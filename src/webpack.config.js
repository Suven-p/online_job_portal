const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
    mode: 'production',
    entry: './bin/www',
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'backend.js',
    },
    resolve: { alias: { '@root': path.resolve('.') } },
    externalsPresets: { node: true },
    externals: [nodeExternals()],
};
