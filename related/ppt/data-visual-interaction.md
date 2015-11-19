## 数据 · 视觉编码 · 交互

Echarts团队

Note:
自我介绍

---


![](./asset/img/data-mess.jpg)

Note: 海量数据

----

![](./asset/img/data-understanding.jpg)

Note: 如何转化为人脑可认知的视觉元素

----

![](./asset/img/warm-up-v0.png)

----

![](./asset/img/warm-up-v1.png)

----

![](./asset/img/warm-up-trend0.png)

Note:
哪个年龄段及收入水平人群的三酸甘油脂水平（身体脂肪量）趋势与其他均不同？

----

![](./asset/img/warm-up-trend1.png)

----


### {0|视觉感知}

> {0|客观事物通过人的视觉在人脑中形成的直接反映}

### {1|认知}

> {1|信息的获取、分析、归纳、解码、储存、概念形成、提取和使用}

### {2|**擅长**}

Note:
认知心理学将认知过程看成由信息的获取、分析、归纳、解码、储存、概念形成、提取和使用等一系列阶段组成的按一定程序进行的信息加工系统。

简单说，感知是关于输入信号的本质，也就是看见的事物；而认知是关于怎样理解和解释看到的东西。

接受到的信息大部分来源于视觉。视觉擅长进行认知。

----

![](./asset/img/warm-up-scatters0.png)

Note:

再举个例子，相关系数。
安斯库姆四重奏（Anscombe's quartet）。
分析数据前先绘制图表的重要性。

----

![](./asset/img/warm-up-scatters1.png)

---












# 数据


----


### 类别

* {0|数值}

    * {0|10米 5mA 2048KB 312天}

* {1|有序}

    * {1|小，中，大}
    * {1|周一，周二，周三}

* {2|类别}

    * {2|北京，南京，开封}

* {3|维度}

    * {3|一维、二维、三维、n维}

* {4|关系}

    * {4|树、图（网络）}


Note:
可视化的设计、ec的制作中，考虑对数据从这些类别上来刻画。
映射、视觉元素














---

# 可视编码

* {0|标记（图形元素）}
* {1|视觉通道}

Note:

可视编码由两部分组成:标记 和 视觉通道（用于控制标记的视觉特征）

可视编码是信息可视化的核心，是将数据信息映射成可视化元素的技术。

----

## 标记

<div style="min-width: 1050px">
<div style="float:left;">
{0|
点
~[350*400](./asset/ec-demo/glyph-point.html)
}
</div>

<div style="float:left;">
{1|
线
~[350*400](./asset/ec-demo/glyph-line.html)
}
</div>

<div style="float:left;">
{2|
面
~[350*400](./asset/ec-demo/glyph-area.html)
}
</div>


Note: 这个大家都知道。

----

## 视觉通道

{0|颜色&nbsp;&nbsp;&nbsp;亮度&nbsp;&nbsp;&nbsp;饱和度&nbsp;&nbsp;&nbsp;透明度
}
{1|尺寸&nbsp;&nbsp;&nbsp;形状&nbsp;&nbsp;&nbsp;纹理&nbsp;&nbsp;&nbsp;方向}
{2|动画}


Note:

可能没有给予足够的意识

1.类型（type）
    是什么/在哪里（what/where）
    何种程度（how much）
2.表现力（expressiveness）
    表达且仅表达数据的完整属性
    判断标准：精确性、可辨性、可分离性、视觉突出
3.有效性（effectiveness）
    通道表现力符合属性的重要性

下面是一些视觉通道的解释

----

### 颜色


{0|类别型数据}

{1|~[700*500](./asset/ec-demo/color-category.html)}

----

#### 颜色 - 数值型数据

{0|~[1000*500](./asset/ec-demo/color-grey.html)}


----


<div style="text-align: center; width: 1110px;">

<div style="display:inline-block;vertical-align:middle;width: 300px">

更多的维度<br>

![](./asset/img/dimensions.png)

</div>


<div style="display:inline-block;vertical-align:middle;width: 800px">

{0|颜色 - 多种视觉通道}

{0|~[1000*500](./asset/ec-demo/color-mix-aqi.html)}

</div>
</div>



----

#### 三维 · 高度

{0|~[1200*650](./asset/ec-demo/global-population.html)}


----


### 形状

~[1000*500](./asset/ec-demo/symbol.html)

----


### 视觉突出

~[1000*500](./asset/ec-demo/symbol-categories.html)

Note:

形状为辅助，并不如颜色和大小。

----

Note:

这个不讲了

### 色彩设计原则

* 避免过多颜色交错导致的杂乱无章
* 使用中性背景色，控制对全局色彩的影响
* 最小化同时对比













---

# 交互

----

### 反馈回路

![](./asset/img/visual-analysis-model.png)

Note:
这是个 “可视分析模型” 图。
只是以这个为例说明用户参与的反馈回路。

----

### 可视化设计原则

<div style="text-align: center">

<div style="display:inline-block;vertical-align:top;width: 500px;">
{0|【任务】}


* {0|总览（overview）}
* {0|缩放（zoom）}
* {0|过滤（filter）}
* {0|按需细节<br>（details-on-demand）}
* {0|相关（relate）}
* {0|历史（history）}
</div>

<div style="display:inline-block;vertical-align:top;width: 400px;">

{1|【可视化箴言】}

* {1|总览为先（Overview first）}
* {1|缩放过滤（zoom and filter）}
* {1|按需查看细节（details on demand）}

</div>

</div>


----

~[1000*500](./asset/ec-demo/dataZoom-cartesian-hv.html)

----

## 动画

* {0|带来工程的复杂性}

    * {0|软件脆弱}
    * {0|代码繁杂}

* {1|表达 数据/图形元素在**变化**中的**联系**，助于理解}

Note:

（1）动画带来工程角度的复杂性，增加软件的脆弱（带来bug），增加代码的繁杂（性能优化）。
（2）但是表达交互中数据/图形元素变化的联系，助于理解。













---



# 各种数据的可视化


----

#### 点数据的可视化


{0|~[1000*500](./asset/ec-demo/map-weibo.html)}

Note:

描述地理空间中离散的点，具有经度和纬度的坐标，但不具备大小和尺寸，
包括地图上的地标、附件的美食等

最直接的可视化点数据的方法
根据坐标直接标识在地图上，圆点是最常用的标识符号，其他标识符号还有向量箭头


weibo签到：11.8w 数据

----


#### 线数据的可视化

{0|~[1200*600](./asset/ec-demo/global-airline.html)}

Note:
线数据通常指连接两个或多个地点的线段或路径，线数据具有长度属性，即经过的地理距离



----

### 场 · 向量

<div style="width: 600px; float:left">
{0|<img src="./asset/img/maxresdefault.jpg">}
</div>
<div style="width: 350px; float:left">
{1|<img src="./asset/img/1920px-Van_Gogh_-_Starry_Night_-_Google_Art_Project.jpg">}
</div>

Note:

NASA Perpetual Ocean

----

~[1200*650](./asset/ec-demo/global-wave.html)


----


### 时间数据的可视化


{0|~[1000*500](./asset/ec-demo/dataZoom-cartesian-hv.html)}

Note:
横轴是时间。

----

~[1000*500](./asset/ec-demo/timeline-ecnomic.html)

Note:
时间作为更高层的一个维度。

----

### 关系数据

{0|树}

{1|图}


----

#### 层级数据的可视化（树）


{0|~[1000*600](./asset/ec-demo/hierarchy-tree.html)}

Note:
直接画，但是如果需要表达更多的维度？

----


~[1400*650](./asset/ec-demo/hierarchy-obama.html)

Note:
visual mapping


----

下钻

~[1400*580](./asset/ec-demo/hierarchy-disk.html)


----

#### 网络数据的可视化（图）


{0|~[1400*600](./asset/ec-demo/graph-layout.html)}

Note:

graph 多种layout。


----

#### 力导向

{0|~[1400*600](./asset/ec-demo/force-webkit.html)}


----

Note:

### 更多维度

```
[
    [1,55,9,56,0.46,18,6,"良"],
    [2,25,11,21,0.65,34,9,"优"],
    [3,56,7,63,0.3,14,5,"良"],
    [4,33,7,29,0.33,16,6,"优"],
    [5,42,24,44,0.76,40,16,"优"],
    [6,82,58,90,1.77,68,33,"良"],
    [7,74,49,77,1.46,48,27,"良"],
    [22,84,94,140,2.238,68,18,"良"],
    [23,93,77,104,1.165,53,7,"良"],
    [24,99,130,227,3.97,55,15,"良"],
    [25,146,84,139,1.094,40,17,"轻度污染"],
    [26,113,108,137,1.481,48,15,"轻度污染"],
    [27,81,48,62,1.619,26,3,"良"],
    ...
]
```

----

~[1000*500](./asset/ec-demo/color-mix-aqi.html)

Note:

比较，首先用前面的color-mix:
在二维/三维图表上增加视觉通道，以表达更多的属性信息。
但是 ...

----

Note:

~[1200*650](./asset/ec-demo/global-population.html)

扩充到三维。

----

Note:

下回再讲吧

### 高维数据 - 协同分析

~[1000*500](./asset/ec-demo/data-coop-scatter.html)


----

Note:

下回再讲吧

### 高维数据 - 散点图矩阵

~[1000*500](./asset/ec-demo/data-coop-scatter.html)






---


# 谢谢
