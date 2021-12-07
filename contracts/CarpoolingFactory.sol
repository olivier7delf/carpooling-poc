// SPDX-License-Identifier: MIT
pragma solidity = 0.5.16;

import "./Carpooling.sol";
import "./MetaVariable.sol";

contract CarpoolingFactory is metaVariables {
    address public admin;
    address[] public carpoolingAddress;
    uint64[] public carpoolingIds;

    // Service query to join the safe registry
    enum SafeRegistryState {unknow, pending, validated, refused, conflicted}
    mapping(address => SafeRegistryState) servicesSafeRegistryState; // {service1: pending, service2: validated, ...}

    // User query to subscribe to a service: idCheck, insurance...
    mapping(address => mapping(uint64 => mapping(address => uint8))) pendingServiceCarpoolUserOptions; // {service1:{user9:7, user21:1}, ...}
    mapping(address => mapping(uint64 => mapping(address => uint8))) serviceCarpoolUserOptions; // {service1:{user9:7, user21:1}, ...}
    
    event CreateCarpooling(address driver, uint64 carpoolingId, address carpooling);
    event PendingSetServiceUserOption(address service, uint64 carpoolingId, address user, uint256 amount, bool cancel, bool success);
    event SetServiceUserOption(address service, uint64 carpoolingId, address user, bool success);

    constructor() public {
        admin = msg.sender;
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only the admin can do it");
        _;
    }
    
    // Create a carpooling linked to the factory contract.
    function createCarpooling(string memory origin,
     string memory destination, uint8 nSlot, uint256 price, 
     uint256 startTime,address payable conflictOwner, ModeConflict modeConflict
     ) public {
        uint64 carpoolingId = uint64(carpoolingIds.length);
        Carpooling newCarpooling = new Carpooling(msg.sender, carpoolingId, origin, destination, nSlot, price,
         startTime, conflictOwner, modeConflict);
        carpoolingIds.push(carpoolingId);
        carpoolingAddress.push(address(newCarpooling));

        emit CreateCarpooling(msg.sender, carpoolingId, address(newCarpooling));
    }

    // everyone can find a carpooling address using index
    function getCarpoolingAddressUsingIndex(uint64 index) public view returns(address) {
        return carpoolingAddress[index];
    }

    // ---> Services - factoryContract
    // A service ask to join the SafeRegistry
    function askServiceSafeRegistry() public {
        servicesSafeRegistryState[msg.sender] = SafeRegistryState.pending;
    }

    // admin set the status of the service.
    function setServiceSafeRegistry(address service, SafeRegistryState status) public onlyAdmin {
        servicesSafeRegistryState[service] = status;
    }

    // A user ask the status's service in servicesSafeRegistryState
    function getServiceSafeRegistry(address service) public view returns(SafeRegistryState) {
        return servicesSafeRegistryState[service];
    }

    // ---> Services - Users
    // A user from the carpooling ask to get a service. Add option in VF. Services in safeRegistry listen to this event
    function setPendingServiceCarpoolingUserOption(address service, uint64 carpoolingId, address user, uint256 amount, bool cancel) public {
        bool success = false;
        if(servicesSafeRegistryState[service] == SafeRegistryState.validated){
            pendingServiceCarpoolUserOptions[service][carpoolingId][user] = 1;
            success = true;
        }
        emit PendingSetServiceUserOption(service, carpoolingId, user, amount, cancel, success);
    }

    // the service can validate the user query
    function setServiceCarpoolingUserOption(uint64 carpoolingId, address user, bool success) public {   
        if(success==true){
            serviceCarpoolUserOptions[msg.sender][carpoolingId][user] = pendingServiceCarpoolUserOptions[msg.sender][carpoolingId][user];   
        }
        delete pendingServiceCarpoolUserOptions[msg.sender][carpoolingId][user];
        emit SetServiceUserOption(msg.sender, carpoolingId, user, success);
    }
}