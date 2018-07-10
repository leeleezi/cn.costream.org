---
title: 初始化调度和稳态调度
type: api
order: 31
---

由前端的语法树到平面图，我们得到Static Stream Graph，并对其进行了工作量估计，在编译器后端部分，则是对该平面图进行处理。

## 程序入口

```c++
// （1）The first is initial scheduling and steady-state scheduling of the SSG， SSG is transformed form the syntax tree at step(10) in the front-end
PhaseName = "schedulerSSG";
if (Errors == 0 && SchedulingFlatSSG)
    SSSG = SchedulingSSG(SSG);

```
-	变量 `PhaseName` 为阶段名称，该阶段记为schedulerSSG (scheduler static stream graph)
-	`schedulingFlatSSG`为平面图调度开关，类型`Global Bool`，位于main.cpp全局变量定义部分
-	程序入口即函数`SchedulingSSG(SSG)`，输入语法树转化后的平面图SSG，输出达到稳态调度的SSSG

## 关联文件

(1)	staticStreamGraph.h and  staticStreamGraph.cpp 见 2.1.10
(2)	平面图初态稳态调度类：该类继承自StaticStreamGraph，故具有其所有public下的属性和行为

|Name| Descritpion|
|:-|:-|
|`map<FlatNode * node, int initcount>`<br> `mapInitCount2FlatNode`	|SDF图所有节点初始化调度序列<调度节点，执行次数>》|
|`map<FlatNode* node,int steadycount>`<br>  `mapSteadyCount2FlatNode`|store the steady scheduling result of all nodes in SDF graph|
|`SchedulerSSG(StaticStreamGraph *ssg)	`|构造函数|
|`bool InitScheduling()	`|对平面图初态调度函数|
|`boolSteadyScheduling()`|对平面图稳态调度函数|
|`int GetInitCount(FlatNode *node)`|计算进行初态调度的对应节点调度次数并返回|
|`bool GetSteadyCount(FlatNode *node)`|计算达到稳态调度的对应节点调度次数并返回|
|`map<FlatNode *,int> `<br>`SteadySchedulingGroup(Vector <FlatNode *>)`	|对Vector中的点集进行局部稳态调度并返回<节点，执行次数>|

操作实现代码详见对应实现文件 `schedulerSSG.cpp`

(3)	schedule.cpp
该cpp文件是专为处理调度入口函数的实现文件。SDF中actor是周期性执行的，周期性调度计算了SDF完成一次完整执行时各个actor最少需要重复执行的次数，即actor稳态执行次数，所有actor稳态执行次数组成的序列就是SDF图稳态调度。只有SDF中各个actor节点都达到了稳态调度，才可顺利进行接下来的处理步骤，以达到最终代码生成。

```c++
GLOBAL SchedulerSSG *SchedulingSSG(StaticStreamGraph *ssg)
{
    SchedulerSSG *sssg = new SchedulerSSG(ssg);
    //do SteadyScheduling to sssg, if success return true
    if(sssg->SteadyScheduling())
    {
        sssg->InitScheduling();		
    }
    else
    {
        fprintf(stdout, " The program does not have steady state scheduling , cannot generate code.！\n");
        system("pause");
        exit(1);
    }//else
    return sssg;
}

```
对平面图调度流程如上代码实现
- 以语法树转化的平面图`ssg`作为输入参数
- 输出调度后的`SSSG`

### 初始化调度流程图

![初始化调度流程图](https://i.loli.net/2018/07/10/5b44b3d984421.png)

### 稳态调度流程图

![稳态调度流程图](https://i.loli.net/2018/07/10/5b44b421e2c28.png)

## FAQ

### 调度次序为什么是先稳态再初态?

- 稳态调度自上而下处理节点的数据量，达到平衡
- 初态调度自下而上处理节点的数据量，达到平衡		   
- 初态、稳态相互独立，通常稳态一定存在，稳态不存在，则程序无法运行，初态可能不存在
- `SteadyScheduling()`函数判断该SDF能否达到稳态,
- 减少可避免的`InitScheduling()`函数调用带来的内存开销
### 初态、稳态调度对SDF图完成了什么工作?
- 计算了如何数据流图在初态运行和稳态运行中，如何进行数据填充
- 没有改变SDF的结构特征
