(function($) {
	var floatMenu = $('.floatMenu');
	setFloatMenu();
	$(window).resize(function() {
		setFloatMenu();
	});

	function setFloatMenu(){
		var _w = $(window).width();
		if(_w < 1380){
			floatMenu.hide();
		}else{
			floatMenu.show();
		};		
	};


	//感動指數
	var tubePerNum = 3.04;
	var tubeInitArr = [87,82,89,85,84,80,81,88,87,80,85,90,85,85];//感情指数初始值
	var storage  = localStorage ? localStorage.getItem('tubeStorage') : '';
	var disable_storage =  localStorage ? localStorage.getItem('disableStorage') : '';
	var newTubeArr = [];
	var tubeArr = [];
	//判断时间
	var now = new Date();
	var hour = now.getHours();
	var day = now.getDate(); 
	var flag;
	if(hour == 12 || hour == 18 ){ 
		updateData();
		tubeArr = newTubeArr;
	}else{
		tubeArr = storage ? storage.split(',') : tubeInitArr;
	};

	var disableArr = disable_storage ? disable_storage.split(',') : [];
	//感动指数更新为本地存储数据
	$('.video-box').each(function(i){
		var target = $(this);
		var tubeNum = target.find('.tube-num');
		var curVal = tubeArr[i];
		tubeNum.text(tubeArr[i]);
		var tubeLight = target.find('.tube-light');
		tubeLight.height(parseInt(tubeArr[i]*tubePerNum));
		//按钮置灰
		var feeling = target.find('.feeling');
		for(var j=0;j<disableArr.length;j++){
			if(i == disableArr[j]){
				feeling.addClass('disable');
			};
		};
	});

	//感动指数取随机数
	function updateData(){		
		var MaxVal = 100;
		for(var i=0;i<tubeInitArr.length;i++){
			newTubeArr[i] = Math.floor(Math.random() * ( MaxVal- tubeInitArr[i] - 1)) + tubeInitArr[i];
		};		
	};


	$('.video-box').on('click','.btn-like',function(e){//感动
		var target = $(this);
		changeTube(target,0);
		return false;
	});

	$('.video-box').on('click','.btn-dislike',function(e){//无感
		var target = $(this);
		changeTube(target,1);
		return false;
	});

	function changeTube(target,flag){//flag为0表示喜欢
		if(target.hasClass('disable')){
			return false;
		};
		var parentNode = target.parents('.video-box');
		var button = parentNode.find('.feeling');
		var heart_like = parentNode.find('.heart_like');
		var heart_dislike = parentNode.find('.heart_dislike');
		button.addClass('disable');
		var series = parentNode.attr('data-index');
		var index = $('.video-box').index(parentNode);
		createFlashObj(series,index%2,flag);
		var tube = parentNode.find('.tube-num');
		var tubeLight = parentNode.find('.tube-light');
		var initVal = parseInt(tube.text());
		var endVal;
		if(flag){
			endVal = initVal - 1;
			heart_dislike.addClass('fade');
		}else{//喜欢
			endVal = initVal + 1;
			heart_like.addClass('fade');
		};
		setTimeout(function(){
			tube.text(endVal);
		},500);
		var tubeNewHeight = parseInt(endVal * tubePerNum); 
		tubeLight.height(tubeNewHeight);
		tubeArr[index] = endVal;
		disableArr.push(index);
		if(localStorage){
			localStorage.setItem('tubeStorage',tubeArr);
			localStorage.setItem('disableStorage',disableArr);		
		};		
	};


	function createFlashObj(series,num,flag){//x为模块数，y为模块余数,m为0表示喜欢
		var opObjectParams = {};  
		opObjectParams.wmode = "transparent";  
		opObjectParams.menu = "false";
		opObjectParams.loop = "false";
		if(num!=0){//奇数 右侧
			if(flag == 0){//喜欢
				swfobject.embedSWF("images/like.swf", "flashRight_like"+series, "188", "241", "9.0.0", "expressInstall.swf", null, opObjectParams);				
			}else{
				swfobject.embedSWF("images/dislike.swf", "flashRight_dislike"+series, "188", "241", "9.0.0", "expressInstall.swf", null, opObjectParams);
			};
		}else{
			if(flag == 0){//喜欢
				swfobject.embedSWF("images/like.swf", "flashLeft_like"+series, "188", "241", "9.0.0", "expressInstall.swf", null, opObjectParams);				
			}else{
				swfobject.embedSWF("images/dislike.swf", "flashLeft_dislike"+series, "188", "241", "9.0.0", "expressInstall.swf", null, opObjectParams);
			};
		};
	};

})(jQuery);