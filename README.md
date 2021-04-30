# 五子棋基于canvas与dom实现
## 1.文件结构
    -Gobang
        -Canvas
            -css
                -style.css
            -js
                -script.js
            -index.html
        -DOM
            -css
                -style.css
            -js
                -script.js
            -index.html

## 2.运行说明
    运行/Canvas/index.html或者/DOM/index.html都可正常运行

## 3.实现思路
#### 赢法算法的实现：
    计算出整个15*15的棋盘有多少种赢法，定义一个win[]三维数组
    win数组表达的是某个坐标的棋子有多少种赢法线条（本例中有15*11*5），
    并且有赢法线条的编号。这在后面下完棋后，需要判断该棋子是否在某个赢法线条上，
    然后让blackWin[k]数组+1，等blackWin[k]==5时就赢了

#### 悔棋的思路：
    canvas: 使用getImageData记录悔棋之前的场景，采用putImageData恢复
    
    DOM：存储每一步新添加的棋子div采用display：none进行悔棋操作
