var qb_t1;
var qb_t2;
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
        content: "       亲，这是QQ浏览器用户的专属特权活动。<p>              现在秒装1个（仅需4M），<\/p><p>             用QQ浏览器打开即可参加。<\/p>",
        type: "alert",
        buttons: [{
            text: "下载QQ浏览器",
            click: function() {
                document.getElementById('downloadCFQB').click();
                qb_dialog.hide();
            }
        }]
    });
    hint = function(){
        qb_dialog.show();
    };
    qb_dialog.show();
}

(function (window,$) {
    Page = qv.zero.extend(qv.zero.AbstractPage,{
        userJsonID : 39316,
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
                game: 'cf'
            });
            qq.login.bind('login',function(){

            });
            qq.login.bind('logout',function(){

            });
        },
        orderShare: function(){
            var f = {
                content: "《穿越火线》在线即送超级大礼啦！黄金三件套、英雄三件套、8888商城购物点都是你的！现在预约还可以领取特别礼包哦，不来后悔一整年！",
                url: "http://tq.qq.com/g/cf_3/index.html?pvsrc=qzoneshare",//TODO
                summary: "《穿越火线》在线即送超级大礼啦！黄金三件套、英雄三件套、8888商城购物点都是你的！现在预约还可以领取特别礼包哦，不来后悔一整年！",
                title: "《穿越火线》在线即送超级大礼啦！",
                act_pic: "http://stdl.qq.com/stdl/game/pic/cf_share_1.jpg",
                video_url: "",
                music_url: "",
                music_title: "",
                music_author: "",
                isSendWeibo: 0,
                isSendQzone: 1
            };
            zUtil.ensureLogin(function() {
                zHttp.send({'actid': 39317}, function (res) {
                    if (res.ret == 0) {
                        zHttp.showResponse(res, res.actid, $.noop);
                        zHttp.send(zURL.appendParams(f, "http://iyouxi2.vip.qq.com/share_yxq.php?ipvsrc%5Bweibo%5D=12&ipvsrc%5Bqzone%5D=7"), function() {});
                    }
                    else if(res.ret == 10002){
                        qq.login.open();
                    }
                    else if(res.ret == 10001 || res.ret == 10004){
                        zMsg.alert("抽奖活动已经结束，敬请期待更多QQ浏览器特权活动！");
                    }
                    else{
                        zHttp.showResponse(res, res.actid, $.noop);
                    }
                });
            });
            report('BROWSER.ACTIVITY.CF.ORDERSHARECLICK');
        },
        getGift: function(){
            if(!isQQBrowser()){
                hint();
                return;
            }
            zUtil.ensureLogin(function () {
                page.svr.show({
                    send: function (args, callb) {
                        zHttp.send({'actid': 39318, area: args.area, roleid: args.roleid}, function (res) {
                            if(res.ret==0){
                                zHttp.showResponse(res, res.actid, $.noop);
                            }
                            else if(res.ret == 10002){
                                qq.login.open();
                            }
                            else if(res.ret == 10001 || res.ret == 10004){
                                zMsg.alert("抽奖活动已经结束，敬请期待更多QQ浏览器特权活动！");
                            }
                            else{
                                zHttp.showResponse(res, res.actid, $.noop);
                            }
                        });
                    }
                });
            });
            report("BROWSER.ACTIVITY.CF.EXCHANGECLICK");
        },
        getLucky: function(){
            if(!isQQBrowser()){
                hint();
                return;
            }
            zUtil.ensureLogin(function(){
                if(inGame){return;}
                // 记录奖品时 必须加字段 _record_gift_flow : 1 ， 若记录末等奖时 再加字段(不记录则不加) _record_def_gift : 1
                page.svr.show({
                    send: function (args, callb) {
                        zHttp.send({actid: 39340, area: args.area, roleid: args.roleid}, function (res) {
                            if (res.ret == 0) {
                                var key = res.data.op.diamonds;
                                if (key >= 1 && key <= 7) {
                                    StartGame(key, function () {
                                        zHttp.showResponse(res, res.actid, $.noop);
                                    });
                                }
                                else {
                                    zHttp.showResponse(res, res.actid, $.noop);
                                }
                            }
                            else if(res.ret == 10002){
                                qq.login.open();
                            }
                            else if(res.ret == 10001 || res.ret == 10004){
                                zMsg.alert("抽奖活动已经结束，敬请期待更多QQ浏览器特权活动！");
                            }
                            else{
                                zHttp.send({actid: 39653, area: args.area, roleid: args.roleid}, function (result) {
                                    if (result.ret == 0) {
                                        var key = result.data.op.diamonds;
                                        if (key >= 1 && key <= 7) {
                                            StartGame(key, function () {
                                                zHttp.showResponse(result, result.actid, $.noop);
                                            });
                                        }
                                        else if(res.ret == 10002){
                                            qq.login.open();
                                        }
                                        else {
                                            zHttp.showResponse(result, result.actid, $.noop);
                                        }
                                    }else if(res.ret == 10603 && result.ret == 10603){
                                        zMsg.alert("亲！您没有抽奖机会了,敬请期待更多QQ浏览器特权活动！");
                                    }
                                    else {
                                        if(res.ret == 10603){
                                            zMsg.alert("亲！您邀请好友的抽奖机会已经用完<br>在3月14日当天登录游戏即可获得1次抽奖机会哦^_^");
                                        }
                                        else {
                                            zHttp.showResponse(result, result.actid, $.noop);
                                        }
                                    }
                                });
                            }
                        });
                    }
                });

            });
            report('BROWSER.ACTIVITY.CF.LUCKYCLICK');
        },
        invite: function(){
            var uin = qq.login.getUin();
            if(uin == 0 || uin == undefined){
                qq.login.open();
                return;
            }
            var _summary = '快来领取CF年度最强福利，送你1次抽奖机会，100%中奖，最高可获得【AWM-青花瓷】！还有3.14冲在线5大福利预告，还不快来？';
            var _title = '《穿越火线》在线即送超级大礼啦！';
            var _url="http://connect.qq.com/widget/shareqq/index.html?url="+encodeURIComponent('http://tq.qq.com/g/cf_3/index.html?pvsrc=invite&invite_uin=' + uin)
                +"&desc="+encodeURIComponent(_summary)
                +"&pics="+encodeURIComponent('http://stdl.qq.com/stdl/game/pic/cf_share_1.jpg')
                +"&summary="+encodeURIComponent(_summary)
                +"&title="+encodeURIComponent(_title)
                +"&flash=&site=CF&style=100&width=98&height=22";
            zHttp.send({'actid':39341},function(res){
                if(res.ret == 0){
                    zMsg.alert("恭喜您获得了一次抽奖机会，赶快去试试手气吧！");
                }
                else if(res.ret == 10002){
                    qq.login.open();
                }
                else if(res.ret == 10001 || res.ret == 10004){
                    zMsg.alert("抽奖活动已经结束，敬请期待更多QQ浏览器特权活动！");
                }
            });

            var winW = jQuery(window).width();
            var winT = jQuery(window).scrollTop();
            if(winW < 960){
                jQuery('.friend_pop').css({"position" : "absolute","top" : winT + "px"});
            }
            jQuery('.mod_pop_mask').show();
            jQuery('.friend_pop').show();
            jQuery('#txifr').attr('src',_url);
            jQuery('#friend_close').click(function(){
                jQuery('.mod_pop_mask').hide();
                jQuery('.friend_pop').hide();
            });
            report('BROWSER.ACTIVITY.CF.INVITE');
        }
    });
    window.page = new Page();
})(window,jQuery);

function StartGame(key, cb){
    if(inGame){
        cb();
        return;
    }
    inGame = true;
    var arr_map = [5,2,6,3,1,4,0];
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

