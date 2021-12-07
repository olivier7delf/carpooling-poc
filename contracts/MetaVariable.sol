// SPDX-License-Identifier: MIT
pragma solidity = 0.5.16;

// used by multiple contracts
interface metaVariables {
    enum State{pending, booked, validated, paid, conflicted}
    enum ModeConflict{generous, normal, tyranic}  
}