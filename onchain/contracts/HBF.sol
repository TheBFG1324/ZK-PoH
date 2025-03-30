// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract HBF {
    uint256 private constant BITSTREAM_SIZE = 46251;
    uint256 private constant INDEXES_PER_PERSON = 3;
    uint256 private constant LEVELS = 165;
    uint256 private constant VALUES_PER_UINT256 = 16;
    uint256 private constant PACKED_INDICES_PER_LEVEL = (BITSTREAM_SIZE + VALUES_PER_UINT256 - 1) / VALUES_PER_UINT256;

    // Storage for bit streams using arrays instead of mappings
    uint256[PACKED_INDICES_PER_LEVEL][LEVELS] private bitStreams;

    // Set a single value
    function setValue(uint256 level, uint256 valueIndex, uint16 value) public {
        require(level < LEVELS, "Level index out of range");
        require(valueIndex < BITSTREAM_SIZE, "Value index out of range");

        uint256 packedIndex = valueIndex / VALUES_PER_UINT256;
        uint256 position = valueIndex % VALUES_PER_UINT256;

        // Retrieve the packed data
        uint256 packedData = bitStreams[level][packedIndex];

        // Clear the bits at position
        packedData &= ~(uint256(0xFFFF) << (position * 16));

        // Set the new value
        packedData |= uint256(value) << (position * 16);

        bitStreams[level][packedIndex] = packedData;
    }

    // Get a single value
    function getValue(uint256 level, uint256 valueIndex) public view returns (uint16) {
        require(level < LEVELS, "Level index out of range");
        require(valueIndex < BITSTREAM_SIZE, "Value index out of range");

        uint256 packedIndex = valueIndex / VALUES_PER_UINT256;
        uint256 position = valueIndex % VALUES_PER_UINT256;

        uint256 packedData = bitStreams[level][packedIndex];

        uint16 value = uint16((packedData >> (position * 16)) & 0xFFFF);

        return value;
    }

    // New function to set packed data directly
    function setPackedDataBatch(
        uint256 level,
        uint256[] memory packedIndices,
        uint256[] memory packedData
    ) public {
        require(level < LEVELS, "Level index out of range");
        require(packedIndices.length == packedData.length, "Arrays must be of the same length");
        for (uint256 i = 0; i < packedIndices.length; i++) {
            bitStreams[level][packedIndices[i]] = packedData[i];
        }
    }

    // Insert an identity
    function insertIdentity(uint256[INDEXES_PER_PERSON][LEVELS] memory person) public {
        for (uint256 level = 0; level < LEVELS; level++) {
            for (uint256 i = 0; i < INDEXES_PER_PERSON; i++) {
                uint256 valueIndex = person[level][i];
                require(valueIndex < BITSTREAM_SIZE, "Value index out of range");

                uint256 packedIndex = valueIndex / VALUES_PER_UINT256;
                uint256 position = valueIndex % VALUES_PER_UINT256;

                uint256 packedData = bitStreams[level][packedIndex];
                uint16 currentValue = uint16((packedData >> (position * 16)) & 0xFFFF);

                currentValue += 1;

                // Clear the bits at position
                packedData &= ~(uint256(0xFFFF) << (position * 16));

                // Set the new value
                packedData |= uint256(currentValue) << (position * 16);

                bitStreams[level][packedIndex] = packedData;
            }
        }
    }

    // Remove an identity
    function removeIdentity(uint256[INDEXES_PER_PERSON][LEVELS] memory person) public {
        for (uint256 level = 0; level < LEVELS; level++) {
            for (uint256 i = 0; i < INDEXES_PER_PERSON; i++) {
                uint256 valueIndex = person[level][i];
                require(valueIndex < BITSTREAM_SIZE, "Value index out of range");

                uint256 packedIndex = valueIndex / VALUES_PER_UINT256;
                uint256 position = valueIndex % VALUES_PER_UINT256;

                uint256 packedData = bitStreams[level][packedIndex];
                uint16 currentValue = uint16((packedData >> (position * 16)) & 0xFFFF);

                require(currentValue > 0, "Bit value is too low to remove identity!");

                currentValue -= 1;

                // Clear the bits at position
                packedData &= ~(uint256(0xFFFF) << (position * 16));

                // Set the new value
                packedData |= uint256(currentValue) << (position * 16);

                bitStreams[level][packedIndex] = packedData;
            }
        }
    }

    // Check if an identity is enrolled
    function checkIfEnrolled(uint256[INDEXES_PER_PERSON][LEVELS] memory person) public view returns (uint256) {
        uint256 passCount = 0;

        for (uint256 level = 0; level < LEVELS; level++) {
            bool levelPassed = true;

            for (uint256 i = 0; i < INDEXES_PER_PERSON; i++) {
                uint256 valueIndex = person[level][i];
                require(valueIndex < BITSTREAM_SIZE, "Value index out of range");

                uint256 packedIndex = valueIndex / VALUES_PER_UINT256;
                uint256 position = valueIndex % VALUES_PER_UINT256;

                uint256 packedData = bitStreams[level][packedIndex];
                uint16 currentValue = uint16((packedData >> (position * 16)) & 0xFFFF);

                if (currentValue == 0) {
                    levelPassed = false;
                    break;
                }
            }

            if (levelPassed) {
                passCount++;
            }
        }

        return passCount;
    }

    // Mock function to get HBF level data
    function getLevelArray(uint256 level) public pure returns (uint256[] memory) {
        require(level < LEVELS, "Level index out of range");
        uint256[] memory emptyArray = new uint256[](0);
        return emptyArray;
    }
}