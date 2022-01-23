const path = require('path');
const nodeExternals = require('webpack-node-externals');

module.exports = {
    /**
     * @type {("none" | "development" | "production")}
     */
    mode: 'production',
    entry: './src/bin/www',
    output: {
        path: path.join(__dirname, 'dist'),
        filename: 'backend.js',
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: [
            '.tsx',
            '.ts',
            '.js',
        ],
        alias: { '@root': path.resolve('./src') },
    },
    externalsPresets: { node: true },
    externals: [nodeExternals()],
};
