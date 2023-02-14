const path = require('path')
const { WebpackDonePlugin } = require("./webpack/WebpackDonePlugin");
const { WebpackRunPlugin } = require("./webpack/WebpackRunPlugin");
const loader1 = require('./webpack/loader1')
const loader2 = require('./webpack/loader2')
module.exports = {
    entry: {
        // index: path.join(__dirname, "./src/index.js")
        index: "./src/index.js"
    },
    //其他省略
    module: {
        rules: [
            { test: /\.js$/, use: [loader1, loader2] }
        ]
    },
    plugins: [new WebpackRunPlugin(), new WebpackDonePlugin()],
};