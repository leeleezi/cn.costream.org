---
title:   平面图节点工作量估计
type: api
order: 29
---

平面图节点工作量估计，针对语法树转换而成的静态数据流图SDF中所有节点进行工作量估算，为后端调度划分奠定基础。

## 程序入口

```c++
//（11）Workload estimate to nodes in flatgraph
PhaseName = "WorkEstimate";
if (Errors == 0 && WorkEstimate)
	GenerateWorkEst(SSG,WorkEstimateByDataFlow);
```
-   `WorkEstimate`为平面图节点工作量估计开关，定义于`main.cpp`头部
-	`WorkEstimateByDataFlow`为使用数据流估计稳态工作量开关，此时设置为false，此开关决定工作量估计的方式
-	`GenerateWorkEst(…)`函数为节点工作量估计代码实现函数



## 关联文件解析

(1)	GenerateWorkEst.cpp
该文件定义并实现了平面图节点工作量估计函数
```c++
GLOBAL void GenerateWorkEst(StaticStreamGraph *ssg,bool WorkEstimateByDataFlow)
{
    int len = ssg->GetFlatNodes().size();//get the length of operator
    for (int i=0;i<len;i++)
    {
        int w = 0,w_init = 0;
        FlatNode *tmpFn = (ssg->GetFlatNodes())[i];
        //get the operator body 
        ChildNode *body =  tmpFn->contents->body;
        if ( body != NULL)     //calculate workload in operator body
        {
            w_init = workEstimate_init(body, w);
            //choose way of workestimate
            if(WorkEstimateByDataFlow)
                w = workEstimateUseDataFlow(body,w);
            else
                w = workEstimate(body, w);
        }
        //rest head and tail of buffer in multicore
        w += (tmpFn->outFlatNodes.size()+tmpFn->inFlatNodes.size())*UPDATEEDGETAG;		    
        ssg->AddInitWork(tmpFn, w_init);
        ssg->AddSteadyWork(tmpFn, w);
    }
}

```

(2)workEstimate.h & workEstimate.c
该文件定义并实现的节点工作量的一般计算方式。

```c++
//首先，头文件中定义了不同节点类型的工作量估计值；
#define PRINT  3
#define PEEK  3
#define POP  3
#define PUSH  3
#define INT_ARITH_OP  1
#define FLOAT_ARITH_OP  2
#define LOOP_COUNT  5
#define SWITCH  1
#define IF  1
#define CONTINUE  1
#define BREAK  1
#define MEMORY_OP  2
#define METHOD_CALL_OVERHEAD  10
#define UNKNOWN_METHOD_CALL  60
#define INIT 0
#define STEADY 1
#define STREAM_OP 20
#define PRINTLN_OP -60 
#define FRTA_OP -60 
int totalWork = 0;

```
```c++
//然后，实现文件中为工作量估计代码
GLOBAL int workEstimate(Node *from,int w)
{
    state =STEADY;
    totalWork = w;
    if(from->coord.line == 0)
        isSTREAM = 1;
    rWorkCompute(from);  //针对不同的节点类型设定不同的工作量估计权值
    isSTREAM = 0;
    return totalWork;
}
```
See project files for more details

(3)	workEstimate2.h & workEstimate2.c
该文件是专门针对数据流程序的数据流图定义并实现的数据流估计稳态工作量的计算方式。

```c++
//首先，头文件中定义了不同节点类型的工作量估计值；
int totalWork = 0;

……
//然后，实现文件中为工作量估计代码
GLOBAL int workEstimateUseDataFlow(Node* from,int w)
{
    totalWork = w;
    return totalWork;
}

……
//由于数据流估计稳态工作量计算方式并没有实现，所以此处代码不完全。

```
