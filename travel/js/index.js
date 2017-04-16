window.onload=function(){
	//轮播
	const dots = $('.dots').children();
	//标记轮播点击的是第几个圆点；
	let dotN = 0;
	dotFn = function(_this){
		$('.dots:eq(dotN)').siblings().css('border-color','#fff');
		$('.dots:eq(dotN)').css('border-color','#54d2e2');
		$('.letter').html(letter[dotN]+`<div class="en">${words[dotN]}</div>`);
		$('.letter').css('background-image',`url(../img/(${dotN}-1)a.jpg)`);
		$('#head').css('background-image',`url(../img/(${dotN}-1).jpg)`);
	}
	dots.each(function(index,ele){
		dots.click(function(){
			var _this = $(this);
			dotFn(_this);
			dotN=_this.index();
		})
	})
//	setInterval(function(){
//		dotN++;
//		(dotN>dots.length-1)?(dotN=0):dotN;
//		dotFn()
//	},1000)
}
