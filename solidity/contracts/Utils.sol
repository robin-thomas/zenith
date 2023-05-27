// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

/**
 * @dev This contract is a library of utility functions.
 */
library Utils {
    /**
     * @dev Converts a uint8 number in hex character to uint8.
     *
     * @param _c The string to be converted.
     * @return The bytes representation of the string.
     */
    function fromHexChar(uint8 _c) internal pure returns (uint8) {
        if (bytes1(_c) >= bytes1("0") && bytes1(_c) <= bytes1("9")) {
            return _c - uint8(bytes1("0"));
        }
        if (bytes1(_c) >= bytes1("a") && bytes1(_c) <= bytes1("f")) {
            return 10 + _c - uint8(bytes1("a"));
        }
        if (bytes1(_c) >= bytes1("A") && bytes1(_c) <= bytes1("F")) {
            return 10 + _c - uint8(bytes1("A"));
        }
        revert("fail");
    }

    /**
     * @dev Converts a hex string to bytes.
     *
     * @param _hexString The hex string to be converted.
     * @return The bytes representation of the string.
     */
    function hexStringToBytes(
        string memory _hexString
    ) internal pure returns (bytes memory) {
        bytes memory _ss = bytes(_hexString);
        bytes memory _r = new bytes(_ss.length / 2);

        for (uint _index = 0; _index < _ss.length / 2; _index++) {
            _r[_index] = bytes1(
                fromHexChar(uint8(_ss[2 * _index])) *
                    16 +
                    fromHexChar(uint8(_ss[2 * _index + 1]))
            );
        }
        return _r;
    }

    /**
     * @dev Converts a string to uint.
     *
     * @param _s The string to be converted.
     * @return The uint representation of the string.
     */
    function stringToUint(string memory _s) internal pure returns (uint) {
        bytes memory _b = bytes(_s);
        uint _result = 0;
        for (uint _index = 0; _index < _b.length; _index++) {
            uint _c = uint(uint8(_b[_index]));
            if (_c >= 48 && _c <= 57) {
                _result = _result * 10 + (_c - 48);
            }
        }
        return _result;
    }
}
