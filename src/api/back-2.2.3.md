---
title: 数据流图划分
type: api
order: 33
---

当COStream编译工程的阅读理解工作进行到该步骤，则对于该编译器的整体实现机制、语法树到平面图的转化以及数据流图SDF的存储访问等方面有了基本的了解和掌握。
要想真正理解编译器后端对于数据流图SDF中节点的调度和划分思想与实现，必须有一定的C++编程基础，对于C++标准中的结构体、指针、基本容器（如list、vector、map、multimap）及迭代器Iterator达到熟悉并灵活应用的程度。
我们知道，COStream是一个数据流语言，一门在多核平台下得以并行运行的高级语言，其面向多种平台后端如X10Backend 、 X86Backend 以及 GPUBackend ，并且针对不同的后端划分调度的方法有所差异，因此，划分调度及后面的分裂融合直至最终代码生成步骤模块的实现方法均是以平台分别实现。


## 程序入口

```c++
// （3）Parition graph
PhaseName = "Partition";
if (Errors == 0 && PPartition && (X86Backend || X10Backend || GPUBackend) )
{
    ……
    if (X10ParallelBackEnd == TRUE)
    ……
    else if (X10DistributedBackEnd == TRUE)
    ……
    else if (X10Backend || X86Backend)
    {
        //According to the number of nodes in SSSG, and CPU cores 
        //set the partition number
        mp->setCpuCoreNum(CpuCoreNum, SSSG);
        mp->SssgPartition(SSSG,1);
    }
    else if (GPUBackend && MAFLPFlag)
    ……
}

PhaseName = "SetMultiNum";
if (Errors == 0 && GPUBackend)
    ……
    PhaseName = "PartitionGraph";
    if (Errors == 0 && PPartition && PartitionGraph && (X86Backend||X10Backend ||
                                                        GPUBackend) )
    {
    if(GPUBackend)
        DumpStreamGraph(SSSG,maflp,"GPUPartitionGraph.dot",NULL);
    else
        DumpStreamGraph(SSSG, mp, "PartitionGraph.dot",NULL);
    }
```
-	例如: 如果我们使用Inter X86架构下的8核服务器，根据条件判断，进入X86Backend代码分支
-	变量`mp`即`MetisPartiton *mp = NULL` 定义在main函数，划分调度类MetisPartition的一个对象;
-	首先，根据源程序经语法树转化的SDF图节点个数以及当前CPU的物理核数，决定SDF图的划分份数，由`setCpuCoreNum(CpuCoreNum , SSSG)`实现，其中变量`CpuCoreNum=8`定义在main.cpp，SSSG是上一阶段初态和稳态调度的输出。
-	划分份数确定后，调用划分函数`mp->SssgPartition(SSSG,1)` 该函数在MetisPartition.cpp中实现，该文件是此划分调度模块的一个关联文件。
-	完成划分调度，将划分后的SDF图打印输出`DumpStreamGraph(SSSG, mp, "PartitionGraph.dot",NULL)`。

## 关联文件解析
(1)	 partition.h & partition.cpp
partition.h 定义了所有划分调度的基类
![partitionclass](https://i.loli.net/2018/07/10/5b44b37a0688d.jpg)

*基类Partition成员变量*

|名称|描述|
|:-|:-|
| `map<FlatNode*,int>`<br>	`FlatNode2PartitionNum`|保存划分结果,节点到划分编号的映射|
| `multimap<int，FlatNode*>`<br>`FlatNode2PartitionNum`	|保存划分结果,划分编号到节点的映射|
|`vector<FlatNode *> PartitionNumSet` 	|记录返回的节点集合|
|`int mnparts` 	|划分的份数|

*基类Partition成员函数*

|函数名称|描述|
|:-|:-|
|`void setCpuCoreNum(int,SchedulerSSG*)` |设置划分的place个数（由SDF图节点以及用户指定划分核决定）|

*基类Partition非成员函数*

|函数名称|描述|
|:-|:-|
|`void DumpStreamGraph(SchedulerSSG*ssg,Partition *,`<br> `const char *fileName, ClusterPartition *)`|SDF平面图对应dot文件的生成函数，在文件dumpGraph.cpp中实现|
|`void ComputeSpeedup(SchedulerSSG*sssg,Partition *mp , `<br> `std::string , const char *fileName,std::string)`|单核、多核平台COStream程序执行理论加速比的计算函数，在speedup.cpp文件中实现|

(2)	Metis.h & MetisPartiton.h & MetisPartiton.cpp
束调度的实现相关文件，该编译工程中对于束调度采用了是Metis划分算法。

(3)	RRSPartition.h & RRSPartition.cpp
循环分发调度的实现相关文件。

(4)	TDOBPartition.h & TDOBPartition.cpp
自上而下负载均衡的划分调度实现相关文件。


## 划分算法流程图
1)	（1）	设置划分核数
该函数用来设置划分模块数目，物理核数决定划分份数
![partitionflowchat](https://i.loli.net/2018/07/10/5b44b38ab3da7.jpg)

2)	SDFPartion—SSSGPartition
采用MetisPartition任务调度，结合边通信及负载均衡

*单核下，数据处理*

|变量名称|描述|
|:-|:-|
|`map<FlatNode*,int> FlatNode2PartitionNum `	|`Insert(make_pair(sssg->GetFlatNodes()[i],0))` <br>将SDF图所有节点的划分编号映射为0|
|`multimap<int，FlatNode*> FlatNode2PartitionNum` |`Insert(make_pair(0,sssg->GetFlatNodes()[i]))`<br>将SDF图所有节点的划分编号映射为0|

*多核下, use Metis API*

|变量名称|描述|
|:-|:-|
|`vector<int> part(nvtxs)`|	nvtxs：SDF节点总量; <br>part：存储每个节点划分后的划分编号|
|`vector<int> vsize(nvtxs,0)`|	vsize：于存储每个节点的工作量，划分前全部初始化为0|
|`vector<int> adjncy(edgenum*2)`|adjncy：用于存储边，容量初始化为节点数量的2倍|
|`vector<int> adjwgt(edgenum*2)`|adjwgt： 用于存储边的权重|
|`METIS_PartGraphKway(&nvtxs,&mncon,mxadj,`<br>`madjncy,mvwgt,mvsize,`<br>`madjwgt,&mnparts,tpwgts,`<br>`ubvec,options,&objval,mpart)`|调用metis接口下的K-路图划分算法，对当前SDF图根据actor工作量和通信量进行划分|
|`FlatNode2PartitionNum.insert`<br>`(make_pair(sssg->GetFlatNodes()[i],part[i]))`|建立节点到划分编号的映射 |
|`PartitonNum2FlatNode.insert`<br>`(make_pair(part[i],sssg->GetFlatNodes()[i]))`|建立划分编号到节点的映射 |

## FAQ
### 程序实例生成的划分平面图中什么时候对节点进行着色？
SDF划分平面图的生成由dumpGraph.cpp中的`DumpStreamGraph(SchedulerSSG*ssg,Partition *, const char *fileName, ClusterPartition *)`函数生成 .dot 文件，严格按照用户设定的划分份数以及划分调度模块的结果，对每一个SDF图节点进行着色。

### MKP—多层K路图划分的特点？
它没有改变SDF图的结构特征（节点数量不变），将图划分为具有相似权重的多个子图，并确保子图之间的最小通信。

