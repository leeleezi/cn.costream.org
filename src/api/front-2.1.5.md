---
title:  语义检查
type: api
order: 25
---

语义检查是编译器前端词、语法分析后的步骤，该模块对语法分析后生成的抽象语法树所有节点逐一检查。

## 程序入口
```c++
// （5）sem-check.c is a semantic check file
	PhaseName = "Semantic Check"; 
	if (Errors == 0 && SemanticCheck)
		Program = SemanticCheckProgram(Program);

```
- This input of function is COStream program
- SemanticCheck is the switch of semantic check，defined in the head of main.cpp

## 关联文件解析
`sem-check.c` 是一个对前端语法树的语义检查文件

|输入：语法树||
|:-|:-|
|`GLOBAL List * SemanticCheckProgram()`|`program`是词、语法分析后生成的语法树该函数对其进行语义检查，返回检查后的program|
|表达式节点语义检查函数<br> Function type : `inline Node *`|`SemCheckConst()` <br>`SemCheckId()`<br>`SemCheckBinop()`<br>`SemCheckUnary()`<br>……|
|类型节点语义检查函数<br>Function type : `inline Node *`|`SemCheckPrim()`<br>`SemCheckTdef()`<br>……|
|其它语法树节点语义检查函数<br>Function type : `inline Node *`|`SemCheckDecl()`<br>`SemCheckAttrib()`<br>`SemCheckProc()`|
|SPL语法扩展语义检查函数<br>Function type : `GLOBAL Node *`|`AddDeclNodeConstTq()`<br>`StreamCheckFields()`<br>`SemCheckComposite()`<br>`SemCheckParam()`<br>`SemCheckWindow()`<br>……|   

说明：语义分析阶段在`SemCheckComposite()`函数，给程序入口节点`gMainComposite`赋值，使得该节点指向整个语法分析树的头结点，是语法树转化为平面图的基础。