//上报
	function report(hottagValue) {
	    window.setTimeout(function () {
	       pgvSendClick({hottag: hottagValue});
	    }, 100);
		//console.log(hottagValue);
	}
	if(typeof(pgvMain) == 'function') {
	    pgvMain("pathtrace", {pathStart: true, tagParamName: "ADTAG", useRefUrl: true, override: true, careSameDomainRef: false});
	}

;(function(window,$){
	$(document).scrollTop(0);

	$('.beautiImg').slick({
		dots: true,
		infinite: true,
		speed: 500,
		fade: false,
		cssEase: 'linear'
	});


	$('.slick-prev,.slick-next').click(function(){
		var title = $('.slick-active').find('img').attr('data-title');
		$('.h2t').text(title);
		$('.slider0').show();
		return false;
	});

	$('.slick-dots li').click(function(){
		$('.slider0').show();
		return false;
	});


	$('.beautiImg').on('click','img',function(){
		/*if($(this).attr('data-id') == 's016584a9dg') {
			alert('敬请期待！');
			return;
		};*/
		var vid = $(this).attr('data-id');
		$('.pop-layer').show();
		$('.masklayer').show();
		setTimeout(function(){
			$('.video-close').show();
		},100);
		/*--视频播放*/
		var video = new tvp.VideoInfo();
		video.setVid(vid);
		var player = new tvp.Player();
		player.create({
			flashWmode:'Opaque',
			width:546,
			height:369,
			video:video,
			isVodFlashShowSearchBar:0,
			isVodFlashShowEnd:0,
			autoplay: true,
			vodFlashSkin:"http://imgcache.qq.com/minivideo_v1/vd/res/skins/TencentPlayerMiniSkin.swf",
			modId:"mod_player",
			onallended:function(){
				$('.pop-layer').hide();
				$('.scan-layer').show();
			}
		});
		report('BROWSER.ACTIVITY.PCLUODI.VIDEOCLICK');
	});

	$('.pop-layer').on('click','.video-close',function(){
		$('#mod_player').empty();
		$('.pop-layer').hide();
		$('.masklayer').hide();
		return false;
	});


	$('.scan-layer').on('click','.close',function(){
		$('.scan-layer').hide();
		$('.masklayer').hide();
		return false;
	});


	$('.pc_btn').click(function(){
		var buttonName = $(this).attr('data-btn');
		report('BROWSER.ACTIVITY.PCLUODI.'+buttonName+'CLICK');
	});


	$('.mobile_btn').click(function(){
		$('.scan-layer').show();
		$('.masklayer').show();
		var buttonName = $(this).attr('data-btn');
		report('BROWSER.ACTIVITY.PCLUODI.'+buttonName+'CLICK');
		return false;
	});

	
}(window,jQuery))
