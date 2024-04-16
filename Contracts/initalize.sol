// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "node_modules/@openzeppelin/contracts/token/ERC721/ERC721.sol";
//import "@openzeppelin/contracts/access/Ownable.sol";

contract boilerGotchi is ERC721 {
    struct Gotchi {
        string name;
        uint256 mood;
        uint256 energy;
        address owner;
        uint256 lastPlayed;
    }
 
    mapping(address => Gotchi) public gotchis;
    mapping(address => string) private names; 

    uint256 public nextID;

    constructor() ERC721("BoilerGotchi", "BG") {
    }

    function createGotchi(string memory name) public {
        require(bytes(name).length > 0, "Name should not be empty");
        require(gotchis[msg.sender].owner == address(0), "You already have a gotchi");
        uint256 tokenID = nextID++;
        _safeMint(msg.sender, tokenID);
        gotchis[msg.sender] = Gotchi({
            name: name,
            mood: 100,
            energy: 100,
            owner: msg.sender,
            lastPlayed: block.timestamp
        });
    }

    function deleteGotchi() public {
        require(gotchis[msg.sender].owner == msg.sender, "You do not own a BoilerGotchi" );
        uint256 tokenId = _getGotchiTokenId(msg.sender);
        _burn(tokenId);
        delete gotchis[msg.sender];
    }

    function _getGotchiTokenId(address owner) private view returns (uint256) {
        require(gotchis[owner].owner == owner, "Owner does not have a BoilerGotchi");
        uint256 tokenId;
        for (uint256 i = 0; i < nextID; i++) {
            if (ownerOf(i) == owner) {
                tokenId = i;
                break;
            }
        }
        require(tokenId != 0, "Token ID not found");
        return tokenId;
    }

    function getBoilergotchiName(address user_addr) public view returns (string memory) {
        require(ownerOf(user_addr) != address(0), "BoilerGotchi does not exist.");
        return names[user_addr];
    }

    function setBoilergotchiName(address user_addr, string memory name) public {
        require(user_addr == msg.sender, "Caller is not the owner.");
        names[user_addr] = name;
    }

    function getBoilergotchiEnergyPoints(uint256 id) public view returns (uint256) {
        Gotchi storage g = gotchis[id];
        return g.energy;
    }

    function setBoilergotchiEnergyPoints(uint256 id, uint256 energy) public {
        require(msg.sender == ownerOf(id), "Caller is not the owner.");
        Gotchi storage g = gotchis[id];
        g.energy = energy;
    }

}
