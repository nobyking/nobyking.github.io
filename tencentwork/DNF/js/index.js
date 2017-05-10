
var systemTime = 0;

function report(hottagValue) {
    window.setTimeout(function () {
        pgvSendClick({hottag: hottagValue});
    }, 100);
}
if(typeof(pgvMain) == 'function') {
    pgvMain("pathtrace", {pathStart: true, tagParamName: "ADTAG", useRefUrl: true, override: true, careSameDomainRef: false});
}

//文字滚动 竖
function autoScroll(div, ul, ul2){
    var divO = document.getElementById(div);
    var ulO = document.getElementById(ul);
    var ulO2 = document.getElementById(ul2);
    ulO2.innerHTML = ulO.innerHTML;
    qb_t2 = setInterval(function(){
        if(ulO2.offsetTop-divO.scrollTop<=0)
            divO.scrollTop-=ulO.offsetHeight;
        else{
            divO.scrollTop++ ;
        }

    },100);
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
                document.getElementById('downloadQBBtn').click();
                qb_dialog.hide();
            }
        }]
    });
    hint = function(){
        qb_dialog.show();
    };
    qb_dialog.show();
}


//剩余礼券数量
function setMoneyCount(num){
    var me = jQuery('#money');
    var k = 0;
    if(num === '++'){
        k = parseInt(me.text()) + 1;
    } else if (num === '--'){
        k = parseInt(me.text()) - 1;
    } else if(!isNaN(num)){
        k = num;
    }
    if(k < 0){
        k = 0;
    }
    me.text(k);
}

//抽奖动画
var index=0,
    prevIndex=0,
    Speed=300,
    Time,
    EndIndex=0,
    cycle=0,
    EndCycle=0,
    flag=false,
    quick= 0,
    circle_box,
    padding_img,
    inGame = false,
    oddClassName=[];
function StartGame(key, cb){
    if(inGame){
        cb();
        return;
    }
    inGame = true;
    var arr_map = [0,1,4,3,2];
    var arr_len = arr_map.length;
    key = arr_map[key-1];
    index=0;
    prevIndex=0;
    cycle=0;
    Speed=300;
    EndIndex=0;
    quick=0;
    EndCycle=0;
    flag=false;
    EndIndex=Math.floor(Math.random()*arr_len+1);
    circle_box=[];
    for(var i=0; i<arr_len;i++){
        circle_box.push(document.getElementById("lucky_box_"+i));
        if(oddClassName.length  < arr_len){
            oddClassName[i] = circle_box[i].className;
        }
        circle_box[i].className = oddClassName[i];
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
            Speed=70;
            Time=setInterval(_Star(key,cb),Speed);
        }

        if((cycle==EndCycle+1) && (index==EndIndex)){
            clearInterval(Time);
            Speed=300;
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
    circle_box[prevIndex].className = oddClassName[prevIndex];
    circle_box[index].className = oddClassName[index] + " active";

    index++;
    quick++;
}

(function (window,$) {
    Page = qv.zero.extend(qv.zero.AbstractPage,{
        userJsonID : 50678,
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
                game: 'dnf'
            });
            if(!!qq.login.getUin()) {
                page.querySignIn();
            }
            qq.login.bind('login', function () {
                page.querySignIn();
            });
            qq.login.bind('logout', function () {
                setMoneyCount(0);
            });
        },
        //签到
        signIn: function() {
            if(!isQQBrowser()) {
                hint();
                return;
            }
            zUtil.ensureLogin(function() {
                page.svr.show({
                    send: function (args, callb) {
                        zHttp.send({'actid':50689, area: args.area, roleid: args.roleid}, function (res) {
                            if (res.ret == 0){
                                zHttp.showResponse(res, res.actid, $.noop);
                                setMoneyCount('++');
                            } else if (res.ret == 10002){
                                qq.login.open();
                            } else if (res.ret == 10001 || res.ret == 10004){
                                zMsg.alert("活动已经结束，敬请期待更多QQ浏览器特权活动！");
                            } else {
                                zHttp.showResponse(res, res.actid, $.noop);
                            }
                        });
                        report('BROWSER.ACTIVITY.DNF.SIGNINCLICK');
                    }
                });
            });
        },
        //查询签到天数
        querySignIn: function() {
            zUtil.ensureLogin(function () {
                zHttp.send({'actid':50706}, function (res) {
                    if(res.ret == 0){
                        var k = res.data.op;
                        setMoneyCount(k);
                        //预约按钮
                        systemTime = parseInt(qv.date.format("Ymd", res.time * 1000));
                        if (systemTime >= 20150715) {
                            jQuery('.baoxiang_4 .btn_yuyue').hide();
                            jQuery('.baoxiang_4 .btn_exchange').show();
                        } else {
                            jQuery('.baoxiang_4 .btn_yuyue').show();
                            jQuery('.baoxiang_4 .btn_exchange').hide();
                        }
                    }
                });
            });
        },
        //领取签到礼包、预约礼包
        exchange: function(e, act) {
            if(!isQQBrowser()){
                hint();
                return;
            }
            var index = act[0];
            var arr = [50703, 50704, 50705, 50747];
            var id = arr[index];
            zUtil.ensureLogin(function () {
                page.svr.show({
                    send: function (args, callb) {
                        zHttp.send({'actid': id, area: args.area, roleid: args.roleid}, function (res) {
                            if (res.ret == 0){
                                zHttp.showResponse(res, res.actid, $.noop);
                            } else if (res.ret == 10002){
                                qq.login.open();
                            } else if (res.ret == 10001 || res.ret == 10004){
                                zMsg.alert("活动已经结束，敬请期待更多QQ浏览器特权活动！");
                            } else {
                                zHttp.showResponse(res, res.actid, $.noop);
                            }
                        });
                    }
                });
                if (index == 0) {
                    report("BROWSER.ACTIVITY.DNF.SIGNINGIFTS1CLICK");
                } else if (index == 1) {
                    report("BROWSER.ACTIVITY.DNF.SIGNINGIFTS3CLICK");
                } else if (index == 2) {
                    report("BROWSER.ACTIVITY.DNF.SIGNINGIFTS7CLICK");
                } else if (index == 3) {
                    report("BROWSER.ACTIVITY.DNF.APPOINTGIFTSCLICK");
                }
            });
        },
        //领取新手、回归、特权礼包
        exchange2: function(e,act) {
            var isQB = act[1];
            if(isQB == 'true'){
                if(!isQQBrowser()) {
                    hint();
                    return;
                }
            }
            var index = act[0];
            var arr = [50679, 50680, 50681];
            var id = arr[index];
            var uin = zURL.get('invite_uin');
            zUtil.ensureLogin(function () {
                page.svr.show({
                    send: function (args, callb) {
                        zHttp.send({'actid': id, area: args.area, roleid: args.roleid}, function (res) {
                            if (res.ret == 0){
                                if(index == 0 && !!uin){
                                    zHttp.send({'actid':50715, invite_uin:uin})
                                }
                                zHttp.showResponse(res, res.actid, $.noop);
                            } else if (res.ret == 10002){
                                qq.login.open();
                            } else if (res.ret == 10001 || res.ret == 10004){
                                zMsg.alert("活动已经结束，敬请期待更多QQ浏览器特权活动！");
                            } else {
                                zHttp.showResponse(res, res.actid, $.noop);
                            }
                        });
                    }
                });
                if(index == 0) {
                    report("BROWSER.ACTIVITY.DNF.XINSHOUCLICK");
                } else if(index == 1) {
                    report("BROWSER.ACTIVITY.DNF.HUIGUICLICK");
                } else if(index == 2) {
                    report("BROWSER.ACTIVITY.DNF.TEQUANCLICK");
                }
            });
        },
        //预约
        appoint: function() {
            zUtil.ensureLogin(function () {
                zHttp.send({'actid':50712}, function (res){
                    if(res.ret == 0){
                        zHttp.showResponse(res, res.actid, $.noop);
                    } else if (res.ret == 10002){
                        qq.login.open();
                    } else if (res.ret == 10001 || res.ret == 10004){
                        zMsg.alert("活动已经结束，敬请期待更多QQ浏览器特权活动！");
                    } else {
                        zHttp.showResponse(res, res.actid, $.noop);
                    }
                });
                report("BROWSER.ACTIVITY.DNF.APPOINTCLICK");
            });
        },
        //抽奖
        getLucky: function() {
            if(!isQQBrowser()){
                hint();
                return;
            }
            zUtil.ensureLogin(function(){
                // _record_def_gift 为1时记录末等奖的奖品  ，不记录则不填写此字段
                page.svr.show({
                    send: function (args, callb) {
                        zHttp.send({'actid':50728, area: args.area, roleid: args.roleid},function (json) {
                            zHttp.send({'actid': 50716, area: args.area, roleid: args.roleid}, function (res) {
                                if (res.ret == 0) {
                                    try {
                                        var key = res.data.op.diamonds;
                                        if (key >= 1 && key <= 5) {
                                            StartGame(key, function () {
                                                zHttp.showResponse(res, res.actid, $.noop);
                                            })
                                        } else {
                                            zHttp.showResponse(res, res.actid, $.noop);
                                        }
                                    } catch (e) {
                                        zHttp.showResponse(res, res.actid, $.noop);
                                    }
                                } else if (res.ret == 20801 && json.ret == 29114){
                                    zMsg.alert('亲，登录游戏30分钟就能获得一次抽奖机会哦~<br>赶紧去登录游戏吧^_^<br>记得签到之前先退出游戏哦~');
                                } else if (res.ret == 10002) {
                                    qq.login.open();
                                } else if (res.ret == 10001 || res.ret == 10004){
                                    zMsg.alert("活动已经结束，敬请期待更多QQ浏览器特权活动！");
                                } else {
                                    zHttp.showResponse(res, res.actid, $.noop);
                                }
                            })
                        })
                    }
                });
            });
            report('BROWSER.ACTIVITY.DNF.LUCKYCLICK');
        },
        //邀请好友
        invite: function(){
            var uin = qq.login.getUin();
            if(uin == 0 || uin == undefined){
                qq.login.open();
                return;
            }
            var _summary = '《地下城与勇士》新版本发布，魔界在召唤！【霸王之契约】、【深渊通行证】来就送！还有机会获得黑钻，还不快来抢？';
            var _desc = '《地下城与勇士》新版本发布，魔界在召唤！【霸王之契约】、【深渊通行证】来就送！还有机会获得黑钻，还不快来抢？';
            var _title = '《地下城与勇士》新版本发布';
            var _url="http://connect.qq.com/widget/shareqq/index.html?url="+encodeURIComponent('http://qbevent.cs0309.imtt.qq.com/DNF/index.html?pvsrc=invite&invite_uin=' + uin)
                +"&desc="+encodeURIComponent(_desc)
                +"&pics="+encodeURIComponent('http://stdl.qq.com/stdl/game/pic/dnf_share.jpg')
                +"&summary="+encodeURIComponent(_summary)
                +"&title="+encodeURIComponent(_title)
                +"&flash=&site=DNF&style=100&width=98&height=22";
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
            report('BROWSER.ACTIVITY.DNF.INVITE');
        }
    });
    window.page = new Page();
})(window,jQuery);


//tab 切换 函数
function tab(i){
    jQuery('#tabTit span').eq(i).addClass('active').siblings().removeClass('active');
    jQuery('#tabCont .wrap').eq(i).show().siblings().hide();
}

window.onload = function(){
    //视频初始化；
    window.video = new tvp.VideoInfo();
    video.setVid("o0016a3a607");
    window.player = new tvp.Player();
    player.create({
        width: 540,
        height: 275,
        video: video,
        modId: "videoBox", //mod_player是刚刚在页面添加的div容器
        autoplay: false,  //是否自动播放
        flashWmode: "transparent",
        vodFlashSkin: "http://imgcache.qq.com/minivideo_v1/vd/res/skins/TencentPlayerMiniSkin.swf" //是否调用精简皮肤，不使用则删掉此行代码
    });
    //宝箱
    jQuery('.baoxiang').hover(function () {
        jQuery(this).css({'z-index':'2'}).children('.gifts').show();
    }, function () {
        jQuery(this).css({'z-index':'1'}).children('.gifts').hide();
    });
    //TAB切换
    if(isQQBrowser()){
        tab(0);
    }else{
        tab(2);
    }
    jQuery('#tabTit span').mouseenter(function () {
        var n = jQuery(this).index();
        tab(n);
    });
    //中奖名单
    try{
        var amsConfig = zMsg.getFormData(1);
        if (amsConfig) {
            var rules = [];
            for (var i in amsConfig) {
                rules.push('<li><em>' + amsConfig[i]['f_1']  + "</em><span>" +amsConfig[i]['f_2'] + '</span></li>');
            }
            jQuery('#namelist').html(rules.join(''))
        }
    }catch(e){}
    autoScroll("namelistDiv", "namelist","namelist2");//竖向滚动的内容


};


