if (top != self) {
    top.location = self.location;
}
if (opener) {
    try {
        if (opener.document.domain == document.domain) {
            opener.location = opener.location
        }
    }
    catch (e) {}
}

;(function(window,$){
    $(window).scrollTop(0);


    //右侧随屏滚动菜单 
    window.QB_QINGYUN.subMenu();

    window.onload = function(){
        //填充视频列表
        var videoBox = $('#gallery');
        var videoArr = [];
        var videoData = zMsg.getFormData(1);
        for(var i in videoData) {
            videoArr.push('<div class="gallery-pic" data-vid="'+ videoData[i].vid +'" data-report="'+ videoData[i].report +'"><div class="img"><img src="'+ videoData[i].img +'" alt="'+ videoData[i].title +'" title="'+ videoData[i].title +'"></div><p>'+ videoData[i].title +'</p></div>');
        }
        videoBox.html(videoArr.join(''));
        /*自定义滚动条*/
        videoBox.mCustomScrollbar({
            mouseWheelPixels: 150
        });
        //视频初始化
        var firstVid = $('.gallery-pic').eq(0).data('vid');
        var firstReport = $('.gallery-pic').eq(0).data('report');
        window.video = new tvp.VideoInfo();
        video.setVid(firstVid);
        window.player = new tvp.Player();
        player.create({
            width: 720,
            height: 405,
            video: video,
            modId: "videoBox", //mod_player是刚刚在页面添加的div容器
            autoplay: true,  //是否自动播放
            flashWmode: "transparent",
            vodFlashSkin: "http://imgcache.qq.com/minivideo_v1/vd/res/skins/TencentPlayerMiniSkin.swf", //是否调用精简皮肤，不使用则删掉此行代码
            oninited: function () {
                $('.gallery-pic').eq(0).addClass('current');
                api.report('BROWSER.ACTIVITY.QINGYUNZHI.VIDEOCLICK_' + firstReport);
            }
        });
        videoBox.on('click', '.gallery-pic', function () {
            if($(this).hasClass('current')) return;
            var vid = $(this).data('vid');
            var report = $(this).data('report');
            player.curVideo.setVid(vid);
            player.play(player.curVideo);
            $(this).addClass('current').siblings('.gallery-pic').removeClass('current');
            api.report('BROWSER.ACTIVITY.QINGYUNZHI.VIDEOCLICK_'+ report);
        });
        //页游礼包按钮 后加 手游礼包按钮
        //$('#gameWeb').after('<a href="http://1.qq.com/page/?app=1105399579&union=10194_160_1" target="_blank" class="game-link-mobile" onclick="api.report(\'BROWSER.ACTIVITY.QINGYUNZHI.GAMEMOBILECLICK\')"></a>')
    };



})(window,jQuery);