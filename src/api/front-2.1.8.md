---
title:  常量传播
type: api
order: 27
---
常量传播：把每次运行时总是得到相同常量值的表达式替换为常量值。

## 介绍

常量传播是一种在现代编译器中使用的编译器优化技术。 高级常量传播形式或稀疏条件常量传播可以更准确地传播常量并无缝地删除无用的代码。

## 程序入口

```c++
// （8）Constant propagation
PhaseName = "Propagate";
if (Errors == 0 && Propagate)
{
    Program = PropagateProgram(Program);
    gIsAfterPropagate = TRUE;
}

```
-	变量`Propagate` 为常量传播开关，定于于main.cpp头部。
-	`PrapagateProgram(…)`函数实现常量传播，输入参数为活跃变量分析后的抽象语法树program，输出参数为常量传播后的抽象语法树program。
-	关联文件 : `propagator.h & propagator.cpp` 常量传播的声明头文件以及代码实现文件。
