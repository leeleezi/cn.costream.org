---
title: 概览
type: api
order: 1
---
## 编译器工程架构
![编译器工程架构](/img/PART2-1.png)
### 编译器前端
1. 获取输入

    `Main#Handle_options`
    `Main#Get_preprocessed_input`

    初始化环境
    `GLOBAL#InitTypes`
    `Main#Init_symbol_tables`
    `GLOBAL#InitOperatorTable`

1. 文法建立与语法树生成

    `GLOBAL#yyparse`
    生成List*program，这个program即语法树非常重要

1. 打印符号表

    `GLOBAL#PrintSymbolTable`

1. 删除临时文件

1. 打印抽象语法树

    `GLOBAL#PrintList`

1. 语义检查
    `GLOBAL#SemanticCheckProgram`
1. 活跃变量分析
    `GLOBAL#AnalyzeProgram`
1. 添加变量重命名
    `GLOBAL#VariableRenameProgram`
    `GLOBAL#ResetASTSymbolTable`
    这部分对生成文件的名字进行修改，根据actor结点的名字或者duplicate以及从上到下从左到右的编号确定生成文件的名字。如sink_30.h
1. 常量传播
    `GLOBAL#PropagateProgram`
这部分将composite中的param（全部常量）进行替代
1. 语法树到平面图
    `GLOBAL#AST2FlatStaticStreamGraph`,生成StaticStreamGraph类对象SSG
    `AutoProfiling#AutoProfiling()`
    `AutoProfiling#GeneratingProfile()`
1. 对平面图各节点进行工作估计
    静态工作量估计：
    `GLOBAL#GenerateWorkEst()`

### 编译后端
1. 对平面图进行初始化调度和稳态调度
    `GLOBAL#SchedulingSSG(),生成SSSG为SchedulerSSG`
1. 用XML文件的形式描述SDF图
    `GLOBAL#DumpStreamGraph()`
1. 对节点进行调度划分
    `MetisPartition#MetisPartiton()`
    `Partition#setPlaces()`
    `Partition#SssgPartition()`
1. 水平分裂
    RHFissionission开关控制
    水平分裂完之后需要从新metis划分
    `MetisPartiton()`
    `setPlaces()`
    `SssgPartition()`
 
1. 打印理论加速比
    开关Speedup打开
    `GLOBAL#ComputeSpeedup()`
1. 阶段赋值
    `StageAssignment#StageAssignment()`
    `StageAssignment#actorTopologicalorder(GetFlatNodes())`
    `StageAssignment#actorStageMap(GetFlatNode2Partition())`
1. 输入为SDF图输出为目标代码
    `库函数#direct.h#getcwd()`
    `GodeGeneration#CodeGeneration()`
    
![编译器后端](/img/PART2-2.png)
