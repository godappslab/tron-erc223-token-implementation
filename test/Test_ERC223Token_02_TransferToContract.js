const ERC223Token = artifacts.require('ERC223Token');
const BigNumber = require('bignumber.js');

// A Smart Contract in which the token fallback function of ERC 223 is implemented
const ImplementedERC223Fallback = artifacts.require('./ImplementedERC223Fallback.sol');

// Smart Contract with ERC 223 token fallback function not implemented
const NotImplementedERC223Fallback = artifacts.require('./NotImplementedERC223Fallback.sol');
const NotERC223FallbackButHasFallback = artifacts.require('./NotERC223FallbackButHasFallback.sol');

const toHumanReadableNumber = function(number, decimals) {
    return new BigNumber(number).div(BigNumber(10).pow(decimals)).toFormat(decimals);
};

contract('[TEST] ERC223Token Transfer to contract', async (accounts) => {
    const decimals = 18;

    // Number of tokens to transfer
    const transferValue = 100 * 10 ** decimals;

    const log = function() {
        console.log('       [LOG]', ...arguments);
    };

    const assertAmountEqual = function(a_value, b_value) {
        assert.equal(toHumanReadableNumber(a_value, decimals), toHumanReadableNumber(b_value, decimals));
    };

    it('Allow token transfer to implemented contract', async () => {
        const token = await ERC223Token.deployed();
        const implemented = await ImplementedERC223Fallback.new();

        const before = await token.balanceOf.call(implemented.address).then((result) => {
            return tronWeb.toDecimal(result.balance._hex);
        });
        log('implemented:', toHumanReadableNumber(before, decimals));

        log('ImplementedERC223Fallback :', implemented.address);

        await token.transfer.call(implemented.address, transferValue.toString());

        log('waiting...');
        await new Promise((r) => setTimeout(r, 1000));

        const after = await token.balanceOf.call(implemented.address).then((result) => {
            return tronWeb.toDecimal(result.balance._hex);
        });
        log('implemented:', toHumanReadableNumber(after, decimals));

        assertAmountEqual(after, transferValue);
    });

    it('Not allow token transfer to no implemented contract', async () => {
        const token = await ERC223Token.deployed();
        const notImplemented = await NotImplementedERC223Fallback.new();

        const before = await token.balanceOf.call(notImplemented.address).then((result) => {
            return tronWeb.toDecimal(result.balance._hex);
        });
        log('notImplemented:', toHumanReadableNumber(before, decimals));

        try {
            log('NotImplementedERC223Fallback :', notImplemented.address);
            await token.transfer.call(notImplemented.address, transferValue.toString());
            assert.fail('Expected throw not received');
        } catch (e) {
            log(e.message);
            const reverted = e.message.search('Not allow token transfer to no implemented contract') >= 0;
            assert.ok(true);
        }

        const after = await token.balanceOf.call(notImplemented.address).then((result) => {
            return tronWeb.toDecimal(result.balance._hex);
        });
        log('notImplemented:', toHumanReadableNumber(after, decimals));
    });

    it('Not allow transfer to has fallback contract', async () => {
        const token = await ERC223Token.deployed();
        const hasFallback = await NotERC223FallbackButHasFallback.new();

        const before = await token.balanceOf.call(hasFallback.address).then((result) => {
            return tronWeb.toDecimal(result.balance._hex);
        });
        log('hasFallback:', toHumanReadableNumber(before, decimals));

        try {
            log('NotImplementedERC223FallbackButHasFallback :', hasFallback.address);
            await token.transfer.call(hasFallback.address, transferValue.toString());
            assert.fail('Expected throw not received');
        } catch (e) {
            log(e.message);
            const reverted = e.message.search('Not allow transfer to has fallback contract') >= 0;
            assert.ok(true);
        }

        const after = await token.balanceOf.call(hasFallback.address).then((result) => {
            return tronWeb.toDecimal(result.balance._hex);
        });
        log('hasFallback:', toHumanReadableNumber(after, decimals));
    });
});
