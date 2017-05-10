
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
                    <a href='http://dldir1.qq.com/invc/tt/QQBrowser_Setup_Privilegecenter.exe#?ADTAG=SNO=' class='btn btn_downloadQB' onclick='report(\"BROWSER.ACTIVITY.GONELOVER.DOWNLOADQBCLICK\")'>下载QQ浏览器</a>\
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
                    <a href='http://dldir1.qq.com/invc/tt/QQBrowser_Setup_Privilegecenter.exe#?ADTAG=SNO=' class='btn btn_downloadQB2' onclick='report(\"BROWSER.ACTIVITY.GONELOVER.DOWNLOADQBCLICK2\")'>下载专用版QQ浏览器</a>\
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
                            <p>恭喜您</p>\
                            <p class='tit'>获得《消失的爱人》电影票一张</p>\
                        </h3>\
                        <div class='giftsCdkey'>兑换码为：" + cdkey + "</div>\
                        <div class='giftsExplain' style=''>\
                            <div class='giftsTips' style=''>\
                                <p class='ptit'>使用规则：</p>\
                                <p class='rule_order'><span>1.</span><em>打开百度糯米APP，点击右下角“我的”->订单下面的“电影”->预售->激活兑换码</em></p>\
                                <p class='rule_order'><span>2.</span><em>在激活兑换码页面，输入兑换码，最后点击底部“完成”按钮，进入选座流程：选择影院-> 选择观影场次->选择座位->确认兑换</em></p>\
                                <p class='rule_order'><span>3.</span><em>有效期1月5日—1月18日（含5日和18日）</em></p>\
                                <p class='rule_order'><span>4.</span><em>兑换成功后，用户将收到取票短信，请根据短信提示到影院的自助终端机出票</em></p>\
                                <p class='rule_order'><span>5.</span><em>每个兑换码仅限兑换一个座位</em></p>\
                                <p class='rule_order'><span>6.</span><em>兑换码不支持兑换场次为IMAX、VIP厅、明星见面会、影院公告的特殊场次，如情人节、中秋节、平安夜、圣诞节</em></p>\
                                <p class='rule_order'><span>7.</span><em>使用过程如有疑问，请拨打客服电话咨询：4006-099-866</em></p>\
                            </div>\
                        </div>\
                    </div>";
        } else if(k == 2){
            html = "<div class='popContTit'>QQ浏览器</div>\
                    <div class='contentGifts'>\
                        <h3 class='gifts_title'>\
                            <p>恭喜您</p>\
                            <p class='tit'>获得《消失的爱人》电影红包一个 </p>\
                        </h3>\
                        <div class='giftsExplain'>\
                            <div class='giftsCode'><img src='http://event.browser.qq.com/stdl/activity/GoneLover/images/code.jpg' width='140' height='140'><span>微信扫码领取</span></div>\
                            <div class='giftsTips' style=''>\
                                <p class='ptit'>使用规则：</p>\
                                <p class='rule_order'><span>1、</span><em>红包限在微信电影票使用，不限影院、不限城市；</em></p>\
                                <p class='rule_order'><span>2、</span><em>红包仅用于在线选座购票影院，每个订单限用一张，不限影片使用；</em></p>\
                                <p class='rule_order'><span>3、</span><em>红包不可以转赠、分享，并不能与影院其他优惠同时使用；</em></p>\
                                <p class='rule_order'><span>4、</span><em>红包效期为：动态有效期，从领取日起30天内有效；</em></p>\
                                <p class='rule_order'><span>5、</span><em>红包仅限购买35元以上的影票使用；</em></p>\
                                <p class='rule_order'><span>6、</span><em>红包每个用户只能领取一次，新用户20元，老用户5元；</em></p>\
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
        html = "<div style='text-align: left;'>\
                <div class='wardTit'>获奖记录</div>"+ info +"</div>";               
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
        userJsonID:82175,
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
            if($('#btn_rob').hasClass('disabled')){
                return;
            };

            if (!isQQBrowser()) {
                dialog.alert(tips['8']());
                return;
            };

            //var actID = 82203; //test
            var actID = 82207;
            zUtil.ensureLogin(function () {
                // 记录奖品时 必须加字段 _record_gift_flow : 1 ， 若记录末等奖时 再加字段(不记录则不加) _record_def_gift : 1
                zHttp.send({actid: actID,_record_gift_flow : 1,_record_def_gift : 1,guid:qb_guid}, function (res) {
                    if (res.ret == 0) {
                        var key = res.data.op.diamonds;
                        var cdkey = res.data.op.cdkey;
                        if (key == 1) {
                            dialog.open(tips['0'](1, cdkey));//兑换券
                        } else {
                            dialog.open(tips['0'](2, cdkey));//优惠券
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
                report("BROWSER.ACTIVITY.GONELOVER.GETLUCKY");
            });
        },
        //查询中奖记录
        queryGift: function () {
            zUtil.ensureLogin(function () {
                zHttp.send({actid: 82209}, function (res) {
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
                            if (name === "消失的爱人电影票") {
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
                report("BROWSER.ACTIVITY.GONELOVER.QUERYGIFTSCLICK");
            });
        }
    });


    //分享组件
    var shareFunc = function(type,url){
        report('BROWSER.ACTIVITY.GONELOVER.SINA');
        var _url = "http://tq.qq.com/events/gonelover/index.html?ADTAG=sina";
        var _pic = "http://event.browser.qq.com/stdl/activity/GoneLover/img/share.png";
        var _title = "#QQ浏览器邀你看首映，免费电影票等你领！";
        var _description = "当#0115消失的爱人#灵魂归来，你会恐惧讶异，还是为与她厮守而倾尽所有去保密？ 猛戳→免费观影，看黎明、王珞丹携手探寻不死挚爱！";
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
    video.setVid("g01791jld57");
    window.player = new tvp.Player();
    player.create({
        width: 622,
        height: 355,
        video: video,
        modId: "videoBox", //mod_player是刚刚在页面添加的div容器
        autoplay: true,  //是否自动播放
        flashWmode: "transparent",
        vodFlashSkin: "http://imgcache.qq.com/minivideo_v1/vd/res/skins/TencentPlayerMiniSkin.swf" //是否调用精简皮肤，不使用则删掉此行代码
    });

    zHttp.send({actid: 82175}, function (res) {
        var now = new Date(res.time*1000);
        var month = now.getMonth();
        var day = now.getDate();
        if(month == 12 && day >= 18){
            jQuery('#btn_rob').addClass('disabled');
        };      
    });

};
