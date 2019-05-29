# COStream 中文文档
![](https://travis-ci.org/DML308/cn.costream.org.svg?branch=master)

该站点基于 [Hexo](https://hexo.io/) 构建而成，使用[vue](https://vuejs.org)提供的主题。网站内容在 `src` 文件夹内，格式为 Markdown

英文原版仓库地址：https://github.com/DML308/COStream

## 编辑

``` bash
#modify XX.md
$ hexo generate
$ git status
$ git add -A
$ git commit 
$ git push
```

## 为 algolia 搜索建立索引

```bash
$ hexo algolia
```

## 部署

该站点使用[travis-ci持续集成服务](https://travis-ci.org) 对 `master` 分支进行部署到 `gh-pages` - Git Pages。

## 如何参与贡献

目前网站处于维护状态，我们会定期同步更新到英文版.


**注意：**

原则上这里不适合讨论 COStream 的使用问题，建议相关问题在 [COStream 仓库](https://github.com/DML308/COStream)开 `Issue`，以便得到更多人的帮助和更充分的讨论。

## 致谢

感谢 hexo 提供的渲染引擎和 vue 提供的主题.

