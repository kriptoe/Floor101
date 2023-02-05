// SPDX-License-Identifier: GPL-2.0-or-later
pragma solidity >=0.8.0 <0.9.0;

import '@openzeppelin/contracts/utils/Strings.sol';
import "./Base64.sol";

/// @title NFTSVG
/// @notice Provides a function for generating an SVG associated with a Uniswap NFT
library NFTSVG {
    using Strings for uint256;

    struct SVGParams {
        string id;      
        string addr; 
        bool locked; 
        uint256 treasury;
    }

    function generateSVG(SVGParams memory params) internal pure returns (string memory svg) {
        return
            string(
                abi.encodePacked(
                    generateSVGDefs(params.id),
                    generateSVGBorderText(params.addr),
                    generateSVGCardMantle(params.addr),
                    '</svg>'
                )
            );
    }

    function generateSVGDefs(string memory id) internal pure returns (string memory svg) {
        svg = string(
            abi.encodePacked(
                '<svg width="290" height="500" viewBox="0 0 290 500" xmlns="http://www.w3.org/2000/svg"',
                " xmlns:xlink='http://www.w3.org/1999/xlink'>",
                 '<defs><filter id="f1"><feImage result="p0" xlink:href="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nMjkwJyBoZWlnaHQ9JzUwMCcgdmlld0JveD0nMCAwIDI5MCA1MDAnIHhtbG5zPSdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Zyc+PHJlY3Qgd2lkdGg9JzI5MHB4JyBoZWlnaHQ9JzUwMHB4JyBmaWxsPScjZmE4OThlJy8+PC9zdmc+"/><feImage result="p1" xlink:href="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nMjkwJyBoZWlnaHQ9JzUwMCcgdmlld0JveD0nMCAwIDI5MCA1MDAnIHhtbG5zPSdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Zyc+PGNpcmNsZSBjeD0nMjA2JyBjeT0nMTg1JyByPScxMjBweCcgZmlsbD0nI2MwMmFhYScvPjwvc3ZnPg=="/><feImage result="p2" xlink:href="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nMjkwJyBoZWlnaHQ9JzUwMCcgdmlld0JveD0nMCAwIDI5MCA1MDAnIHhtbG5zPSdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Zyc+PGNpcmNsZSBjeD0nMjInIGN5PSc0NzMnIHI9JzEyMHB4JyBmaWxsPScjNzE5YWEyJy8+PC9zdmc+" /><feImage result="p3" xlink:href="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0nMjkwJyBoZWlnaHQ9JzUwMCcgdmlld0JveD0nMCAwIDI5MCA1MDAnIHhtbG5zPSdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Zyc+PGNpcmNsZSBjeD0nMTAyJyBjeT0nMjcxJyByPScxMDBweCcgZmlsbD0nIzc1NmNjMicvPjwvc3ZnPg==" /><feBlend mode="overlay" in="p0" in2="p1" /><feBlend mode="exclusion" in2="p2" /><feBlend mode="overlay" in2="p3" result="blendOut" /><feGaussianBlur in="blendOut" stdDeviation="42" /></filter> <clipPath id="corners"><rect width="290" height="400" rx="42" ry="42" /></clipPath><path id="text-path-a" d="M40 12 H250 A28 28 0 0 1 278 40 V460 A28 28 0 0 1 250 488 H40 A28 28 0 0 1 12 460 V40 A28 28 0 0 1 40 12 z" /><path id="minimap" d="M234 444C234 457.949 242.21 463 253 463" /><filter id="top-region-blur"><feGaussianBlur in="SourceGraphic" stdDeviation="24" /></filter><linearGradient id="grad-up" x1="1" x2="0" y1="1" y2="0"><stop offset="0.0" stop-color="white" stop-opacity="1" /><stop offset=".9" stop-color="white" stop-opacity="0" /></linearGradient><linearGradient id="grad-down" x1="0" x2="1" y1="0" y2="1"><stop offset="0.0" stop-color="white" stop-opacity="1" /><stop offset="0.9" stop-color="white" stop-opacity="0" /></linearGradient><mask id="fade-up" maskContentUnits="objectBoundingBox"><rect width="1" height="1" fill="url(#grad-up)" /></mask><mask id="fade-down" maskContentUnits="objectBoundingBox"><rect width="1" height="1" fill="url(#grad-down)" /></mask><mask id="none" maskContentUnits="objectBoundingBox"><rect width="1" height="1" fill="white" /></mask><linearGradient id="grad-symbol"><stop offset="0.7" stop-color="white" stop-opacity="1" /><stop offset=".95" stop-color="white" stop-opacity="0" /></linearGradient><mask id="fade-symbol" maskContentUnits="userSpaceOnUse"><rect width="290px" height="200px" fill="url(#grad-symbol)" /></mask></defs>',
   '<g clip-path="url(#corners)"><g style="filter:url(#top-region-blur); transform:scale(1.5); transform-origin:center top;"><g clip-path="url(#corners)"><rect style="filter: url(#f1)" x="0px" y="0px" width="290px" height="500px" /><g style="filter:url(#top-region-blur); transform:scale(1.5); transform-origin:center top;"><rect fill="none" x="0px" y="0px" width="350px" height="500px" /><ellipse cx="50%" cy="0px" rx="180px" ry="120px" fill="#000" opacity="0.85" /></g><rect x="0" y="0" width="400" height="500" rx="42" ry="42" fill="rgba(0,0,0,0)" stroke="rgba(255,255,255,0.2)" /></g></g><g style="filter:url(#top-region-blur); transform:scale(1.5); transform-origin:center top;"><rect fill="none" x="0px" y="0px" width="290px" height="500px" /><ellipse cx="50%" cy="0px" rx="180px" ry="120px" fill="#000" opacity="0.85" /></g><text text-rendering="optimizeSpeed"></text><g mask="url(#fade-symbol)"><rect fill="none" x="0px" y="0px" width="290px" height="200px" /> <text y="70px" x="55px" fill="white"  font-weight="200" font-size="32px" >FL', unicode'👀','R 101</text></g><text y="125px" x="72px"  font-size="36px">', unicode' 🔑 🚪 ❔',' </text>',
                '<rect x="16" y="16" width="258" height="468" rx="26" ry="26" fill="rgba(0,0,0,0)" stroke="rgba(255,255,255,0.2)" />',
                '<g style="transform:translate(79px,284px)"><rect width="128px" height="26px" rx="8px" ry="8px" fill="rgba(0,0,0,0.6)" /><text x="12px" y="17px" font-family="\'Courier New\', monospace" font-size="12px" fill="white"><tspan fill="rgba(255,255,255,0.6)">ID: </tspan>', id, '</text></g></g>'
            )
        );
    }

    function generateSVGBorderText(string memory userAddress) internal pure returns (string memory svg) {
        svg = string(
            abi.encodePacked(
                '<text text-rendering="optimizeSpeed">',
                '<textPath startOffset="-100%" fill="white" font-family="\'Courier New\', monospace" font-size="10px" xlink:href="#text-path-a">',
                userAddress, '<animate additive="sum" attributeName="startOffset" from="0%" to="100%" begin="0s" dur="30s" repeatCount="indefinite" />',
                '</textPath> <textPath startOffset="0%" fill="white" font-family="\'Courier New\', monospace" font-size="10px" xlink:href="#text-path-a">',
                'NFT OWNER : ', userAddress, '<animate additive="sum" attributeName="startOffset" from="0%" to="100%" begin="0s" dur="30s" repeatCount="indefinite" /> </textPath>',
                '<textPath startOffset="50%" fill="white" font-family="\'Courier New\', monospace" font-size="10px" xlink:href="#text-path-a">',
                '--- <animate additive="sum" attributeName="startOffset" from="0%" to="100%" begin="0s" dur="30s"',
                ' repeatCount="indefinite" /></textPath><textPath startOffset="-50%" fill="white" font-family="\'Courier New\', monospace" font-size="10px" xlink:href="#text-path-a">',
                'FLOOR 101 <animate additive="sum" attributeName="startOffset" from="0%" to="100%" begin="0s" dur="30s" repeatCount="indefinite" /></textPath></text>'
            )
        );
    }

    function generateSVGCardMantle(string memory userAddress) internal pure returns (string memory svg) {
        svg = string(
            abi.encodePacked(
                '<g style="transform:translate(19px, 314px)"><rect width="253px" height="26px" rx="8px" ry="8px" fill="rgba(0,0,0,0.6)" /><text x="1px" y="17px" font-family="\'Courier New\', monospace" font-size="10px" fill="white"><tspan fill="rgba(255,255,255,0.6)">', userAddress , '</tspan></text></g><g mask="url(#fade-symbol)"><rect fill="none" x="0px" y="0px" width="290px" height="200px" /></g>',
                '<rect x="16" y="16" width="258" height="368" rx="26" ry="26" fill="rgba(0,0,0,0)" stroke="rgba(255,255,255,0.2)" />'
            )
        );
    }

   function  generateLockedSVG ()internal pure returns(string memory svg){
          svg = string(
            abi.encodePacked(
     '<svg width="290" height="500" viewBox="0 0 290 500" xmlns="http://www.w3.org/2000/svg"><defs>',
     '<clipPath id="corners"><rect width="290" height="500" rx="42" ry="42" /></clipPath></defs><g clip-path="url(#corners)">',
     '<rect fill="83843f" x="0px" y="0px" width="290px" height="500px" /></g><text y="70px" x="32px" fill="white" font-weight="200" font-size="32px">FLOOR 101</text>',
    '<text y="270px" x="22px" fill="red"font-weight="600" font-size="55px">LOCKED</text><g style="transform:translate(29px, 384px)">',
    '<text x="12px" y="17px" font-family="\'Courier New\', monospace" font-size="12px" fill="white"><tspan fill="rgba(255,255,255,0.6)">ID: </tspan>1</text></g></svg>'
            )
        );
    }   

}
