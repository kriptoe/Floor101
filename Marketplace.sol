// SPDX-License-Identifier: MIT LICENSE

pragma solidity ^0.8.4;

  import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
  import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
  import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
  import "@openzeppelin/contracts/access/Ownable.sol";
  import "hardhat/console.sol";
  import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Marketplace is IERC721Receiver, ReentrancyGuard, Ownable {

  address payable holder;
  uint256 listingFee = 0.00025 ether;

  struct List {
    uint256 tokenId;
    address payable seller;
    address payable holder;
    uint256 price;
    bool sold;
  }

     struct Loan {
        address owner;
        uint256 endDate; 
        uint256 loanAmount;
        uint256 lendingFee;
        bool locked;            // true = loan is open so NFT cant be used
        bool liquidated;        // false, set to true if loan is liquidated
    }

   mapping(uint256 => List) public vaultItems;
   mapping (uint256 => Loan ) public loans; // map NFTid to loan struct
   IERC20 paytoken ;//  = IERC20(mumbaiDaiAddress);
   uint256 totalLoans;  // keep track of active loans

  event NFTListCreated (
    uint256 indexed tokenId,
    address seller,
    address holder,
    uint256 price,
    bool sold
  );


  ERC721Enumerable nft;
    event saleListingEvent(address indexed sender, uint256 NFTid, uint256 price);

   constructor(address dai) {
    paytoken  =  IERC20(dai);
  }

  function getListingFee() public view returns (uint256) {
    return listingFee;
  }
  
  function addNFTCollection(ERC721Enumerable _nft) public onlyOwner{
      nft = _nft;
      holder = payable(msg.sender);    
  }

  // users can lend against the floor price of the token
  // IMPORTANT : requires approval from the nft contract
   function lend(uint256 tokenId) public payable nonReentrant{
     require (nft.ownerOf(tokenId)==msg.sender, "Not owner" ) ;
     loans[tokenId].owner = msg.sender;
     loans[tokenId].endDate = block.timestamp + 2 weeks;
     loans[tokenId].locked = true;                 // so we know the nft is in the lending contract
     loans[tokenId].liquidated = false;
     loans[tokenId].loanAmount = 95 ether;     
     loans[tokenId].lendingFee = 1 ether; 
     console.log ("loan amount -------------- ", loans[tokenId].loanAmount);
     nft.transferFrom(msg.sender, address(this), tokenId);         // transfer NFT to contract  
     paytoken.transfer(msg.sender, 95 ether );    // transfer 95 dai to lender
     totalLoans ++;                                   // keep track of loans
   }

  // IMPORTANT : requires approval from the DAI contract
    function send() public payable{
      paytoken.transferFrom(msg.sender, address(this), 100 ether);
    }

   // have to approve market contract with dai contract
    function repayLoan(uint256 tokenId) public payable nonReentrant {
      uint256 amount = loans[tokenId].loanAmount + loans[tokenId].lendingFee;
      console.log("pay back DAI amount ----------------------- ", amount);
      console.log("lender dai balance ----------------------- ", paytoken.balanceOf(msg.sender ));    
      require(paytoken.balanceOf(msg.sender ) >= loans[tokenId].loanAmount + loans[tokenId].lendingFee, "Not enough dai");
      require(loans[tokenId].owner == msg.sender, "NFT not yours"); //require the loan was made from this sender address
      paytoken.transferFrom(msg.sender, address(this), amount);
      nft.transferFrom(address(this), msg.sender, tokenId); // transfer NFT to contract
      loans[tokenId].locked = false;
      totalLoans --;
  } 

  function listSaleFloor101Treasury(uint256 tokenId, uint256 price) public onlyOwner {
      require(vaultItems[tokenId].tokenId == 0, "NFT already listed");
      require(price > 199, "Amount must be higher than 200");
      vaultItems[tokenId] =  List(tokenId, payable(msg.sender), payable(address(this)), price, false);
      emit NFTListCreated(tokenId, msg.sender, address(this), price, false);
  }

  // List for sale on Marketplace
  // IMPORTANT : requires approval from the nft contract
  function listSale(uint256 tokenId, uint256 price) public payable nonReentrant {
      require(nft.ownerOf(tokenId) == msg.sender, "NFT not yours");
      require(vaultItems[tokenId].tokenId == 0, "NFT already listed");
      require(price > 0, "Amount must be higher than 0");
      require(msg.value == listingFee, "Please transfer 0.00025 crypto to pay listing fee");
      vaultItems[tokenId] =  List(tokenId, payable(msg.sender), payable(address(this)), price, false);
      nft.transferFrom(msg.sender, address(this), tokenId);
      emit saleListingEvent(msg.sender, tokenId,  price);
      emit NFTListCreated(tokenId, msg.sender, address(this), price, false);
  }

  function buyNft(uint256 tokenId) public payable nonReentrant {
      uint256 price = vaultItems[tokenId].price * 10 ** 18;
      require(paytoken.balanceOf(msg.sender ) >= price, "Not enough dai");
      vaultItems[tokenId].seller.transfer(msg.value);
      nft.transferFrom(address(this), msg.sender, tokenId);
      vaultItems[tokenId].sold = true;
      delete vaultItems[tokenId];
  }

  function cancelSale(uint256 tokenId) public nonReentrant {
      require(vaultItems[tokenId].seller == msg.sender, "NFT not yours");
      nft.transferFrom(address(this), msg.sender, tokenId);
      delete vaultItems[tokenId];
  }
  
  function getPrice(uint256 tokenId) public view returns (uint256) {
      uint256 price = vaultItems[tokenId].price;
      return price;
  }

 function nftListings() public view returns (List[] memory) {
    uint256 nftCount = nft.totalSupply();
    uint currentIndex = 0;
    List[] memory items = new List[](nftCount);
    for (uint i = 0; i < nftCount; i++) {
        if (vaultItems[i + 1].holder == address(this)) {
        uint currentId = i + 1;
        List storage currentItem = vaultItems[currentId];
        items[currentIndex] = currentItem;
        currentIndex += 1;
      }
    }
    return items;
  }

  function onERC721Received(
        address,
        address from,
        uint256,
        bytes calldata
    ) external pure override returns (bytes4) {
      require(from == address(0x0), "Cannot send nfts to Vault directly");
      return IERC721Receiver.onERC721Received.selector;
    }
  
    function withdraw() public payable onlyOwner() {
      require(payable(msg.sender).send(address(this).balance));
    }

       receive() external payable {}
}
