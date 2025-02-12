// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {PriceConverter} from "./PriceConverter.sol";
import {AggregatorV3Interface} from "@chainlink/contracts/src/v0.8/shared/interfaces/AggregatorV3Interface.sol";

import "hardhat/console.sol";

error FundMe__NotOwner();
error FundMe__CallFailed();
error FundMe__InvalidAmount();

/// @title Learning Solidity: A contract for crowdfunding
contract FundMe {
    using PriceConverter for uint256;

    uint256 public constant MINIMUM_USD = 50 * 1e18;
    address[] private s_funders;
    mapping(address => uint256) private s_addressToAmountFunded;
    address private immutable I_OWNER;
    AggregatorV3Interface private s_priceFeed;

    modifier onlyOwner() {
        if (msg.sender != I_OWNER) revert FundMe__NotOwner();
        _;
    }

    constructor(address _priceFeed) {
        s_priceFeed = AggregatorV3Interface(_priceFeed);
        I_OWNER = msg.sender;
    }

    receive() external payable {
        fund();
    }

    fallback() external payable {
        fund();
    }

    /// Fund the contract
    /// @dev adds the sender to the funders list and stores the amount funded
    function fund() public payable {
        //        console.log("Conversion rate:", msg.value.getConversionRate(priceFeed));

        if (msg.value.getConversionRate(s_priceFeed) < MINIMUM_USD) revert FundMe__InvalidAmount();

        s_funders.push(msg.sender);
        s_addressToAmountFunded[msg.sender] = msg.value;
    }

    /// Withdraw the funds
    /// @dev withdraws the funds to the owner address, resets the funders list and the amount funded
    function withdraw() public onlyOwner {
        for (uint256 funderIndex = 0; funderIndex < s_funders.length; funderIndex++) {
            address funder = s_funders[funderIndex];
            s_addressToAmountFunded[funder] = 0;
        }

        s_funders = new address[](0);

        (bool isCallSuccess, ) = payable(msg.sender).call{value: address(this).balance}("");

        if (!isCallSuccess) revert FundMe__CallFailed();
    }

    function cheaperWithdraw() public payable onlyOwner {
        address[] memory funders = s_funders;

        for (uint funderIndex = 0; funderIndex < funders.length; funderIndex++) {
            address funder = funders[funderIndex];
            s_addressToAmountFunded[funder] = 0;
        }

        s_funders = new address[](0);

        (bool isCallSuccess, ) = payable(I_OWNER).call{value: address(this).balance}("");

        if (!isCallSuccess) revert FundMe__CallFailed();
    }

    function getOwner() public view returns (address) {
        return I_OWNER;
    }

    function getFunder(uint256 _index) public view returns (address) {
        return s_funders[_index];
    }

    function getAmountFunded(address _funder) public view returns (uint256) {
        return s_addressToAmountFunded[_funder];
    }

    function getPriceFeed() public view returns (AggregatorV3Interface) {
        return s_priceFeed;
    }
}
