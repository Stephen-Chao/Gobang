var chessBoard=[];//二维数组用来保存棋盘信息，0为没有走过的，1为黑棋，2为白棋
var currentChess=true;//目前正要下的棋子的颜色，初始化为true表示黑子棋子。false表示白色棋子
var over=false;//标志游戏是否结束，有一方赢了就表示结束

var currentChessX = 0;  // 记录最新棋子x
var currentChessY = 0; //记录最新棋子y
var now_Chess;  //记录最新当前棋子

//赢法数组，用来记录所有可能的赢法方案，
var wins=[];

//赢法的统计数组，分别统计黑棋和白棋在上面所有赢法方案中已经完成了几颗棋子了
var blackWin=[],whiteWin=[];

//初始化棋盘信息，将二维数组所有项全部初始化为0
for (var i = 0; i < 15; i++) {
    chessBoard[i]=[];
    for (var j = 0; j < 15; j++) {
        chessBoard[i][j]=0;
    }
}

//初始化枚举赢法的数组，为一个三维数组
for (var i = 0; i < 15; i++) {
    wins[i]=[];
    for (var j = 0; j < 15; j++) {
        wins[i][j]=[];
    }
}

var count=0;

//枚举所有可能的五个棋子竖直排列的情况
for (var i = 0; i < 15; i++) {
    for (var j = 0; j < 11; j++) {
        for (var k = 0; k < 5; k++) {
            wins[i][j+k][count]=true;
        }
        count++;
    }
}

//枚举所有可能的五个棋子水平排列的情况
for (var i = 0; i < 15; i++) {
    for (var j = 0; j < 11; j++) {
        for (var k = 0; k < 5; k++) {
            wins[j+k][i][count]=true;
        }
        count++;
    }
}


//枚举所有可能的五个棋子反斜线排列的情况
for (var i = 0; i < 11; i++) {
    for (var j = 0; j < 11; j++) {
        for (var k = 0; k < 5; k++) {
            wins[i+k][j+k][count]=true;
        }
        count++;
    }
}

//枚举所有可能的五个棋子正斜线排列的情况
for (var i = 0; i < 11; i++) {
    for (var j = 14; j >3; j--) {
        for (var k = 0; k < 5; k++) {
            wins[i+k][j-k][count]=true;
        }
        count++;
    }
}


//分别初始化黑白两棋子在某种赢法的情况下已经有的棋子为0
for (var i = 0; i < count; i++) {
    blackWin[i]=0;
    whiteWin[i]=0;
}





//获取棋盘在dom中的元素
var chess=document.getElementById('chess');

//获得棋盘到其包含元素的左边和右边距离
var chessLeft=chess.offsetLeft;
var chessTop=chess.offsetTop;


/*画棋盘格14*14=196格*/
function drawChessBoard() {
    var fragment=document.createDocumentFragment();
    for (var i = 0; i < 196; i++) {
        var div=document.createElement('div');
        div.className="chessboard";
        fragment.appendChild(div);
    }
    chess.appendChild(fragment);
}


/*在某个位置画一颗棋子
@para i 横向第i个格子线
@para j 纵向第j个格子线
*/
function drawChess(i,j){

    var chess_piece=document.createElement("div");
    if (currentChess) {//设置黑棋对应的css类
        chess_piece.className="black_piece";
    }else{//设置白棋对应的CSS类
        chess_piece.className="white_piece";
    }

    chess.appendChild(chess_piece);
    //设置绝对定位的偏移量
    chess_piece.style.left=15+i*30+"px";
    chess_piece.style.top=15+j*30+"px";
    now_Chess = chess_piece; // 当前最新棋子
}

/*
设置鼠标点击处理事件
*/
chess.onclick=function(e){
    if (over) {
        window.alert("本轮游戏已经结束了，请刷新浏览器重新开始！");
        return;
    }

    //获取点击的位置相当于棋盘左上角的位置
    var x=e.clientX-chessLeft;
    var y=e.clientY-chessTop;

    var i=Math.floor(x/30);
    var j=Math.floor(y/30);

    currentChessX = i; //获取当前位置x
    currentChessY = j; //获取当前位置y
    if (chessBoard[i][j]===0) {//在画棋子之前先判断一下棋盘上该位置是否已经有了棋子，为空时才允许放置
        drawChess(i,j);//画棋子
        if (currentChess) {//如果放下的棋子为黑棋
            chessBoard[i][j]=1;
            for (var k = 0; k <count; k++) {//遍历所有赢法
                if (wins[i][j][k]) {
                    blackWin[k]++;
                    whiteWin[k]=undefined;
                    if (blackWin[k]===5) {//如果黑棋在第k中赢法中已经有了5颗棋子，说明黑棋赢了
                        window.alert("黑棋赢！");
                        over=true;
                    }
                }
            }
        }else{//如果放下的棋子为白棋
            chessBoard[i][j]=2;
            for (var k = 0; k <count; k++) {
                if (wins[i][j][k]) {
                    whiteWin[k]++;
                    blackWin[k]=undefined;
                    if (whiteWin[k]===5) {//如果白棋在第k中赢法中已经有了5颗棋子,说明白棋赢了
                        window.alert("白棋赢！");
                        over=true;
                    }
                }
            }
        }
        currentChess=!currentChess;//将下一步棋的颜色进行反转
    }

}


//初始化棋盘
drawChessBoard();

//重开
function remake(){
    location.reload() //刷新以重新开始
}

//悔棋
function reChess(){
    now_Chess.style.display = 'none'; //不显示棋子
    //减少赢子的个数
    if (currentChess) {//如果放下的棋子为黑棋
        for (var k = 0; k <count; k++) {//遍历所有赢法
            if (wins[currentChessX][currentChessY][k]) {
                blackWin[k]--;
                whiteWin[k]=undefined;
            }
        }
    }else{//如果放下的棋子为白棋
        for (var k = 0; k <count; k++) {
            if (wins[currentChessX][currentChessY][k]) {
                whiteWin[k]--;
                blackWin[k]=undefined;
            }
        }
    }
    chessBoard[currentChessX][currentChessY] = 0 //棋盘数组减少
    currentChess=!currentChess;//将下一步棋的颜色进行反转
    //按钮转制
    document.getElementById('reChess').setAttribute("disabled",true);
    document.getElementById('reChess').style.cursor='not-allowed';
    document.getElementById('reChess').style.background='#999';
    document.getElementById('deReChess').disabled=false;
    document.getElementById('deReChess').style.cursor='pointer';
    document.getElementById('deReChess').style.background='lightcoral';
    console.log('执行结束')
}
//撤销悔棋
function deReChess(){
    now_Chess.style.display = 'block'; //展示棋子
    //按钮转制
    document.getElementById('deReChess').setAttribute("disabled",true);
    document.getElementById('deReChess').style.cursor='not-allowed';
    document.getElementById('deReChess').style.background='#999';
    document.getElementById('reChess').disabled=false;
    document.getElementById('reChess').style.cursor='pointer';
    document.getElementById('reChess').style.background='lightgoldenrodyellow';
}
