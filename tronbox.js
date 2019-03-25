const tronNetworkConfig = require('./private_file/tron-network-config.js');
/*
module.exports = {
    mainnet: {
        privateKey: '*********************************',
    },

    shasta: {
        privateKey: '*********************************',
    },

    development: {
        privateKey: '*********************************',
    },
};
*/

module.exports = {
    networks: {
        development: {
            privateKey: tronNetworkConfig.development.privateKey,
            consume_user_resource_percent: 30,
            fee_limit: 100000000,
            fullHost: 'http://127.0.0.1:9090',
            network_id: '*',
        },
        mainnet: {
            privateKey: tronNetworkConfig.mainnet.privateKey,
            consume_user_resource_percent: 30,
            fee_limit: 100000000,
            fullHost: 'https://api.trongrid.io',
            network_id: '*',
        },
        shasta: {
            privateKey: tronNetworkConfig.shasta.privateKey,
            consume_user_resource_percent: 30,
            fee_limit: 100000000,
            fullHost: 'https://api.shasta.trongrid.io',
            network_id: '*',
        },
    },
};
