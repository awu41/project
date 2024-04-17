// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract BoilerGotchi {
	struct Gotchi {
		string name;
		uint256 mood;
		uint256 energy;
		address owner;
		uint256 lastPlayed;
	}

	mapping(uint256 => Gotchi) public gotchis; 

	function feed() public {
		// Feed the gotchi and raise the energy level and happiness value
		// Require gotchi exist and its energy isn't full
	}

}
