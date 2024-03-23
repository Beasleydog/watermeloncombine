module.exports = {
    experiments: {
        asyncWebAssembly: true
    },
    watch: true,
    entry: {
        main: './src/index.js',
        spectate: './src/spectate.js'
    },
    output: {
        filename: '[name].js',
        path: __dirname + "/build"
    }
}