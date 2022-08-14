//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "./ERC721Tradable.sol";

contract RayOfLight is ERC721Tradable {
    constructor(address _proxyRegistryAddress) ERC721Tradable("RayOfLight", "ROL", _proxyRegistryAddress) {}

    function baseTokenURI() override public pure returns (string memory) {
      return 'https://ray-of-light-test-storj.s3.filebase.com/';
    }

    function contractURI() public view returns (string memory) {
      return "https://ray-of-light-test-storj.s3.filebase.com/contract.json";
    }
}
