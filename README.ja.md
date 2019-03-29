# ERC223トークンの実装(TRON)

*Read this in other languages: [English](README.en.md), [简体中文](README.zh.md), [日本語](README.ja.md).*

## 概要

これはERC223トークンを [TRON \| Decentralize The Web](https://tron.network/) で動作するように修正したソースコード及び、ドキュメントです。

* openzeppelin-solidity の `SafeMath.sol` `Address.sol` の `pragma solidity ^0.5.0;` にコンパイラが対応していないため、プロジェクトに取り込み、`pragma solidity ^0.4.23;`としています。

## トークンの設定

トークンの名称・シンボル・総供給量・小数点以下の桁数は `migrations/2_deploy_tron_token.js` ファイル内の変数により指定を変えることができるような実装にしています。

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

**トークンの名称**

```es6
const name = 'GToken'; // Specify the name of your token
```

**トークンの単位**

```es6
const symbol = 'GT'; // Specify the symbol of your token
```

**小数点以下の桁数**

```es6
const decimals = 18; // Number of decimal places
```

**総供給量(整数表現)**

```es6
const totalSupply = 1000000000; // Total supply of tokens (integer representation)
```

## 仕様

基本的な仕様については、以下のURLで議論されている機能・仕様を実装する。

[Dexaran/ERC223\-token\-standard at Recommended](https://github.com/Dexaran/ERC223-token-standard/tree/Recommended)

例外として、以下の関数については、意図しない動作を引き起こす可能性があると判断し、実装していません。

```solidity
  function transfer(address to, uint value, bytes data, string custom_fallback) public returns (bool ok);
```

追加の仕様として以下の URL にて議論されている `tokenFallback()` を実行した際の戻り値を確認するように実装している。これにより、フォールバック関数が実行されてしまうことによるトークンの消失に対応する。

https://github.com/ethereum/EIPs/issues/223#issuecomment-423952050


## Test Cases

[tronprotocol/tron\-box](https://github.com/tronprotocol/tron-box) を利用したテストスクリプトで動作確認を行う。

テストの実行結果を以下に貼り付ける。

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

## 実装

実装はGitHubにて公開しています。

https://github.com/godappslab/tron-erc223-token-implementation

トークンはテストネットにデプロイしています。

https://shasta.tronscan.org/#/contract/TXhZKUNdQyPKB88Sif74u81wPLhq8Zm74r

Ethereum 向けに開発したERC223トークンの実装は下記のリポジトリで公開しています。

https://github.com/godappslab/erc223-token-implementation

## 参考文献

- [Dexaran/ERC223\-token\-standard at Recommended](https://github.com/Dexaran/ERC223-token-standard/tree/Recommended)

- [ERC223 token standard · Issue \#223 · ethereum/EIPs](https://github.com/ethereum/EIPs/issues/223)
