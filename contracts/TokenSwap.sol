// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
contract TokenSwap is Ownable {
    address public mainToken;
    address public receiver;
    address public sender;
    address public admin;
	mapping(address => SwappedCurrency) public swappedCurrencies;
    event SafeTransfer(IERC20 _token, address _sender, address _recipient, uint _amount);
    event SetMainToken (address _token);
    event SetSwappedCurrencyRateAndDecimals (address _currency, uint256 _rate, uint256 _decimals);
    event Swap(address _token, uint256 amountSender, address receiver,uint amountReceiver);
	struct SwappedCurrency {
		uint256 decimals;
		uint256 rate;
	}
    constructor() {}
    function initialize(
    	address _mainToken,
		address _swappedCurrency,
		uint256 _swappedRate,
		uint256 _swappedCurrencyDecimals,
        address _receiver,
        address _sender) external onlyOwner {
		mainToken = _mainToken;
        receiver=_receiver;
        sender=_sender;
        swappedCurrencies[_swappedCurrency]=SwappedCurrency({
        rate:_swappedRate,
        decimals:_swappedCurrencyDecimals
        });
    }
    function swap(address _token, uint256 amountSender) public {
        require(amountSender > 0, "Amount is zero");
        require(msg.sender == receiver || msg.sender == sender, "UNAUTHORIZED");
        uint amountReceiver = _getSwappedCurrencyToTokenAmount(_token,amountSender);
        _safeTransferFrom(IERC20(mainToken), sender, receiver, amountSender);
        _safeTransferFrom(IERC20(_token), receiver, sender, amountReceiver);
        emit Swap(_token,amountSender,receiver, amountReceiver);
    }
	function setSwappedCurrencyRateAndDecimals(
		address _currency,
		uint256 _rate,
		uint256 _decimals
	) external onlyOwner {
		swappedCurrencies[_currency].rate = _rate;
		swappedCurrencies[_currency].decimals = _decimals;
        emit SetSwappedCurrencyRateAndDecimals(_currency,_rate,_decimals);
	}
    function getSwappedCurrencyRate(address _currency) public view returns (uint256) {
		return swappedCurrencies[_currency].rate;
	}
	function getSwappedCurrencyDecimals(address _currency) public view returns (uint256) {
		return swappedCurrencies[_currency].decimals;
	}
    function _getSwappedCurrencyToTokenAmount(
		address _token,
		uint256 _amount
	) public view returns (uint256) {
		uint256 rate = getSwappedCurrencyRate(_token);
		uint256 decimals = getSwappedCurrencyDecimals(_token);
		return (_amount * rate) / (10 ** decimals);
	}
    function setMainToken(address _token) external onlyOwner {
        require(_token==mainToken,"Can not set the same token");
		mainToken = _token;
		emit SetMainToken(_token);
	}
    function _safeTransferFrom(
        IERC20 token,
        address _sender,
        address recipient,
        uint amount
    ) private {
        bool sent = token.transferFrom(_sender, recipient, amount);
        token = IERC20(token);
        require(sent, "Token transfer failed");
        emit SafeTransfer(token,msg.sender,recipient,amount);
    }
}
