---
title:  语法树到平面图 SSG
type: api
order: 29
---


平面图是指COStream数据流源程序对应的一个静态同步数据流图SDF，它是编译器后端讨论调度划分的研究对象。编译器前端的词、语法分析生成抽象语法树AST，语法树到平面图模块实现将该AST转换为SDF。

## 程序入口
```c++
// （10）AST to Flatgraph
// SSG ( object of StaticStreamGraph )
PhaseName = "AST2FlatSSG";
if (Errors == 0 && AST2FlatSSG)
    SSG = AST2FlatStaticStreamGraph(gMainComposite);

```
-	`AST2FlatSSG` 为语法树到平面图开关，定义于main.cpp头部
-	`AST2FlatStaticStreamGraph(…)`函数为语法树到平面图的实现，输入参数为抽象语法树的根节点`gMainComposite`，输出参数为静态数据流图StaticStreamGraph对象SSG

## 关联文件解析

(1)	flatNode.h & flatNode.cpp
该文件为静态数据流图的节点结构说明文件

|变量名称|变量描述|
|:-|:-|
|`int visitTimes`|表示该节点是否已经被访问过|
|`operatorNode *contents`	|指向operator（经常量传播后的）|
|`compositeNode *composite`	|指向operator所在的composite（实际展开的）|
|`operatorNode *oldContents	`|指向原始operator|
|`compositeNode *oldComposite	`|指向原始operator所在的composite|
|`int nOut`	|输出边数目|
|`int nIn`	|输入边数目|
|`int place_id, thread_id, `<br>`post_thread_id, serial_id`| 划分算法中使用的变量|
|`vector<FlatNode *> outFlatNodes`	|输出边的operator集合|
|`vector<FlatNode *> inFlatNodes	 `   |输入边的operator集合|
|`outPushString`<br>`inPopString`<br>`inPeekString`<br>`pushString`<br>`peekString`|保存operater信息<br>Type :`vector<string>` |
|`long work_estimate`	|节点work函数的静态工作量估计值|
|`int num	`|operator在ssg图中flatnodes的顺序编号|
|`int GPUPart` <br> `bool BorderFlag`|GPU节点划分变量 |
|`currentIn ,currentOut ,schedMult ,`<br>`schedDivider ,uin ,label`|扩展变量 Type:`int `	|
|SDF nodes functions：||
|`void AddOutEdges(FlatNode *dest)	`|添加出边|
|`void AddInEdges(FlatNode *src)`	|添加入边|
|`string GetOperatorName()	`|获取flatnode节点的operator的name|
|`void visitNode()	`|访问该节点 |
|`void ResetVisitTimes()`	|重置visitTimes信息|
|`int GetVisitTimes()	`|获取该节点的访问信息|
|`void SetIOStreams()	`|......|

具体函数实现见`flatNode.cpp`



(2)	staticStreamGraph.h & staticStreamGraph.cpp

该头文件描述的是静态数据流图的属性和行为，引用了`flatNode.h` ，即流图的基本节点为flatNode结构，其定义的行为供后端语法树到平面图生成以及节点划分调度调用。

|变量名称|变量描述|
|:-|:-|
|`FlatNode *topLevel`|SDF的起始节点，假设只有一个输入为0的节点|
|`vector<FlatNode *> tmpFlatNodes	`|SDF图某place上或某thread上节点集合|
|`vector<FlatNode *> flatNodes	`|SDF图所有节点集合|
|`map<Node *, FlatNode *> mapEdge2UpFlatNode	`|将有向边与其上端绑定|
|`map<Node *, FlatNode *> mapEdge2DownFlatNode	`|将有向边与其下端绑定|
|`map<FlatNode *, int> mapSteadyWork2FaltNode	`|存放各个operator的workestimate 稳态工作量估计|
|`map<FlatNode *, int> mapInitWork2FaltNode	`|存放各个operator的workestimate 初态工作量估计|
|Funcitions名称:|描述|
|`StaticStreamGraph()`|构造函数|
|`SetName()	`|设置actor名字 |
|`SetTopLevel()	`|设置SDF图起始点|
|`AddFlatNode(FlatNode *flatNode)	`|向`flatNodes`中添加节点|
|`PrintFlatNodes()	`|该函数仅有声明，没有实现|


(3)	ast2ssg.cpp
该文件在引入静态数据流图相关头文件的基础上实现语法树到平面图的转换。

|变量名称|变量描述|
|:-|:-|
|`AST2FlatStaticStreamGraph(Node *mainComposite)`	|语法树到平面图的转换函数|
|`GraphToOperators(Node *composite, Node *oldComposite)	`|平面图节点单元operator的生成函数|


## 程序实现

```c++
// 返回静态流图，作为后端分析的输入
GLOBAL StaticStreamGraph *AST2FlatStaticStreamGraph(Node *mainComposite)
{
    Node *compositeCall = NULL, *operNode = NULL;
    List *operators = NULL;	
    //使用断言assert判断前端语法分析树的有效性
    assert(mainComposite && mainComposite->typ == Composite && 
        mainComposite->u.composite.decl->u.decl.type->u.comdcl.inout == NULL);
    assert(strcmp(mainComposite->u.composite.decl->u.decl.name, "Main") == 0);
    //创建一个静态数据流图，调用默认构造函数，参数初始化为空
    ssg = new StaticStreamGraph();
    //参数后者代表oldComposite
    GraphToOperators(mainComposite, mainComposite);
    //设置链表头结点
    ssg->SetTopLevel();
    //设置流图所有结点权重
    ssg->SetFlatNodesWeights();
    /* 重置ssg内flatNodes的每个flatNode的name, 便于打印dot图*/
    ssg->ResetFlatNodeNames(); 
#if 0
    ssg->PrintFlatNodes();
    PrintNode(stdout, gMainComposite, 0);
    system("pause");
#endif
    return ssg;
}

```