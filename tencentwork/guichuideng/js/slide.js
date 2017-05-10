;(function($,window){
	var spedd = 5000;
	var $kvfull = $('.kvfull');
	var $full_block = $kvfull.find('.kvblock');
	var liNode = $kvfull.find('ul.kvlist li');
	var fullLen = $('.kvfull ul.kvlist li').length;
	var kvcon = $('.kvcon');
	kvcon.html(liNode.eq(0).find('.kvinfo').html());
	
	var $kvthumb= $('.kvthumb');
	var $thumb_block = $kvthumb.find('.kvblock');
	$kvthumb.data('index',0);
	var $kvlist = $kvthumb.find('ul.kvlist');
	var thumbli = $kvthumb.find('ul.kvlist li');
	var space = parseInt(thumbli.css('marginRight'));
	var thumb_total = thumbli.length;
	var perNum = Math.ceil($kvlist.width()/(thumbli.width()+space));/*每页显示的数量*/
	var start = Math.ceil(perNum/2)-1;
	var end = thumb_total-1-Math.ceil(perNum/2)+1;

	/*hash值*/ 
	var url = window.location.hash;
	var urlstring = url.substring(url.indexOf('#')+1);
	if(!urlstring){ 
		$kvfull.data('index',0);
	 }
	for(var i=0;i<fullLen-1;i++){
		var rel = liNode.eq(i).attr('data-url');
		if(rel != urlstring){ 
			$kvfull.data('index',0); 
			continue;
		}else{
			$kvfull.data('index',i);
			slide($kvfull,1,-1);
			$kvthumb.data('index',i);
			thumbSlide($kvthumb,start,end);
			break;
		}
	};
	$('.stars .kvfull ul.kvlist li').attr('class');



	/*大图部分*/
	$('.prev').click(function(){
		if($full_block.is(':animated')){ $full_block.stop(1,1);};
		if($thumb_block.is(':animated')){ $thumb_block.stop(1,1);};
		var distance = liNode.width();
		var direction = -1;
		var flag =1;
		var cur = $kvfull.data('index');
		if( cur <=0){ return false;}
		slide($kvfull,direction,flag);
		$kvthumb.data('index',--cur);
		thumbSlide($kvthumb,start,end);
		$(this).blur();
		return false;
	});
	$('.next').click(function(){
		if($full_block.is(':animated')){ $full_block.stop(1,1);}
		if($thumb_block.is(':animated')){ $thumb_block.stop(1,1);};
		var distance = liNode.width();
		var direction = 1;
		var flag = 1;
		var cur = $kvfull.data('index');
		if(cur>=fullLen-1){ return false;}
		slide($kvfull,direction,flag);
		$kvthumb.data('index',++cur);
		thumbSlide($kvthumb,start,end);
		$(this).blur();
		return false;
	});

	/*缩略图部分*/
	$('.kvthumb ul.kvlist li').hover(function(){
		 var parent = $kvthumb;
		 var direction = 1;
		 var index = $('.kvthumb ul.kvlist li').index($(this));
		 parent.data('index',index);
         thumbSlide(parent,start,end,direction);
         var flag = 0;
         $kvfull.data('index',index);
         slide($kvfull,direction,flag);
         return false;
	});


})(jQuery,window);



function slide(parent,direction,flag){
	var per = parent.find('ul.kvlist li').width();
	var cur = parent.data('index');
	var liNode = parent.find('ul.kvlist li');
	var $kvcon = $('.kvcon');
	var len = liNode.length;
	if(flag == 1){
		cur += direction;
	};
	parent.find('.kvblock').animate({'scrollLeft':per*cur},2);
	parent.data('index',cur);
};

function thumbSlide(parent,start,end){
	var thumb_cur = parent.data('index');
	var thumb_block = parent.find('.kvblock');
	var thumb_li = parent.find('ul.kvlist li');
	var space = parseInt(thumb_li.css('marginRight'));
	var thumb_per = thumb_li.width() + space;
	thumb_li.removeClass('now').eq(thumb_cur).addClass('now');
	parent.data('index',thumb_cur);
	if( thumb_cur < start){
		thumb_block.animate({'scrollLeft':0},200);
	}else if( thumb_cur > end){
		thumb_block.animate({'scrollLeft':(end-start)*thumb_per},200);
	}else{
		thumb_block.animate({'scrollLeft':(thumb_cur-start)*thumb_per},200);
	}	
};