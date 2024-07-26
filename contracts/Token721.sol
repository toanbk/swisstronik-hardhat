// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Token721 is ERC721, ERC721Burnable, Ownable {
    uint256 private _nextTokenId;

    constructor(address initialOwner)
        ERC721("Token721", "PRY")
        Ownable(initialOwner)
    {}

    function safeMint(address to) public onlyOwner {
        uint256 tokenId = _nextTokenId++;
        _safeMint(to, tokenId);
    }

    function premint(address to) public onlyOwner returns (uint256) {
        uint256 newTokenId = _nextTokenId;
        _safeMint(to, newTokenId);
        _nextTokenId++;
        return newTokenId;
    }
}