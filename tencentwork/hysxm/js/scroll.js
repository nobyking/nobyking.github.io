;(function($,window){
	//图片轮播
	var kvblock = $('.kvblock');
	var perWidth = kvblock.width();
	var len =  kvblock.find('.kvtitle').length;
	var dot = $('.dotlist a');
	kvblock.data('index',0);
	var prevBtn = $('.kv .prev');
	var nextBtn = $('.kv .next');
	prevBtn.hide();
	prevBtn.click(function(){
		if( kvblock.is(':animated') ){ kvblock.stop(1,1); }
		var index = kvblock.data('index');
		if(index == 0 ){ prevBtn.hide(); return false;}
		index--;
		if(index == 0){
			prevBtn.hide()
		}else{
			prevBtn.show();
		};
		nextBtn.show();		
		scroll(index);
		return false;
	});
	nextBtn.click(function(){
		if( kvblock.is(':animated') ){ kvblock.stop(1,1); }
		var index = kvblock.data('index');
		if(index==len-1){ return false;}
		index++;
		if(index==len-1){ 
			nextBtn.hide();
		}else{
			nextBtn.show();
		}
		prevBtn.show();
		scroll(index);		
		return false;
	});
	dot.click(function(){
		if( kvblock.is(':animated') ){ kvblock.stop(1,1); }
		var cur = $(this).index();
		var index = kvblock.data('index');
		if(cur == index){ return false;}
		if(cur == 0){
			prevBtn.hide();
		}else{
			prevBtn.show();
		};
		if(cur == len-1){
			nextBtn.hide();
		}else{
			nextBtn.show();
		}
		scroll(cur);
		return false;
	});

	function scroll(num){
		kvblock.animate({'scrollLeft':perWidth*num+'px'},200);
		kvblock.data('index',num);
		dot.removeClass('active').eq(num).addClass('active');
	}


	//左侧浮动栏
	//var which = $('.fixer');
	// $(window).scroll(function(){
	// 	var offsetTop = $(window).scrollTop();
	// 	if(offsetTop>600){
	// 		var temp = offsetTop - 500;
	// 		which.animate({top : temp},{duration:450 , queue:false });
	// 	}
	// });


	// setBar();
	// $(window).resize(function(event) {
	// 	setBar();
	// });
	// //在窗口变小时左侧浮动栏消失

	//设置自动识别
	var $fixer = $('.fixer');
	var fixY = $fixer.height();
	//var anchorItem = 
	//$fixer.css('margin-top',- fixY/2);	
	$('.fixer a').on('focus',function(){
		$(this).blur();
	})

	$fixer.removeClass('fix_bar');
	//$fixer.css('position','absolute');
	var  arr = setAnchor();
	var  newArr = order(arr);
	var newArrlen = newArr.length -1;
	var scrollflag = false;
	var curNode ='';
	var _w = $(window).width();
	var showFlag = 1;
	setBar();
	$(window).on('resize',function(){
		setBar();
		setClass();
	});


	function setClass(){
		if($(document).scrollTop()>=630){
			$fixer.addClass('fixbar');
		}else{
			$fixer.removeClass('fixbar');
		};		
	}	

	function setBar(){
		var _w=$(window).width();
		if(_w>=1350 && _w < 1600 ){
			$fixer.css('left','10px');
			showFlag = 1;  //showFlag:1左侧浮动栏显示 0 不显示
			$fixer.show();		
		}else if( _w>=1600 && _w<3000){
			$fixer.css('left','100px');
			showFlag = 1;
			$fixer.show();
		}else{
			showFlag  =0;
			$fixer.hide();
		};		
	}

	$(window).on('scroll',function(){
		var screenY = $(window).height();
		if( showFlag == 1  && $(document).scrollTop() >= 630 ){
			$fixer.addClass('fix_bar');
		}else{
			$fixer.removeClass('fix_bar');
			$('ul.anchorlist li a').removeClass('active').eq(0).addClass('active');
		};
		//页面滚动时固定栏的变化
		var scrollY = $(document).scrollTop();
		var btmY = $(document).height() - screenY;
		var temp;
		for(var i=0;i<newArr.length;i++){
			if(scrollflag){ return;}
			if(scrollY>= btmY){
				temp = 'anchor_recommend';
			}else if(scrollY < 630){
				temp = 'anchor_movie';
			}else{
				if(scrollY>=630 && scrollY<1170){
					temp = 'anchor_movie';
				}else if(scrollY>= 1170 && scrollY<= 1815){
					temp = 'anchor_draw';
				}else if(scrollY>=1815 && scrollY<= 2328){
					temp = 'anchor_view';
				}else if(scrollY>=2328){
					temp = 'anchor_recommend';
				};				
			};

			$('ul.anchorlist li a').removeClass('active');
			$('ul.anchorlist li a[data-url=\''+temp+'\']').addClass('active');
		}

	});
	
	//click触发时的菜单变化
	$('ul.anchorlist li a').click(function(){
		scrollflag = true;
		$('ul.anchorlist li a').removeClass('active');
		var url = $(this).attr('data-url');
		curNode = url;
		$(this).addClass('active');
		var offsetY = $('.'+url).offset().top - 45;
		$('html,body').animate({scrollTop:offsetY},300,function(){
			scrollflag = false;
		});
		return false;
	});
	 

	/*关联数组*/
	function setAnchor(){
		var $liNode = $('ul.anchorlist li');
		var arr=[];
		for(var i=0;i<$liNode.length;i++){
			var key = $liNode.eq(i).find('a').attr('data-url');
			if( $('.'+key).length==0 ){ return;}
			var value = $('.'+key).offset().top;
			arr[''+key] = value;
		};
		
	    return arr;
	};

	function order(arr){
		var newarr = new Array();
		for(var k in arr){
			newarr.push(k);
		}
		newarr.sort(function sortfunction(x,y){
	 		return arr[x]-arr[y];
		});
		return newarr;
	};

/*fixer end*/ 


})(jQuery,window);


	
