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

var NUA= navigator.userAgent.toLowerCase();
var isIpad= NUA.match(/ipad/i) == "ipad";

var qbUrl = '';
if(isIpad) {
    qbUrl = 'https://itunes.apple.com/us/app/id426097375?mt=8&ADTAG=&SNO=';
} else {
    qbUrl = 'http://dldir1.qq.com/invc/tt/QQBrowser_Setup_Privilegecenter.exe#?ADTAG=&SNO=';
}
//ipad 另外加载的样式
if(isIpad) {
    var nodeStyle = document.createElement('style');
    var _temp = '';
    if(isQQBrowser()) {
        _temp = '#header-qb{display:none;}';
    }
    var cssText = '.popMsg{transform: scale(1.5,1.5);}'+_temp;
    nodeStyle.type = 'text/css';
    if(nodeStyle.styleSheet) {
        nodeStyle.stylesheet.cssText = cssText;
    } else {
        nodeStyle.innerHTML = cssText;
    }
    document.getElementsByTagName('head')[0].appendChild(nodeStyle);
    jQuery('.middle_1').hide();
    jQuery('.middle_1_ipad').show();
    jQuery('#header-qb').attr('href',qbUrl);
} else {
    jQuery('.middle_1').show();
    jQuery('.middle_1_ipad').hide();
}

//活动地址 不带任何参数
var _pageUrl = location.protocol + '//' + location.host + location.pathname;
//获取AMS系统中设置的提示语
function getAmsMsg(res) {
    var msgCfg = zHttp.getMsgByState( res.data, res.actid, res.ret, $.noop );
    return zMsg.repair( msgCfg.m );
}
//小屏更改头部图
function reSize() {
    var winW = document.body.clientWidth;
    if(winW < 1900) {
        jQuery('.middle_1').css({'background-image':'url(http://stdl.qq.com/stdl/activity/warcraft/images/middle_1_min.jpg)'});
    } else {
        jQuery('.middle_1').css({'background-image':'url(http://stdl.qq.com/stdl/activity/warcraft/images/middle_1.jpg)'});
    }
}
reSize();
window.onresize = function () {
    reSize()
};

//解决IE9以下$.ajax无效的BUG
if ( window.XDomainRequest ) {
    jQuery.ajaxTransport(function( s ) {
        if ( s.crossDomain && s.async ) {
            if ( s.timeout ) {
                s.xdrTimeout = s.timeout;
                delete s.timeout;
            }
            var xdr;
            return {
                send: function( _, complete ) {
                    function callback( status, statusText, responses, responseHeaders ) {
                        xdr.onload = xdr.onerror = xdr.ontimeout = jQuery.noop;
                        xdr = undefined;
                        complete( status, statusText, responses, responseHeaders );
                    }
                    xdr = new XDomainRequest();
                    xdr.onload = function() {
                        callback( 200, "OK", { text: xdr.responseText }, "Content-Type: " + xdr.contentType );
                    };
                    xdr.onerror = function() {
                        callback( 404, "Not Found" );
                    };
                    xdr.onprogress = jQuery.noop;
                    xdr.ontimeout = function() {
                        callback( 0, "timeout" );
                    };
                    xdr.timeout = s.xdrTimeout || Number.MAX_VALUE;
                    xdr.open( s.type, s.url );
                    xdr.send( ( s.hasContent && s.data ) || null );
                },
                abort: function() {
                    if ( xdr ) {
                        xdr.onerror = jQuery.noop;
                        xdr.abort();
                    }
                }
            };
        }
    });
}


jQuery.extend( jQuery.easing,
    {
        easeOutBounce: function (x, t, b, c, d) {
            if ((t/=d) < (1/2.75)) {
                return c*(7.5625*t*t) + b;
            } else if (t < (2/2.75)) {
                return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
            } else if (t < (2.5/2.75)) {
                return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
            } else {
                return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
            }
        }
    });

/*投票效果*/
function voteVS(bl,lm){
    var vsBl = jQuery('#vsBl'),
        vsLm = jQuery('#vsLm'),
        vsBlNum = jQuery('#vsBlNum'),
        vsLmNum = jQuery('#vsLmNum'),
        blNum = parseInt(vsBlNum.text().replace(/[^\d]/ig,'')),
        lmNum = parseInt(vsLmNum.text().replace(/[^\d]/ig,''));
    if(bl === '+1') {
        vsBlNum.text('支持：'+(blNum+1));
    } else if(bl === '+2') {
        vsLmNum.text('支持：'+(lmNum+1));
    } else {
        var num_bl = parseInt(bl),
            num_lm = parseInt(lm),
            total = num_bl + num_lm,
            percent_bl = ((num_bl / total) * 100).toFixed(2),
            percent_lm = ((num_lm / total) * 100).toFixed(2);
        percent_bl = percent_bl<=12 ? 12 : percent_bl;
        percent_bl = percent_bl>=88 ? 88 : percent_bl;
        percent_lm = percent_lm<=12 ? 12 : percent_lm;
        percent_lm = percent_lm>=88 ? 88 : percent_lm;
        vsBlNum.text('支持：'+num_bl);
        vsLmNum.text('支持：'+num_lm);
        vsBl.animate({'width':percent_bl+'%'},{easing:'easeOutBounce',duration:1500});
        vsLm.animate({'width':percent_lm+'%'},{easing:'easeOutBounce',duration:1500});
    }
}

//修改皮肤
function changeSkinBl(key){
    jQuery('.skin_bl,.skin_lm').removeClass('selected noSelected');
    try{
        chrome.prefs.set('Skin.Detail','{"skins":[{"id":"121","background_image_in_grid":"http://stdl.qq.com/stdl/skin/upload/thumb/avatar_horde.png","tab_shape":"rect","primary_color":"rgb(0,0,0)","primary_image":"http://stdl.qq.com/stdl/skin/upload/texture/horde.png","primary_image_mode":"top_right","primary_inverse":true}]}');
        jQuery('.skin_bl').addClass('selected');
        jQuery('.skin_lm').addClass('noSelected');
        dialog.alert(tips['4']('部落',key));
    } catch (err){}
}
function changeSkinLm(key){
    jQuery('.skin_bl,.skin_lm').removeClass('selected noSelected');
    try{
        chrome.prefs.setStringPref('Skin.Detail','{"skins":[{"id":"122","background_image_in_grid":"http://stdl.qq.com/stdl/skin/upload/thumb/avatar_allience.png","tab_shape":"rect","primary_color":"rgb(0,0,0)","primary_image":"http://stdl.qq.com/stdl/skin/upload/texture/allience.png","primary_image_mode":"top_right","primary_inverse":true}]}');
        jQuery('.skin_lm').addClass('selected');
        jQuery('.skin_bl').addClass('noSelected');
        dialog.alert(tips['4']('联盟',key));
    } catch (err){}
}
/*查询皮肤*/
function querySkin(){
    try{
        chrome.prefs.get('Skin.Detail',function(res){
            var json = jQuery.parseJSON(res);
            if(json.skins[0].id == 121) {
                jQuery('.skin_bl').addClass('selected');
                jQuery('.skin_lm').addClass('noSelected');
            } else if(json.skins[0].id == 122) {
                jQuery('.skin_lm').addClass('selected');
                jQuery('.skin_bl').addClass('noSelected');
            } else {
                jQuery('.skin_bl,.skin_lm').removeClass('selected noSelected');
            }
        })
    } catch (err) {
        jQuery('.skin_bl,.skin_lm').removeClass('selected noSelected');
    }
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
                <div class='contentBox popConCenter'>\
                    <p style='padding-top: 14px;'>活动已经结束！</p>\
                    <p>敬请期待更多QQ浏览器特权活动！</p>\
                </div>\
                <div class='P_btns'>\
                    <a href='javascript:;' class='btn btn_pop' onclick='dialog.hide();'>确定</a>\
                </div>";
        return html;
    },
    8 : function(){
        var _report = '';
        if(isIpad) {
            _report = 'report("BROWSER.ACTIVITY.WARCRAFT.DOWNLOADQBCLICK_IPAD")';
        } else {
            _report = 'report("BROWSER.ACTIVITY.WARCRAFT.DOWNLOADQBCLICK")';
        }
        html = "<div class='popContTit'>亲爱的用户</div>\
                <div class='contentBox popConCenter'>\
                    <p>亲，这是QQ浏览器的专属活动</p>\
                    <p>请用QQ浏览器参加哦</p>\
                    <p>如果还未安装，请<span class='red'>点击下载</span>安装</p>\
                </div>\
                <div class='P_btns'>\
                    <a href='"+ qbUrl +"' class='btn btn_downloadQB' onclick="+ _report +">下载QQ浏览器</a>\
                </div>";
        return html;
    },
    7 : function(k){
        var _css = '';
        if(k){
            _css = 'font-weight:normal';
        }
        html = "<div class='popContTit'>亲爱的用户</div>\
                <div class='contentBox popConCenter'>\
                    <p style='padding-top: 14px; "+ _css +"'>您的QQ浏览器版本不符合要求</p>\
                    <p>请<span class='red'>点击下载</span>安装专用版QQ浏览器来参加活动</p>\
                </div>\
                <div class='P_btns'>\
                    <a href='"+ qbUrl +"' class='btn btn_downloadQB2' onclick='report(\"BROWSER.ACTIVITY.WARCRAFT.DOWNLOADQBCLICK2\")'>下载专用版QQ浏览器</a>\
                </div>";
        return html;
    },
    6 : function(){
        html = "<div class='popContTit'>亲爱的用户</div>\
                <div class='contentBox popConCenter'>\
                    <p style='padding-top: 14px;'>QQ浏览器抽奖次数已达上限</p>\
                    <p>谢谢您的关注</p>\
                </div>\
                <div class='P_btns'>\
                    <a href='javascript:;' class='btn btn_pop' onclick='dialog.hide();'>确定</a>\
                </div>";
        return html;
    },
    0 : function(){
        html = "<div class='popContTit'>QQ浏览器</div>\
                  <div class='contentGifts'>\
                    <h3 class='gifts_title'>\
                        <p>恭喜您</p>\
                        <p class='tit'>获得《魔兽》电影红包一个 </p>\
                    </h3>\
                    <div class='giftsExplain'>\
                        <div class='giftsCode'><img src='http://stdl.qq.com/stdl/activity/warcraft/images/scan.jpg' width='140' height='140'><span>微信扫码领取</span></div>\
                        <div class='giftsTips' style=''>\
                            <p class='ptit'>使用规则：</p>\
                            <p class='rule_order'><span>1、</span><em>红包限在微信电影票使用，不限影院，不限城市， 不限影片及场次</em></p>\
                            <p class='rule_order'><span>2、</span><em>红包仅用于在线选座购票影院，每个订单限用一张</em></p>\
                            <p class='rule_order'><span>3、</span><em>红包不可以转赠、分享并不能与影院其他优惠同时使用</em></p>\
                            <p class='rule_order'><span>4、</span><em>红包效期为：动态有效期从领取日起30天内有效</em></p>\
                            <p class='rule_order'><span>5、</span><em>10元红包限购买25元以上的影票使用</em></p>\
                            <p class='rule_order'><span>6、</span><em>活动期间每个用户只能领取一次红包</em></p>\
                            <p class='rule_order'><span>7、</span><em>领取时间：6.3-6.17</em></p>\
                        </div>\
                    </div>\
                </div>";
        return html;

    },
    1 : function(){
        html = "<div class='popContTit'>亲爱的用户</div>\
                <div class='contentBox popConCenter'>\
                    <p style='padding-top: 14px;'>亲，您今天已经抽过奖了~</p>\
                    <p>明天再来试试手气~</p>\
                </div>\
                <div class='P_btns'>\
                    <a href='javascript:;' class='btn btn_pop' onclick='dialog.hide();'>确定</a>\
                </div>";
        return html;
    },
    2 : function (info) {
        html = "<div style='text-align: left;'>\
                <div class='wardTit'>获奖记录</div>"+ info +"</div>";               
        return html;
    },
    3 : function () {
        report("BROWSER.ACTIVITY.WARCRAFT.SHARECLICK_IPAD");
        html = "<div class='ipadShareTit'>分享给好友</div>\
                <div class='ipadContent'>\
                    <p>点击浏览器右上角菜单<img src='http://stdl.qq.com/stdl/activity/warcraft/images/icon_m.png'>找到分享<img src='http://stdl.qq.com/stdl/activity/warcraft/images/icon_s.png'>就可以把活动分享给你的好友啦，100%中奖， 快去邀请小伙伴吧！</p>\
                </div>";
        return html;
    },
    4 : function(name,key){
        var _temp = '';
        if(key == 0) {
            _temp = '，'+ name +'支持度+1';
        }
        html = "<div class='popContTit'>提示</div>\
                <div class='contentBox txtCenter'>\
                    <p style='padding-top: 20px;'>为了"+name+"</p>\
                    <p>您已更换"+name+"皮肤"+_temp+"</p>\
                    <p>您可以点击标签栏的皮肤按钮查看其他皮肤</p>\
                </div>";
        return html;
    },
    10 : function(tip){
        html = "<div class='popContTit'>提示</div>\
                <div class='contentBox txtCenter'>\
                    <p style='padding-top: 40px;'>"+tip+"</p>\
                </div>";
        return html;       
    }
};


(function (window,$) {
    Page = qv.zero.extend(qv.zero.AbstractPage, {
        userJsonID: 107148,
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
            if (!!qq.login.getUin() && isIpad) {
                page.addHD();
            }
            qq.login.bind('login', function () {
                if(isIpad) {
                    page.addHD();
                }
            });
            qq.login.bind('logout', function () {

            });
        },
        addHD: function () {
            zHttp.send({actid:107210},function(){})
        },
        //抽奖
        getLucky: function () {
            if (!isQQBrowser()) {
                dialog.alert(tips['8']());
                return;
            }
            zUtil.ensureLogin(function () {
                zHttp.send({actid: 107152}, function (res) {
                    if (res.ret == 0) {
                        dialog.open(tips['0']());
                    } else if (res.ret == 10601 || res.ret == 10603) {
                        dialog.alert(tips['10']('您已经抽过奖了，可以到获奖记录中查询获得的奖项！'));
                    } else if (res.ret == 10002) {
                        qq.login.open();
                    } else if (res.ret == 10001 || res.ret == 10004) {
                        dialog.alert(tips['9']());
                    } else if(res.ret == 20126){
                        dialog.alert(tips['10']('您还没有换魔兽电影皮肤哦！'));
                    } else if(res.ret == 20147){
                        if(isIpad) {
                            dialog.alert(tips['10']('请刷新页面再试！'));
                        } else {
                            dialog.alert(tips['10']('您还没有换魔兽电影皮肤哦！'));
                        }
                    } else {
                        dialog.alert(tips['10'](getAmsMsg(res)));
                    }
                });
                if(isIpad) {
                	report("BROWSER.ACTIVITY.WARCRAFT.GETLUCKY_IPAD");
                } else {
                	report("BROWSER.ACTIVITY.WARCRAFT.GETLUCKY");
                }
            });
        },
        //查询中奖记录
        queryGift: function () {
            zUtil.ensureLogin(function () {
                zHttp.send({actid: 107153}, function (res) {
                    if (res.ret == 0) {
                        var _htmlArr = [],
                            _html = '',
                            count = 0,
                            j = 0;
                        for (var i = res.data.op.length - 1; i >= 0;i--) {
                            var obj = res.data.op[i].val,
                                time = qv.date.format("Y-m-d", obj.time * 1000),
                                name = obj.name,
                                cdkVal = obj.info;
                            _htmlArr.push('<li><span class="giftsTime">' + time + '</span><span style="cursor: pointer; text-decoration: underline;" class="giftsInfo" onclick="dialog.open(tips[\'0\']())">' + name + '</span></li>');
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
                        dialog.alert(tips['10'](getAmsMsg(res)));
                    }
                });
                if(isIpad) {
                    report("BROWSER.ACTIVITY.WARCRAFT.QUERYGIFTSCLICK_IPAD");
                } else {
                    report("BROWSER.ACTIVITY.WARCRAFT.QUERYGIFTSCLICK");
                }
            });
        },
        //投票
        vote : function (This,id) {
            var me = jQuery(This);
            if(me.hasClass('selected')) {
                return;
            }
            if(!isQQBrowser()){
                dialog.alert(tips['8']());
                return;
            }
            zUtil.ensureLogin(function () {
                var voteId = id;
                if (voteId) {
                    zHttp.send({actid: 107149, vote_uin: voteId}, function (res) {
                        var _left = 0;
                        if(voteId == 1) {
                            changeSkinBl(res.ret);
                        } else if(voteId == 2) {
                            changeSkinLm(res.ret);
                        }
                        if (res.ret == 0) {
                            var _top = jQuery('.vs_num').offset().top + 30;
                            if(voteId == 1) {
                                voteVS('+1');
                                _left = jQuery('#vsBlNum').offset().left;
                            } else if(voteId == 2) {
                                voteVS('+2');
                                _left = jQuery('#vsLmNum').offset().left;
                            }
                            var span = jQuery('<span>+1</span>');
                            span.css({'display':'inline-block','position':'absolute','top':_top+'px','left':_left+'px','z-index':'100','font-size':'20px','width':'120px','text-align':'center','color':'#ffda30'});
                            jQuery('body').append(span);
                            span.animate({'top':(_top-40)+'px','opacity':'0'},1000, function () {
                                span.remove();
                            });
                        } else if (res.ret == 10002) {
                            qq.login.open();
                        }
                    });
                }
            });
            report('BROWSER.ACTIVITY.WARCRAFT.VOTE');
        },
        //查询票数
        getVoteNum : function(){
            var allnum = 2,
                uins = '1',
                vsDetail = [];
            for(var i = 2 ; i <= allnum; i++) uins += ('_' + i);
            zHttp.send({_c : 'query',actid:107150,uins: uins},function(json){
                if(json.ret==0){
                    for(var j=1;j<=allnum;j++){
                        vsDetail[j-1] = json.data['107149_'+j];
                    }
                    voteVS(vsDetail[0],vsDetail[1]);
                }
            });
        }
    });
    window.page = new Page();

})(window,jQuery);

//分享组件
var shareFunc = function(){
    var _url = _pageUrl + "?ADTAG=sina";
    var _pic = "http://stdl.qq.com/stdl/activity/warcraft/img/share.png";
    var _title = "十年魔兽，重磅来袭";
    var _description = "十年魔兽，重磅来袭！兄弟，你准备好了吗？QQ浏览器火爆上线部落×联盟两大阵营魔兽主题皮肤，超炫酷界面体验给最懂魔兽的你！现在换新肤就有机会赢取千万《魔兽》大电影优惠券！戳URL #我要的现在就要#";
    var shareUrl = "http://service.weibo.com/share/share.php?uid=1"
        +"&title=" + encodeURIComponent(_description)
        +"&frefer=" + encodeURIComponent(_url)
        +"&url=" + encodeURIComponent(_url)
        +"&pic=" + encodeURIComponent(_pic);
    window.open(shareUrl);
    report('BROWSER.ACTIVITY.WARCRAFT.SHARESINA');
};


//屏蔽特殊字符
function checkData(v) {
    var  entry = { "'": "&apos;", '"': '&quot;', '<': '&lt;', '>': '&gt;' };
    v = v.replace(/(['")-><&\\\/\.])/g, function ($0) { return entry[$0] || $0; });
    return v;
}
function mathRound (min,max){
    var temp=max-min+1;
    return Math.floor(Math.random()*temp+min);
}

var getUD = qv.cookie.get('qb_user');
if (getUD==null && !isIpad) {
    var adtag = qv.cookie.get('ADTAG');
    jQuery.ajax({
        type:"post",
        url:"http://tx013.jimicngame.com/txgame/index.php?g=Wap&m=WarcraftPage&a=action",
        data:"ADTAG="+adtag+"&DOMAIN="+document.domain,
        dataType: "json",
        timeout : 2000, //超时时间设置，单位毫秒
        success:function(msg){
            qv.cookie.set('qb_user',msg['user']);
        }
    });
}

//点赞
var cke = "qb_";
function setPraises(s){
    var _this = jQuery(s);
    var target = _this.find('strong'); //被点击的JQ对象
    var comment_id = _this.data('id');
    var comment_name = cke+"comment_"+comment_id;
    var comment_user = cke+"user";
    comment_num = qv.cookie.get(comment_name);
    getUDs = qv.cookie.get(comment_user);
    var floatNum = jQuery('<span>+1</span>');
    var _top = _this.offset().top - 5;
    var _left = _this.offset().left;
    if(_this.hasClass("selected")||comment_num!=null){
        alert("您已经点过赞啦！");
    }else{
        _this.addClass("selected");
        floatNum.css({'display':'inline-block','position':'absolute','top':_top+'px','left':_left+'px','z-index':'100','font-size':'16px','font-weight':'bold','color':'#ffda30','width':'34px','text-align':'center'});
        jQuery('body').append(floatNum);
        floatNum.show(0).animate({'top':(_top-30)+'px','opacity':'0'},1000, function () {
            floatNum.remove();
        });
        jQuery.ajax({
            type:"get",
            url:"http://tx013.jimicngame.com/txgame/index.php?g=Wap&m=WarcraftPage&a=set_praises",
            data:"user="+getUDs+"&comment_id="+comment_id,
            dataType: "json",
            timeout : 2000, //超时时间设置，单位毫秒
            success:function(msg){
                qv.cookie.set(comment_name,comment_id);
                var curNum = target.html();
                target.html(parseInt(curNum)+1);
            }
        });
    }
}


//提交留言
var STATUS = true,//防止多次点击
    uName = '',
    uMessage = '',
    uListsBox = '',
    roleID = 0;
function setMsgCount(type){
    uName = qv.cookie.get('_nick');
    if(qq.login.getUin() == 0 || uName == ''){
        qq.login.open();
        return false;
    }
    if(uName == null) {
        alert('请刷新页面重试！');
        return false;
    }
    if(type === 'bl') {
        uMessage = jQuery('#msg-text-bl');
        uListsBox = jQuery('#buluo-list>li');
        roleID = mathRound(0,4);
    } else if(type === 'lm') {
        uMessage = jQuery('#msg-text-lm');
        uListsBox = jQuery('#lianmeng-list>li');
        roleID = mathRound(5,9);
    } else {
        alert("请刷新页面重试！");
        return false;
    }
    //去空格
    var message = uMessage.val().replace(/\s+/g,"");
    if( message =="" || message == "说说你的想法"){
        alert("内容不能为空！");
        return false;
    }else{
        if(!STATUS){
            alert("正在提交！请稍后再试！");
            return false;
        }else{
            STATUS = false;//不能继续提交
            jQuery.ajax({
                type:"post",
                url:"http://tx013.jimicngame.com/txgame/index.php?g=Wap&m=WarcraftPage&a=set_msg",
                data:"nickname="+uName+"&user="+getUD+"&roleID="+roleID+"&message="+message,
                dataType: "json",
                success:function(msg){
                    STATUS = true;//恢复
                    var respond = '<li><div class="msg-agree" data-id = "'+msg['id']+'" onclick="setPraises(this)"><strong>0</strong></div><div class="msg-cont"><h5>' + checkData(uName) + '</h5><p>' + checkData(message)+ '</p></div></li>';
                    //置于首位
                    var firstLine = uListsBox.eq(0);
                    jQuery(respond).insertBefore(firstLine);
                    roleID = -1;
                    uMessage.val("说说你的想法");
                }
            });
        }
    }
}




//评论列表
var domeList_bl=jQuery("#buluo-list"),
    domeList_lm=jQuery("#lianmeng-list"),
    isLoad = true,
    page_all = 0,
    rowNum = 10,
    dataList_bl = [],
    dataList_lm = [],
    p_bl = 0,
    p_lm = 0;
function getMessageLists(cb) {
    if(!isLoad) return;
    isLoad = false;
    jQuery.ajax({
        type:"post",
        url:"http://tx013.jimicngame.com/txgame/index.php?g=Wap&m=WarcraftPage&a=get_hot_comments",
        data:"p=" + page_all,
        dataType: "json",
        timeout : 2000, //超时时间设置，单位毫秒
        success:function(msg){
            isLoad = true;
            page_all++;
            var respond = '',
                flag = true;
            jQuery.each(msg, function(i,val){
                respond = '<li><div class="msg-agree" data-id = "'+val.id+'" onclick="setPraises(this)"><strong>'+val.praises+'</strong></div><div class="msg-cont"><h5>' + checkData(val.nickname) + '</h5><p>' + checkData(val.comment_content)+ '</p></div></li>';
                if(val.headimgurl.indexOf('buluo') != -1 || val.comment_content.indexOf('为了部落') != -1) {
                    dataList_bl.push(respond);
                } else if(val.headimgurl.indexOf('lianmeng') != -1 || val.comment_content.indexOf('为了联盟') != -1) {
                    dataList_lm.push(respond);
                } else {
                    if(flag) {
                        dataList_bl.push(respond);
                        flag = false;
                    } else {
                        dataList_lm.push(respond);
                        flag = true;
                    }
                }
            });
            cb ? cb() : '';
        }

    });
}
function fillMessageBL(){
    var _dataTemp = [];
    if((p_bl + 1) * rowNum > dataList_bl.length) {
        getMessageLists(function () {
            fillMessageBL();
        });
    } else {
        for(var i = 0; i < rowNum; i++) {
            _dataTemp.push(dataList_bl[(p_bl * rowNum) + i]);
        }
        domeList_bl.append(_dataTemp.join(''));
        p_bl++;
    }
}
function fillMessageLM(){
    var _dataTemp = [];
    if((p_lm + 1) * rowNum > dataList_lm.length) {
        getMessageLists(function () {
            fillMessageLM();
        });
    } else {
        for(var i = 0; i < rowNum; i++) {
            _dataTemp.push(dataList_lm[(p_lm * rowNum) + i]);
        }
        domeList_lm.append(_dataTemp.join(''));
        p_lm++;
    }
}

function fillMessage(){
    getMessageLists(function () {
        fillMessageBL();
        fillMessageLM();
    });
}


window.onload = function(){
    //视频初始化；
    window.video = new tvp.VideoInfo();
    video.setVid("n0195hoc9ur");
    window.player = new tvp.Player();
    player.create({
        width: 520,
        height: 300,
        video: video,
        modId: "videoBox", //mod_player是刚刚在页面添加的div容器
        autoplay: true,  //是否自动播放
        flashWmode: "transparent",
        vodFlashSkin: "http://imgcache.qq.com/minivideo_v1/vd/res/skins/TencentPlayerMiniSkin.swf" //是否调用精简皮肤，不使用则删掉此行代码
    });

    if(!isIpad) {
        /*只有在QQ浏览器下查询皮肤*/
        if(isQQBrowser()) {
            querySkin();
        }

        /*发表留言*/
        jQuery("#sendMsgBl").on("click",function(){
            setMsgCount('bl');
        });
        jQuery("#sendMsgLm").on("click",function(){
            setMsgCount('lm');
        });
        jQuery('.msg-text-input').focus(function () {
            if(jQuery(this).val().replace(/\s+/g,"") == '说说你的想法') {
                jQuery(this).val('');
            }
        }).blur(function () {
            if(jQuery(this).val().replace(/\s+/g,"") == '') {
                jQuery(this).val('说说你的想法');
            }
        });
        jQuery('#msg-text-bl').keyup(function () {
            var me = jQuery(this),
                len = me.val().length;
            jQuery('#text-count-bl').text(len+'/60');
            if(len > 60) {
                me.val(me.val().substring(0,len-1));
            }
        });
        jQuery('#msg-text-lm').keyup(function () {
            var me = jQuery(this),
                len = me.val().length;
            jQuery('#text-count-lm').text(len+'/60');
            if(len > 60) {
                me.val(me.val().substring(0,len-1));
            }
        });

        /*自定义滚动条*/
        var outterH = jQuery("#msg-list-buluo").height();
        var outterT = jQuery("#msg-list-buluo").offset().top;
        var message_bl = jQuery("#buluo-list");
        var message_lm = jQuery("#lianmeng-list");
        jQuery("#msg-list-buluo").mCustomScrollbar({
            mouseWheelPixels: 100,
            callbacks: {
                onScroll: function () {
                    if((message_bl.height() + 30) - (-message_bl.offset().top + outterT + outterH) <= 200) {
                        //console.log('到达底部');
                        fillMessageBL();
                    }
                }
            }
        });
        jQuery("#msg-list-lianmeng").mCustomScrollbar({
            mouseWheelPixels: 100,
            callbacks: {
                onScroll: function () {
                    if((message_lm.height() + 30) - (-message_lm.offset().top + outterT + outterH) <= 200) {
                        //console.log('到达底部');
                        fillMessageLM();
                    }
                }
            }
        });
        //自动加载列表
        setTimeout(fillMessage,1500);
        //查询票数
        page.getVoteNum();
    }

    /*魔兽电影官网连接上报*/
    jQuery('.code a').click(function () {
        if(isIpad) {
            report('BROWSER.ACTIVITY.WARCRAFT.GUANWANGCLICK_IPAD');
        } else {
            report('BROWSER.ACTIVITY.WARCRAFT.GUANWANGCLICK');
        }
    })
};