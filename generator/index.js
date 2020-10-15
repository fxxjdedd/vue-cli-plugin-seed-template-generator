const path = require('path')
const glob = require('glob')
const { execSync } = require('child_process')
const fs = require('fs')

function replaceHtmlTemplateSymbols() {
  const fileList = glob.sync(path.resolve(__dirname, 'template/public/*.html'))
  fileList.forEach(file => {
    const htmlTemplate = fs.readFileSync(path.resolve(__dirname, file), 'utf-8').toString()
    const replaced = htmlTemplate.replace(/<%=/g, '<%%=').replace(/%>/g, '%%>')
    fs.writeFileSync(file, replaced, 'utf-8')
  })
}

function replaceDotFilePrefix() {
  const fileList = glob.sync(path.resolve(__dirname, '../**/*'), { dot: true, nodir: true })
  fileList.forEach(file => {
    const splits = file.split(path.sep)
    const newSplits = splits.slice()
    splits.forEach((split, index) => {
      if (split.charAt(0) === '.') {
        const newName = `_${split.slice(1)}`
        newSplits[index] = newName
        const oldFile = newSplits.slice(0, index).concat([splits[index]]).join(path.sep)
        const newFile = newSplits.slice(0, index + 1).join(path.sep)
        if (fs.existsSync(oldFile)) {
          fs.renameSync(oldFile, newFile)
        }
      }
    })
  })
}

// 如何判断一个文件是否是vue-cli生成的，我们基于以下3点：
// 1. vue-cli的bare模式src中只会生成: App.vue, main.js, assets
// 2. vue-cli的generator会在所有generator之前执行，所以如果有重名文件会被自定义的generator覆盖，不存在安全问题
// 3. assets是所有技术栈通用的，而App.vue和main.js不是，所以我们只需要针对这两个文件判断
function removeVueCliGeneratedFiles(files) {
  ;['src/App.vue', 'src/main.js'].forEach(file => {
    const fileExist = fs.existsSync(path.resolve(__dirname, 'template', file))
    if (!fileExist) {
      delete files[file]
    }
  })
}

module.exports = (api, options = {}) => {
  const { url, branch, monorepo = false } = options
  if (!url) {
    console.error('url is required')
    process.exit(1)
  }
  const templateDir = path.resolve(__dirname, 'template')
  execSync(`rm -rf ${templateDir}`)
  execSync(`git clone -b ${branch} ${url} ${templateDir}`)
  execSync(`rm -rf ${templateDir}/.git`)

  replaceHtmlTemplateSymbols()

  // https://github.com/vuejs/vue-cli/pull/5537, When this pr is passed, this line can be deleted
  replaceDotFilePrefix()

  const seedTemplatePackage = {
    // 这一行要放到最前面：
    // 1. 不会影响种子仓库原本的package.json
    // 2. 避免vue-cli自动生成的browserslist字段和种子仓库自身的.browserslistrc冲突
    browserslist: undefined,
    ...JSON.parse(fs.readFileSync(path.resolve(templateDir, 'package.json'), 'utf-8')),
  }

  api.extendPackage(seedTemplatePackage)

  api.render('./template', {
    ...options,
  })

  api.postProcessFiles(files => {
    // 另外一个问题，即使是bare模式，vue-cli依然会生成一些文件，我们要把它删掉，保证生成的文件都是来自于种子仓库
    removeVueCliGeneratedFiles(files)
    // 如果是monorepo，直接把src目录删掉
    if (monorepo) {
      execSync(`rm -rf ${templateDir}/src`)
    }
  })
}

// 关于这个插件与vue-cli自带的generator之间可能存在的冲突
// vue-cli自带的generator会在所有自定义generator之前执行，所以一般不会存在冲突。但是依然会存在一些比较特殊的文件，可能会存在冲突：

// README: 最新版的vue-cli会判断是否已经存在README，如果存在则不会进行覆盖
// package.json: 如果想保留种子仓库中的package.json，则必须把它填充到extendPackage中。否则，vue-cli的package.json会完全覆盖种子仓库的.
// 其他文件: 安全的
