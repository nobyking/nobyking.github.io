if(typeof console === "undefined"){
    console = { log: function() { } };
}
//AMS新集成
zHttp.baseUrl = "http://iyouxi3.vip.qq.com/ams3.0.php";
//活动地址 不带任何参数
var _pageUrl = location.protocol + '//' + location.host + location.pathname;
//获取AMS系统中设置的提示语
function getAmsMsg(res) {
    var msgCfg = zHttp.getMsgByState( res.data, res.actid, res.ret, $.noop );
    return zMsg.repair( msgCfg.m );
}

function hint(){
    var qb_dialog = new qv.zero.Dialog({
        title: "QQ浏览器用户专享",
        content: "<p>       亲，这是QQ浏览器用户的专属特权活动。</p><p>             用QQ浏览器打开即可参加。</p>",
        type: "alert",
        buttons: [{
            text: "下载QQ浏览器",
            click: function() {
                document.getElementById('QBDownload').click();
                qb_dialog.hide();
            }
        }]
    });
    hint = function(){
        qb_dialog.show();
    };
    qb_dialog.show();
}

var qb_guid = 0; // window.api.getGuid 有可能不返回数据
var getGuid = function () {
    try {
        var guid = window.external.getGuid();
        qb_guid = guid.split('-').join('');
    }catch(e){
        var web_page_extension_id = '{A3C609B3-3E61-4508-8953-117B7286068B}';
        var platform_extension_id = '{420DEFEE-20A8-468C-BFDA-61A09A99325D}';
        var extension;
        try {
            extension = window.getExtension(web_page_extension_id);
            extension.sendMessage(platform_extension_id, {serviceId: "hardware.getGuid", args: []}, function (data) {
                qb_guid = data[0].split('-').join('');
            });
        }catch(e){
            qb_guid = 0;
        }
    }
};
getGuid();


(function(window,$) {
    Page = qv.zero.extend(qv.zero.AbstractPage,{
        userJsonID : 154004,
        preloads : ['AreaSvrSelector'],
        loadExtHandler  : true,
        //vipmonth : 1,
        init : function () {
            Page.superclass.init.apply(this,arguments);
        },
        initEvent : function () {
            Page.superclass.initEvent.apply(this,arguments);
            $('body').on('click','a[href="#"]',function (e) {
                e.preventDefault();
            });
            page.svr = new qv.zero.AreaSvrSelector({
                game: 'mh'
            });           
            if(!!qq.login.getUin()){
                //
            }
            qq.login.bind('login',function(){
                //
            });
            qq.login.bind('logout',function(){
                //
            });
        },
        signin: function (e, act) {
            zUtil.ensureLogin(function () {
                page.svr.show({
                    send: function (args, callb) {
                        zHttp.send({'actid': 154275, area: args.area, roleid: args.roleid}, function (res) {
                            if (res.ret == 0) {
                                zHttp.showResponse(res, res.actid, $.noop);
                            } else if (res.ret == 10002) {
                                qq.login.open();
                            } else if (res.ret == 10001 || res.ret == 10004) {
                                zMsg.alert("活动已经结束，敬请期待更多QQ浏览器特权活动！");
                            } else {
                                zHttp.showResponse(res, res.actid, $.noop);
                            }
                        });
                    }
                });
                api.report("BROWSER.ACTIVITY.MHO_161221.SNGNINCLICK");
            })
        },
        exchange: function(e,act){
            var index = +(act[0]),
                idArr = [154251,154252,154268,154269,154274,154277,154278,154279,154282,154304],
                actid = idArr[index];
            if(index == 8) {
                if(!api.isQQBrowser()){
                    hint();
                    return;
                }
            }
            if(!qb_guid) {
                getGuid();
            }
            zUtil.ensureLogin(function () {
                page.svr.show({
                    send: function (args, callb) {
                        zHttp.send({'actid': actid, area: args.area, roleid: args.roleid,guid: qb_guid}, function (res) {
                            if (res.ret == 0) {
                                zHttp.showResponse(res, res.actid, $.noop);
                            } else if (res.ret == 10002) {
                                qq.login.open();
                            } else if (res.ret == 10001 || res.ret == 10004) {
                                zMsg.alert("活动已经结束，敬请期待更多QQ浏览器特权活动！");
                            } else {
                                zHttp.showResponse(res, res.actid, $.noop);
                            }
                        });
                    }
                });
                api.report("BROWSER.ACTIVITY.MHO_161221.EXCHANGEGIFTSCLICK" + index);
            });
        }
    });
    window.page = new Page();

})(window,jQuery);

//右侧浮动菜单
function subMenu(){
    var Stop = [640, 1560, 2420, 2920];
    var winW = jQuery(window).width();
    var winH = jQuery(window).height();
    var demo = jQuery('#menu');
    var btn = jQuery('#rightNav li');
    var topInit = demo.css('top').replace(/[^\d]/ig,'');
    var flag = false;
    jQuery(window).bind('resize', function () {
        winW = jQuery(window).width();
        winH = jQuery(window).height();
        if(winW >= 1350){
            demo.show();
            if(winW < 1700){
                jQuery('#menu').css({'right':'0','margin-right':'0'});
            }else{
                jQuery('#menu').css({'right':'50%','margin-right':'-860px'});
            }
        }else{
            demo.hide();
        }
    });
    jQuery(window).bind('scroll', function () {
        var _top = jQuery(window).scrollTop();
        var _demoTop = winH/2 - demo.height();
        _demoTop = _demoTop <= 45 ? 45 : _demoTop;
        if(_top >= topInit-_demoTop){
            jQuery('#menu').css({'position':'fixed','top': _demoTop + 'px'});
        }else{
            jQuery('#menu').css({'position':'absolute','top': topInit + 'px'});
        }
        if(flag) return;
        for(var i = 0; i < Stop.length; i++){
            if(_top >= Stop[i] - (winH / 2)){
                btn.eq(i).addClass('active').siblings().removeClass('active');
            }
            if(_top < Stop[0] - (winH / 2)){
                btn.eq(0).addClass('active').siblings().removeClass('active');
            }
        }
    });
    jQuery('#rightNav li:not').bind('click', function () {
        flag = true;
        jQuery(this).addClass('active').siblings('li').removeClass('active');
        var k = jQuery(this).index();
        if(jQuery(window).scrollTop() == Stop[k]) return;
        jQuery('html,body').stop().animate({'scrollTop' : Stop[k] + 'px'},300, function () {
            flag = false;
        });
    });
    jQuery(window).resize();
    jQuery(window).scroll();
}


(function(window,$){
    //头尾初始化
    api.initNav("header","footer",{ //对应header footer div的id
        background:"#424242",  //footer的背景色，常常需要根据页面设计改变颜色 默认：黑色（可选）
        color:"#aaa",  //footer中文字的颜色 默认：白色（可选）
        qblink:"http://dldir1.qq.com/invc/tt/QQBrowser_Setup_DY_MonsterHunter.exe", //下载QB按钮的链接 默认：特权中心QB包（可选）
        report:"BROWSER.ACTIVITY.MHO_161221.QBDOWNLOADCLICK_TOP", //点击流数据上报（可选）
        isTqHide:false //特权LOGO是否显示（可选）
    });
    //右侧随屏滚动菜单
    subMenu();
})(window,jQuery);
