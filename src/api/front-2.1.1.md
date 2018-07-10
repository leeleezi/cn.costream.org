---
title: 输入预处理&初始化环境
type: api
order: 21
---

对输入预处理及初始化环境是编译前端处理的第一个步骤，是后期词、语法分析的基础。

## 程序入口
该部分共包括三个函数调用:

|关键函数名|函数描述|
|:-|:-|
|`yyin = get_preprocessed_input()`	|对用户编译命令信息提取并处理，得到要求编译的源程序文件，提取文件名以及内容做相应的赋值|
|`InitTypes()`	|初始化类型表，该部分在`type.h` 以及` type.c` 文件中实现，了解flex与bison词、语法构造器便可知.此举使得词、语法分析步骤清晰简洁。|
|`init_sysbol_tables(TRUE)`	|初始化操作符表，该部分在main.cpp文件中定义，其内部调用函数在`symbol.h`及`symbol.c`文件中实现，作用同上。|
|`InitOperatorTable()	`|初始化操作符表，该部分在`operators.h` 及`operator.c`中实现，作用同上。|

## Associated file

(1) ast.h
该文件是整个编译工程最顶层的一个结点类型说明文件，其定义的各种节点类型贯穿前端的词、语法分析，语法树到平面图的转化至后端划分调度，包含了整个工程的节点类型的声明.

|节点类型|节点描述|
|:-|:-|
|expression nodes|`Const , Id , Binop , Unary , Cast , Comma , Ternary , Array , Call , Initializer , ImplicitCast`|
|statement nodes|`Label , Switch , Case , Default , If , IfElse , While , Do , For , Goto , Continue , Break , Return , Block`|
|type nodes|`Prim , Tdef , Ptr , Adcl , Fdcl , Sdcl , Udcl , Edcl`|
|declaration nodes|`Decl`|
|GCC_attribute extension|`Attrib`|
|procedure def node|procedure def node|
|random text and preprocessor command node|random text and preprocessor command node:Text|
|SPL nodes|`STRdcl , Comdcl , Composite , ComInOut , ComBody , Param , OperBody , Operdcl , Operator_  , Window , Sliding , Tumbling , CompositeCall , Pipeline , SplitJoin , Split , Join , RoundRobin , Duplicate , Add`|
|BasicType|`Uchar , Schar , Char , Ushort , Sshort , Uint , Sint , Int_ParseOnly , Ulong , Slong , Ulonglong , Slonglong , Float , Double , Longdouble , Void , Ellipsis , MaxBasicType`|
|Typedef  ypeSpecifier|struct|
|Typedef  ExplodedType|struct|
|Typedef  SUEtype|Struct union enum|
|various Node structure definitions in project:||
|Expression nodes	|Such as  `ConstNode`|
|Statement nodes	|Such as `SwitchNode`|
|…… | |

(2) basics.h
这是一个基本类型说明文件

|类型|描述|
|:-|:-|
|`typedef void Generic`| 表示void|
|`typedef void ** GenericREF`|存储Generic的地址通过引用传递|
|`typedef int Bool `	|定义值为整数的布尔类型Bool|
|`#define assert(X)`	|检查函数|
|`typedef struct Basic node type`|nodeStruct Node,tableStruct SymbolTable,int OpType|
|`typedef enum Operand type opDataType`|op_int = 1 , op_float . op_unknow|
|`typedef struct tablestruct SymbolTable`	|符号表|
|`typedef structAST tablestruct ASTSymbolTable `	|抽象语法树符号表|
|`typedef struct coord`	|Coord ：程序代码坐标结构，返回行、偏移、文件： return line, offset, file, includedp|
|其他全局变量声明||
|`SPL Constructor，GLOBAL Node *`	|`MakeSplitOperator(); MakeJoinOperator();` ……|

(3)  type.h & type.c
该文件是编译工程前端，为词、语法分析前的准备工作初始化类型表的声明头文件，该文件中定义了诸多结点类型，并对COStream语言文法进行了扩展，以适用于COStream数据流程序的分析。

|类型|描述|
|:-|:-|
|枚举类型 type ScopeState：|This is a type structure that uses constants to represent different types：<br>`Redecl `： may redeclare a typedef name<br>`NoRedecl` :  may not redeclare a typedef name <br>`SU` : a structure or a union field <br>`Stream `: a stream SPL<br> `Formal` : a formal parameter<br>`Commal` : a SPL composite stream |
|全局类型常量  Node |`*PrimVoid *PrimChar *PrimSchar *PrimUchar *PrimSshort `<br>`*PrimUshort *PrimSint *PrimUint *PrimSlong *PrimUlong `<br>`*PrimSlonglong *PrimUlonglong *primFloat *PrimDouble *PrimLongdouble`|
||`*StaticString`|
||`*SintZero *UintZero *SlongZero *UlongZero *FloatZero *DoubleZero`|
||`*PtrVoid *PtrNull`|
||`*SintOne *UintOne *SlongOne *UlongOne *FloatOne *DoubleOn`e|
|初始化类型表 |`void InitTypes(void)`|
|类型表其它相关函数|……|
|SPL相关函数<br>COStream数据流相关函数|`Void CompositeConflict()`<br>`Void OperatorConflict()`<br>`Void Patameter_conflict()`<br>`Void Stream_conflict()`<br>`Void Var_conflict()`<br>`Void ModifyOperatorDeclArguments()`<br>`Void PrintStream()`<br>`Bool IsStream()`<br>`Int Stream_Sizeof()`|

(4)symbol.h & symbol.c
该文件是编译工程前端，为词、语法分析前的准备工作初始化符号表的声明头文件与实现文件，内部定义了程序代码中用到了符号标记信息，简化词法分析中繁多的符号标记应用。

|类型|描述|
|:-|:-|
|结构体类型 symbolstruct：|这是一种类型结构体，定义符号表中的信息，包括：<br>`const char *name`<br>`Generic *var`<br>`Scope scope`<br>`Symbol *next`<br>`Symbol *shadow`<br>`Symbol *scope_next` |
|结构体类型  Scope |short level <br>short version|
|结构体类型 ASTsymbol struct|针对COStream程序对符号表进行扩展:<br>`const char *name`<br>`const char *newName`<br>`Generic *oldId`<br>`Generic *newId`<br>`ASTSymbol *next`<br>`ASTSynbol *shadow`|
|新建符号表函数 |`SymbolTable *NewSymbolTable(…)`|
|符号表其它相关函数|……|
|COStream程序符号表函数扩展|`ASTSymbolTable *NewASTSymbolTable (…)`<br>`Void ResetASTSymbolTable (…)`<br>……|

(5)operators.h & operators.c
编译工程前端，为后续词、语法分析前的准备工作初始化操作符表的声明头文件与实现文件，内部定义了程序代码中的一元、二元至多元操作符。

|类型|描述|
|:-|:-|
|结构体类型|这是一种类型结构体，定义操作符中的信息，包括：<br>`const char *text  // Corresponding operator content`<br>`const char *name // Corresponding operator name`<br>`short unary_prec`<br>`short binary_prec	`<br>`Bool left_assoc<br>Bool (*unary_eval)(Node *)` |
|符号表其它相关函数|`void InitOperatorTable(void)`|
|符号表其它相关函数|……|

## 输入预处理

输入预处理模块由`main.cpp`中的`get_preprocessed_input()`函数实现，主要完成编译器输入程序源文件的处理，提取文件中的源程序名称以及代码，为`input_file`赋值。读取输入文件内容，以做后续处理。


## 初始化类型表

初始化类型表模块由`type.c`中的`InitTypes()`函数实现
```c++
// Create a storage type array TypeNames in the grammar, save the names of all basic data types
PRIVATE const char *TypeNames[MaxBasicType];
GLOBAL void InitTypes()
{ 
    TypeNames[Uchar] = "unsigned char";
    TypeNames[Schar] = "signed char";
    TypeNames[Char] = "char";
    TypeNames[Ushort] = "unsigned short";
    TypeNames[Sshort] = "short";
    TypeNames[Uint] = "unsigned";
    TypeNames[Sint] = "int";
    TypeNames[Int_ParseOnly] = "int";
    TypeNames[Ulong] = "unsigned long";
    TypeNames[Slong] = "long";
    TypeNames[Ulonglong] = "unsigned long long";
    TypeNames[Slonglong] = "long long";
    TypeNames[Float] = "float";
    TypeNames[Double] = "double";
    TypeNames[Longdouble] = "long double";
    TypeNames[Void] = "void";
    TypeNames[Ellipsis] = "...";
    // Create a basic type node, implemented by the MakePrim() function in the ast.c file
    EllipsisNode  = MakePrim(EMPTY_TQ, Ellipsis);
    Undeclared   = MakeDecl("undeclared!", EMPTY_TQ, NULL, NULL, NULL);
    PrimVoid     = MakePrim(EMPTY_TQ, Void);
    PrimChar     = MakePrim(EMPTY_TQ, Char);
    PrimSchar    = MakePrim(EMPTY_TQ, Schar);
    PrimUchar    = MakePrim(EMPTY_TQ, Uchar);
    PrimSshort   = MakePrim(EMPTY_TQ, Sshort);
    PrimUshort   = MakePrim(EMPTY_TQ, Ushort);
    PrimSint     = MakePrim(EMPTY_TQ, Sint);

    PrimUint     = MakePrim(EMPTY_TQ, Uint);
    PrimSlong    = MakePrim(EMPTY_TQ, Slong);
    PrimUlong    = MakePrim(EMPTY_TQ, Ulong);
    PrimSlonglong= MakePrim(EMPTY_TQ, Slonglong);
    PrimUlonglong= MakePrim(EMPTY_TQ, Ulonglong);
    PrimFloat    = MakePrim(EMPTY_TQ, Float);
    PrimDouble   = MakePrim(EMPTY_TQ, Double);
    PrimLongdouble = MakePrim(EMPTY_TQ, Longdouble);
    StaticString = MakePtr(EMPTY_TQ, MakePrim(T_STATIC, Char));
    /* Make some standard zeros */
    SintZero   = MakeConstSint(0);
    UintZero   = MakeConstUint(0);
    SlongZero  = MakeConstSlong(0);
    UlongZero  = MakeConstUlong(0);
    FloatZero  = MakeConstFloat(0.0);
    DoubleZero = MakeConstDouble(0.0);
    /* Make some standard ones */
    SintOne    = MakeConstSint(1);
    UintOne    = MakeConstUint(1);
    SlongOne   = MakeConstSlong(1);
    UlongOne   = MakeConstUlong(1);
    FloatOne   = MakeConstFloat(1.0);
    DoubleOne  = MakeConstDouble(1.0);

    PtrVoid = MakePtr(EMPTY_TQ, PrimVoid);
    PtrNull = MakeConstPtr(0);
}

```

## 初始化符号表

初始化符号表模块包含定义文法中标识符、关键字、表达式等符号，由`main.cpp`中的`init_sysbol_tables(…)`函数实现.

```c++
// Initialization symbol table
PRIVATE void init_symbol_tables(Bool shadow_warnings)
{
    ShadowProc shadow_proc;
    if (shadow_warnings)
      shadow_proc = (ShadowProc) shadow_var;
    else
      shadow_proc = NULL;
    // Defining grammar identifier
    Identifiers = NewSymbolTable("Identifiers", Nested,
				 shadow_proc, (ExitscopeProc) OutOfScope);
    Labels = NewSymbolTable("Labels", Flat,
			    NULL, (ExitscopeProc) EndOfLabelScope);
    Tags = NewSymbolTable("Tags", Nested,
		shadow_warnings ? (ShadowProc)ShadowTag : (ShadowProc)NULL,
		NULL);
    Externals = NewSymbolTable("Externals", Flat,
			       NULL, (ExitscopeProc) OutOfScope);
/*****************--------------Define For COStream----------********************/
	CompositeIds = NewSymbolTable("CompositeIds", Flat,
		NULL, (ExitscopeProc) OutOfScope);
	ToTransformDecl = NewASTSymbolTable("ToTransformDecl",Flat);//zww
	ParameterPassTable = NewASTSymbolTable("ParameterPassTable",Flat);//zww
	VariableRenameTable = NewASTSymbolTable("VariableRenameTable",Flat);//ly
}
```

## 初始化操作符表

初始化操作符模块完成对文法中各种数学运算符以及语言处理操作符进行定义，由`operator.c`中的`InitOperatorTable()`函数实现：

```c++
GLOBAL void InitOperatorTable()
{
    SET_OP(ARROW,       "->",      "ARROW",       0, 15);
    SET_OP('.',         ".",       "DOT",         0, 15);
    SET_OP('!',         "!",       "not",        14,  0);
    SET_OP('~',         "~",       "bitnot",     14,  0);
    SET_OP(ICR,         "++",      "ICR",        14,  0);
    SET_OP(POSTINC,     "++",      "postinc",    14,  0);
    SET_OP(PREINC,      "++",      "preinc",     14,  0);
    SET_OP(DECR,        "--",      "DECR",       14,  0);
    SET_OP(POSTDEC,     "--",      "postdec",    14,  0);
    SET_OP(PREDEC,      "--",      "predec",     14,  0);
    SET_OP(SIZEOF,      "sizeof",  "sizeof",     14,  0);
    // Defining logical operators
    SET_OP(ADDRESS,     "&",       "addrof",     14,  0);
    SET_OP(INDIR,       "*",       "indir",      14,  0);
    SET_OP(UPLUS,       "+",       "UPLUS",      14,  0);
    SET_OP(UMINUS,      "-",       "neg",        14,  0);
    SET_OP('*',         "*",       "mul",         0, 13);
    SET_OP('/',         "/",       "div",         0, 13);
    SET_OP('%',         "%",       "mod",         0, 13);
    SET_OP('+',         "+",       "add",         0, 12);
    SET_OP('-',         "-",       "sub",         0, 12);
    SET_OP(LS,          "<<",      "lsh",         0, 11);
    SET_OP(RS,          ">>",      "rsh",         0, 11);
    SET_OP('<',         "<",       "lt",          0, 10);
    SET_OP('>',         ">",       "gt",          0, 10);
    SET_OP(LE,          "<=",      "le",          0, 10);
    SET_OP(GE,          ">=",      "ge",          0, 10);
    SET_OP(EQ,          "==",      "eq",          0,  9);
    SET_OP(NE,          "!=",      "ne",          0,  9);
    SET_OP('&',         "&",       "band",        0,  8);
    SET_OP('^',         "^",       "bxor",        0,  7);
    SET_OP('|',         "|",       "bor",         0,  6);
    SET_OP(ANDAND,      "&&",      "and",         0,  5);
    SET_OP(OROR,        "||",      "or",          0,  4);
    /* ternary operator has precedence three, but is handled separately */
    SET_OP('=',         "=",       "asgn" ,       0,  2); RIGHT_ASSOC('=');
    SET_OP(MULTassign,  "*=",      "*=",          0,  2); RIGHT_ASSOC(MULTassign);
    SET_OP(DIVassign,   "/=",      "/=",          0,  2); RIGHT_ASSOC(DIVassign);
    SET_OP(MODassign,   "%=",      "%=",          0,  2); RIGHT_ASSOC(MODassign);
    SET_OP(PLUSassign,  "+=",      "+=",          0,  2); RIGHT_ASSOC(PLUSassign);
    SET_OP(MINUSassign, "-=",      "-=",          0,  2); RIGHT_ASSOC(MINUSassign);
    SET_OP(LSassign,    "<<=",     "<<=",         0,  2); RIGHT_ASSOC(LSassign);
    SET_OP(RSassign,    ">>=",     ">>=",         0,  2); RIGHT_ASSOC(RSassign);
    SET_OP(ANDassign,   "&=",      "&=",          0,  2); RIGHT_ASSOC(ANDassign);
    SET_OP(ERassign,    "^=",      "^=",          0,  2); RIGHT_ASSOC(ERassign);
    SET_OP(ORassign,    "|=",      "|=",          0,  2); RIGHT_ASSOC(ORassign);
    /* comma operator has precedence one, but is handled separately */
}

```

其中，`SET_OP(int i, const char *text, const char *name, int unary, int binary)`函数实现将相应的操作符添加到定义的操作符表中，对操作符信息进行数据填充，该函数在`operator.c`中实现。