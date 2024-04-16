// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract BoilerGotchi {
	struct Gotchi {
		string name;
		uint256 mood;
		uint256 energy;
		address owner;
	}
    
	function feed() public {
		// Feed the gotchi and raise the energy level and happiness value
		// Require gotchi exist and its energy isn't full
	}

	// Get the mood of a BoilerGotchi using the name
	function getMood (string name) public {
	}

	// Set the mood of a BoilerGotchi using the name
	function setMood (string name) public {
	}
}

