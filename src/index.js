// import { SyncHook } from 'tapable'
const fs = require('fs')
const path = require('path')
const { SyncHook } = require('tapable')
function toUnixPath(filePath) {
    return filePath.replace(/\\/g, "/")
}

const baseDir = toUnixPath(process.cwd())

class Compiler {
    constructor(webpackOptions) {

        this.options = webpackOptions

        this.hooks = {
            run: new SyncHook(),
            done: new SyncHook()
        }
    }

    compiler(callback) {

        //虽然webpack只有一个Compiler，但是每次编译都会产出一个新的Compilation，
        //这里主要是为了考虑到watch模式，它会在启动时先编译一次，然后监听文件变化，如果发生变化会重新开始编译
        //每次编译都会产出一个新的Compilation，代表每次的编译结果
        let compilation = new Compilation(this.options)
        console.log(this.options)
        compilation.build(callback)
        // const onDone = () => {
        //     this.hooks.done.call()
        // }
        // this.done(onDone)
    }

    run(callback) {
        this.hooks.run.call();
        const onCompiled = () => {
            this.hooks.done.call()
        }
        this.compiler(onCompiled)
    }

    done(callback) {

    }
}


class Compilation {
    constructor(webpackOptions) {
        this.options = webpackOptions
        this.modules = []; //本次编译所有生成出来的模块
        this.chunks = []; //本次编译产出的所有代码块，入口模块和依赖的模块打包在一起为代码块
        this.assets = {}; //本次编译产出的资源文件
        this.fileDependencies = []; //本次打包涉及到的文件，这里主要是为了实现watch模式下监听文件的变化，文件发生变化后会重新编译

        // this.modules = []
        // this.chunks = []
        // this.assets = []
        // this.fileDependencies = []
    }

    //当编译模块的时候，name：这个模块是属于哪个代码块chunk的，modulePath：模块绝对路径
    buildModule(name, modulePath) {
        //6.2.1 读取模块内容，获取源代码
        let sourceCode = fs.readFileSync(modulePath, 'utf-8')
        //buildModule最终会返回一个modules模块对象，每个模块都会有一个id,id是相对于根目录的相对路径
        let moduleId = "./" + path.posix.relative(baseDir, modulePath)
        //6.2.2 创建模块对象
        let module = {
            id: moduleId,
            names: [name],//names设计成数组是因为代表的是此模块属于哪个代码块，可能属于多个代码块
            dependencies: [],//它依赖的模块
            _source: ""//该模块的代码信息
        }


        //6.2.3 找到对应的 `Loader` 对源代码进行翻译和替换
        let loaders = [];
        let { rules = [] } = this.options.module;
        rules.forEach(rule => {
            let { test } = rule
            //如果模块的路径和正则匹配，就把此规则对应的loader添加到loader数组中
            if (modulePath.match(test)) {
                loaders.push(...rule.use)
            }
        })
        sourceCode = loaders.reduceRight((code, loader) => { return loader(code) }, sourceCode)

        return module
    }

    build(callback) {
        //第五步：根据配置文件中的`entry`配置项找到所有的入口
        let entry = {};
        if (typeof this.options.entry === 'string') {
            entry.main = this.options.entry
        } else {
            entry = this.options.entry
        }

        //第六步：从入口文件出发，调用配置的 `loader` 规则，对各模块进行编译
        for (let entryName in entry) {
            //entryName="main" entryName就是entry的属性名，也将会成为代码块的名称
            let entryFilePath = path.posix.join(baseDir, entry[entryName])
            //6.1 把入口文件的绝对路径添加到依赖数组（`this.fileDependencies`）中，记录此次编译依赖的模块
            this.fileDependencies.push(entryFilePath)

            // console.log(entryFilePath)
            //6.2 得到入口模块的的 `module` 对象 （里面放着该模块的路径、依赖模块、源代码等）
            let entryModule = this.buildModule(entryName, entryFilePath)
            //6.3 将生成的入口文件 `module` 对象 push 进 `this.modules` 中
            this.modules.push(entryModule)
        }

        //编译成功执行callback
        callback()
    }
}


function webpack(webpackOptions) {
    const compiler = new Compiler(webpackOptions)
    const { plugins } = webpackOptions
    for (let plugin of plugins) {
        plugin.apply(compiler)
    }
    return compiler
}




exports.webpack = webpack