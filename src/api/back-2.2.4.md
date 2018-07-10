---
title: 打印理论加速比
type: api
order: 35
---

理论加速比，用来对比单核与多核平台下程序的运行效率。
计算方式：理论加速比 = 单核下总执行工作量 / 多核下最大执行工作量。

## 程序入口
```c++
// （5）Print theoretical speedup ratio
PhaseName = "Speedup";
if (Errors == 0 && Speedup && (X86Backend||X10Backend) )
    ComputeSpeedup(SSSG,pp,ccfilename,"workEstimate.txt","RRS");
```
The input argument of the function:
-	SSSG：函数的输入实参，初态、稳态调度；划分、水平分裂的结果
-	pp：函数的输入实参，多核下根据实验平台进行划分的结果
-	程序工作量结果，写入文件workEstimate.txt中

## 关联文件解析
(1)	Speedup.h
这是一个简单的头声明文件，不包含实质性的内容，仅仅含有预编译头的声明。

```c++
#ifndef _DUMP_H
#define _DUMP_H
#include "MetisPartiton.h"

#endif // _DUMP_H

```
(2)	Speedup.cpp
该文件是打印理论加速比的函数实现文件，具体思路是以数据流程序对应的SDF图中每个节点的稳态工作量为衡量依据，分别求出所有节点的工作量总和作为单核平台执行工作量，然后，根据划分结果，求出所有核上的最大工作量作为多核平台下每个核的执行工作量，求其比例作为单核与多核下程序的执行加速比。

- Step 1：求得SDF图所有节点工作量总和total
```c++
for (int i=0;i<sssg->GetFlatNodes().size();i++)
{
	total +=sssg->GetSteadyCount(sssg->GetFlatNodes()[i])*
    sssg->GetSteadyWorkMap().find(sssg->GetFlatNodes()[i])->second;
}

```

- Step 2：求得多核平台下，最大核工作量作为多核平台的核平均工作量maxWorkLoad
```c++
for (int i=0;i<mp->getParts();i++)//遍历每个place
{
    //find node set in partition i
    vector<FlatNode *> tmp = mp->findNodeSetInPartition(i);
    double total_inplace=0.0;
    for (int j=0;j<tmp.size();j++)
    {
        //node’s Execution workload = number of executions * per steady-state workload
        double tmpd=sssg->GetSteadyCount(tmp[j])*ssg->GetSteadyWorkMap().find(tmp[j])->second;
        total_inplace += tmpd;
        if(tmpd > maxActorWorkload) 
        {
            maxActorWorkload=tmpd;
            maxActorWorkloadName=tmp[j]->name;
        }		
        buff<<i<<"\t\t\t"<<tmp[j]->name<<"\t\t\t\t\t"<<tmpd<<"\t\t\t"<<
        do_fraction(tmpd/total*100)<<"%\n";
    }
    string inp=do_fraction(total_inplace);
    buf<<i<<"\t\t\t"<<total_inplace<<"\t\t"<<do_fraction(total_inplace/total*100)<<"%\n";
    if(total_inplace > maxWorkLoad) 
        maxWorkLoad = total_inplace;
}
```

- Step 3：以上两步计算结果比例作为程序的执行加速比，打印输出
```c++
buf <<"##################### total info ###############################\n";
buf<<"total workload \t= "<<t<<"\n";
buf<<"max workload \t= "<<maxWorkLoad<<"\n";
buf<<"max speedup \t= "<<do_fraction(total/maxWorkLoad)<<"\n";
```
