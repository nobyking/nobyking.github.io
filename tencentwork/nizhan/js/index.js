/**
 * Created by v_zmengren on 2015/4/27.
 */
var inGame = false;
function report(hottagValue) {
    window.setTimeout(function () {
        pgvSendClick({hottag: hottagValue});
    }, 100);
}
if(typeof(pgvMain) == 'function') {
    pgvMain("pathtrace", {pathStart: true, tagParamName: "ADTAG", useRefUrl: true, override: true, careSameDomainRef: false});
}

function getQBVersion() {
    var version = 0;
    try{
        try{
            version = window.external.getVersion() || 1;
        }catch(e){
            version = window.external.getbrowserversion() || 1;
        }
    }catch(e){
        version = /QQBrowser/.test(navigator.userAgent) || "100.0.0.0";
    }
    return version;
}

function isQQBrowser() {
    var version = getQBVersion();
    var result = (version != "100.0.0.0") && (version != 0);
    isQQBrowser = function () {
        return result;
    };
    return result;
}

function hint(){
    var qb_dialog = new qv.zero.Dialog({
        title: "QQ浏览器用户专享",
        content: "　　 亲，这是QQ浏览器用户的专属特权活动。<p>　　极速安装一个，用QQ浏览器打开即可参加。<\/p>",
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

//抽奖
function StartGame(key, cb){
    if(inGame){
        cb();
        return;
    }
    inGame = true;
    var arr_map = [5,0,2,4,6,1,3];
    var arr_num = arr_map.length;
    key = arr_map[key-1];
    index=0;
    prevIndex=0;
    cycle=0;
    Speed=300;
    EndIndex=0;
    quick=0;
    EndCycle=0;

    flag=false;
    EndIndex=Math.floor(Math.random()*arr_num+1);
    circle_box=[];
    for(var i=0; i<arr_num;i++){
        circle_box.push(document.getElementById("lucky-box-"+i));
        circle_box[i].className = 'lucky-box';
    }

    EndCycle=1;
    Time = setInterval(_Star(key,cb),Speed);
}

function _Star(key, cb){
    return function(){
        Star(key,cb);
    }
}

function Star(key,cb){
    if(flag==false){
        if(quick==5){
            clearInterval(Time);
            Speed=100;
            Time=setInterval(_Star(key,cb),Speed);
        }

        if((cycle==EndCycle+1) && (index==EndIndex)){
            clearInterval(Time);
            Speed=400;
            flag=true;
            Time=setInterval(_Star(key,cb),Speed);
        }
    }

    if(index >= circle_box.length){
        index=0;
        cycle++;
    }
    if(flag==true && (index==key)){
        quick=0;
        clearInterval(Time);
        setTimeout(function(){
            inGame = false;
            cb();
        },1000);
    }

    if(index>0)
        prevIndex=index-1;
    else{
        prevIndex=circle_box.length-1;
    }
    circle_box[prevIndex].className = 'lucky-box';
    circle_box[index].className = 'lucky-box active';

    index++;
    quick++;
}

(function (window,$) {
    Page = qv.zero.extend(qv.zero.AbstractPage,{
        userJsonID : 45902,
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
                game: 'nz'
            });
        },
        exchange: function(){
            var uin = zURL.get('invite_uin');
            zUtil.ensureLogin(function () {
                page.svr.show({
                    send: function (args, callb) {
                        zHttp.send({'actid': 45903, area: args.area, roleid: args.roleid}, function (res) {
                            if(res.ret == 0) {
                                zHttp.showResponse(res, res.actid, $.noop);
                                if(!!uin){
                                    zHttp.send({'actid':45907, invite_uin:uin})
                                }
                            }else if(res.ret == 10002){
                                qq.login.open();
                            }else if (res.ret == 10001 || res.ret == 10004) {
                                zMsg.alert("活动已经结束，敬请期待更多QQ浏览器特权活动！");
                            }
                            else{
                                zHttp.showResponse(res, res.actid, $.noop);
                            }
                        });
                    }
                });
                report("BROWSER.ACTIVITY.NIZHAN.EXCHANGEXINSHOU");
            });
        },
        exchange2: function(){
            if(!isQQBrowser()){
                hint();
                return;
            }
            zUtil.ensureLogin(function () {
                page.svr.show({
                    send: function (args, callb) {
                        zHttp.send({'actid': 45904, area: args.area, roleid: args.roleid}, function (res) {
                            if(res.ret == 0) {
                                zHttp.showResponse(res, res.actid, $.noop);
                            }else if(res.ret == 10002){
                                qq.login.open();
                            }else if (res.ret == 10001 || res.ret == 10004) {
                                zMsg.alert("活动已经结束，敬请期待更多QQ浏览器特权活动！");
                            }
                            else{
                                zHttp.showResponse(res, res.actid, $.noop);
                            }
                        });
                    }
                });
                report("BROWSER.ACTIVITY.NIZHAN.EXCHANGETEQUAN");
            });
        },
        invite: function(){
            var uin = qq.login.getUin();
            if(uin == 0 || uin == undefined){
                qq.login.open();
                return;
            }
            var _summary = '逆战特权活动送最新武器啦，快来抢吧！好友成功领取礼包还可以让我获得一次神兽武器抽奖机会，求赏脸支持！';
            var _title = 'QQ浏览器--《逆战》K爆雪国尸兄';
            var _url="http://connect.qq.com/widget/shareqq/index.html?url="+encodeURIComponent('http://tq.qq.com/g/nz_5/index.html?pvsrc=invite&invite_uin=' + uin)
                +"&desc="+encodeURIComponent(_summary)
                +"&pics="+encodeURIComponent('http://stdl.qq.com/stdl/game/pic/nz_share4.jpg')
                +"&summary="+encodeURIComponent(_summary)
                +"&title="+encodeURIComponent(_title)
                +"&flash=&site=CF&style=100&width=98&height=22";
            var winW = jQuery(window).width();
            var winT = jQuery(window).scrollTop();
            if(winW < 960){
                jQuery('.friend_pop').css({"position" : "absolute","top" : winT + "px","margin-top":"0"});
            }
            jQuery('.mod_pop_mask').show();
            jQuery('.friend_pop').show();
            jQuery('#txifr').attr('src',_url);
            jQuery('#friend_close').click(function(){
                jQuery('.mod_pop_mask').hide();
                jQuery('.friend_pop').hide();
            });
            report('BROWSER.ACTIVITY.NIZHAN.INVITECLICK');
        },
        shareQZ: function(){
            var f = {
                content: "《逆战》最新版本上线，快来免费领取最强杀伤力武器【火神暴君】，一起去K爆雪国尸兄！",
                url: "http://tq.qq.com/g/nz_5/index.html?ADTAG=share&pvsrc=share",
                summary: "《逆战》最新版本上线，快来免费领取最强杀伤力武器【火神暴君】，一起去K爆雪国尸兄！",
                title: "QQ浏览器--《逆战》K爆雪国尸兄",
                act_pic: "http://stdl.qq.com/stdl/game/pic/nz_share4.jpg",
                video_url: "",
                music_url: "",
                music_title: "",
                music_author: "",
                isSendWeibo: 0,
                isSendQzone: 1
            };
            zUtil.ensureLogin(function() {
                zHttp.send(zURL.appendParams(f, "http://iyouxi2.vip.qq.com/share_yxq.php?ipvsrc%5Bweibo%5D=12&ipvsrc%5Bqzone%5D=7"), function() {
                    zHttp.send({'actid':45906}, function(res) {
                        if(res.ret == 0) {
                            zHttp.showResponse(res, res.actid, $.noop);
                        }else{
                            zHttp.showResponse(res, res.actid, $.noop);
                        }
                    });
                });
            });

            report('BROWSER.ACTIVITY.NIZHAN.SHARECLICK');
        },
        getLucky: function(){
            if(!isQQBrowser()){
                hint();
                return;
            }
            zUtil.ensureLogin(function(){
                if(inGame) return false;
                page.svr.show({
                    send: function (args, callb) {
                        // 记录奖品时 必须加字段 _record_gift_flow : 1 ， 若记录末等奖时 再加字段(不记录则不加) _record_def_gift : 1
                        zHttp.send({actid: 45908, area: args.area, roleid: args.roleid}, function (res) {
                            jQuery('.lucky-box').children('.lucky_show').fadeOut(0);
                            if (res.ret == 0){
                                try{
                                    //转起来
                                    var key_map = [5,0,2,4,6,1,3];
                                    var key = res.data.op.diamonds;
                                    if(key >= 1 && key <= 7){
                                        StartGame(key, function () {
                                            zHttp.showResponse(res, res.actid, $.noop);
                                            jQuery('.lucky-box').eq(key_map[key-1]).children('.lucky_show').fadeIn(1000);
                                        })
                                    }else{
                                        zHttp.showResponse(res, res.actid, $.noop);
                                    }
                                }
                                catch (e){
                                    zHttp.showResponse(res, res.actid, $.noop);
                                }

                            }else if (res.ret == 10002) {
                                qq.login.open();
                            }
                            else if (res.ret == 10001 || res.ret == 10004) {
                                zMsg.alert("活动已经结束，敬请期待更多QQ浏览器特权活动！");
                            }
                            else{
                                zHttp.showResponse(res, res.actid, $.noop);
                            }
                        });
                    }
                });
            });
            report('BROWSER.ACTIVITY.NIZHAN.LUCKYCLICK');
        }
    });
    window.page = new Page();
})(window,jQuery);

window.onload = function(){
    //修复登录跳转页面底部的BUG
    zUtil.ensureLogin = function (fn,context){
        var me=this;
        if(!qq.login.getUin()){
            qq.login.open(function(){
                OZ&&OZ.report({operID:1,operType:"登录",operDesc:"登录访问页面"});
                fn.call(context||me)
            });
            var loginTop = window.scrollY;
            setTimeout(function(){
                window.scroll(0,loginTop);
            },300);
            return false
        }else{
            return fn.call(context||me)}
    };
    //banner按钮hover
    jQuery('.Bbtns a').hover(function () {
        jQuery(this).parent().addClass('hover');
    },function () {
        jQuery(this).parent().removeClass('hover');
    });

    //右侧随屏滚动菜单
    subMenu();

    /*抽奖*/
    /*jQuery('.getLucky').click(function () {
        var key = 3;
        StartGame(key, function () {
            alert(key);
            jQuery('.lucky-box').eq(key - 1).children('.lucky_show').fadeIn(500);
        })
    });*/
};
function subMenu(){
    var Stop = [], Wheight = 0;
    for(var i = 0; i < 3; i++){
        Stop[i] = document.getElementById('gifts_' + parseInt(i + 1)).offsetTop;
    }
    Wheight = document.documentElement.clientHeight;
    jQuery(window).bind('resize', function () {
        var winW = jQuery(window).width();
        if(winW >= 1280){
            jQuery('#menu').show();
            if(winW < 1440){
                jQuery('#menu').css({'right':'0','margin-right':'5px'});
            }else{
                jQuery('#menu').css({'right':'50%','margin-right':'-700px'});
            }
        }else{
            jQuery('#menu').hide();
        }
    });
    jQuery(window).bind('scroll', function () {
        var _top =jQuery(window).scrollTop();
        if(_top >= 525){
            jQuery('#menu').css({'position':'fixed','top':'45px'});
        }else{
            jQuery('#menu').css({'position':'absolute','top':'570px'});
        }
        for(var i = 0; i < Stop.length; i++){
            if(_top >= Stop[i] - (Wheight / 2)){
                jQuery('#rightNav li:not(:first)').eq(i).addClass('active').siblings().removeClass('active');
            }
            if(_top < Stop[0] - (Wheight / 2)){
                jQuery('#rightNav li:not(:first)').eq(0).addClass('active').siblings().removeClass('active');
            }
        }
    });
    jQuery('#rightNav li:not(:first)').bind('click', function () {
        var k = jQuery(this).index() - 1;
        jQuery('html,body').animate({'scrollTop' : Stop[k] - 45 + 'px'},600);
        //jQuery(window).scrollTop(parseInt());
    });
    jQuery(window).resize();
    jQuery(window).scroll();
}