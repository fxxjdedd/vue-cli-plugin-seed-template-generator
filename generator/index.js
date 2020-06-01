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

module.exports = (api, options = {}) => {
  const { url, branch } = options
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

  api.render('./template', {
    ...options,
  })
}
