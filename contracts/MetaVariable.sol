// SPDX-License-Identifier: MIT
pragma solidity = 0.5.16;

// used by multiple contracts
interface metaVariables {
    enum State{pending, booked, validated, paid, conflicted} // of a carpooling
    enum ModeConflict{generous, normal, tyranic}  
    // generous: in case of conflict, passenger get back their money
    // normal: it depends
    // tyranic: the conflict owner will decide
}