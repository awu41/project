// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
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

    function getBoilergotchiName() public view returns (string memory) {
        require(gotchis[msg.sender].owner != address(0), "BoilerGotchi does not exist.");
        return names[msg.sender];
    }

    ///function setBoilergotchiName(address user_addr, string memory name) public {
     //   require(user_addr == msg.sender, "Caller is not the owner.");
       // names[user_addr] = name;
    //}

    function getBoilergotchiEnergyPoints() public view returns (uint256) {
        // Access the gotchi with the specified ID
        Gotchi storage g = gotchis[msg.sender];
        // Return the energy points
        return g.energy;
    }

    function setBoilergotchiEnergyPoints(uint256 energy) public {
        require(gotchis[msg.sender].owner == msg.sender, "Caller is not the owner.");
        Gotchi storage g = gotchis[msg.sender];
        g.energy = energy;
	}

    function feedBoilerGotchi() public {
        // Function to will feed apto gotchi by one
        if (gotchis[msg.sender].energy != 100) {
            gotchis[msg.sender].energy += 10;
        }
        if (gotchis[msg.sender].mood != 350) {
            gotchis[msg.sender].mood += 35;
        }
    }

    function playBoilerGotchi() public {
        require(gotchis[msg.sender].energy != 0, "Your gotchi has no energy");
        if (gotchis[msg.sender].mood != 365) {
            gotchis[msg.sender].mood++;
        }
        gotchis[msg.sender].energy--;
        gotchis[msg.sender].lastPlayed = block.timestamp;
    }

    function checkSuicidal() public view returns(bool) {
        Gotchi storage g = gotchis[msg.sender];
        return (block.timestamp - g.lastPlayed > 365 days); // suicidal if it hasn't been played with or fed in 365 days
    }

    function getMood() view public returns (string memory) {
		//first check to see if gotchi is suicidal
		Gotchi storage g = gotchis[msg.sender];
		if (checkSuicidal()) {
			return "Suicidal";
		}
        else if (g.mood >= 200) { // Happy if mood has score 200+
            return "Happy";
		}
		else if (g.mood >= 100) { // Chill if mood has score 100 - 199
            return "Chill";
		}
		else if (g.mood >= 1) { // Sad if mood has score 0-99
            return "Sad";
		}
    }

    function uint256ToString(uint256 _value) internal pure returns (string memory) {
		if (_value == 0) {
			return "0";
		}
		uint256 temp = _value;
		uint256 digits;
		while (temp != 0) {
			digits++;
			temp /= 10;
		}
		bytes memory buffer = new bytes(digits);
		while (_value != 0) {
		digits -= 1;
		buffer[digits] = bytes1(uint8(48 + uint256(_value % 10)));
		_value /= 10;
		}
		return string(buffer);
    }

    function checkStatus() public view returns (string memory) {
        Gotchi storage g = gotchis[msg.sender];
		//get the mood of gotchi
		string memory moodDescription = getMood();
		return string(abi.encodePacked("Name: ", g.name, "\nMood: ", moodDescription, "\nEnergy: ", uint256ToString(g.energy)));
    }

    function transfer(address from, address to) public {
        uint256 tokenId = _getGotchiTokenId(from);
            transferFrom(from, to, tokenId);
    }
}
