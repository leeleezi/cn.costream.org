---
title: 文法建立 & 语法树生成
type: api
order: 22
---

完成输入预处理以及初始化类型、符号表和操作符表后，则进入前端核心处理模块词法分析和语法分析，该步骤针对输入源程序文件处理，得到描述该程序文件的抽象语法树。

## 程序入口

```c++
/*（2）文法建立和语法树生成，yyparse()函数是内部调用语法分析器
* 于parser.c 3371行 {Program = GrabPragmas((yyvsp[(1)-(1)].L))};
* 得到对输入源程序的分析结果-语法树，存在list *program中
*/
PhaseName = "Parsing";
parsed_ok = yyparse(); 
if (Level != 0) 
{
    SyntaxError("unexpected end of file");
}
```
此处一个函数`parse()`的调用涵盖了整个词法分析与语法分析的内容，要想真正理解其中的步骤与内涵，必须对词法分析与语法分析有一个良好的掌握并对该工程中的词、语法分析文件仔细阅读。

## Flex

Flex又称快速词法分析器生成程序：
-	用正则表达式描述词法结构
-	正则表达式使用元语言描述匹配模式
-	对于工程，c4.l 为相应词法分析文件
-	处理步骤如下图：


![Flexsteps](https://i.loli.net/2018/07/10/5b44b348d5c8b.jpg)

## Bison
Bison 又称语法分析器：
-	识别文法，规则—BNF范式
-	利用移进/规约分析，运作当前记号的匹配规则
-	对于工程，ANSI-C.y为相应的语法分析文件
-	处理步骤如下图：


![Bisonsteps](https://i.loli.net/2018/07/10/5b44b357cd194.jpg)