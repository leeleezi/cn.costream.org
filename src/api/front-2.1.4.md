---
title: 删除临时文件 & 词、语法分析结果检查
type: api
order: 24
---

删除临时目录是编译工程在前端词、语法分析之后，对源程序文件所在目录下的临时文件进行删除。
另外，该模块对前面词、语法分析结果进行了正确性验证。


## 程序入口
```c++
// （4）Delete file & verifies the Lexical and grammatical analysis results
if (tmpname[0] != 0) 
{
    assert(0 == fclose(yyin));
    assert(0 == remove(tmpname));
}	
#ifndef NDEBUG
if (Errors == 0) {
    PhaseName = "Verification";
    VerifyParse(Program);
}
#endif

```
- 变量` Program`存储了源程序；
- `VerifyParse(Program)`是函数实现入口；实现对词、语法分析后，节点、数据类型、声明列表、表达式、表达式列表、语句、语句列表以及COStream语言扩展文法分析结果的正确性验证。
- 相关文件 : `verify-parse.c`

