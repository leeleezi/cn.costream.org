---
title: Git 使用简明教程
type: guide
order: 1001
---

<p class="tip">供以后多核组新生看</p>

## 学会使用**Vmware**安装Linux 虚拟机
不喜欢**Vmware**的可以选择 VirtualBox 或 Parallel Desktop (for Mac)

虚拟机选择 Ubuntu 或者 CentoOs 都可以,或其他 Linux 发行版
>Ubuntu:
- 14.04.5  	[下载](https://mirrors.163.com/ubuntu-releases/14.04.5/)	 *推荐64位*
- 16+版本  		*暂未测试过*
## Git
- 为什么要使用 Git? [廖雪峰的Git教程](https://www.liaoxuefeng.com/wiki/0013739516305929606dd18361248578c67b8067c8c017b000) *仅做参考*
- git 常用指令速查 [Git简明教程-简书](https://www.jianshu.com/p/16ad0722e4cc)

## 安装 git
`$ sudo apt-get install git`
![ubuntu](https://i.loli.net/2018/06/14/5b21fec70faa5.png)
初次安装git需要配置用户名和邮箱，否则git会提示：please tell me who you are.
你需要运行命令来配置你的用户名和邮箱：
![user.name](https://i.loli.net/2018/06/14/5b2200e1212ec.png)
<p class="tip">其实这里的 `user.name`不需要和你注册的账号相同,换句话说这里的 `user.name` 可以任意填写,不过当你有多台Git设备时可以通过定义这个 `user.name`来区分是由哪台设备上传的 `commit`,关于这一点在后文的 `git log`会有图片演示</p>

## 生成 ssh 密钥 
为了连接 Github 我们需要使用 ssh [参考链接](https://www.cnblogs.com/superGG1990/p/6844952.html)
git使用ssh密钥时，免去每次都要求输密码的麻烦
使用`ssh-keygen -t rsa -C "your@email.com"`指令生成 ssh 密钥
![](https://i.loli.net/2018/06/14/5b2204fb8d82c.png)
用`cat ~/.ssh/id_rsa.pub`查看你的 ssh 公钥,复制下面字符串
![copy ssh](https://i.loli.net/2018/06/14/5b2205ae66151.png)
登陆你的github帐户。点击右上角你的头像，然后 `Settings -> 左栏点击 SSH and GPG keys -> 点击 New SSH key`,把上面复制的公钥内容，粘贴进“Key”文本域内。 title域，自己随便起个名字例如上文的 user.name。点击 Add key。
完成以后，验证下这个key是不是正常工作：
```
$ ssh -T git@github.com
Attempts to ssh to github
RSA key fingerprint is 16:27:ac:a5:76:28:2d:36:63:1b:56:4d:eb:df:a6:48.
Are you sure you want to continue connecting (yes/no)? yes
```
如果看到：
`Hi xxx! You've successfully authenticated, but GitHub does not # provide shell access.`
恭喜你，你的设置已经成功了。

## 修改 & 提交
~~素质三连(误)~~
```bash
$ git add -A
$ git commit 
$ git push
```


## 学习要求✭
- 基本要求: 熟练使用`git clone | add | commit | push` *这里足够80%日常使用了*
- 进阶要求: 了解**分支**,使用`git branch | checkout`等指令
- 更高要求: 了解开源项目的`tag`,`release`,`Pull Request`等项目版本管理内容
- 边角料 : 在使用时遇到问题可以随时百度`git 版本回滚`,`.gitignore`,`git 分支合并`,`git log 详解`等内容

## 更多
### 更好看的 git log
```bash
git config --global alias.lg "log --color --graph --pretty=format:'%Cred%h%Creset -%C(yellow)%d%Creset %s %Cgreen(%cr) %C(bold blue)<%an>%Creset' --abbrev-commit" 
```
现在你每次在终端输入`git lg`，就能看到下面漂亮的git log了。
![git-lg](https://i.loli.net/2018/06/14/5b22158769764.png)
>需要注意的是:
- 前文设置的 user.name 这里会出现在 `git log` 记录里, 所以说给不同用户和设备设置不同的 user.name 是有益的.
- 专业团队的`git commit`的`comment`要求清晰、风格统一, 可以参考[阮一峰的网络日志-Commit](http://www.ruanyifeng.com/blog/2016/01/commit_message_change_log.html)

### for Mac:
Mac 用户可以通过 SSH 来连接自己的Vmware虚拟机 , 为什么要多此一举呢,是因为这里有超好看的终端 iTerm2,配置可以参考[ITerm2配色方案-简书](https://www.jianshu.com/p/33deff6b8a63)