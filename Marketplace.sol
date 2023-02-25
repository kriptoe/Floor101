// SPDX-License-Identifier: MIT LICENSE

pragma solidity ^0.8.4;

  import "@openzeppelin/contracts/token/ERC721/IERC721Receiver.sol";
  import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
  import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
  import "@openzeppelin/contracts/access/Ownable.sol";
  import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
  import "hardhat/console.sol";

contract Marketplace is IERC721Receiver, ReentrancyGuard, Ownable {

// -------------------------ERRORS -------------------------------
  error notOwner();             // Not owner of NFT
  error notEnoughDAI();         // user doesnt have enough DAI 
  error alreadyListed();        // NFT already listed

  /* ------------ EVENTS -------------------------------------*/
  event lendEvent(uint256 indexed NFTid, address indexed sender,  uint256 loanAmount, uint256 fee, uint256 dueDate);
  event repayLoanEvent(uint256 NFTid, address indexed sender,  uint256 loanAmount);
  event saleListingEvent(address indexed sender, uint256 NFTid, uint256 price);
  event buyNftEvent(uint256 indexed tokenId, address indexed buyer, uint256 indexed price);

  address payable holder;
  uint256 listingFee = 0.0006 ether;
  uint256 lendingFee = 0.0006 ether;
  uint256 maxLoan = 100 ether;

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
        bool liquidated;        // false, set to true if loan is liquidated
    }
  /* ------------ MAPPINGS -------------------------------------*/
   mapping(uint256 => List) public vaultItems;    //map nft id to Sales Listing struct
   mapping (uint256 => Loan ) public loans;      // map NFTid to loan struct
   mapping (address => uint256 ) public hasLoan;     // to easily find if address has loan

   IERC20 paytoken ;//  = IERC20(mumbaiDaiAddress);

  ERC721Enumerable nft;

   constructor() {
  }

  // set the payment address to DAI
   function setPayToken(address dai) public onlyOwner{
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
   function lend(uint256 tokenId, uint256 loanLength) public payable nonReentrant{
    if (nft.ownerOf(tokenId)!=msg.sender)
        revert notOwner();
      
    if (loanLength == 4)
    {require(msg.value == lendingFee * 2, "Please transfer 0.0012 crypto to pay listing fee");   }        
    else {
      require(msg.value == lendingFee , "Please transfer 0.0006 crypto to pay listing fee");
    }        
     loans[tokenId].owner = msg.sender;
     loans[tokenId].endDate = loanLength; // * 604800 + block.timestamp; // 1209600;  // 2 weeks from now 604800 = 1 week
     loans[tokenId].liquidated = false;
     loans[tokenId].loanAmount = maxLoan;     
     loans[tokenId].lendingFee = 1 ether; 
     nft.transferFrom(msg.sender, address(this), tokenId);         // transfer NFT to contract  
     paytoken.transfer(msg.sender, maxLoan );          // transfer maxloan amount to lender  
     hasLoan[msg.sender] =  tokenId;               // maps address to ID so we know it has a loan
     // console.log("las loan ------------------------------- ",tokenId);
     emit lendEvent( tokenId, msg.sender, maxLoan, lendingFee, loans[tokenId].endDate );
   }

  // This function checks that the liquidation date has occurred
  // as the NFT is already owned by the contract we set a sale price and list it on our marketplace
  function liquidate (uint256 tokenId, uint256 price) public {
      require (loans[tokenId].endDate < block.timestamp,"Loan still active");
      require(price > maxLoan, "Amount must be higher than 100");  // cant sell a liquidated NFT for less than floor

      require(vaultItems[tokenId].tokenId == 0, "NFT already listed");
      vaultItems[tokenId] =  List(tokenId, payable(address(this)), payable(address(this)), price, false);  // list token for sale with seller address as the address of contract
      hasLoan[msg.sender] =  0;      // 0 means that address no longer has a loan
      emit saleListingEvent(loans[tokenId].owner , tokenId,  price);
  }

  // have to approve market contract with dai contract
    function repayLoan(uint256 tokenId) public payable nonReentrant {
      uint256 amount = loans[tokenId].loanAmount;  
      if(paytoken.balanceOf(msg.sender ) <= loans[tokenId].loanAmount)
         revert notEnoughDAI();
      require(loans[tokenId].owner == msg.sender, "NFT not yours"); //require the loan was made from this sender address
      paytoken.transferFrom(msg.sender, address(this), amount);
      nft.transferFrom(address(this), msg.sender, tokenId); // transfer NFT to contract
      hasLoan[msg.sender] =  0;      // 0 means that address no longer has a loan
      emit repayLoanEvent(tokenId, msg.sender, amount);
  } 

  function listSaleFloor101Treasury(uint256 tokenId, uint256 price) public onlyOwner {
      require(vaultItems[tokenId].tokenId == 0, "NFT already listed");
      require(price > maxLoan, "Amount must be higher than 110");
      vaultItems[tokenId] =  List(tokenId, payable(msg.sender), payable(address(this)), price, false);
      emit saleListingEvent(msg.sender, tokenId,  price);      
  }

  // List for sale on Marketplace
  // IMPORTANT : requires approval from the nft contract
  function listSale(uint256 tokenId, uint256 price) public payable nonReentrant {
        if (nft.ownerOf(tokenId) != msg.sender)
            revert notOwner();

        if (vaultItems[tokenId].tokenId != 0)
            revert alreadyListed();

      require(price > 0, "Amount must be higher than 0");
      require(msg.value == listingFee, "Please transfer 0.0006 crypto to pay listing fee");
      vaultItems[tokenId] =  List(tokenId, payable(msg.sender), payable(address(this)), price, false);
      nft.transferFrom(msg.sender, address(this), tokenId);
      emit saleListingEvent(msg.sender, tokenId,  price);
  }

  function buyNft(uint256 tokenId) public payable nonReentrant {
      uint256 price = vaultItems[tokenId].price;

      if(paytoken.balanceOf(msg.sender ) < price)
         revert notEnoughDAI();

      vaultItems[tokenId].seller.transfer(msg.value);
      paytoken.transferFrom(msg.sender, vaultItems[tokenId].seller, price);  // transfer the dai to the seller address
      nft.transferFrom(address(this), msg.sender, tokenId);
      vaultItems[tokenId].sold = true;
      delete vaultItems[tokenId];
      emit buyNftEvent(tokenId, msg.sender, price) ; 
  }

  function cancelSale(uint256 tokenId) public nonReentrant {
      require(vaultItems[tokenId].seller == msg.sender, "NFT not yours");
      nft.transferFrom(address(this), msg.sender, tokenId);
      delete vaultItems[tokenId];
  }
  
  function getPrice(uint256 tokenId) public view returns (uint256) {
      return vaultItems[tokenId].price;
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

     // Transfer DAI to multisig for investment strategies
  function transferToMultisig(uint256 amount, address multisigAddress) public onlyOwner{
    paytoken.transfer( multisigAddress, amount);
  }

 // upfront fee for taking a loan
 function setLoanFee(uint256 _amount) public onlyOwner{
     lendingFee = _amount;
 }

  function setMaxLoan(uint256 _amount) public onlyOwner{
     maxLoan = _amount;
 }
       receive() external payable {}
}
