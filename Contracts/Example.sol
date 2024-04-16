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

	function checkSuicidal(uint256 id) internal {
        Gotchi storage g = gotchis[id];
        if (block.timestamp - g.lastPlayed > 365 days) {
            g.mood = -1; // suicidal mood
        }
    }

    function getMood(uint256 id) public view returns (string memory) {
		//first check to see if gotchi is suicidal
		checkSuicidal(id);
		Gotchi storage g = gotchis[id];
        if (g.mood >= 200) { // Happy if mood has score 200+
            return "Happy";
        }
		else if (g.mood >= 100) { // Chill if mood has score 100 - 199
            return "Chill";
        }
		else if (g.mood >= 1) { // Sad if mood has score 0-99
            return "Sad";
        }
		else {
            return "Suicidal"; // Suicidal if mood has score -1 (hasn't been played or fed in 365 days)
        }
	}

	function checkStatus(uint256 id) public view returns (string memory) {
        Gotchi storage g = gotchis[id];
		//check if gotchi is suicidal and update mood
        checkSuicidal(id);
		//get the mood of gotchi
        string memory moodDescription = getMood(id);
        return string(abi.encodePacked("Name: ", g.name, "\nMood: ", moodDescription, "\nEnergy: ", uint256ToString(g.energy)));
    }
}
