---
title: 文法简介
type: guide
order: 30

---


COStream编程语言是一种面向并行体系结构的高性能数据流编程语言，由华中科技大学数字媒体处理与检索实验室多核计算与流编译组设计与开发。语言的名称由3个关键字：composite、operator和stream组合而来。COStream程序采用数据流图的方式来描述应用的处理过程，图中节点表示计算，边表示数据的流动。COStream语言具有广泛的应用领域，当前主要用于面向大数据量处理应用，如媒体处理、信号处理、搜索应用、数据文件处理等。

### 文档说明
本文档为COStream语言的编程手册，主要对COStream语言的定义、编程规范和编译器行为（包括静态和动态）的进行详细说明，为编程人员采用COStream进行编程提供技术支持。

## 程序例子

```c
composite Main(){
  int N = 10;
  stream<int x>S,P;
  S = Source(){
    int x;
     init {x = 0;}
     work {
       S[0].x = x;
       x++;
     }
     window{
       S tumbling(1);
     }
  };
  P = MyOp(S)(N);   
  Sink(P){
    work{
      int r;
      r = P[0].x;
      println(r);
    }
    window{
      P tumbling(1);
    }
  };
}
composite MyOp(output Out,input In){
  param
    int pn;
  Out = Averager(In){
    work{
      int sum = 0;
      int i;
      for(i=0;i<pn;i++)
        sum += In[i].x;
      Out[0].x = sum/pn;
    }
    window{
      In sliding(pn,1);
      Out tumbling(1);
    }
  };
}
```
下图给出了该COStream流程序实例的对应数据流图。程序的功能为求移动平均值。每一个独立运行的COStream程序都由一个称为Main的composite开始，Main作为整个程序的入口。花括号之间定义了三个计算节点称为operator，分别为Source，Averager和Sink。其功能如下：Source作为数据源产生由“0”开始的自然数序列输出给Averager；Averager将得到的前N个自然数求平均值并消耗掉最早得到的一个数据，把计算得到的平均值输出给Sink；Sink将得到的平均值打印输出到屏幕。
![](/img/PART1-1.2.png)

各个operator之间通过流变量S和P相互连接，每个operator内部包含了对数据流的处理过程。Operator对每个数据流变量都定义了相应的window，采用窗口机制（window）对每个数据流进行访问，window内存放了operator每次进行运算所需数据。每次operator都从输入流的window中读入数据，同时将结果填入到输出流window中。图1中operator Averager在输入流S和输出流P上分别定义了2个window：滑动窗口（sliding）和翻转窗口（tumbling），sliding窗口的大小为N个数据（token）长度，每次计算完成后滑动一个1个数据长度；tumbling窗口的长度为1个数据长度，每次计算完成后窗口的数据全部输出到数据流中。窗口中的数据采用类似数组下标的方式来访问。

每个operator采用数据驱动的方式执行，即输入数据填满窗口即触发operator的执行，只要有无穷的数据，程序将会无穷执行。每个operator内含有在该operator内可见的变量声明列表、init函数库和work函数块3部分：变量声明列表定义了init和work中使用到的变量（见第3章），init部分的语句只在operator的第一次运行时执行，之后不断地执行work部分的代码。

## 语言的执行模型

编程语言是底层程序执行模型的体现。COStream采用同步数据流模型[1]（Synchronous Data Flow, SDF）作为语言的执行模型。

在同步数据流模型中，程序由一个带权重的有向图称为同步数据流图表示。图中，每个结点代表了一个计算任务，称为actor，每条边代表了生产者actor与消费者actor之间的数据流动，每条边上具有两个权值，分别代表生产者每次执行后生产数据的个数和消费者每次执行后消耗数据的个数。每个actor都是一个独立的计算单元，它有独立的指令流和地址空间，actor之间的数据流动通过FIFO队列来实现。actor的执行采用数据驱动的方式，只要actor的输入边有足够的数据消耗，它将不停地重复执行并产生数据到输出边。在静态同步数据流模型中，actor的每次执行消耗固定数目的数据，称为消耗率，同样地，actor每次执行产生固定数目的数据称为产生率。

下图表示数据流程序有2个actor，actor A和actor B都是独立的计算单元，actor A每次执行向队列缓存中产生3个数据，即生产速率为3，actor B每次执行从队列缓存中消耗2个数据，消耗速率为2。两个actor都采用数据驱动的方式执行，只要数据足够，自动开始执行。
![一个SDF图例子](/img/PART1-1.3.png)

>COStream语言描述的数据流图是基于**同步数据流图SDF**的，两者的对应关系如下：
1. COStream中的operator对应于SDF中的actor；
1. COStream中的stream变量对应于SDF中的FIFO数据边；
1. COStream中的数据流上的window大小对应于SDF中actor对数据的生产和消耗速率。
1. COStream暂时不支持类似StreamIt中feedback loop的图[2]以及带有delay数据边的SDF图（具体可以参考文章[3]）
此外， COStream还增加了对sliding window的支持

## 语法符号

本文将采用BNF（Backus Naur Form）来描述语言的语法特性，以下是常用到的语法符号。

| 语法符号 | 说明 |
| :----- | :----- |
| italics |	非终结符（Non-terminal）|
| italics			|		非终结符（Non-terminal）|
| ALL_CAPS_ITALICS	| 标示符（终结符），如ID标示符 |
| ‘text’				|	常量|
| (…)				|	分组，用于分隔语法单位 |
| …&#124;…				|	并操作，匹配左边或者右边语法单位 |
| …?					|	可选操作 |
| …*					| 语法单位重复0次或者多次 |
| …+					| 语法单位重复1次或者多次 |
| …*,			|		逗号分隔的0项或者多项语法单位 |
| …+,			|		逗号分隔的1项或者多项语法单位 |
| …*;			|		分号分隔的0项或者多项语法单位 |
| …+;			|		分号分隔的1项或者多项语法单位 |
| non-Ternimal ::=…	|	规则定义 |
