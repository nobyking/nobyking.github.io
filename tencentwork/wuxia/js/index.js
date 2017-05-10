/**
 * Created by v_zmengren on 2015/5/15.
 */
function report(hottagValue) {
    window.setTimeout(function () {
        pgvSendClick({hottag: hottagValue});
    }, 100);
}
if(typeof(pgvMain) == 'function') {
    pgvMain("pathtrace", {pathStart: true, tagParamName: "ADTAG", useRefUrl: true, override: true, careSameDomainRef: false});
}

//判断QQ浏览器
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

//弹出框JS
var dialog = {
    id : 0,
    store: [],

    init : function(keepBefore, msg, Css){
        var popWrap, popBox, popClose, popBg;
        var ObjCss = Css || '';
        var id = '' + new Date().getTime();
        if(!keepBefore && this.store.length!==0){
            for(var i=0; i<this.store.length; i++){
                this.hide(this.store[i]);
            }
            this.store = [id];
        }
        else{
            this.store.push(id);
        }
        popBg = document.createElement('div');
        popBg.id = "popBg_" + id;
        popBg.className = "popBg";
        document.body.appendChild(popBg);

        popBox = document.createElement('div');
        popBox.className = 'popMsg ' + ObjCss;
        popBox.id = 'popMsg_'+id;
        document.body.appendChild(popBox);

        var content = msg || '';
        popBox.innerHTML = '<div class="popTop"></div><div class="popWrap"><a href="javascript:void(0);" class="popClose" onclick="dialog.hide()" title="关闭"></a><div class="popContainer">'+ content +'</div></div><div class="popBottom"></div>';
        popBox.style.marginTop = popBox.offsetHeight/-2 +'px';
    },
    open : function(msg, flag){
        this.init(flag, msg);
    },
    show : function(msg, flag){
        this.init(flag, msg, 'popList');
    },
    hide : function(id){
        if(!id){
            id = this.store.pop();
        }
        if(id != undefined) {
            document.body.removeChild(document.getElementById("popBg_" + id));
            document.body.removeChild(document.getElementById('popMsg_' + id));
        }
    }
};

//提示语
var html;
var tips = {
    9 : function(){
        html = "<h5 style='font-size: 20px; padding-top: 30px;'>活动已经结束！<br>敬请期待更多QQ浏览器特权活动！</h5>\
                <div class='P-btns'>\
                    <a href='javascript:;' class='btn btn-ensure' onclick='dialog.hide();'>确定</a>\
                </div>";
        return html
    },
    8 : function(){
        html = "<h3 style='font-size: 22px; padding:15px 0 10px;'>大侠，这是QQ浏览器的专属活动</h3>\
                <p>请用QQ浏览器参加哦<br>如果还未安装，请<span class='red'>点击下载</span>安装</p>\
                <div class='P-btns'>\
                    <a href='javascript:;' class='btn btn-downloadQB' onclick='document.getElementById(\"QBDownload\").click();dialog.hide();'>下载QQ浏览器</a>\
                </div>";
        return html
    },
    0 : function(k,cdk){
        if(k == 1){
            html = "<h3 style='font-size: 22px; padding:15px 0 10px;'>恭喜大侠贺喜大侠！</h3>\
                <p>您获得一个超萌公仔</p>\
                <p>请如实填写您的<a href='http://vip.qq.com/my/index.html#address' target='_blank' class='red'>收货地址</a></p>\
                <div class='P-btns'>\
                    <a href='http://vip.qq.com/my/index.html#address' target='_blank' class='btn btn-ensure2' onclick='dialog.hide();'>去填写</a>\
                </div>";
        } else if(k == 2){
            html = "<h3 style='font-size: 22px; padding:15px 0 10px;'>浪迹天涯怎能没些碎银子？</h3>\
                <p>恭喜大侠获得<span class='red'>5</span>Q币，已发放至<br>您的<a href='http://my.pay.qq.com/account/index.shtml' target='_blank' style='text-decoration: underline; color: #a80000;'>qq账户</a>中，请注意查收！</p>\
                <div class='P-btns'>\
                    <a href='javascript:;' class='btn btn-ensure' onclick='dialog.hide();'>确定</a>\
                </div>";
        } else if(k == 3){
            html = "<h3 style='font-size: 22px; padding:15px 0 10px;'>浪迹天涯怎能没些碎银子？</h3>\
                <p>恭喜大侠获得<span class='red'>1</span>Q币，已发放至<br>您的<a href='http://my.pay.qq.com/account/index.shtml' target='_blank' style='text-decoration: underline; color: #a80000;'>qq账户</a>中，请注意查收！</p>\
                <div class='P-btns'>\
                    <a href='javascript:;' class='btn btn-ensure' onclick='dialog.hide();'>确定</a>\
                </div>";
        } else if(k == 4){
            html = "<h3 style='font-size: 22px; padding:15px 0 10px;'>恭喜大侠贺喜大侠！</h3>\
                <p>您获得天涯明月刀限号不删档测试激活码</p>\
                <p style='font-size: 20px;'>"+ cdk +"</p>\
                <p>这就去<a href='http://wuxia.qq.com/cp/a20150413jhzh/' target='_blank' style='text-decoration: underline; color: #a80000;'>激活</a></p>\
                <div class='P-btns'>\
                    <a href='javascript:;' class='btn btn-ensure' onclick='dialog.hide();'>确定</a>\
                </div>";
        } else if(k == 5 || k == 6){
            html = "<h3 style='font-size: 22px; padding:15px 0 10px;'>恭喜大侠贺喜大侠！</h3>\
                <p>您获得QQ浏览器碎片一枚<br>集齐三枚又<span class='red'>可免费抽奖一次</span>哦！</p>\
                <p style='font-size: 13px;padding-top: 5px;'>贴心小Tips：您还可以每天登录后<br>在页面右侧领取碎片</p>\
                <div class='P-btns'>\
                    <a href='javascript:;' class='btn btn-ensure' onclick='dialog.hide();'>确定</a>\
                </div>";
        }  else if(k == 7){
            html = "<h3 style='font-size: 22px; padding:15px 0 10px;'>既入江湖 生死为疆！</h3>\
                <p>一次不中，还盼大侠卷土重来，<br>再接再厉！</p>\
                <div class='P-btns'>\
                    <a href='javascript:;' class='btn btn-ensure' onclick='dialog.hide();'>确定</a>\
                </div>";
        } else if(k == 8){
            html = "<h3 style='font-size: 22px; padding:0 0 10px;'>琴箫乱，逆风寒 <br>集齐碎片再来玩！</h3>\
                <p>大侠抽奖机会已用尽，每天登录</p>\
                <p class='red'>领取碎片还有机会继续免费抢码抢公仔哦</p>\
                <div class='P-btns' style='text-align: right;'>\
                    <a href='javascript:;' class='btn btn-shareQZ'>分享到QQ空间</a> <a href='javascript:;' class='btn btn-shareQQ'>分享给QQ好友</a>\
                </div>";
        }
        return html
    }
};

//设置碎片、抽奖次数
function setMoney(k, j){ //k->碎片；j->默认次数
    if(isNaN(k) || isNaN(k)){
        jQuery('#money').text(k);
        jQuery('#count').text(j);
    }else {
        if (k >= 0) {
            jQuery('#money').text(k);
        }
        var m = parseInt(k / 3) + j;
        jQuery('#count').text(m);
        window.lottery_num = m;
    }
}
//更新签到按钮状态
function todaySignin(t){    //t->true 已签到
    if(t){
        jQuery('.btn_signin').hide();
        jQuery('.signinEnd').show();
    }else{
        jQuery('.btn_signin').show();
        jQuery('.signinEnd').hide();
    }
}

//抽奖
var inGame = false;
function StartGame(key, cb){
    if(inGame){
        cb();
        return;
    }
    inGame = true;
    var arr_map = [5,2,6,1,0,4,7,3];
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

//文字滚动 横
function autoScroll(div, div2, ul, ul2){
    var divO = document.getElementById(div);
    var divO2 = document.getElementById(div2);
    var ulO = document.getElementById(ul);
    var ulO2 = document.getElementById(ul2);
    var liW = 0;
    for(var i = 0; i < ulO.children.length; i++){
        liW += ulO.children[i].offsetWidth
    }
    ulO2.innerHTML = ulO.innerHTML;
    ulO.style.width = liW + 'px';
    ulO2.style.width = liW + 'px';
    divO2.style.width = liW * 2 + 'px';
    qb_t2 = setInterval(function(){
        if(ulO2.offsetWidth-divO.scrollLeft<=0)
            divO.scrollLeft-=ulO.offsetWidth;
        else{
            divO.scrollLeft++ ;
        }
    },30);
}

// 加入收藏
var isQQIE = (window.external && window.external.extension && /QQBrowser/i.test(navigator.userAgent)) ? true : false;
var isQQCT = (window.getExtension && /Chrome.*QQBrowser/i.test(navigator.userAgent)) ? true : false;
var favorite = function(){
    var sTitle = "天涯明月刀--不删档激活码大放送";
    var sURL = "http://tq.qq.com/g/wuxia/index.html?pvsrc=favorite";
    function FIE(sURL, sTitle){
        try {
            window.external.addFavorite(sURL, sTitle);
        } catch (e) {
            try {
                window.sidebar.addPanel(sTitle, sURL, "");
            } catch (e) {
                alert("加入收藏失败，请使用Ctrl+D进行添加");
            }
        }
    }
    if (isQQIE) {
        try {
            window.external.extension.bookmark.add(sTitle,sURL);
        }catch(e){
            FIE(sURL, sTitle);
        }
    }
    else if (isQQCT) {
        var web_page_extension_id = '{A3C609B3-3E61-4508-8953-117B7286068B}';
        var platform_extension_id = '{420DEFEE-20A8-468C-BFDA-61A09A99325D}';
        var extension;
        var QB8 = !!(/QQBrowser\/8/i.test(navigator.userAgent));
        try {
            if(QB8){
                extension = window.getExtension(web_page_extension_id);
                extension.sendMessage(platform_extension_id, {serviceId: "bookmark.add", args: [sTitle,sURL]})
            } else {
                FIE(sURL, sTitle);
            }
        }catch(e){
            FIE(sURL, sTitle);
        }
    }
    else{
        FIE(sURL, sTitle);
    }
};


//分享组件
var shareFunc = function(type,url){
    var shareObj={
        qq: function(a){
            var b = {
                url: a.url,
                desc: a.description || "",
                pics: a.pic,
                summary: a.summary || "",
                title: a.description || "",
                flash: '',
                site: '天涯明月刀',
                style: '100',
                width: '98',
                height: '22'
            };
            var s = [];
            for(var i in b){
                s.push(i + '=' + encodeURIComponent(b[i]||''));
            }
            return "http://connect.qq.com/widget/shareqq/index.html?" + s.join('&');
        },
        qzone: function(a) {
            var b = {
                url: a.url,
                showcount: "1",
                desc: a.description || "",
                //summary: a.summary || "",
                title: a.title,
                pics: a.pic || null,
                style: "203",
                width: 98,
                height: 22
            };
            var s = [];
            for(var i in b){
                s.push(i + '=' + encodeURIComponent(b[i]||''));
            }
            return "http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?" + s.join('&');
        },
        tencent: function(a) {
            var b = {
                title: a.description || "",
                url: a.url,
                pic: a.pic
            };
            var s = [];
            for(var i in b){
                s.push(i + '=' + encodeURIComponent(b[i]||''));
            }
            return "http://share.v.t.qq.com/index.php?c=share&a=index&" + s.join('&');
        },
        sina: function(a) {
            var b = {
                title: a.description,
                frefer: a.url,
                url: a.url,
                pic: a.pic||null
            };
            var s = [];
            for(var i in b){
                s.push(i + '=' + encodeURIComponent(b[i]||''));
            }
            return "http://service.weibo.com/share/share.php?uid=1&" + s.join('&');
        }
    };
    var wording = {
        url: "http://tq.qq.com/g/wuxia/index.html?pvsrc="+type,
        pic: "http://stdl.qq.com/stdl/game/pic/wuxia_share.png",
        title: "天涯明月刀--不删档激活码大放送",
        description: "我在天涯明月刀等你，一起仗剑走江湖！"
    };
    if(url){
        wording.url = url;
    }
    window.open(shareObj[type](wording));
};

//日历签到
function fullNum(n){
    return n > 10 ? n : "0" + n;
}
function updateTimer(timer){
    jQuery('.cal-container td').each(function(){
        jQuery(this).removeClass('today');
    });
    jQuery('#cal-' + timer).addClass('today');
}
function dateShow(arr){
    if(!!arr){
        for(var i = 0; i < arr.length; i++){
            jQuery('#cal-' + arr[i]).addClass('success');
        }
    }else {
        jQuery('.cal-container td').each(function(){
            jQuery(this).removeClass('success');
        })
    }
}
//先加载本地时间
var T_date = new Date();
var d_m = fullNum((T_date.getMonth() + 1).toString());
var d_d = fullNum(T_date.getDate().toString());
updateTimer("2015"+ d_m + d_d);

(function (window,$) {
    Page = qv.zero.extend(qv.zero.AbstractPage,{
        userJsonID : 47652,
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
                game: 'wuxia'
            });
            //初始化展示
            page.getTimer();
            if(!!qq.login.getUin()){
                page.queryToday();
                page.queryMoney();
                page.querySignIn();
            }
            qq.login.bind('login', function () {
                page.queryToday();  //查询今日是否签到
                page.queryMoney();  //查询碎片数、抽奖次数
                page.querySignIn(); //更新签到日历
            });
            qq.login.bind('logout', function () {
                setMoney('X','X');
                todaySignin(false);
                dateShow();
            });
        },
        //获取系统时间
        getTimer: function () {
            zHttp.send({'actid': 47652}, function (res) {
                var thisTimer = qv.date.format('Ymd',res.time * 1000);
                updateTimer(thisTimer);
            });
        },
        //领取每日碎片
        signIn: function(){
            if(!isQQBrowser()){
                dialog.open(tips['8']());
                return;
            }
            zUtil.ensureLogin(function() {
                zHttp.send({'actid': 47654}, function (res) {
                    if(res.ret == 0) {
                        //隐藏按钮
                        todaySignin(true);
                        //更新碎片个数、抽奖机会
                        page.queryMoney();
                        //更新签到日历
                        var todayTime = qv.date.format('Ymd',res.time * 1000);
                        jQuery('#cal-' + todayTime).addClass('success');
                        dialog.open('<h5 style="font-size: 25px; padding-top: 60px;"><p>恭喜您获得碎片一枚！</p><div class="P-btns"><a href="javascript:;" class="btn btn-ensure" onclick="dialog.hide();">确定</a></div></h5>');
                    }else if(res.ret == 10601){
                        dialog.open('<h5 style="font-size: 25px; padding-top: 30px;"><p>抱歉！<br>今天的碎片您已经领取过了！</p><div class="P-btns"><a href="javascript:;" class="btn btn-ensure" onclick="dialog.hide();">确定</a></div></h5>');
                        todaySignin(true);
                    }else if(res.ret == 10002){
                        qq.login.open();
                    }else if (res.ret == 10001 || res.ret == 10004) {
                        dialog.open(tips['9']());
                    }
                    else{
                        zHttp.showResponse(res, res.actid, $.noop);
                    }
                });
            });
            report("BROWSER.ACTIVITY.WUXIA.SIGNINCLICK");
        },
        //签到日历
        querySignIn: function () {
            zHttp.send({'actid': 47659}, function (res) {
                if(res.ret == 0) {
                    var Arr = res.data.op;
                    dateShow(Arr);
                }
            });
        },
        //查询今日是否签到
        queryToday: function(){
            zHttp.send({'actid': 47655}, function (res) {
                if(res.ret == 0) {
                    var isSignin = res.data.op.count;
                    todaySignin(Boolean(isSignin));
                }
            });
        },
        //查询碎片数（是否还有默认的抽奖机会）
        queryMoney: function(){
            zHttp.send({'actid': 47668}, function (res) {
                if(res.ret == 0) {
                    var monry = res.data.op;
                    zHttp.send({'actid': 47669}, function (json) {
                        if(json.ret == 0) {
                            var count = json.data.op.join[47676];
                            var _count = 0;
                            if(count >= 0 && count <= 2){
                                _count = 2 - count;
                            } else {
                                _count = 0;
                            }
                            setMoney(monry,_count);
                        }
                    });
                }
            });
        },
        //抽奖
        getLucky: function(){
            if(!isQQBrowser()){
                dialog.open(tips['8']());
                return;
            }
            zUtil.ensureLogin(function(){
                if(inGame){return;}
                // _record_def_gift 为1时记录末等奖的奖品  ，不记录则不填写此字段
                zHttp.send({actid: 47676, _record_gift_flow:1}, function (res) {
                    if (res.ret == 0) {
                        try{
                            var key = res.data.op.diamonds;
                            var ccdkey = res.data.op.cdkey;
                            var _key;
                            if (key >= 1 && key <= 6) {
                                if(key == 5){
                                    _key = parseInt(Math.round(Math.random())) + 5;
                                } else if(key == 6){
                                    _key = 8;
                                }else{
                                    _key = key;
                                }
                                StartGame(_key, function () {
                                    if(key == 4){
                                        dialog.open(tips['0'](4, ccdkey));
                                    } else if(window.lottery_num-1 > 0 && key == 6){
                                        dialog.open(tips['0'](7));//还有抽奖机会未中奖
                                    } else {
                                        dialog.open(tips['0'](_key));
                                    }
                                    page.queryMoney();
                                });
                            }
                            else {
                                zHttp.showResponse(res, res.actid, $.noop);
                            }
                        }catch(err) {
                            zHttp.showResponse(res, res.actid, $.noop);
                        }
                    }
                    else if (res.ret == 20801) {
                        dialog.open(tips['0'](8));
                    }
                    else if (res.ret == 10002) {
                        qq.login.open();
                    }
                    else if (res.ret == 10001 || res.ret == 10004) {
                        dialog.open(tips['9']());
                    }
                    else {
                        zHttp.showResponse(res, res.actid, $.noop);
                    }
                });
            });
            report("BROWSER.ACTIVITY.WUXIA.GETLUCKYCLICK");
        },
        //查询中奖纪录
        queryGift : function() {
            zUtil.ensureLogin(function () {
                zHttp.send({actid: 47907}, function (res) {
                    if (res.ret == 0) {
                        var _htmlArr = [],
                            _html = '',
                            count = 0,
                            j = 0;
                        for (var i in res.data.op) {
                            var obj = res.data.op[i].val,
                                time = qv.date.format("Y-m-d", obj.time * 1000),
                                name = obj.name;
                            if(obj.name === "谢谢参与"){continue;}
                            if(obj.name === "QQ浏览器碎片"){
                                j++;
                            } else if(obj.name === "超萌公仔"){
                                _htmlArr.push('<li><span class="time">'+ time +'</span><span class="info">'+ name +'</span><span class="way"><a href="http://vip.qq.com/my/index.html#contact" target="_blank">编辑收货地址</a></span></li>');
                            } else if(obj.name === "激活码"){
                                _htmlArr.push('<li><span class="time">'+ time +'</span><span class="info">'+ name +'</span><span class="way"><a href="http://vip.qq.com/my/gift.html" target="_blank">查看激活码</a></span></li>');
                            } else{
                                _htmlArr.push('<li><span class="time">'+ time +'</span><span class="info">'+ name +'</span><span class="way">/</span></li>');
                            }
                            count++;
                        }
                        if(j != 0){
                            _htmlArr.push('<li><span class="time">活动期间</span><span class="info">QQ浏览器碎片×'+ j +'</span><span class="way">/</span></li>');
                        }
                        if (count == 0) {
                            _html = '<div class="noGifts">大侠的行囊空空如也，<br>还没有抽中任何奖品！<div class="P-btns"><a href="javascript:;" class="btn btn-ensure" onclick="dialog.hide();">确定</a></div></div>';
                        }else{
                            _html = '<ul class="giftsList">'+ _htmlArr.join("") +'</ul>\
                                    <div class="P-btns" style="padding-top: 8px;"><a href="javascript:;" class="btn btn-ensure" onclick="dialog.hide();">确定</a></div>';
                        }
                        dialog.show(_html);
                    } else if (res.ret == 10002) {
                        qq.login.open();
                    } else if (res.ret == 10001 || res.ret == 10004) {
                        dialog.open(tips['9']());
                    } else {
                        zHttp.showResponse(res, res.actid, $.noop);
                    }
                });
                report("BROWSER.ACTIVITY.WUXIA.QUERYGIFTSCLICK");
            });
        }
    });
    window.page = new Page();
})(window,jQuery);

function leftMenu(){
    jQuery(window).scroll(function () {
        var scrollTop = jQuery(window).scrollTop();
        if(scrollTop > 955){
            jQuery('#mod-fixLeft').css({'position':'fixed','top':'45px'});
        }else{
            jQuery('#mod-fixLeft').css({'position':'absolute','top':'1000px'});
        }
    });
    jQuery(window).resize(function () {
        var w = jQuery(window).width();
        if(w < 1280){
            jQuery('#mod-fixLeft').hide(0);
        }else if(w >= 1280 && w < 1366){
            jQuery('#mod-fixLeft').show(0);
            jQuery('#mod-fixLeft').css('margin-left','-666px');
        }else{
            jQuery('#mod-fixLeft').show(0);
            jQuery('#mod-fixLeft').css('margin-left','-715px');
        }
    });
    jQuery(window).scroll();
    jQuery(window).resize();
    jQuery('#mod-fixLeft li').click(function(){
        var me = jQuery(this);
        var k = me.index();
        var mId = me.find('a').attr('href');
        var mTop = jQuery(mId).offset().top - 45;
        jQuery(window).scrollTop(mTop);
        me.addClass('active').siblings('li').removeClass('active');
        if(k == 1 || k == 2){
            tab(0);
        }else if(k == 0){
            tab(1);
        }
        return false;
    });
}
window.onload = function(){
    //左侧按钮
    leftMenu();
    //延迟加载视频
    setTimeout(function () {
        var video = new MoreEquipmentVideo({tag:'videoBox',vid:'h0016h4s8p0',auto:true});
    },1000);

    //分享展示
    jQuery(".share_box").hover(function(){
        jQuery('.share_list').stop(true,true).show(0);
    },function(){
        jQuery('.share_list').stop(true,true).hide(0);
    });

    //文字滚动 延迟加载
    setTimeout(function () {
        try{
            var amsConfig = zMsg.getFormData(1);
            if (amsConfig) {
                var rules = [];
                for (var i in amsConfig) {
                    rules.push('<li><span class="num">恭喜大侠' + amsConfig[i]['f_1']  + "</span>获得" +amsConfig[i]['f_2'] + '</li>');
                }
                jQuery('#noticeList').html(rules.join(''))
            }
        }catch(e){}
        autoScroll("noticeDiv", "noticeBox", "noticeList","noticeList2");//竖向滚动的内容
    },1000);

    //日历效果
    function tab(k){
        var l = 0;
        if(k == 1){
            l = 0;
            jQuery('.cal-month').text('5月');
            jQuery('.cal-prev').addClass('end');
            jQuery('.cal-next').removeClass('end');
        }else{
            l = - 215;
            jQuery('.cal-month').text('6月');
            jQuery('.cal-prev').removeClass('end');
            jQuery('.cal-next').addClass('end');
        }
        jQuery('.cal-container').stop().animate({"left": l + "px"},300);
    }
    //初始化
    tab(1);
    jQuery('.cal-prev').click(function () {
        tab(1);
    });
    jQuery('.cal-next').click(function () {
        tab(2);
    });

    //分享
    jQuery('body').on('click','.btn-shareQZ', function () {
        var f = {
            url: "http://tq.qq.com/g/wuxia/index.html?pvsrc=qzoneshare",
            summary: "我在天涯明月刀等你，一起仗剑走江湖！",
            title: "天涯明月刀--不删档激活码大放送",
            act_pic: "http://stdl.qq.com/stdl/game/pic/wuxia_share.png",
            zone_pic: '',
            desc : '',
            music_url :  '',
            topic : '',
            music_title : '',
            music_author : '',
            video_pic : '',
            video_url : '',
            play_url : '',
            isSendWeibo :0,
            isSendQzone : 1,
            gtk_type: 0
        };
        zUtil.ensureLogin(function() {
            zHttp.send(zURL.appendParams(f, "http://iyouxi.vip.qq.com/share_new.php?ipvsrc%5Bweibo%5D=12&ipvsrc%5Bqzone%5D=7"), function() {
                dialog.open('<h5 style="font-size: 25px; padding-top: 60px;"><p>恭喜您分享成功！</p><div class="P-btns"><a href="javascript:;" class="btn btn-ensure" onclick="dialog.hide();">确定</a></div></h5>',true);
                report('BROWSER.ACTIVITY.WUXIA.LUCKYSHAREQZCLICK');
            });
        });
    });
    jQuery('body').on('click','.btn-shareQQ', function () {
        var _summary = '我在天涯明月刀等你，一起仗剑走江湖！';
        var _title = '天涯明月刀--不删档激活码大放送';
        var _url="http://connect.qq.com/widget/shareqq/index.html?url="+encodeURIComponent('http://tq.qq.com/g/wuxia/index.html?pvsrc=invite')
            +"&desc="+encodeURIComponent(_summary)
            +"&pics="+encodeURIComponent('http://stdl.qq.com/stdl/game/pic/wuxia_share.png')
            +"&summary="+encodeURIComponent(_summary)
            +"&title="+encodeURIComponent(_title)
            +"&flash=&site=%e5%a4%a9%e6%b6%af%e6%98%8e%e6%9c%88%e5%88%80&style=100&width=98&height=22";
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
        report('BROWSER.ACTIVITY.WUXIA.LUCKYSENDQQCLICK');
    })

};