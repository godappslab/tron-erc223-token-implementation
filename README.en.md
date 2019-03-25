# Implementation of ERC 223 token (TRON)

*Read this in other languages: [English](README.en.md) , [Japanese](README.ja.md) .*

## Overview

This is the source code and documentation that has modified the ERC 223 token to work with [TRON | Decentralize The Web](https://tron.network/) .

- The compiler does not support `pragma solidity ^0.5.0;` of `SafeMath.sol` `Address.sol` of openzeppelin-solidity, so it is included in the project and is called `pragma solidity ^0.4.23;` .

## Token setting

The implementation is such that the token name, symbol, total supply amount, and the number of decimal places can be changed by the variables in the `migrations/2_deploy_tron_token.js` file.

```es6
const fs = require('fs');
const ERC223Token = artifacts.require('ERC223Token');

const name = 'GToken'; // Specify the name of your token
const symbol = 'GT'; // Specify the symbol of your token
const decimals = 18; // Number of decimal places
const totalSupply = 1000000000; // Total supply of tokens (integer representation)

module.exports = (deployer) => {
    deployer.deploy(ERC223Token, name, symbol, decimals, totalSupply).then(() => {
        // Save ABI to file
        fs.mkdirSync('deploy/abi/', { recursive: true });
        fs.writeFileSync('deploy/abi/ERC223Token.json', JSON.stringify(ERC223Token.abi), { flag: 'w' });
    });
};
```

**Token name**

```es6
const name = 'GToken'; // Specify the name of your token
```

**Unit of token**

```es6
const symbol = 'GT'; // Specify the symbol of your token
```

**Number of digits after the decimal point**

```es6
const decimals = 18; // Number of decimal places
```

**Total supply amount (integer expression)**

```es6
const totalSupply = 1000000000; // Total supply of tokens (integer representation)
```

## specification

For basic specifications, implement the functions and specifications discussed in the following URL.

[Dexaran / ERC223-token-standard at Recommended](https://github.com/Dexaran/ERC223-token-standard/tree/Recommended)

As an exception, the following functions have not been implemented because they have determined that they may cause unintended operation.

```solidity
  function transfer(address to, uint value, bytes data, string custom_fallback) public returns (bool ok);
```

As an additional specification, it is implemented to check the return value when executing `tokenFallback()` , which is discussed in the following URL. This addresses the loss of tokens due to the fallback function being executed.

https://github.com/ethereum/EIPs/issues/223#issuecomment-423952050

## Test Cases

[Confirm](https://github.com/tronprotocol/tron-box) operation with test script using [tronprotocol / tron-box](https://github.com/tronprotocol/tron-box) .

Paste the test execution results below.

```bash
$ tronbox test
Using network 'development'.

Compiling ./contracts/ERC223ContractReceiverIF.sol...
Compiling ./test/ImplementedERC223Fallback.sol...
Compiling ./test/NotERC223FallbackButHasFallback.sol...
Compiling ./test/NotImplementedERC223Fallback.sol...
Deploying contracts to development network...

Warning: This version does not support tests written in Solidity.

Preparing Javascript tests (if any)...


  Contract: [TEST] ERC223Token Transfer to EOA
       [LOG] Owner      : 1,000,000,000.000000000000000000
       [LOG] User1      : 0.000000000000000000
       [LOG] User2      : 0.000000000000000000
    ✓ Initial state is the owner address token holding number: 1,000,000,000.000000000000000000 (63ms)
       [LOG] Owner      : 999,999,900.000000000000000000
       [LOG] User1      : 100.000000000000000000
       [LOG] User2      : 0.000000000000000000
    ✓ Transfer to Owner->User1 100.000000000000000000 (120ms)
       [LOG] Owner      : 999,999,700.000000000000000000
       [LOG] User1      : 100.000000000000000000
       [LOG] User2      : 200.000000000000000000
    ✓ Transfer to Owner->User2 200.000000000000000000 (110ms)
       [LOG] Owner      : 999,999,700.000000000000000000
       [LOG] User1      : 100.000000000000000000
       [LOG] User2      : 200.000000000000000000
    ✓ Transfer to User1->User2 200.000000000000000000 (92ms)

  Contract: [TEST] ERC223Token Transfer to contract
       [LOG] implemented: 0.000000000000000000
       [LOG] ImplementedERC223Fallback : 41edfae670018200a05947552c1d972baad90a1752
       [LOG] waiting...
       [LOG] implemented: 100.000000000000000000
    ✓ Allow token transfer to implemented contract (1136ms)
       [LOG] notImplemented: 0.000000000000000000
       [LOG] NotImplementedERC223Fallback : 41387ee0e8fc901652d279b221b941291da8a83d80
       [LOG] assert.fail()
       [LOG] notImplemented: 0.000000000000000000
    ✓ Not allow token transfer to no implemented contract (127ms)
       [LOG] hasFallback: 0.000000000000000000
       [LOG] NotImplementedERC223FallbackButHasFallback : 41d14a2032ac5642f3d4adab6f8a5152c5696ff26f
       [LOG] assert.fail()
       [LOG] hasFallback: 0.000000000000000000
    ✓ Not allow transfer to has fallback contract (113ms)


  7 passing (2s)

```

## Implementation

Implementation will be released on GitHub.

https://github.com/godappslab/tron-erc223-token-implementation

## References

- [Dexaran / ERC223-token-standard at Recommended](https://github.com/Dexaran/ERC223-token-standard/tree/Recommended)

- [ERC223 token standard · Issue # 223 · ethereum / EIPs](https://github.com/ethereum/EIPs/issues/223)
