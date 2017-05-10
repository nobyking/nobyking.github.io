
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

function setView (k,cb) {
    var demo = jQuery('.flame');
    var btn = jQuery('.btn_lucky');
    if(k == 1) {
        demo.addClass('finish');
        btn.addClass('disabled').attr("data-do","page.getLucky,1");
    } else if(k == -1){
        demo.addClass('disabled');
        btn.addClass('disabled').attr("data-do","page.getLucky,1");
    } else {
        demo.removeClass('disabled finish');
        btn.removeClass('disabled').attr("data-do","page.getLucky");
    }
    if(cb) {
        setTimeout(cb,1500);
    }
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
    alert : function(msg, flag){
        this.init(flag, msg, 'popWarn');
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
        html = "<div class='popContTit'>亲爱的用户</div>\
                <div class='contentBox'>\
                    <p style='padding-top: 14px;'>活动已经结束！</p>\
                    <p>敬请期待更多QQ浏览器特权活动！</p>\
                </div>\
                <div class='P_btns'>\
                    <a href='javascript:;' class='btn btn_pop' onclick='dialog.hide();'>确定</a>\
                </div>";
        return html;
    },
    8 : function(){
        html = "<div class='popContTit'>亲爱的用户</div>\
                <div class='contentBox'>\
                    <p>亲，这是QQ浏览器的专属活动</p>\
                    <p>请用QQ浏览器参加哦</p>\
                    <p>如果还未安装，请<span class='red'>点击下载</span>安装</p>\
                </div>\
                <div class='P_btns'>\
                    <a href='http://dldir1.qq.com/invc/tt/QQBrowser_Setup_Privilegecenter.exe#?ADTAG=SNO=' class='btn btn_downloadQB' onclick='report(\"BROWSER.ACTIVITY.GUICHUIDENG.DOWNLOADQBCLICK\")'>下载QQ浏览器</a>\
                </div>";
        return html;
    },
    7 : function(k){
        var _css = '';
        if(k){
            _css = 'font-weight:normal';
        }
        html = "<div class='popContTit'>亲爱的用户</div>\
                <div class='contentBox'>\
                    <p style='padding-top: 14px; "+ _css +"'>您的QQ浏览器版本不符合要求</p>\
                    <p>请<span class='red'>点击下载</span>安装专用版QQ浏览器来参加活动</p>\
                </div>\
                <div class='P_btns'>\
                    <a href='http://dldir1.qq.com/invc/tt/QQBrowser_Setup_Privilegecenter.exe#?ADTAG=SNO=' class='btn btn_downloadQB2' onclick='report(\"BROWSER.ACTIVITY.GUICHUIDENG.DOWNLOADQBCLICK2\")'>下载专用版QQ浏览器</a>\
                </div>";
        return html;
    },
    6 : function(){
        html = "<div class='popContTit'>亲爱的用户</div>\
                <div class='contentBox'>\
                    <p style='padding-top: 14px;'>QQ浏览器抽奖次数已达上限</p>\
                    <p>谢谢您的关注</p>\
                </div>\
                <div class='P_btns'>\
                    <a href='javascript:;' class='btn btn_pop' onclick='dialog.hide();'>确定</a>\
                </div>";
        return html;
    },
    0 : function(k,cdkey){
        if(k == 1){
            html = "<div class='contentGifts'>\
                        <h3 class='gifts_title'>\
                            <span class='ico_movie'></span>\
                            <img src='http://stdl.qq.com/stdl/activity/guichuideng/images/gifts_tit_1.png'>\
                        </h3>\
                        <div class='giftsCdkey'>兑换码为：" + cdkey + "</div>\
                        <div class='giftsExplain' style=''>\
                            <div class='giftsCode' style=''><img src='http://stdl.qq.com/stdl/activity/guichuideng/images/code.png' width='115' height='115'><span>扫码领取</span></div>\
                            <div class='giftsTips' style=''>\
                                <p>使用说明：</p>\
                                <p>1.打开大众点评手机客户端，没安装的请扫码下载</p>\
                                <p>2.选择电影进入后选择影片《九层妖塔》，选择影院及座位，提交订单</p>\
                                <p>3.支付时选择兑换券/兑换码，输入即可</p>\
                                <p>4.有效期9月25日—10月31日，请及时兑换使用</p>\
                            </div>\
                        </div>\
                    </div>\
                    <div class='P_btns'>\
                        <a href='javascript:;' class='btn btn_pop' onclick='dialog.hide();'>确定</a>\
                    </div>";
        } else if(k == 2){
            html = "<div class='contentGifts'>\
                        <h3 class='gifts_title'>\
                            <span class='ico_movie'></span>\
                            <img src='http://stdl.qq.com/stdl/activity/guichuideng/images/gifts_tit_2.png'>\
                        </h3>\
                        <div class='giftsExplain'>\
                            <div class='giftsCode'><img src='http://stdl.qq.com/stdl/activity/guichuideng/images/code2.jpg' width='115' height='115'><span>扫码领取</span></div>\
                            <div class='giftsTips' style=''>\
                                <p>使用说明：</p>\
                                <p>1.优惠券仅限在微信电影票使用，仅限影片《九层妖塔》</p>\
                                <p>2.优惠券仅用于选座购票影院，不支持兑换券</p>\
                                <p>3.优惠券有效期2015-10-19，请在有效期内使用</p>\
                                <p>4.每个用户限领1张，不与其他优惠同时使用，不可转赠</p>\
                            </div>\
                        </div>\
                    </div>\
                    <div class='P_btns'>\
                        <a href='javascript:;' class='btn btn_pop' onclick='dialog.hide();'>确定</a>\
                    </div>";
        }
        return html;
    },
    1 : function(){
        html = "<div class='popContTit'>亲爱的用户</div>\
                <div class='contentBox'>\
                    <p style='padding-top: 14px;'>亲，您已经抽过奖了</p>\
                    <p>谢谢您的关注</p>\
                </div>\
                <div class='P_btns'>\
                    <a href='javascript:;' class='btn btn_pop' onclick='dialog.hide();'>确定</a>\
                </div>";
        return html;
    },
    2 : function (info) {
        html = "<div class='popContTit'>获奖记录</div>\
                <div style='padding-top: 85px;text-align: left;'>"+ info +"</div>";
        return html;
    }
};

(function (window,$) {
    Page = qv.zero.extend(qv.zero.AbstractPage, {
        userJsonID: 65828,
        loadExtHandler: true,
        //vipmonth : 1,
        init: function () {
            Page.superclass.init.apply(this, arguments);
        },
        initEvent: function () {
            Page.superclass.initEvent.apply(this, arguments);
            $('body').on('click', 'a[href="#"]', function (e) {
                e.preventDefault();
            });
            if (!!qq.login.getUin()) {
                page.queryLucky();
            }
            qq.login.bind('login', function () {
                page.queryLucky();
            });
            qq.login.bind('logout', function () {
                setView(0);
            });
        },
        queryLucky: function () {
            zUtil.ensureLogin(function () {
                zHttp.send({'actid': 65942}, function (res) {
                    if (res.ret == 0) {
                        var k = res.data.op.join[65949];
                        setView(k);
                    }
                });
            });
        },
        //抽奖
        getLucky: function (e,act,flag) {
            if (!isQQBrowser()) {
                dialog.alert(tips['8']());
                return;
            }
            if (qb_guid == 0) {
                if(flag != 'true') {
                    getGuid();
                    page.getLucky('true');
                } else {
                    dialog.alert(tips['7'](1));
                    return;
                }
            }
            if(act[0] == 1) {
                return;
            }
            zUtil.ensureLogin(function () {
                // 记录奖品时 必须加字段 _record_gift_flow : 1 ， 若记录末等奖时 再加字段(不记录则不加) _record_def_gift : 1
                var _url = "http://festival.browser.qq.com/check?_record_gift_flow=1&_record_def_gift=1&actid=65949&guid=" + qb_guid;
                zHttp.send(_url, function (res) {
                    if (res.ret == 0) {
                        var key = res.data.op.diamonds;
                        var cdkey = res.data.op.cdkey;
                        setView(-1, function () {
                            if (key == 1) {
                                dialog.open(tips['0'](1, cdkey));//兑换券
                            } else {
                                dialog.open(tips['0'](2));//优惠券
                            }
                        });
                    } else if (res.ret == -1) {
                        dialog.alert(tips['7']());
                    } else if (res.ret == -2) {
                        dialog.alert(tips['6']());
                    } else if (res.ret == 10601 || res.ret == 10603) {
                        dialog.alert(tips['1']());  //没有抽奖机会
                    } else if (res.ret == 10002) {
                        qq.login.open();
                    } else if (res.ret == 10001 || res.ret == 10004) {
                        dialog.alert(tips['9']());
                    } else {
                        zHttp.showResponse(res, res.actid, $.noop);
                    }
                });
            });
            report("BROWSER.ACTIVITY.GUICHUIDENG.GETLUCKYCLICK");
        },
        //查询中奖纪录
        queryGift: function () {
            zUtil.ensureLogin(function () {
                zHttp.send({actid: 65948}, function (res) {
                    if (res.ret == 0) {
                        var _htmlArr = [],
                            _html = '',
                            count = 0,
                            j = 0;
                        for (var i in res.data.op) {
                            var obj = res.data.op[i].val,
                                time = qv.date.format("Y-m-d", obj.time * 1000),
                                name = obj.name;
                            if (name === "鬼吹灯电影票") {
                                _htmlArr.push('<li><span class="giftsTime">' + time + '</span><span class="giftsInfo">' + name + '</span>　<a href="http://vip.qq.com/my/gift.html" target="_blank">查看CDKEY</a></li>');
                            } else {
                                _htmlArr.push('<li><span class="giftsTime">' + time + '</span><span class="giftsInfo">' + name + '</span></li>');
                            }
                            count++;
                        }
                        if (count == 0) {
                            _html = '<div class="noGifts">亲，您还没有抽中任何奖品！</div>';
                        } else {
                            _html = '<ul class="giftsList">' + _htmlArr.join("") + '</ul>';
                        }
                        dialog.show(tips['2'](_html));
                    } else if (res.ret == 10002) {
                        qq.login.open();
                    } else if (res.ret == 10001 || res.ret == 10004) {
                        dialog.alert(tips['9']());
                    } else {
                        zHttp.showResponse(res, res.actid, $.noop);
                    }
                });
                report("BROWSER.ACTIVITY.GUICHUIDENG.QUERYGIFTSCLICK");
            });
        }
    });
    window.page = new Page();
})(window,jQuery);

function setNav(){
    var Stop = [], Wheight = 0;
    for(var i = 0; i < 4; i++){
        Stop[i] = document.getElementById('offsetTop_' + parseInt(i)).offsetTop;
    }
    Wheight = document.documentElement.clientHeight;
    jQuery('.navlist a').bind('click', function () {
        var k = jQuery(this).index();
        jQuery('html,body').stop().animate({'scrollTop' : Stop[k] - 45 + 'px'},300);
        jQuery(this).addClass('active').siblings().removeClass('active');
    });
};

window.onload = function(){
    //视频初始化；
    window.video = new tvp.VideoInfo();
    video.setVid("z0018j54xt5");
    window.player = new tvp.Player();
    player.create({
        width: 680,
        height: 384,
        video: video,
        modId: "videoBox", //mod_player是刚刚在页面添加的div容器
        autoplay: false,  //是否自动播放
        flashWmode: "transparent",
        vodFlashSkin: "http://imgcache.qq.com/minivideo_v1/vd/res/skins/TencentPlayerMiniSkin.swf" //是否调用精简皮肤，不使用则删掉此行代码
    });    
    //导航
    setNav();
};