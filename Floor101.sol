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

contract Floor101 is ERC721Enumerable, Ownable  {

   using Strings for uint256;
   using HexStrings for uint160;  
   using Counters for Counters.Counter;
   Counters.Counter private _tokenIds;
   bool public nftDisabled= false;    // used to disable burning of an nft if it is being used for lending   
   uint256 private s_lastTimeStamp;  // to track the burn date
   mapping (address => uint256) public UserAddresses; // maps the user address to the NFT ID
   mapping (uint256 => mapping (address => bool))public locked; // true means locked for lending
  
   uint256 totalLoans = 0;
   // address private mumbaiDaiAddress =  0x1B2278e4f8e9D7786ed305B0204db3107Efa3396;
   IERC20 paytoken ;//  = IERC20(mumbaiDaiAddress);
   address public marketContractAddress ;//  = IERC20(mumbaiDaiAddress);   
   NFTSVG.SVGParams p;

    event mintEvent(address indexed sender, uint256 NFTid);

   constructor(address dai, address market) ERC721("Floor101", "flr") {
       paytoken  =  IERC20(dai);
       marketContractAddress=  market; 
       s_lastTimeStamp = block.timestamp;
     }

  // as there are 2 mint functions this saves repetition
  function setMint() internal {
      _tokenIds.increment();   
      p.id = uint2str(_tokenIds.current()) ;
      p.addr = (uint160(msg.sender)).toHexString(20);
      p.locked = false;
      p.treasury = paytoken.balanceOf (address(this)) / 1 ether; 
      _safeMint(msg.sender, _tokenIds.current());
      emit mintEvent(msg.sender, _tokenIds.current());
      UserAddresses[msg.sender]=  _tokenIds.current(); 
  }

  // if the protocol reaches 101 mints, the contract can mint another 50 nfts which can be sold on the open market to add to the value of the treasury
  // change the min on deploy
   function ownerMint() public onlyOwner{
      require(_tokenIds.current() > 0 && _tokenIds.current() < 101, "Max mint reached");
      setMint();   
   }

    // mint amount is the amount of US dollars being converted to pesos
   function mintWithDAI() public payable {
    require( _tokenIds.current() < 101, "Max mint reached");    
   // require(_exists(UserAddresses[msg.sender]) == false, "Can only mint 1 NFT per address");
    require(paytoken.balanceOf(msg.sender ) >= 100 ether, "Not enough dai");
    paytoken.transferFrom(msg.sender, address(this), 100 ether);
    setMint();   
  }

  /* burns NFT and reimburses user with the floor backing of NFTs
  // burn is closed most of the time to utilize treasury
  function burnNFT(uint256 tokenId) public payable {
      require (ownerOf(tokenId)==msg.sender, "Not owner" ) ;
       // burn the nft
      burn(tokenId);    
      paytoken.transfer(msg.sender,100 ether );
  }  */

  // Transfers all money from mint into the lending contract
  function transferToMarket() public onlyOwner{
    paytoken.transfer( marketContractAddress, paytoken.balanceOf (address(this)));
  }

  function tokenURI(uint256 id) public view override returns (string memory) {
      require(_exists(id), "not exist");
      string memory name = string(abi.encodePacked('ID #',id.toString()));
      string memory description = string(abi.encodePacked('FLOOR 101 NFT owned liquidity'));
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
                              '", "external_url":"https://floor101.com/',
                              id.toString(),
                              '", "attributes": [{"trait_type": "mint price", "value": "',
                             "$100",
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
