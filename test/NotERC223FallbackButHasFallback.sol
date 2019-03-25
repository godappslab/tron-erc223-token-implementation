pragma solidity ^0.4.23;

/**
* @title Contract that will work with ERC223 tokens.
*/

contract NotERC223FallbackButHasFallback {
    /**
     * @dev fallback function
     *
     */
    function() external {}

}
