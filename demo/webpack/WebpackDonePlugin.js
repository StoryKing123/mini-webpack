class WebpackDonePlugin {
    apply(compiler) {
        compiler.hooks.done.tap("WebpackDonePlugin", () => {
            console.log("结束编译");
        });
    }
}

exports.WebpackDonePlugin = WebpackDonePlugin