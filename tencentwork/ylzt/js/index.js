
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
            window.isQB = true;
            window.isChrometab = false;
        }catch(e){
            version = window.external.getbrowserversion() || 1;
            window.isChrometab = true;
            window.isQB = false;
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
                document.getElementById('downloadQQBrowserBtn').click();
                qb_dialog.hide();
                report("BROWSER.ACTIVITY.YLZT.QBDOWNLOAD");
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
        userJsonID : 43899,
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
                game: 'yl'
            });
        },
        exchange: function(e,act){
            var index = act[0];
            var isQB = act[1];
            var arr = [43900, 43906, 43932];
            var id = arr[index];
            if(!!isQB){
                if(!isQQBrowser()){
                    hint();
                    return;
                }
            }
            zUtil.ensureLogin(function () {
                page.svr.show({
                    send: function (args, callb) {
                        zHttp.send({'actid': id, area: args.area, roleid: args.roleid}, function (res) {
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
                if(index==0) {
                    report("BROWSER.ACTIVITY.YLZT.XINSHOUCHANGECLICK");
                } else if(index==1){
                    report("BROWSER.ACTIVITY.YLZT.HUIGUICHANGECLICK");
                }else{
                    report("BROWSER.ACTIVITY.YLZT.TEQUANCHANGECLICK");
                }
            });
        },
        getLucky : function () {
            if (!isQQBrowser()) {
                hint();
                return;
            }
            zUtil.ensureLogin(function () {
                page.svr.show({
                    send: function (args, callb) {
                        zHttp.send({actid: 43934, area: args.area, roleid: args.roleid},function(json){
                            if(json.ret == 10002){
                                qq.login.open();
                                return;
                            }
                            else if(json.ret == 10001 || json.ret == 10004){
                                zMsg.alert("抽奖活动已经结束，敬请期待更多QQ浏览器特权活动！");
                                return;
                            }
                            zHttp.send({actid: 43949, area: args.area, roleid: args.roleid}, function (res) {
                                if(res.ret == 0){
                                    zHttp.showResponse(res, res.actid, $.noop);
                                }
                                else if(res.ret == 10002){
                                    qq.login.open();
                                }
                                else if(res.ret == 10001 || res.ret == 10004){
                                    zMsg.alert("抽奖活动已经结束，敬请期待更多QQ浏览器特权活动！");
                                }
                                else if(json.ret == 29114 && res.ret == 20801){
                                    zMsg.alert("亲，您今天还没有登录游戏哦~<br>登录游戏后即可获得一次抽奖机会^_^");
                                }
                                else{
                                    zHttp.showResponse(res, res.actid, $.noop);
                                }
                            });
                        });
                    }
                });
                report("BROWSER.ACTIVITY.YLZT.LUCKYGIFTCLICK");

            });
        },
        shareQZ: function(){
            var f = {
                content: "我正在玩腾讯第一国战网游《御龙在天》，送你两个礼包，快来和我并肩作战！",
                url: "http://tq.qq.com/g/yulong/index.html?pvsrc=qzoneshare",
                summary: "我正在玩腾讯第一国战网游《御龙在天》，送你两个礼包，快来和我并肩作战！",
                title: "《御龙在天》--QQ浏览器特权联营",
                act_pic: "http://stdl.qq.com/stdl/game/pic/ylzt_share.jpg",
                video_url: "",
                music_url: "",
                music_title: "",
                music_author: "",
                isSendWeibo: 0,
                isSendQzone: 1
            };
            zUtil.ensureLogin(function() {
                zHttp.send(zURL.appendParams(f, "http://iyouxi2.vip.qq.com/share_yxq.php?ipvsrc%5Bweibo%5D=12&ipvsrc%5Bqzone%5D=7"), function() {
                    zHttp.send({'actid':43935}, function(res) {
                        if(res.ret == 10002){
                            qq.login.open();
                        }
                        else if(res.ret == 10001 || res.ret == 10004){
                            zMsg.alert("抽奖活动已经结束，敬请期待更多QQ浏览器特权活动！");
                        }
                        else{
                            zHttp.showResponse(res, res.actid, $.noop);
                        }
                    });
                    report('BROWSER.ACTIVITY.YLZT.SHARECLICK');
                });
            });
        },
        sendQQ: function(){
            var uin = qq.login.getUin();
            if(uin == 0 || uin == undefined){
                qq.login.open();
                return;
            }
            var _summary = '嘿，我正在玩腾讯第一国战网游《御龙在天》，发现这个专区可以免费领礼包，快来一起玩吧！';
            var _title = '《御龙在天》--QQ浏览器特权联营';
            var _url="http://connect.qq.com/widget/shareqq/index.html?url="+encodeURIComponent('http://tq.qq.com/g/yulong/index.html?pvsrc=invite&invite_uin=' + uin)
                +"&desc="+encodeURIComponent(_summary)
                +"&pics="+encodeURIComponent('')
                +"&summary="+encodeURIComponent(_summary)
                +"&title="+encodeURIComponent(_title)
                +"&flash=&site=CF&style=100&width=98&height=22";
            zHttp.send({'actid':43936},function(res){
                if(res.ret == 0){
                    zMsg.show("恭喜您获得了一次抽奖机会，赶快去试试手气吧！");
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
            report('BROWSER.ACTIVITY.YLZT.SENDQQ');
        }
    });
    window.page = new Page();
})(window,jQuery);

window.onload = function () {
    //视频初始化；
    window.video = new tvp.VideoInfo();
    video.setVid("v015192hwz0");
    window.player = new tvp.Player();
    player.create({
        width: 362,
        height: 197,
        video: video,
        modId: "videoBox", //mod_player是刚刚在页面添加的div容器
        autoplay: false,  //是否自动播放
        flashWmode: "transparent",
        vodFlashSkin: "http://imgcache.qq.com/minivideo_v1/vd/res/skins/TencentPlayerMiniSkin.swf" //是否调用精简皮肤，不使用则删掉此行代码
    });
    //TAB切换
    if(isQQBrowser()){
        tab(0);
    }else{
        tab(2);
    }
    jQuery('.tab-title a').mouseenter(function () {
        var n = jQuery(this).index();
        tab(n);
    });
    //产品展示
    DY_scroll('#showWrap','#showSlide','#show_l','#show_r',3,true);
};

//tab 切换 函数
function tab(i){
    jQuery('.tab-title a').eq(i).addClass('active').siblings().removeClass('active');
    jQuery('.tab-content .wrap').eq(i).show().siblings().hide();
}

//奖品展示 函数
function DY_scroll(wraper,img,prev,next,speed,or){// or为true为自动播放，不加此参数或false就默认不自动，speed自动播放的间隔时间
    var flag = "left";
    var wraper = jQuery(wraper);
    var prev = jQuery(prev);
    var next = jQuery(next);
    var img = jQuery(img);
    var w = img.find('li').outerWidth(true);
    var s = speed;
    next.click(function(){
        img.animate({'margin-left':-w}/*,1500,'easeOutBounce'*/,function(){
            img.find('li').eq(0).appendTo(img);
            img.css({'margin-left':0});
        });
        flag = "left";
    });
    prev.click(function(){
        img.find('li:last').prependTo(img);
        img.css({'margin-left':-w});
        img.animate({'margin-left':0}/*,1500,'easeOutBounce'*/);
        flag = "right";
    });
    if (or == true){
        ad = setInterval(function() { flag == "left" ? next.click() : prev.click()},s*1000);
        wraper.hover(function(){clearInterval(ad);},function(){ad = setInterval(function() {flag == "left" ? next.click() : prev.click()},s*1000);});
    }
}
