---
title: 目标代码生成
type: api
order: 37
---

该编译工程是一个高级语言之间转换的编译器，主要目的是实现多核平台下的并行编程，针对数据流语言COStream编写的数据流程序，经过编译原理的一系列步骤转换为多线程的C++程序代码。
经过以上介绍的步骤，该阶段实现编译器的最后一个模块，不同目标代码的生成。


## 程序入口
```c++
// （7）Input is SDF graph，output is platform code
PhaseName = "CodeGeneration";
if (Errors == 0 && GenerateDestCode && (X86Backend || X10Backend ||
GPUBackend) )
{
    char *tmp = new char[1000];
    getcwd(tmp, 1000);
    //printf("%s\n", tmp);
    ActorEdgeInfo actorEdgeInfo(SSSG);
    CodeGeneration(tmp, SSSG,substring,pSA,mp,maflp);
    delete tmp;
    delete pSA;
    tmp = NULL;
     ……
}

```
- 首先，类ActorEdgeInfo的构造函数创建一个对象，存储当前SDF图中所有边的信息
- 代码生成入口函数CodeGeneration(…)
- 其中，代码生成函数的参数设定为
```c++
void CodeGeneration(char *currentDir,   //currentDir：directory of Source file 
SchedulerSSG *sssg,                     //sssg：SDF graph finish the scheduling and division
string substring,                       //substring： COStream source filename
StageAssignment *psa,                   //psa：result of Stageassignment
MetisPartiton *Mp,                      //Mp：result of Metis partition 
MAFLPartition *maflp)                   //maflp：result of GPU partition 
```

## 关联文件解析

|File name |Function|
|:-|:-|
|`ActorEdgeInfo.h& ActorEdgeInfo.cpp`|store information about all edges in the current SDF graph|
|`CodeGeneration.h& CodeGeneration.cpp`|A collection of all platform code generation calls|
|`X86CodeGenatate.h&X86CodeGenerate.cpp`|Code generation module for the X86 platform|
|`X86LibCopy.h & X86LibCopy.cpp`|Lib copy module for the X86 platform|


## 关键代码理解
Part 1: 目标代码文件名与路径的处理
```c++
if (Win)
{
	dir += "\\X86StaticDistCode_Win\\";
}
else 
    dir +="\\X86StaticDistCode_Linux\\";
dir += substring;
dir += "\\";
objName = new char[substring.size()+1];
strcpy(objName,substring.c_str());
```

Part 2: 代码生成各模块分解
```c++
X86CodeGenerate *X86Code = new X86CodeGenerate(sssg, nCpucore, dir.c_str(),psa,Mp);
X86Code->CGGlobalvar();	     //生成流程序引入的全局变量定义文件	GlobalVar.cpp
X86Code->CGGlobalvarextern();//生成流程序引入的全局变量的声明文件 GlobalVar.h
X86Code->CGglobalHeader();	 //生成stream流类型和全局数据流缓存区的声明
X86Code->CGglobalCpp();	     //生成流缓冲区的定义
X86Code->CGThreads();	     //生成所有线程
X86Code->CGactors();		 //生成以类表示的计算单元actor
X86Code->CGMain();		     //生成启动线程的main文件
```
Part 3: 代码生成Lib文件拷贝
```c++
X86LibCopy tmp;
tmp.Run(dir.c_str());
```