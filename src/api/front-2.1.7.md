---
title:  变量重命名
type: api
order: 26
---

添加变量重命名模块

## 程序入口

```c++
//（7）Add variable rename
PhaseName = "VariableRename";
if(Errors == 0 && VariableRename)
{
    Program = VariableRenameProgram(Program);
}
ResetASTSymbolTable(VariableRenameTable);

```
- 对程序中的变量进行重新命名，例如 actor 变成 actor_1
- 相关文件 rename.h & rename.c
