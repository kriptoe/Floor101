// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

//import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
    import "@openzeppelin/contracts/utils/Counters.sol";
    import "@openzeppelin/contracts/access/Ownable.sol";
    import "@openzeppelin/contracts/utils/Strings.sol";
    import "@openzeppelin/contracts/utils/math/SafeMath.sol";
    import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
    import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
    import "./SVGNFT.sol";
    import "./HexStrings.sol";

contract Pcash is ERC721Enumerable, Ownable  {

   using Strings for uint256;
   using HexStrings for uint160;  
   using Counters for Counters.Counter;
   Counters.Counter private _tokenIds;
   mapping (address => uint256) public UserAddresses; // maps the user address to the NFT ID
   mapping (uint256 => mapping (address => bool))public locked; // true means locked for lending
   uint256 totalLoans = 0;
   // address private mumbaiDaiAddress =  0x1B2278e4f8e9D7786ed305B0204db3107Efa3396;
   IERC20 paytoken ;//  = IERC20(mumbaiDaiAddress);
   NFTSVG.SVGParams p;

     struct Loan {
        address owner;
        uint256 endDate; 
        bool isOpen;            // true = loan is open, false = loan has been closed
        bool liquidated;        // false, set to true if loan is liquidated
    }
 
   constructor(address dai) ERC721("FloorIZA", "flr") {
       paytoken  =  IERC20(dai);
     }

  // users can lend against the floor price of the token
   function lend(uint256 tokenId) public {
     require (ownerOf(tokenId)==msg.sender, "Not owner" ) ;
     require (locked[tokenId][msg.sender]==false, "Locked lending" ) ;
     locked[tokenId][msg.sender]=true ;             // lock the token for various reasons, ie cant sell on opensea
     transferFrom(msg.sender, address(this), tokenId);  // transfer NFT to contract
     paytoken.transfer(msg.sender, 95 ether );          // transfer 95 dai to lender
     totalLoans ++;                                   // keep track of loans
     uint loanDeadline = (block.timestamp + 2 weeks - block.timestamp);
   }

   function liquidate(uint256 tokenId) public onlyOwner {
     require (ownerOf(tokenId)==address(this), "Not owner" ) ;
     require (locked[tokenId][msg.sender]==true, "Locked lending" ) ;
     burn(tokenId);  
     totalLoans --;
   }

   // redeem the NFT used for lending
   function redeem(uint256 tokenId) public payable{
     require(paytoken.balanceOf(msg.sender ) == 96 ether, "Not enough dai");
     require (msg.sender==address(this), "Not owner" ) ;
     require (locked[tokenId][msg.sender]==true, "Locked lending" ) ;
     transferFrom(address(this), msg.sender, tokenId);  // transfer NFT to contract   
     locked[tokenId][msg.sender]==false;
     totalLoans --;
   }

    // mint amount is the amount of US dollars being converted to pesos
   function mintWithDAI(uint256 _USDCAmount) public payable {
    require(_exists(UserAddresses[msg.sender]) == false, "Can only mint 1 NFT per address");
    require(paytoken.balanceOf(msg.sender ) >= 100 ether, "Not enough dai");
    paytoken.transferFrom(msg.sender, address(this), 100 ether);
      _USDCAmount = _USDCAmount * 10 ** 18; // convert amount to 18 decimals
      _tokenIds.increment();
      p.id = uint2str(_tokenIds.current()) ;
      p.addr = (uint160(msg.sender)).toHexString(20);
      p.locked = false;
      _safeMint(msg.sender, _tokenIds.current());
      UserAddresses[msg.sender]=  _tokenIds.current();
  }

  // burns NFT and reimburses user with the floor backing of NFTs
  function burnNFT(uint256 tokenId) public payable {
      require (ownerOf(tokenId)==msg.sender, "Not owner" ) ;
       // burn the nft
      burn(tokenId);    
      paytoken.transfer(msg.sender,100 ether );
  }

  function tokenURI(uint256 id) public view override returns (string memory) {
      require(_exists(id), "not exist");
      string memory name = string(abi.encodePacked('BET ID #',id.toString()));
      string memory description = string(abi.encodePacked('PCASH first NFT stablecoin '));
      string memory image = Base64.encode(bytes(NFTSVG.generateSVG(p)));

      return
          string(
              abi.encodePacked(
                'data:application/json;base64,',
                Base64.encode(
                    bytes(
                          abi.encodePacked(
                              '{"name":"',
                              name,
                              '", "description":"',
                              description,
                              '", "external_url":"https://burnyboys.com/token/',
                              id.toString(),
                              '", "attributes": [{"trait_type": "pesos", "value": "',
                             "bal",
                              '"}], "owner":"',
                              (uint160(ownerOf(id))).toHexString(20),
                              '", "image": "',
                              'data:image/svg+xml;base64,',
                              image,
                              '"}'
                          )
                        )
                    )
              )
          );
  }





    function uint2str(uint _i) internal pure returns (string memory _uintAsString) {
      if (_i == 0) {
          return "0";
      }
      uint j = _i;
      uint len;
      while (j != 0) {
          len++;
          j /= 10;
      }
      bytes memory bstr = new bytes(len);
      uint k = len;
      while (_i != 0) {
          k = k-1;
          uint8 temp = (48 + uint8(_i - _i / 10 * 10));
          bytes1 b1 = bytes1(temp);
          bstr[k] = b1;
          _i /= 10;
      }
      return string(bstr);
  }

    function getFloorPrice() public view returns(uint256){
      return  SafeMath.div(getUSDCContractBalance() , totalSupply() - totalLoans,"");
    }

    function getUSDCContractBalance() public view returns (uint256){
       return paytoken.balanceOf (address(this));
    }

    function burn(uint256 tokenId) internal {
        super._burn(tokenId);
    }

     receive() external payable {}

}
