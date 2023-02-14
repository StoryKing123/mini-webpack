class WebpackRunPlugin {
    apply(compiler) {
        compiler.hooks.run.tap("WebpackRunPlugin", () => {
            console.log("开始编译");
        });
    }
}

exports.WebpackRunPlugin = WebpackRunPlugin