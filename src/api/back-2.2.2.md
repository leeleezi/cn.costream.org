---
title: 用XML文本的形式描述SDF图
type: api
order: 32
---

经过后端步骤一的对平面图进行初始化调度和稳态调度，得到平面图SSSG（schedule static stream Graph），接下来的步骤则是，针对该平面图进行划分，融合分裂，一系列的优化，最终生成目标代码。
紧接着步骤二为用XML文本的形式描述SDF图，该步骤生成一个dot文件，以打印SDF图。

## 程序入口

```c++
// （(1)Describe the SDF diagram in the form of XML
PhaseName = "SSG2Graph";
if (Errors == 0 && SSG2Graph)
    DumpStreamGraph(SSSG, NULL, "flatgraph.dot",NULL);
```
-	变量`PhaseName`为阶段名称，该阶段记为SSG2Graph
-	`SSG2Graph` 为平面图调度开关，类型Global Bool，位于main.cpp全局变量定义部分
-	程序入口即函数`DumpStreamGraph(SSSG, NULL, "flatgraph.dot",NULL)`，输入达到稳态调度的SSSG，输出可打印平面图的dot文件，“flatgraph.dot”

## 关联文件解析

(1)	dumpGraph.h
这是一个简单的头声明文件，不包含实质性的内容，仅仅含有预编译的声明。
```c++
#ifndef _DUMP_H
#define _DUMP_H
#include "MetisPartiton.h"

#endif // _DUMP_H
```
(2)	dumpGraph.cpp
访问并打印流图节点方法的实现文件。
首先，文件中定义了146中颜色字符串数组，用于区分流图划分在各个核上的不同结点。
其次，定义并实现了访问流图结点信息并打印的函数。
另外，定义并实现的dot文件输出函数，`void DumpStreamGraph(SSSG, NULL, "flatgraph.dot",NULL)`该函数即main.cpp中编译器后端步骤二调用的程序入口。

```c++
GLOBAL void DumpStreamGraph(SchedulerSSG *sssg,Partition *mp,const char *fileName, ClusterPartition* cp)
{	
    if ( cp )
    {
        vertexBuf.str("");
        edgeBuf.str("");
        stringstream buf;
        Ssg = sssg;
        mpp = mp;
        buf<<"digraph COStream {";
        vertexBufInPlace = new stringstream[cp->GetClusters()];
        toBuildClusterOutPutString(Ssg->GetTopLevel(), cp);
        for (int i = 0; i < cp->GetClusters(); i++)
        {
            buf << "\nsubgraph cluster_" << i << " {";
            buf << "\nlabel = \"place_" << i << "\";";
            buf <<vertexBufInPlace[i].str() << "}" ;
        }
        buf<<"\n\n";  
        buf<<edgeBuf.str();
        buf<<"}\n";  
        Ssg->ResetFlatNodeVisitTimes();//将flatnode的visttimes置0
        ofstream fw;
        fw.open(fileName);
        fw<<buf.str();
        fw.close();
    }
    else
    {
        Ssg = sssg;
        mpp = mp;
        buf.str("");
        buf<<"digraph Flattend {\n";
        toBuildOutPutString(Ssg->GetTopLevel());
        buf<<"}\n";  
        Ssg->ResetFlatNodeVisitTimes();//将flatnode的visttimes置0
        ofstream fw;
        fw.open(fileName);
        fw<<buf.str();
        fw.close();
    }
}

void toBuildOutPutString(FlatNode *node)
{
    //访问并打印相应节点信息
    MyVisitNode(node);
    for (int i = 0; i < node->nOut; i++) {/*DFS*/
        //该结点的后续结点还未被访问过
        if (node->outFlatNodes[i] == NULL || node->outFlatNodes[i]->GetVisitTimes() != 0)
        continue;
        toBuildOutPutString(node->outFlatNodes[i]);
    }
}

/* 访问该结点并打印节点信息，为节点着色 */
void MyVisitNode(FlatNode *node)
{
    node->VisitNode();
    if (node->contents!=NULL ) {
        ...(code of print the info of node )
        //color the node after Partition
        if(mpp != NULL)
        {		
            buf<<" color=\""<<color[mpp->findPartitionNumForFlatNode(node)]<<"\""; 
            buf<<" style=\"filled\" "; 	
        }
        ...
    }
}

```
以上代码即为用XML文本的形式描述SDF图的实现函数。