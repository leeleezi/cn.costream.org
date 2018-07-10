---
title: 输入文件的获取与处理
type: api
order: 20
---

该工程是一个针对数据流语言COStream的编译器，目标是将输入的COStream源程序经过编译器处理即（词法分析、语法分析、语义分析、中间代码生成与优化、目标代码生成）得到目标C++并行代码。与普通编译器不同的是，我们不仅实现了语言COStream到高级语言C++的转换，而且针对数据流的并行特性，根据输入的COStream源程序中暴露出的并行性以及对应数据流图的节点信息，进行了划分调度，最终得到C++多线程代码。

## 工程入口
```c++
GLOBAL int main(int argc, char *argv[])
{
    ……
    //Frontend
    preproc = default_preproc;
    //Get input, processe command line parameter
    handle_options(argc, argv);

    int pos1 = InputFileName.find_last_of('/');
    int pos2 = InputFileName.find(".spl");
    string substring=InputFileName.substr(pos1+1,pos2-pos1-1);	
    string ccfilename=InputFileName.substr(pos1+1,pos2-pos1-1);
}
```
- `default_preproc`是main.cpp文件的一个私有字符串变量，其存储默认编译命令”gcc –E –x c” 
- 基本变量`preproc `用于编译命令处理判断
- main函数默认参数`(argc,argv)`，其中`argc`指命令行输入参数的个数，`argv`存储了所有的命令行参数，本工程argc=1 argv=“工程路径”
- `handle_option`函数将`Input_file`赋值给`InputFileName`，接下来截取输入源程序文件名，并记录下来`substring` 与 `ccfilename`均存储该文件名，前者在后期代码生成中有引用，后者在工作量估计步骤中得以引用。


## 关联文件解析
`main.cpp`
该文件是整个工程的入口文件，其中定义了程序入口函数`main(argc,argv)`，以及必要头文件引用、必要全局变量声明、必要基本函数定义实现等。
具体代码实现详见main.cpp程序源文件，结合工程进行整体理解。

|关键变量说明：||
|:-|:-|
|`GLOBAL List *Program` |这是一个全局`List*`变量专为处理输入源程序，`program`=源程序文件地址，而`*program`=源程序内容，是前端语法分析的目标。|
|`GLOBAL Node * gMainComposite` | 这是分析程序的入口，相当于数据流程序的main函数，也是语法树的根节点，同样也是数据流图SDF的头结点。|
|`GLOBAL extern StaticStreamGraph *SSG	`|`SSG`变量即静态数据流图，将存储由前端语法树直接转化而来的平面图；`extern`关键字指该变量在此处仅是声明而非定义，具体详参extern说明。|
|`GLOBAL SchedulerSSG *SSSG`	|`SSSG`变量是经初态调度和稳态调度后的数据流图，它是由`SSG`转化而来。|
|`GLOBAL Bool PrintAST`|操作开关，以`PrintAST`为例，定义为true代表在控制台打印语法树，定义为false则不输出语法树。|
| .etc……||
|关键函数列举：||
|`void handle_options(int argc , char *argv[])` |命令行参数处理函数，获取用户输入的对源程序的编译命令中包含的各种信息|
|`void init_symbol_tables(Bool shadow_warnings)	`|初始化符号表实现函数|
|`FILE *get_preprocessed_input()`|对输入源程序预处理函数，经过处理得到将要分析的输入源程序文件信息，并将文件地址赋值于`Input_File`|

## 输入文件获取与处理
编译器的初始化包括输入源程序的分析与编译命令的解析两个方面，该模块的实现由main.cpp中的`handle_options(int argc , char *argv[])` 来实现：
-	函数参数`argc`与`argv`同`main`函数参数，`argc`指命令行输入参数的个数，argv存储了所有的命令行参数，本工程`argc=1 argv[0]=“工程路径”`；
-	定义源程序路径数组，`char *files[16] = {"./tests/SPLtest/Benchmarks/rvq.spl2.cc", ….};` 每一个文件都是COStream测试程序；
-	解析命令行参数，参数个数为`argc`：

```c++
if (X86Backend)
{
    argc = 5;  
    argv[1] = "-x86";         //chose platform
    argv[2] = "-nCpucore";    //set cpu core number
    argv[3] = "8";            // set cpu core number
    argv[4] = files[3];       //sorcefile for test
}
else if (GPUBackend)
{
    argc = 9;
    argv[1] = "-gpu";  
    argv[2] = "-nGpu";
    argv[3] = "3";
    argv[4] = files[8];
    argv[5] = "-o";
    argv[6] = "test";
    argv[7] = "-multi";
    argv[8] = "3";
}

```
-	对argc数量的命令行参数关键字，逐个分析获取用户所设置的编译需求：
```c++
for (i=1; i<argc; i++) {
    if (argv[i][0] == '-') {  
        switch (argv[i][1]) {
            case '-':
                QuietlyIgnore = !QuietlyIgnore;
                break;
            case 'h':
                usage(FALSE, 0);
                break;
            case 'a':
                if (strcmp(argv[i], "-ansi") == 0) {
                    ANSIOnly = TRUE;
                /* change the preprocessor command, if the user hasn't
                already changed it with -P */
                if (preproc == default_preproc)
                    preproc = ansi_preproc;
                }
                else if (strcmp(argv[i], "-ast") == 0) 
                    PrintAST = TRUE;
                else
                    unknown_option(argv[i]);
                    break;
                    ……
        }//switch
    } else {
        if (input_file != NULL) {
            fprintf(stderr, "Multiple input files defined, using `%s'\n",argv[i]);
        }//if
        else
            input_file = argv[i];
    }//if
}//for

```