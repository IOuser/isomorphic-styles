module.exports = {
    devtool: false,
    mode: 'development',
    module: {
        rules: [
            {
                test: /(\.scss|\.css)$/,
                use: [
                    { loader: require.resolve('../lib/loader/loader.js'), options: { autoInject: true } },
                    {
                        loader: 'css-loader',
                        options: {
                            sourceMap: true,
                            modules: true,
                            localIdentName: '[name]__[local]--[hash:base64:5]', // : '[hash:base64:6]',
                            camelCase: true,
                            // importLoaders: 2,
                        },
                    },
                ],
            }
        ]
    }
}
