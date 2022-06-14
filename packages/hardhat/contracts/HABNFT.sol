// SPDX-License-Identifier: MIT
pragma solidity >=0.7.0 <0.9.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract HABNFT is ERC721 {
    uint256 token_count;

    uint maxSupply = 1000;

    constructor() ERC721("HabitosNFT", "HAB") {}

    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        require(_exists(tokenId), "ERC721Metadata: URI query for nonexistent token");
        return "https://ipfs.io/ipfs/QmbmMFHEwtadq3hZkrmoBfxjn4zJw5gbzCBJ4sD3Utgw2k";
    }

    function mintNFT(address to) internal returns (uint tokenID) {
        require(token_count < maxSupply, "No hay mas HabitosNFT :(");
        token_count  += 1;
        _mint(to, token_count);
        return token_count;
    }
}