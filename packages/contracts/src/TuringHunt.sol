// SPDX-License-Identifier: MIT
pragma solidity ^0.8.23;

import {Ownable} from "@openzeppelin/contracts/access/Ownable.sol";

contract TuringHunt is Ownable {
    constructor(address initialOwner) Ownable(initialOwner) {}
}
