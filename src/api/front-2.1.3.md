---
title: 打印符号表
type: api
order: 23
---

打印符号表是对编译器处理文法中包括标识符、关键字等符号的列举，将存储符号的数组写入文件并打印出来。当打印符号表开关设置为true时，该功能模块才会执行。

## 程序入口

```c++
//（3）print symbol table
if (PrintSymTables) {
    PrintSymbolTable(stdout, Externals);
}
```
`PrintSymTables ` 为打印符号表开关，定义与Main.cpp文件的头部，值为true或false
    
## 代码实现

该模块代码实现在symbol.c中，该文件已在2.1.1 初始化环境中介绍。

```c++
/***********************************************************************\
* PrintSymbolTable
\***********************************************************************/
GLOBAL void PrintSymbolTable(FILE *out, SymbolTable *table)
{
     Symbol *chain, *shadow;
     int i, entries=0, length, worst = 0, depth=0;
     assert(table != NULL);
     fprintf(out, "\nSymbolTable: %s\n", table->table_name);
     for (i=0; i<TABLE_SIZE; i++) {
        length = 0;
        for (chain = table->table[i]; chain != NULL; chain = chain->next) 
        {
            length++;
            fprintf(out, "\t%s:", chain->name);
            for (shadow = chain; shadow != NULL; shadow = shadow->shadow) 
            {
                fprintf(out, " (%d,%d)",(int) shadow->scope.level,
                                        (int) shadow->scope.version);
            }
            fputc('\n', out);
        }
        entries += length;
        depth += (length + 1)*length/2;  /* sum of 1 to length */
        if (length > worst) worst = length;
     }
     fprintf(out, "End of symbol table %s\n", table->table_name);
     fprintf(out, "\t%d entries\n", entries);
     fprintf(out, "\tAverage depth for a successful search: %.2g\n",
            depth/(entries+1e-6));
     fprintf(out, "\tAverage depth for a failed search: %.2g\n",
            entries/(float)TABLE_SIZE);
     fprintf(out, "\tLongest chain: %d\n", worst);
}
//
```