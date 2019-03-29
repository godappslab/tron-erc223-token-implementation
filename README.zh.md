# 执行ERC 223令牌（TRON）

*Read this in other languages: [English](README.en.md), [日本語](README.ja.md).*

## 摘要

这是修改ERC 223令牌以与[TRON | Decentralize The Web](https://tron.network/)一起使用的源代码和文档。

- 编译器不支持openzeppelin- `SafeMath.sol` `Address.sol`的`pragma solidity ^0.5.0;` `SafeMath.sol` `pragma solidity ^0.5.0;`因此它包含在项目中，称为`pragma solidity ^0.4.23;` .

## 令牌设置

实现使得可以通过`migrations/2_deploy_tron_token.js`文件中的变量更改令牌名称，符号，总供应量和小数位数。

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

**令牌名称**

```es6
const name = 'GToken'; // Specify the name of your token
```

**令牌单位**

```es6
const symbol = 'GT'; // Specify the symbol of your token
```

**小数点后的位数**

```es6
const decimals = 18; // Number of decimal places
```

**总供应量（整数表达式）**

```es6
const totalSupply = 1000000000; // Total supply of tokens (integer representation)
```

## 规范

对于基本规范，请实现以下URL中讨论的功能和规范。

[推荐使用Dexaran / ERC223-token-standard](https://github.com/Dexaran/ERC223-token-standard/tree/Recommended)

作为例外，以下功能尚未实现，因为它们已确定它们可能导致意外操作。

```solidity
  function transfer(address to, uint value, bytes data, string custom_fallback) public returns (bool ok);
```

作为附加规范，它被实现为在执行`tokenFallback()`时检查返回值，这将在以下URL中讨论。这解决了由于执行回退功能而导致的令牌丢失。

https://github.com/ethereum/EIPs/issues/223#issuecomment-423952050

## 测试用例

使用[tronprotocol / tron-box](https://github.com/tronprotocol/tron-box)使用测试脚本[确认](https://github.com/tronprotocol/tron-box)操作。

粘贴下面的测试执行结果。

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

## 履行

该实现可在GitHub上获得。

https://github.com/godappslab/tron-erc223-token-implementation

令牌部署在测试网上。

https://shasta.tronscan.org/#/contract/TXhZKUNdQyPKB88Sif74u81wPLhq8Zm74r

为以太坊开发的ERC 223令牌的实现在以下存储库中发布。

https://github.com/godappslab/erc223-token-implementation

## 参考书目

- [Dexaran/ERC223-token-standard at Recommended](https://github.com/Dexaran/ERC223-token-standard/tree/Recommended)

- [ERC223 token standard · Issue #223 · ethereum/EIPs](https://github.com/ethereum/EIPs/issues/223)
