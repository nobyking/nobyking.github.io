;(function($,window){
	var spedd = 5000;
	var $kvfull = $('.kvfull');
	var $full_block = $kvfull.find('.kvblock');
	var liNode = $kvfull.find('ul.kvlist li');
	var fullLen = $('.kvfull ul.kvlist li').length;
	
	$('.gallery_box span').on('click',function(){
		$('.prev_area,.next_area').removeClass('disabled');
		var index = $(this).index();
		$kvfull.data('index',index); 
		if(index == 0){
			$('.prev_area').addClass('disabled');
		};
		if(index == fullLen - 1){
			$('.next_area').addClass('disabled');
		};
		slide($kvfull,1,-1);
		$('.masklayer').show();
		$('#photogallery').show();
		report("BROWSER.ACTIVITY.GONELOVER.PHOTOS");
	});




	$('.kvfull,.masklayer').on('click',function(){
		$('.masklayer').hide();
		$('#photogallery').hide();
	});

	$('.kvblock').on('click',function(e){
		e.stopPropagation();
		return false;
	});



	/*大图部分*/
	$('.prev_area').click(function(){
		if($full_block.is(':animated')){ $full_block.stop(1,1);};
		var distance = liNode.width();
		var direction = -1;
		var flag =1;
		var cur = $kvfull.data('index');
		if(cur <= 1){
			$(this).addClass('disabled');
		}else{
			$('.prev_area,.next_area').removeClass('disabled');	
		};
		if( cur <=0){  
			return false;
		};
		slide($kvfull,direction,flag);
		$(this).blur();
		return false;
	});
	$('.next_area').click(function(){
		if($full_block.is(':animated')){ $full_block.stop(1,1);}
		var distance = liNode.width();
		var direction = 1;
		var flag = 1;
		var cur = $kvfull.data('index');
		if(cur >= fullLen - 2){
			$(this).addClass('disabled'); 
		}else{
			$('.prev_area,.next_area').removeClass('disabled');
		};
		if(cur>=fullLen-1){
			return false;
		}
		slide($kvfull,direction,flag);
		$(this).blur();
		return false;
	});

	function slide(parent,direction,flag){
		var per = parent.find('ul.kvlist li').width();
		var cur = parent.data('index');
		var liNode = parent.find('ul.kvlist li');
		var len = liNode.length;
		if(flag == 1){
			cur += direction;
		};
		parent.find('.kvblock').animate({'scrollLeft':per*cur},2);
		parent.data('index',cur);
	};

})(jQuery,window);

