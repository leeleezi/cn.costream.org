---
title:  打印抽象语法树
type: api
order: 28
---

打印抽象语法树，该阶段实现将前期工作后的COStream源程序对应抽象语法树AST在控制台的打印输出。

## Program entrance

```c++
//（9）Print AST
if (PrintAST) 
{
    PrintList(stdout, Program, -1);
    fprintf(stdout, "\n");
}

```
-	PrintAST：打印抽象语法树开关，定义于main.cpp头部
-	函数 PrintList(…) 函数为打印抽象语法树实现，将program内容在控制台打印输出

## 关联文件解析

`print-ast.c`
该文件为打印抽象语法树模块的单独实现代码文件，内部定义了AST上不同类型节点的打印方式。

|节点打印函数|描述|
|:-|:-|
|表达式节点打印输出||
|`PrintConst(…)`|该函数实现常量表达式的打印|
|`PrintBinop(…)`|二元表达式的打印输出|
|......|......|
|语句节点打印输出||
|`PrintLabel(…)`|Label节点的打印输出 |
|`PrintSwitch(…)`|Switch语句节点的打印输出 |
|......|......|
|类型节点打印输出||
|`PrintPrim(…)`|基本数据类型的打印输出|
|`PrintFdec(…)`|函数声明节点的打印输出|
|......|......|
|COStream文法扩展节点打印输出||
|`PrintComposite(…)`|COStream语言关键字Composite节点打印输出|
|`PrintParam(…)`|COStream语言常量Param节点打印输出|
|......|......|
|语法树节点及整体list打印输出||
|`PrintNode(…)`|节点打印函数，该函数内部实现判断节点类型，调用相应类型节点打印函数|
|`PrintList(…)`|语法树Program以链表的形式存储，从头结点依次遍历根据节点类型于控制台打印输出|