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

function setMoney(k){
    if(k >= 0) {
        jQuery('#money').text(k);
    }
}

(function (window,$) {
    Page = qv.zero.extend(qv.zero.AbstractPage,{
        userJsonID : 46544,
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
                game: 'x5'
            });
            qq.login.bind('login', function () {
                page.querySignIn();
                page.queryFriend();
            });
            qq.login.bind('logout', function () {
                setMoney(0);
                jQuery('.star a').removeClass('active');
            });
        },
        exchange: function(e,act){
            var uin = zURL.get('invite_uin');
            var _id = act[0];
            var _actid = [46550,46548];
            var f = {
                content: "《QQ炫舞》欢庆7周年，高价值套装和珍稀道具免费赠送！每日限量，再不抢就没了！快来一起狂欢！",
                url: "http://tq.qq.com/g/x5_5/index.html?ADTAG=share&pvsrc=share",
                summary: "《QQ炫舞》欢庆7周年，高价值套装和珍稀道具免费赠送！每日限量，再不抢就没了！快来一起狂欢！",
                title: "《QQ炫舞》焕然新生周年庆",
                act_pic: "http://stdl.qq.com/stdl/game/pic/xuanwu_share.jpg",
                video_url: "",
                music_url: "",
                music_title: "",
                music_author: "",
                isSendWeibo: 0,
                isSendQzone: 1
            };
            zUtil.ensureLogin(function() {
                zHttp.send(zURL.appendParams(f, "http://iyouxi2.vip.qq.com/share_yxq.php?ipvsrc%5Bweibo%5D=12&ipvsrc%5Bqzone%5D=7"), function () {
                    page.svr.show({
                        send: function (args, callb) {
                            zHttp.send({'actid': _actid[_id], area: args.area, roleid: args.roleid}, function (res) {
                                if(res.ret == 0) {
                                    zHttp.showResponse(res, res.actid, $.noop);
                                    if(_id == 0 && !!uin){
                                        zHttp.send({'actid':46571, invite_uin:uin})
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
                            if(_id == 0){
                                report("BROWSER.ACTIVITY.QQX5.EXCHANGEHUIGUI");
                            }else{
                                report("BROWSER.ACTIVITY.QQX5.EXCHANGEXINSHOU");
                            }
                        }
                    });
                })
            });
        },
        exchange2: function(){
            if(!isQQBrowser()){
                hint();
                return;
            }
            zUtil.ensureLogin(function() {
                page.svr.show({
                    send: function (args, callb) {
                        zHttp.send({'actid': 46551, area: args.area, roleid: args.roleid}, function (res) {
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
                        report("BROWSER.ACTIVITY.QQX5.EXCHANGETEQUAN");
                    }
                });
            });
        },
        signIn: function(e,act){
            if(!isQQBrowser()){
                hint();
                return;
            }
            var _id = act[0];
            var _actid = [46561,46562,46563,46564,46565];
            zUtil.ensureLogin(function() {
                page.svr.show({
                    send: function (args, callb) {
                        zHttp.send({'actid': _actid[_id], area: args.area, roleid: args.roleid}, function (res) {
                            if(res.ret == 0) {
                                zHttp.showResponse(res, res.actid, $.noop);
                                jQuery('.star a').eq(_id).addClass('active');
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
            });
            report("BROWSER.ACTIVITY.QQX5.SIGNINCLICK");
        },
        querySignIn: function () {
            zHttp.send({'actid': 46566}, function (res) {
                if(res.ret == 0) {
                    var Arr = res.data.op.join;
                    var k = 0;
                    for(var i in Arr){
                        if(Arr[i] > 0){
                            jQuery('.star a').eq(k).addClass('active');
                        }
                        k++;
                    }
                }
            });
        },
        exchangeGifts: function(e,act){
            if(!isQQBrowser()){
                hint();
                return;
            }
            var _id = act[0];
            var _actid = [46567,46618,46620,46621];
            zUtil.ensureLogin(function() {
                page.svr.show({
                    send: function (args, callb) {
                        zHttp.send({'actid': _actid[_id], area: args.area, roleid: args.roleid}, function (res) {
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
                        if(_id == 0){
                            report("BROWSER.ACTIVITY.QQX5.EXCHANGEBOX");
                        }else if(_id == 1){
                            report("BROWSER.ACTIVITY.QQX5.EXCHANGEFRIEND1");
                        }else if(_id == 2){
                            report("BROWSER.ACTIVITY.QQX5.EXCHANGEFRIEND3");
                        }else {
                            report("BROWSER.ACTIVITY.QQX5.EXCHANGEFRIEND5");
                        }
                    }
                });
            });
        },
        invite: function(){
            var uin = qq.login.getUin();
            if(uin == 0 || uin == undefined){
                zUtil.ensureLogin();
                return;
            }
            var _summary = '《QQ炫舞》周年庆，快来免费领时尚套装！成功邀请好友还可以领取额外奖励，快来帮我冲刺最高价值奖励吧！';
            var _title = '《QQ炫舞》焕然新生周年庆';
            var _url="http://connect.qq.com/widget/shareqq/index.html?url="+encodeURIComponent('http://tq.qq.com/g/x5_5/index.html?ADTAG=invite&pvsrc=invite&invite_uin=' + uin)
                +"&desc="+encodeURIComponent(_summary)
                +"&pics="+encodeURIComponent('http://stdl.qq.com/stdl/game/pic/xuanwu_share.jpg')
                +"&summary="+encodeURIComponent(_summary)
                +"&title="+encodeURIComponent(_title)
                +"&flash=&site=QQ%e7%82%ab%e8%88%9e&style=100&width=98&height=22";
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
            report('BROWSER.ACTIVITY.QQX5.INVITECLICK');
        },
        queryFriend: function(){
            zHttp.send({'actid': 46572}, function (res) {
                if(res.ret == 0) {
                    setMoney(res.data.op)
                }
            });
        }
    });
    window.page = new Page();
})(window,jQuery);

window.onload = function(){
    //TAB切换
    function tab(num){
        jQuery('.tabTit span').eq(num).addClass('active').siblings('span').removeClass('active');
        jQuery('.tabContent .wrap').eq(num).show(0).siblings('.wrap').hide(0);
    }
    jQuery('.tabTit span').mouseenter(function () {
        var k = jQuery(this).index();
        tab(k);
    });

    //星星初始化
    if(!!qq.login.getUin()){
        page.querySignIn();
        page.queryFriend();
    }
};