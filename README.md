# Project Description

In this project, there are two roles involved: user and admin.

## User

User role: approve SwapToken to withdraw coin, swap token

## Admin

The admin role: initialize, set the exchange rate, set token, set sender, set receiver

## Process Flow

The main flow of the process is as follows:

1. User 1 holds 5000000000000000000 tokens of ABC Coin, an ERC20 token.
2. User 2 holds 5000000000000000000  tokens of XYZ Coin, another ERC20 token.
3. Both User 1 and User 2 want to exchange a certain amount of ABC for XYZ, with the exchange rate determined by the admin.
4. The admin deploys the TokenSwap contract.
5. The admin initialize the TokenSwap contract.
6. The admin can change the exchange rate, coin, sender, receiver if needed.
7. User 1 approves TokenSwap to withdraw 10000 tokens from their ABC Coin balance.
8. User 2 approves TokenSwap to withdraw 10000 tokens from their XYZ Coin balance.
9. Either User 1 or User 2 invokes the TokenSwap.swap() function.
10. As a result, the tokens are successfully traded between User A and User B.

