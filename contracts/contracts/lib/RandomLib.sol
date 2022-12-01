// //SPDX-License-Identifier: Unlicense
// pragma solidity ^0.8.0;

// library RandomLib {
//     // TODO: improve security (e.g. using a vrf solution)
//     function random(uint256 nonInclusiveMax) public view returns (uint256) {
//         return
//             uint256(
//                 keccak256(
//                     abi.encodePacked(
//                         block.timestamp,
//                         block.difficulty,
//                         msg.sender
//                     )
//                 )
//             ) % nonInclusiveMax;
//     }

//     function isTargetAddressInArray(
//         address[] memory addresses,
//         address target
//     ) internal pure returns (uint256) {
//         for (uint256 i = 0; i < addresses.length; i++) {
//             if (addresses[i] == target) return i + 1;
//         }
//         return 0;
//     }

//     function selectRandomAddresses(
//         address[] memory addresses,
//         uint256[] memory weights,
//         uint256 weightSum,
//         uint256 numToSelect
//     ) public view returns (address[] memory, uint256[] memory) {
//         address[] memory selectedAddresses = new address[](numToSelect);
//         uint256[] memory selectedTimes = new uint256[](numToSelect);
//         uint256 curIndex = 1; // to distinguish b/w empty and 0 index
//         for (uint256 i = 0; i < numToSelect; i++) {
//             uint256 randomNum = random(weightSum);
//             uint256 pointer = 0;
//             address selected;
//             // TODO: use binary search
//             for (uint256 j = 0; j < addresses.length; j++) {
//                 address addr = addresses[j];
//                 uint256 weight = weights[j];
//                 if (weight == 0) continue;
//                 if (pointer <= randomNum && randomNum < pointer + weight) {
//                     selected = addr;
//                     weights[j] -= 1;
//                     break;
//                 }
//                 pointer += weight;
//             }
//             weightSum -= 1;
//             uint256 index = isTargetAddressInArray(selectedAddresses, selected);
//             if (index > 0) {
//                 selectedTimes[index - 1] += 1;
//             } else {
//                 selectedAddresses[curIndex - 1] = selected;
//                 selectedTimes[curIndex - 1] += 1;
//                 curIndex++;
//             }
//         }
//         return (selectedAddresses, selectedTimes);
//     }
// }
