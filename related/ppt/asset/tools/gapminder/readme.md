Gapminder 数据处理工具
===

用于处理GapMinder上的原始数据

来自: [http://www.gapminder.org/data/](http://www.gapminder.org/data/)

Usage
---

1. data.coffee 为原始数据,为 Excel 转出的二维数组.    
原始数据来自: [这里](http://www.gapminder.org/data/)

2. compute.coffee 为处理数据逻辑, 大致思路就是将几组数据做一个内连接, 按国家名字制作出一个新的二维数组, 
包含了一个国家下的人口/人均GDP/人均寿命等数据.

3. joinUtil.coffee 做内联的函数

4. gapminder.json.js 输出第2步的数据.


```javascript

coffee compute.coffee

```
===