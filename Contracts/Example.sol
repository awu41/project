// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract BoilerGotchi {
    uint256 public value;

    event ValueChanged(uint256 newValue);

    function setValue(uint256 newValue) public {
        value = newValue;
        emit ValueChanged(newValue);
    }

    function getValue() public view returns (uint256) {
        return value;
    }

	function feed() public {
		// Feed the gotchi and raise the energy level and happiness value
		// Require gotchi exist and its energy isn't full
	}
}

