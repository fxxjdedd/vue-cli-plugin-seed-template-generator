# vue-cli-plugin-seed-template-generator

这是一个通用的Vue-cli插件，可以帮你把种子仓库拉取下来，并清空其git的commit历史。

如果你有一个种子仓库，又苦于没有脚手架方便的生成这个种子仓库，这个插件可以帮助到你。

## 作为Vue-Cli的插件的用法
1. 修改下方代码中的url为你的种子仓库的ssh地址
2. 修改your-project-name为你的项目名
3. 复制到命令行执行即可
```bash
declare preset='{
    "plugins": {
        "vue-cli-plugin-seed-template-generator": {
           "url": <git-repo-url>
        }
    }
}'
vue create --inlinePreset $preset <your-project-name>
```

## License
MIT