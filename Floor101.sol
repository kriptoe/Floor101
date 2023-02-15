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

   address public marketContractAddress ;//  = IERC20(mumbaiDaiAddress);   
   address private multisigAddress;
   // address private mumbaiDaiAddress =  0x1B2278e4f8e9D7786ed305B0204db3107Efa3396;
  string public nftMessage;

  mapping (uint => SVGParams) public nftOwners;  // mapping to struct
  mapping ( uint256=> address) public UserAddresses; // maps NFT ID to the user address

      struct Floor {
        uint256 floorPrice;          
        uint256 marketContract;      // money sent to marketContract for lending
        uint256 multiSigWallet;      // money sent multisig wallet for investing
    }

    struct SVGParams {
        uint id;      
        address addr;
    }

   IERC20 paytoken ; //  = IERC20(mumbaiDaiAddress);
   Floor public fp;  // srtruct that keeps trackof treasury funds

  function addNFT(uint _id, address  _addr) public {
    nftOwners[_tokenIds.current()] = SVGParams(_id, _addr);
  }

function getNFT(uint _memberId) public view returns(SVGParams memory) {
    return nftOwners[_memberId];
  }

   event mintEvent(address indexed sender, uint256 NFTid);

   constructor(address dai, address market) ERC721("Floor101", "flr") {
       paytoken  =  IERC20(dai);
       fp.floorPrice = 0;  // srtruct that keeps trackof treasury funds
       marketContractAddress=  market; 
       multisigAddress = 0xCA873271C35f6Da98922af014bc3425488a245D5;
       nftMessage  = "NOL - NFT owned liquidity";
     }

    // mint amount is the amount of US dollars being converted to pesos
   function mintWithDAI() public payable {
      require( _tokenIds.current() < 101, "Max mint reached");    
     // require(_exists(UserAddresses[msg.sender]) == false, "Can only mint 1 NFT per address");
      require(paytoken.balanceOf(msg.sender ) >= 100 ether, "Not enough dai");
      paytoken.transferFrom(msg.sender, address(this), 100 ether);
      _tokenIds.increment();   
      //  p.addr = (uint160(msg.sender)).toHexString(20);
      // p.treasury = paytoken.balanceOf (address(this)) / 1 ether; 
      _safeMint(msg.sender, _tokenIds.current());
      emit mintEvent(msg.sender, _tokenIds.current());
      UserAddresses[_tokenIds.current()] = msg.sender; 
      addNFT(_tokenIds.current(), msg.sender) ;  
      fp.floorPrice = getFloorPrice();
  }

  /* burns NFT and reimburses user with the floor backing of NFTs
  // burn is closed most of the time to utilize treasury
  function burnNFT(uint256 tokenId) public payable {
      require (ownerOf(tokenId)==msg.sender, "Not owner" ) ;
       // burn the nft
      burn(tokenId);    
      paytoken.transfer(msg.sender,100 ether );
  }  */

  // Transfers money from mint into the lending contract making it available for lending
  function transferToMarket(uint256 amount) public onlyOwner{
    paytoken.transfer( marketContractAddress, amount);
    fp.marketContract += amount;
  }

    // Transfer DAI to multisig for investment strategies
  function transferToMultisig(uint256 amount) public onlyOwner{
    paytoken.transfer( multisigAddress, amount);
    fp.multiSigWallet += amount;   // records how much has been sent to multisig
  }

  // function used to deposit money back into contract from multisig wallet
  function deposit(uint256 _amount) public payable {
    paytoken.transferFrom(msg.sender, address(this), _amount);
    fp.multiSigWallet -= _amount;   // reduce total in multisig else the floor price will be too high
  }

  function tokenURI(uint256 id) public view override returns (string memory) {
      require(_exists(id), "not exist");
      string memory name = string(abi.encodePacked('ID #',id.toString()));
      string memory description = string(abi.encodePacked('FLOOR 101 NFT owned liquidity'));
      string memory image = Base64.encode(bytes(NFTSVG.generateSVG(id.toString(), fp.floorPrice.toString(), uint160(ownerOf(id)).toHexString(20), nftMessage )));

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
                             "$", fp.floorPrice.toString(),
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
      return (getDaiContractBalance() + fp.marketContract + fp.multiSigWallet) / (totalSupply() * 10 ** 18) ;
    }

  function getTotalSupply() public view returns(uint256){
    return  totalSupply();
 }

    function getDaiContractBalance() public view returns (uint256){
       return paytoken.balanceOf (address(this));
    }

    // sets the middle message on the scrolling text
    function setMessage(string memory m) public onlyOwner{
      nftMessage = m;
    }

/*
    function setPersonalMessage( uint256 id, string memory message) public{
        require(msg.sender == UserAddresses[id], "Not owner");
              p.message = message;
    }
*/
    function burn(uint256 tokenId) internal {
        super._burn(tokenId);
    }

     receive() external payable {}

}
