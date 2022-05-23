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

    /// basePrice - fixed price of minting the next height
    constructor(uint256 basePrice) ERC721("RayOfLight", "Ray") {
        require(basePrice > 0);
        _height.reset();
        _height.increment();
        _basePrice = basePrice;
        owner = msg.sender;
        commissions = payable(owner);
    }

    event Received(address, uint);
    receive() external payable {
        emit Received(msg.sender, msg.value);
    }


    /// Mints a new ray for a fixed price
    function mintHigherRay(address to) public payable virtual returns (uint256) {
        require(msg.value >= 10, "Not enough ETH sent; check price!");
        require(_height.current() < 10000, "Maximum height reached");
        uint256 tokenId = _height.current();
        _safeMint(to, tokenId); 
        _height.increment();
        string memory uri = "https://modelAddress.com";
        _setTokenURI(tokenId, uri);
        return tokenId;
    }

    /// Purchase a token for a price set by the owner, while giving 
    function purchase(uint256 tokenId) public payable virtual {
        console.log("here0");
        require(msg.sender != address(0) && msg.sender != address(this), "sender address is zero or contract itself");
        require(_exists(tokenId), "non-existent token");
        require(isPurchasable(tokenId) == true, "token is not purchasable");
        require(msg.value >= getCurrentPriceWithCommission(tokenId), "not enough value");
        address tokenSeller = ownerOf(tokenId);
        console.log("here");
        (bool success, ) = payable(commissions).call{
            value: (getCurrentPrice(tokenId) * 5) / 100
        }("");
        require(success, "comission failed");
        safeTransferFrom(tokenSeller, msg.sender, tokenId);
    }

    /// Sets price of a token. The caller has to be the owner.
    function setCurrentPrice(uint256 tokenId, uint256 _currentPrice) public {
        require(_exists(tokenId), "non-existent token");
        require(_currentPrice > 0, "current price has to positive");
        require(ownerOf(tokenId) == msg.sender, "Only owner can set the price");
        _prices[tokenId] = _currentPrice;
    }
    
    /// Gets current price of a token. This is what the owner gets when token is sold.
    function getCurrentPrice(uint256 tokenId) public view returns (uint256) {
        require(_exists(tokenId), "non-existent token");
        require(_prices[tokenId] != 0, "price is zero");
        return _prices[tokenId];
    }

    /// Gets the price with commission. This is what the buyer has to pay.
    function getCurrentPriceWithCommission(uint256 tokenId) public view returns (uint256) {
        require(_exists(tokenId), "non-existent token");
        uint256 price = _prices[tokenId];
        
        return price;
    }

    /// Puts a token on sale. Can only be called when price is already set.
    function makePurchasable(uint256 tokenId) public {
        console.log("here0");
        require(_exists(tokenId), "non-existent token");
        require(_prices[tokenId] > 0, "price at zero");
        _isPurchasable[tokenId] = true;
    }

    /// Disables token sale.
    function makeUnpurchasable(uint256 tokenId) public {
        require(_exists(tokenId), "non-existent token");
        _isPurchasable[tokenId] = false;
    }

    /// Gets if a token is purchasable.
    function isPurchasable(uint256 tokenId) public view returns (bool) {
        require(_exists(tokenId), "non-existent token");
        return _isPurchasable[tokenId];
    }
}
