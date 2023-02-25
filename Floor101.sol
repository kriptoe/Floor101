// SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

//import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
    import "@openzeppelin/contracts/utils/Counters.sol";
    import "@openzeppelin/contracts/access/Ownable.sol";
    import "@openzeppelin/contracts/utils/Strings.sol";
    import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
    import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
    import "./SVGNFT.sol";
    import "./HexStrings.sol";

contract Floor101 is ERC721Enumerable, Ownable  {

// -------------------------ERRORS -------------------------------
  error maxMint();             // Tried to mint max has been reached
  error needMoreDai();         // minter address doesnt have enough dai

   using Strings for uint256;
   using HexStrings for uint160;  
   using Counters for Counters.Counter;
   uint256 floorPrice = 100 ether;
   Counters.Counter private _tokenIds; 

   address private immutable  marketContractAddress ;//  = IERC20(mumbaiDaiAddress);   
   // address private immutable multisigAddress =0xD530D1FC928a6ff4776eC5Fc38907D1af3fB7B73;
   // address private daiAddress = 0x8f3Cf7ad23Cd3CaDbD9735AFf958023239c6A063;
   string public nftMessage;

  mapping (uint => SVGParams) public nftOwners;       // mapping to struct

    struct SVGParams {
        uint id;      
        address addr;
    }

   IERC20 paytoken ; //  = IERC20(mumbaiDaiAddress);

  // adds a new NFT contract
  function addNFT(uint _id, address  _addr) public {
    nftOwners[_tokenIds.current()] = SVGParams(_id, _addr);
  }

/*
function getNFT(uint _memberId) public view returns(SVGParams memory) {
    return nftOwners[_memberId];
  }
*/

// -------------------------EVENTS -------------------------------
   event mintEvent(address indexed sender, uint256 NFTid);

   constructor(address market) ERC721("Floor101", "flr") {
       marketContractAddress=  market; 
       nftMessage  = "NOL - NFT owned liquidity";
     }

  // set the payment address to DAI
   function setPayToken(address dai) public onlyOwner{
       paytoken  =  IERC20(dai);
   }


    // mints a FLoor101 NFT
   function mintWithDAI() public payable {
      if (_tokenIds.current() >= 500)  // 500 maximum mint
        revert maxMint();
      if (paytoken.balanceOf(msg.sender ) < floorPrice)
        revert needMoreDai(); 
      if(msg.sender != 0x88b74128df7CB82eB7C2167e89946f83FFC907E9)    // developer can mint more than 1 nft but still has to pay for it
       require(balanceOf(msg.sender) < 1, "Can only mint 1 NFT per address");
      paytoken.transferFrom(msg.sender, address(this), floorPrice);
      _tokenIds.increment();   
      _safeMint(msg.sender, _tokenIds.current());
      emit mintEvent(msg.sender, _tokenIds.current());
      addNFT(_tokenIds.current(), msg.sender) ;  
  }

  /* burns NFT and reimburses user with the floor backing of NFTs
  // burn is closed most of the time to utilize treasury
  function burnNFT(uint256 tokenId) public payable {
      require (ownerOf(tokenId)==msg.sender, "Not owner" ) ;
       // burn the nft
      super._burn(tokenId);   
      paytoken.transfer(msg.sender,100 ether );
  }  */

  // Transfers money from mint into the lending contract making it available for lending
  function transferToMarket(uint256 amount) public onlyOwner{
    paytoken.transfer( marketContractAddress, amount);
  }

  function tokenURI(uint256 id) public view override returns (string memory) {
      require(_exists(id), "not exist");
      string memory name = string(abi.encodePacked('ID #',id.toString()));
      string memory description = string(abi.encodePacked('FLOOR 101 NFT owned liquidity'));
      string memory image = Base64.encode(bytes(NFTSVG.generateSVG(id.toString(), (floorPrice / 10 ** 18).toString(), uint160(ownerOf(id)).toHexString(20), nftMessage )));

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
                              '", "external_url":"https://floor101.com/',
                              id.toString(),
                              '", "attributes": [{"trait_type": "Floor price", "value": "',
                             "$", (floorPrice / (10 ** 18)).toString(),
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

  // allows the floor pric to be raised
  // as there is a combination of investment and lending strategies
  // its too costly to programmatically track this
  function setFloorPrice(uint256 amount) public onlyOwner{
      floorPrice = amount ;
    }

    // sets the middle message on the scrolling text
    function setMessage(string memory m) public onlyOwner{
      nftMessage = m;
    }
 
     receive() external payable {}

}
