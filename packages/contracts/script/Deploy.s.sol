// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import {Script, console} from "forge-std/Script.sol";
import {TuringHunt} from "src/TuringHunt.sol";

contract DeployScript is Script {
    function setUp() public {}

    function run() public {
        uint256 deployerPrivateKey = vm.envUint("PRIVATE_KEY");
        address deployerAddress = vm.addr(deployerPrivateKey);
        vm.startBroadcast(deployerPrivateKey);

        console.log("Deploying TuringHunt with deployer address", deployerAddress);

        TuringHunt game = new TuringHunt(deployerAddress);

        console.log("Deployed TuringHunt at address: %s", address(game));
        vm.stopBroadcast();
    }
}
