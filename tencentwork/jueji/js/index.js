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
    //填充演员列表
    function fillActore(cb) {
        var actorArr = [];
        var _html = '';
        var nameArr = ['霓虹','麒零','鬼山莲泉','银尘','幽冥','鬼山缝魂','天束幽花','苍白少年','神音',' 特蕾娅','漆拉','郭敬明'];
        for(var i = 1; i <= 12; i++) {
            _html = '<li class="actor-'+ i +'" data-actorid="'+ i +'" data-name="'+ nameArr[i-1] +'">\
                        <div class="pic"></div>\
                        <span class="name"></span>\
                        <span class="hotNumber"><i class="icon-add">+1</i><a href="javascript:;" class="icon-heart" data-heartid="'+ i +'"></a><strong>人气</strong><em class="val">0</em></span>\
                    </li>';
            actorArr.push(_html);
        }
        $('.actor').html(actorArr.join(''))
            .on('click', 'li .pic', function () {
                var id = $(this).parent().data('actorid');
                if(id == 12) return;
                $('#actor-img').attr('src','http://stdl.qq.com/stdl/activity/jueji/images/actor-detail-'+id+'.jpg');
                $('.pop-actor').show();
                $('.masklayer2').show();
                api.report("BROWSER.ACTIVITY.JUEJI.SHOWACTORCLICK");
            })
            .on('click','.icon-heart', function () {
                var me = $(this);
                var id = me.data('heartid');
                QB_JUEJI.page.vote(id, function (timer) {
                    var addNum = me.prev();
                    addNum.show(0).animate({'top':'-25px','opacity':'0'},300, function () {
                        $(this).css({'top':'-15px','opacity':'1'}).hide();
                    });
                    //设置按钮状态
                    me.addClass('active');
                    //人气值自动加1
                    var voteNumber = me.parent().find('.val');
                    voteNumber.text(parseInt(voteNumber.text())+1);
                    //储存到cookie中，当天过期
                    var _time = qv.date.format("Y-m-d",timer*1000);
                    var timeStar = timer*1000;
                    var timeEnd = new Date(_time).setHours(23,59,59);
                    var time = (timeEnd - timeStar) / 1000;
                    var uin = qq.login.getUin();
                    var val = qv.cookie.get('actor_' + uin) + '|' + id;
                    qv.cookie.set('actor_' + uin, val, {domain:'browser.qq.com',path:'/',expires: time})
                });
            });
        $('.actor li:last').addClass('nocur');
        $('.masklayer2, .actor-close').click(function () {
            $('#actor-img').attr('src','');
            $('.pop-actor').hide();
            $('.masklayer2').hide();
        });
        cb ? cb() : '';
    }

    window.onload = function(){
        //头尾初始化
        api.initNav("header","footer",{ //对应header footer div的id
            background:"#000",  //footer的背景色，常常需要根据页面设计改变颜色 默认：黑色（可选）
            color:"#fff",  //footer中文字的颜色 默认：白色（可选）
            qblink:"http://dldir1.qq.com/invc/tt/QQBrowser_Setup_9.4.8699.400.exe", //下载QB按钮的链接 默认：特权中心QB包（可选）
            report:"BROWSER.ACTIVITY.QINGYUNZHI.QBDOWNLOADCLICK", //点击流数据上报（可选）
            isTqHide:false //特权LOGO是否显示（可选）
        });

        //填充演员列表
        fillActore(function () {
            QB_JUEJI.page.getVoteNum();
        });

        //视频初始化
        window.video = new tvp.VideoInfo();
        video.setVid('m0330z17q30');
        window.player = new tvp.Player();
        player.create({
            width: 385,
            height: 240,
            video: video,
            modId: "videoBox", //mod_player是刚刚在页面添加的div容器
            autoplay: false,  //是否自动播放
            flashWmode: "transparent",
            vodFlashSkin: "http://imgcache.qq.com/minivideo_v1/vd/res/skins/TencentPlayerMiniSkin.swf", //是否调用精简皮肤，不使用则删掉此行代码
            oninited: function () {
                //
            }
        });
    };



})(window,jQuery);