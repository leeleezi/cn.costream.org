---
title: 运行第一个COStream程序
type: guide
order: 3
costream_version: 0.6.0
---

### 运行COStream程序
尝试运行例子程序中的快速傅里叶变换的COStream程序:
```bash
$ cd ~/COStream
$ mkdir run_tests
$ cp tests/SPLtest/Benchmarks/06-FFT5/FFT6.cos run_tests/FFT6.cos
$ cd run_tests
$ COStreamC -x86 -nCpuCore 2 FFT6.cos -o ./fft/     
#出现 compile successful
$ cd fft
$ make              #生成可执行文件a.out
$ ./a.out           #出现执行结果。
```
### COStream命令说明

编译.cos程序命令：
```bash
$ COStreamC -x86 -nCpucore 2 文件名 -o ./k/
$ COStreamC -gpu -nGpu 4 文件名 -o ./test/ -multi 38400
```
>说明：
* CosC为编译命令
* x86 或 gpu为选择后端
* -nCpucore 或-nGpu 设置运行核数
* ./k/设置生成文件在当前目录下新建名为k的文件夹       

其他操作:
* 执行可执行文件并将结果重定向到result.txt文件： ./可执行文件名 > result.txt
* 求执行时间：time ./可执行文件名  -i 10000
* 生成同步数据流图：dot 文件名.dot  -Tpng -o 图名称.png
