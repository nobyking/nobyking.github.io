var numId = 1, 
	time = 10,
	num = 1, 
	clearTime, 
	totalTimes = 0;

function clickTime(){
	/*控制抽奖次数函数*/
	if(numId == 4 || numId == 8 || numId == 12 || numId == 18){
		totalTimes -= 1;
		time = 10;
	}
	if(totalTimes == 2){
		alert("对不起！你的三次机会已用完了，请充值。。。");
		totalTimes = 2;
		return 0;
	}
	totalTimes++;
	beginGame();
}
function beginGame(){
	 document.getElementById("box"+numId).style.backgroundColor = "#F50101";
	var myRandomNum = Math.floor(Math.random() * 18) + 1;
		if(num >= 4 && numId == myRandomNum){
			num = 1;
			time = 10;
			alertUser(numId);
			clearTimeout(clearTime);
			return 0;
		}
	clearTime = setTimeout("changBack();", time);
}
function changBack(){
	document.getElementById("box"+numId).style.backgroundColor = "orange";
	numId++;
	if(numId == 19){
		numId = 1;
		num++;
		time += 25;
	}
	clearTime = setTimeout("beginGame();", time);
}
/*奖项设置*/
function alertUser(numId){
		switch(numId){
				case 1:
					alert("恭喜哦！你中了个电源，请到讲台兑换！谢谢！");
					break;
				case 2:
					alert("恭喜哦！你中了个手表，请到讲台兑换！谢谢！");
					break;
				case 3:
					alert("抱歉！你运气不好啦！！！");
					break;
				case 4:
					alert("运气还不错，再来一次试试吧！");
					break;
				case 5:
					alert("恭喜哦！商品全部5折！");
					break;
				case 6:
					alert("抱歉！你运气不好啦！！！");
					break;
				case 7:
					alert("恭喜哦！你中了个手表，请到讲台兑换！谢谢！");
					break;
				case 8:
					alert("运气还不错，再来一次试试吧！");
					break;
				case 9:
					alert("抱歉！你运气不好啦！！！");
					break;
				case 10:
					alert("恭喜哦！你中了个手表，请到讲台兑换！谢谢！");
					break;
				case 11:
					alert("抱歉！你运气不好啦！！！");
					break;
				case 12:
					alert("运气还不错，再来一次试试吧！");
					break;
				case 13:
					alert("您运气太好了！天啊！你中特奖了，请到讲台兑换哈！谢谢！");
					break;
				case 14:
					alert("抱歉！你运气不好啦！！！");
					break;
				case 15:
					alert("恭喜哦！商品全部5折！");
					break;
				case 16:
					alert("抱歉！你运气不好啦！！！");
					break;
				case 17:
					alert("恭喜哦！WIFI在手，上网不愁哈！");
					break;
				case 18:
					alert("运气还不错，再来一次试试吧！");
					break;
			}
}
