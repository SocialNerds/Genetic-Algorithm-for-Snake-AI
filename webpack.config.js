const path = require('path')

module.exports = {
    entry: './src/app.js',
    output: {
        path: __dirname + '/public',
        filename: 'js/app.js',
        chunkFilename: '[name].js'
    },
    devServer: {
        contentBase: __dirname + '/public/',
        inline: true,
        compress: true,
        port: 8080,
    },
    module: {
        rules: [
            { test: /\.js$/, exclude: /node_modules/, loader: 'babel-loader' },
            {
                test: /\.scss$/,
                use: ['style-loader', 'css-loader', 'sass-loader']
            }
        ]
    },
    watch: true,
    devtool: 'source-map',
    mode: 'development',
}
