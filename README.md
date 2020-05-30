# vue-cli-plugin-seed-template-generator

This is a general-purpose Vue-cli plugin that can help you pull down the seed repository and clear its git commit history.

这是一个通用的Vue-cli插件，可以帮你把种子仓库拉取下来，并清空其git的commit历史。

If you have a seed warehouse, and suffer from the convenience of generating this seed warehouse without scaffolding, this plugin can help you.

如果你有一个种子仓库，又苦于没有脚手架方便的生成这个种子仓库，这个插件可以帮助到你。




## Internal workings

First, pull the user-specified warehouse to the local through git, and clear its `.git` folder, so that the history commit record is cleared

首先通过git把用户指定的仓库拉取到本地，并清除其`.git`文件夹，从而让清空历史commit记录

Then, with the help of the plug-in capabilities provided by vue-cli, use [Generator](https://cli.vuejs.org/zh/dev-guide/plugin-dev.html#generator) to regenerate the warehouse pulled down by git to the user The specified destination folder

然后借助vue-cli提供的插件能力，使用[Generator](https://cli.vuejs.org/zh/dev-guide/plugin-dev.html#generator)把git拉取下来的仓库重新生成到用户指定的目标文件夹



## Usage
1. Specify the `git-repository-url`
2. Specify the `your-project-name`
3. Copy to terminal and run
```bash
declare preset='{
    "plugins": {
        "vue-cli-plugin-seed-template-generator": {
           "url": <git-repository-url>
        }
    }
}'
vue create --inlinePreset $preset <your-project-name>
```

## License
MIT