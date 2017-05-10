
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
        html = "<div class='popContTit'>亲爱的用户</div>\
                <div class='contentBox popConCenter'>\
                    <p>亲，这是QQ浏览器的专属活动</p>\
                    <p>请用QQ浏览器参加哦</p>\
                    <p>如果还未安装，请<span class='red'>点击下载</span>安装</p>\
                </div>\
                <div class='P_btns'>\
                    <a href='http://dldir1.qq.com/invc/tt/QQBrowser_Setup_Privilegecenter.exe#?ADTAG=SNO=' class='btn btn_downloadQB' onclick='report(\"BROWSER.ACTIVITY.KILLER.DOWNLOADQBCLICK\")'>下载QQ浏览器</a>\
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
                    <a href='http://dldir1.qq.com/invc/tt/QQBrowser_Setup_Privilegecenter.exe#?ADTAG=SNO=' class='btn btn_downloadQB2' onclick='report(\"BROWSER.ACTIVITY.KILLER.DOWNLOADQBCLICK2\")'>下载专用版QQ浏览器</a>\
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
    0 : function(k,cdkey){
        if(k == 1){
            html = "<div class='popContTit'>QQ浏览器</div>\
                    <div class='contentGifts'>\
                        <h3 class='gifts_title'>\
                            <p>恭喜您获得</p>\
                            <p class='tit'>《消失的凶手》电影票一张</p>\
                        </h3>\
                        <div class='giftsCdkey'>兑换码为：" + cdkey + "</div>\
                        <div class='giftsExplain' style=''>\
                            <div class='giftsTips' style=''>\
                                <p>使用规则：</p>\
                                <p>1.该码仅可用于兑换《消失的凶手》影票2张，须一次完成全部兑换。</p>\
                                <p>2. 请于该片上映前后（11月26日—12月15日）登录乐视商城http://www.lemall.com/ticket.html，在购买 《消失的凶手》影票选座后结算页面：使用优惠券项输入兑换券码绑定抵扣使用。</p>\
                                <p>3. 每笔订单仅可使用一张券码，不找零、不兑现、使用后作废。</p>\
                                <p>4. 如有疑问，请联系客服：1010-9000。</p>\
                            </div>\
                        </div>\
                    </div>";
        } else if(k == 2){
            html = "<div class='popContTit'>QQ浏览器</div>\
                    <div class='contentGifts'>\
                        <h3 class='gifts_title'>\
                            <p>恭喜您获得</p>\
                            <p class='tit'>《消失的凶手》电影红包一个 </p>\
                        </h3>\
                        <div class='giftsExplain'>\
                            <div class='giftsCode'><img src='http://event.browser.qq.com/stdl/activity/killer/images/code.jpg' width='120' height='120'><span>扫描二维码获取</span></div>\
                            <div class='giftsTips_half' style=''>\
                                <p>使用规则：</p>\
                                <p><span>1、</span><em>输入手机号点击'立即领取'，将获得格瓦拉电影10元代金券一张</em></p>\
                                <p><span>2、</span><em>每个手机号限额领取1次，数量有限先到先得</em></p>\
                                <p><span>3、</span><em>中奖后，请使用输入的手机号注册/登录，若中票券可在'我的'里查看票券/活动码</em></p>\
                                <p><span>4、</span><em>使用时请在选择完影片，影院，座位，确认订单时勾选'活动码'使用兑换</em></p>\
                                <p><span>5、</span><em>票券有效期至2015年11月30日</em></p>\
                                <p><span>6、</span><em>凡以不正当手段（包括但不限于作弊、扰乱系统、实施网络攻击等）参与本次活动的，格瓦拉有权终止其参与活动，取消其使用资格（如奖品已发放，格瓦拉有权追回）</em></p>\
                                <p><span>7、</span><em>如有疑问请致电格瓦拉客服10101068</em></p>\
                            </div>\
                        </div>\
                    </div>";
        }
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
        html = "<div class='popContTit'>获奖记录</div>\
                <div style='text-align: left;'>"+ info +"</div>";
        return html;
    },
    10 : function(tip){
        html = "<div class='popContTit'>提示</div>\
                <div class='contentBox txtCenter'>\
                    <p>"+tip+"</p>\
                </div>";
        return html;       
    }
};


(function (window,$) {
    Page = qv.zero.extend(qv.zero.AbstractPage, {
        userJsonID: 73941,
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
                
            }
            qq.login.bind('login', function () {
                
            });
            qq.login.bind('logout', function () {

            });
        },
        //抽奖
        getLucky: function () {
            if (!isQQBrowser()) {
                dialog.alert(tips['8']());
                return;
            }
            //var actID = 73942; //test
            var actID = 73945;
            zUtil.ensureLogin(function () {
                // 记录奖品时 必须加字段 _record_gift_flow : 1 ， 若记录末等奖时 再加字段(不记录则不加) _record_def_gift : 1
                zHttp.send({actid: actID,_record_gift_flow : 1,_record_def_gift : 1,guid:qb_guid}, function (res) {
                    if (res.ret == 0) {
                        var key = res.data.op.diamonds;
                        var cdkey = res.data.op.cdkey;
                        if (key == 1) {
                            dialog.open(tips['0'](1, cdkey));//兑换券
                        } else {
                            dialog.open(tips['0'](2));//优惠券
                        };
                    }else if (res.ret == 10601 || res.ret == 10603) {
                        dialog.alert(tips['1']());  //没有抽奖机会
                    } else if (res.ret == 10002) {
                        qq.login.open();
                    } else if (res.ret == 10001 || res.ret == 10004) {
                        dialog.alert(tips['9']());
                        $('#btn_rob').addClass('disabled');
                    } else if(res.ret == 10008){
                        var _html = "活动还未开放,请参照公告日期到时来参与";
                        dialog.alert(tips['10'](_html));
                    } else {
                        zHttp.showResponse(res, res.actid, $.noop);
                    }
                });
                report("BROWSER.ACTIVITY.KILLER.GETLUCKY");
            });
        },
        //查询中奖记录
        queryGift: function () {
            zUtil.ensureLogin(function () {
                zHttp.send({actid: 73947}, function (res) {
                    if (res.ret == 0) {
                        var _htmlArr = [],
                            _html = '',
                            count = 0,
                            j = 0;
                        for (var i in res.data.op) {
                            var obj = res.data.op[i].val,
                                time = qv.date.format("Y-m-d", obj.time * 1000),
                                name = obj.name,
                                cdkVal = obj.info;
                            if (name === "消失的凶手电影票") {
                                _htmlArr.push('<li><span class="giftsTime">' + time + '</span><span class="giftsInfo">' + name + '</span><span style="cursor: pointer; text-decoration: underline;" class="cdkey" ONCLICK="dialog.open(tips[\'0\'](1, \''+ cdkVal +'\'))">兑换码:'+cdkVal+'</span></li>');
                            } else {
                                _htmlArr.push('<li><span class="giftsTime">' + time + '</span><span style="cursor: pointer; text-decoration: underline;" class="giftsInfo" onclick="dialog.open(tips[\'0\'](2))">' + name + '</span></li>');
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
                report("BROWSER.ACTIVITY.KILLER.QUERYGIFTSCLICK");
            });
        }
    });


    //分享组件
    var shareFunc = function(type,url){
        report('BROWSER.ACTIVITY.KILLER.SINA');
        var _url = "http://tq.qq.com/events/killer/index.html?ADTAG=sina";
        var _pic = "http://event.browser.qq.com/stdl/activity/killer/img/share.jpg";
        var _title = "#QQ浏览器邀你看首映，免费电影票等你领！";
        var _description = "马战、车战、枪战！QQ浏览器请你免费看悬疑推理大片《消失的凶手》：老牌男神刘青云搭档江一燕、李小璐狂野探奇案！速戳→_→";
        var shareUrl = "http://service.weibo.com/share/share.php?uid=1"
            +"&title=" + encodeURIComponent(_description)
            +"&frefer=" + encodeURIComponent(_url)
            +"&url=" + encodeURIComponent(_url)
            +"&pic=" + encodeURIComponent(_pic);
        window.open(shareUrl);
    };

    window.page = new Page();
    window.api = {
        share:shareFunc
    };
})(window,jQuery);


window.onload = function(){
    //视频初始化；
    window.video = new tvp.VideoInfo();
    video.setVid("i0018kd41a6");
    window.player = new tvp.Player();
    player.create({
        width: 720,
        height: 408,
        video: video,
        modId: "videoBox", //mod_player是刚刚在页面添加的div容器
        autoplay: false,  //是否自动播放
        flashWmode: "transparent",
        vodFlashSkin: "http://imgcache.qq.com/minivideo_v1/vd/res/skins/TencentPlayerMiniSkin.swf" //是否调用精简皮肤，不使用则删掉此行代码
    });    
};
