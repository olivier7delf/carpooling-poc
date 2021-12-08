// SPDX-License-Identifier: MIT
pragma solidity = 0.5.16;

contract CarpoolingFactoryAbstract {    
    function setPendingServiceCarpoolingUserOption(address service, uint64 carpoolingId, address user, uint256 amount, bool cancel) public;
}
