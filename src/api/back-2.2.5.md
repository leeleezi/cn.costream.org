---
title: 阶段赋值
type: api
order: 36
---

当编译器进入阶段赋值阶段时，这意味着我们接近代码生成模块。
在对flatgraph进行划分之后，将flatgraph的每个部分分配给不同的处理器核心以供执行，这是在空间维度上分配计算任务。而确定各个计算单元被流水调度的阶段号是在时间维度上指定计算单元的调度。
使用阶段分配算法构建用于任务分区结果的软件流水线调度是分层流水线代码生成步骤的前奏。

## 程序入口

```c++
/*（6）Stage Assignment */
if (Errors == 0 && X86Backend)  
{
    //Step1: 构造阶段赋值结果存储对象
    pSA = new StageAssignment();
    // Step2:根据SDF图的输入边得到拓扑序列，并打印输出
    pSA->actorTopologicalorder(SSSG->GetFlatNodes());
    // Step3:根据以上步骤的节点划分结果，得到阶段赋值结果
    pSA->actorStageMap(mp->GetFlatNode2PartitionNum());
}
if (Errors == 0 && GPUBackend && MAFLPFlag)
{
    pSA = new StageAssignment();
    pSA->actorTopologicalorder(SSSG->GetFlatNodes());
    pSA->actorStageMapForGPU(maflp->GetFlatNode2PartitionNum());
}

```
- 构造赋值结果对象PSA
- 对SDF图节点拓扑排序
- 节点执行阶段划分并赋值

## 关联文件解析

(1)	ActorEdgeAssignment.h 
该文件是阶段赋值模块的声明头文件，定义阶段赋值类StageAssignment，包含阶段赋值需要的属性和行为函数。

*protected variable：*

|名称|描述|
|:-|:-|
|`vector<FlatNode *>antortopo`	|SDF图所有节点执行的拓扑排序|
|`map<FlatNode* node,int stagenum>Actor2Stage`|SDF图所有节点阶段赋值结果 |
|`multimap< int stagenum,FlatNode* node > Stage2Actor`|SDF图所有节点阶段赋值结果|
|`vector<FlatNode * node > ActorSet`	|保存所有actors |
|`map<FlatNode* node ,int stagenum > DataOfActor2Stage`|GPU后端，节点数据传输阶段|
|`multimap< int stagenum,FlatNode* node > Stage2DataOfActor`|GPU后端，节点数据传输阶段|

*public functions：*

|Name| Descritpion|
|:-|:-|
|`void actorStageMap(map<FlatNode*,int> processor2actor)`	|SDF图节点的执行阶段计算赋值函数|
|`void ActorEdgeAssignment ()`|SDF图所有节点拓扑排序函数|
|`int FindStage(FlatNode*) `|根据节点寻找所在阶段号并返回|
|`vector<FlatNode *> FindActor(int i)`|根据阶段号寻找对应的节点，并返回所有节点容器 |


## 程序实现流程
1)	对SDF图节点拓扑排序—`ActorEdgeAssignment()`
数据流源程序对应的SDF图是一个有向无环图，利用拓扑排序的思想将图中所有的节点排成一个线性序列，作为所有节点的执行次序。
执行步骤
由AOV网构造拓扑序列的拓扑排序算法主要是循环执行以下步骤：
① 选择一个入度为0的顶点并输出之
② 从网中删除此顶点及所有出边
③ 重复 ① ② 直到不存在入度为0的顶点为止

2)对经过拓扑排序的SDF图，进行执行流水线阶段号赋值
阶段赋值属于数据驱动层次流水线调度领域
实现思想如下:
1. 集群节点间异步流水线调度（数据驱动，块通信）
2. 多核节点内部同步流水线调度
2.1 不同机器: 父节点的执行不会影响子节点执行
2.2 相同机器：
2.2.1 同核: 父节点与子节点被分配到同一阶段执行
2.2.2 不同核: 子节点的阶段好比父节点的阶段号大1