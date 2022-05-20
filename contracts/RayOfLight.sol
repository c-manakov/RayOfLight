//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

// import "github.com/oraclize/ethereum-api/oraclizeAPI.sol";

contract RayOfLight is ERC721URIStorage {
    using Counters for Counters.Counter;
    Counters.Counter private _height;

    mapping(uint256 => uint256) private _prices;
    mapping(uint256 => bool) private _isPurchasable;
    address private owner;
    address private commissions;

    uint256 private _basePrice;

    constructor(uint256 basePrice) ERC721("RayOfLight", "Ray") {
        require(basePrice > 0);
        _height.reset();
        _height.increment();
        _basePrice = basePrice;
        owner = msg.sender;
        commissions = payable(owner);
    }

    function mintHigherRay(address to) public payable virtual {
        require(msg.value >= 10, "Not enough ETH sent; check price!");
        require(_height.current() < 10000, "Maximum height reached");
        uint256 tokenId = _height.current();
        _safeMint(to, tokenId);
        _height.increment();
        string memory uri = "https://modelAddress.com";
        _setTokenURI(tokenId, uri);
    }

    function purchase(uint256 tokenId) public payable virtual {
        require(msg.sender != address(0) && msg.sender != address(this));
        require(_exists(tokenId));
        require(isPurchasable(tokenId) == true);
        require(msg.value >= getCurrentPrice(tokenId));
        address tokenSeller = ownerOf(tokenId);
        (bool success, ) = payable(commissions).call{
            value: (msg.value * 5) / 100
        }("");
        require(success);
        safeTransferFrom(tokenSeller, msg.sender, tokenId);
    }

    function setCurrentPrice(uint256 tokenId, uint256 _currentPrice) public {
        require(_exists(tokenId), "nonexistent token");
        require(_currentPrice > 0);
        require(ownerOf(tokenId) == msg.sender, "Only owner can set the price");
        _prices[tokenId] = _currentPrice;
    }

    function getCurrentPrice(uint256 tokenId) public view returns (uint256) {
        require(_exists(tokenId), "nonexistent token");
        return _prices[tokenId];
    }

    function makePurchasable(uint256 tokenId) public {
        require(_exists(tokenId), "nonexistent token");
        require(_prices[tokenId] > 0, "price at zero");
        _isPurchasable[tokenId] = true;
    }

    function makeUnpurchasable(uint256 tokenId) public {
        require(_exists(tokenId), "nonexistent token");
        _isPurchasable[tokenId] = false;
    }

    function isPurchasable(uint256 tokenId) public view returns (bool) {
        require(_exists(tokenId), "nonexistent token");
        return _isPurchasable[tokenId];
    }
}
