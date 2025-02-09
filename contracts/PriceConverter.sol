// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {AggregatorV3Interface} from "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";

library PriceConverter {
    function getPrice(AggregatorV3Interface _priceFeed) internal view returns (uint256) {
        (, int256 price, , , ) = _priceFeed.latestRoundData();

        return uint256(price) * 1e10;
    }

    function getConversionRate(uint256 _ethAmount, AggregatorV3Interface _priceFeed) internal view returns (uint256) {
        uint256 ethPrice = getPrice(_priceFeed);
        uint256 ethAmountInUSD = (ethPrice * _ethAmount) / 1e18;

        return ethAmountInUSD;
    }
}
