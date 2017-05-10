
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
                    <a href='http://dldir1.qq.com/invc/tt/QQBrowser_Setup_Privilegecenter.exe#?ADTAG=SNO=' class='btn btn_downloadQB' onclick='report(\"BROWSER.ACTIVITY.007.DOWNLOADQBCLICK\")'>下载QQ浏览器</a>\
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
                    <a href='http://dldir1.qq.com/invc/tt/QQBrowser_Setup_Privilegecenter.exe#?ADTAG=SNO=' class='btn btn_downloadQB2' onclick='report(\"BROWSER.ACTIVITY.007.DOWNLOADQBCLICK2\")'>下载专用版QQ浏览器</a>\
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
            html = "<div class='popContTit'>提示</div>\
                    <div class='contentGifts'>\
                        <h3 class='gifts_title'>\
                            <p>恭喜您获得</p>\
                            <p class='tit'>《007幽灵党》电影票一张</p>\
                        </h3>\
                        <div class='giftsCdkey'>兑换码为：" + cdkey + "</div>\
                        <div class='giftsExplain' style=''>\
                            <div class='giftsTips' style=''>\
                                <p>使用规则：</p>\
                                <p>1、绑定：下载并激活格瓦拉@电影APP→注册/登陆→点击个人中心→票券/活动码→输入/粘贴→绑定</p>\
                                <p>2、使用：选择影片、影院、场次、座位→点击活动→选择票券→确认订单→凭取票短信至影院自助取票机取票</p>\
                                <p>3、规则：①需下载格瓦拉@电影 APP使用，每台手机+每个ID+手机号，只能使用一次 </p>\
                                <p>②有效期：2015.11.30，适用格瓦拉全国合作影院</p>\
                                <p>③电影节、见面会等特殊场次无法使用</p>\
                            </div>\
                        </div>\
                    </div>";
        } else if(k == 2){
            html = "<div class='popContTit'>提示</div>\
                    <div class='contentGifts'>\
                        <h3 class='gifts_title'>\
                            <p>恭喜您获得</p>\
                            <p class='tit'>《007幽灵党》电影红包一个 </p>\
                        </h3>\
                        <div class='giftsExplain'>\
                            <div class='giftsCode'><img src='http://event.browser.qq.com/stdl/activity/007/images/code2.jpg' width='104' height='104'><span>扫描二维码获取</span></div>\
                            <div class='giftsTips_half' style=''>\
                                <p>使用规则：</p>\
                                <p>1、输入手机号点击立即领取，将获得 格瓦拉电影10元代金券一张</p>\
                                <p>2、每个手机号限额领取1次，数量有限先到先得</p>\
                                <p>3、中奖后，请使用输入的手机号注册/登录，若中票券可在我的里查看票券/活动码</p>\
                                <p>4、使用时请在选择完影片，影院，座位，确认订单时勾选活动使用兑换</p>\
                                <p>5、票券有效期至2015年11月30日</p>\
                                <p>6、凡以不正当手段（包括但不限于作弊、扰乱系统、实施网络攻击等）参与本次活动的，格瓦拉有权终止 其参与活动，取消其使用资格（如奖品已发放，格瓦拉有权追回）</p>\
                                <p>7、如有疑问请致电格瓦拉客服10101068</p>\
                            </div>\
                        </div>\
                    </div>";
        }
        return html;
    },
    5 : function(){
        html = "<div class='popContTit'>提示</div>\
                <div class='contentBox timeTips'>\
                    <p class='msg'>时间还没到哦~</p>\
                    <p>每天11点、16点开抢</p>\
                </div>";
        return html;
    },
    1 : function(){
        html = "<div class='popContTit'>亲爱的用户</div>\
                <div class='contentBox popConCenter'>\
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
        userJsonID: 71217,
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
        getLucky: function (actID) {
            if (!isQQBrowser()) {
                dialog.alert(tips['8']());
                return;
            }
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
                    } else if(res.ret == 10008){
                        var _html = "活动还未开放,请参照公告日期到时来参与";
                        dialog.alert(tips['10'](_html));
                    } else {
                        zHttp.showResponse(res, res.actid, $.noop);
                    }
                });
            });
        },
        //查询中奖记录
        queryGift: function () {
            zUtil.ensureLogin(function () {
                zHttp.send({actid: 71292}, function (res) {
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
                            if (name === "007幽灵党电影票") {
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
                report("BROWSER.ACTIVITY.007.QUERYGIFTSCLICK");
            });
        }
    });


    //分享组件
    var shareFunc = function(type,url){
        report('BROWSER.ACTIVITY.007.SINA');
        var _url = "http://tq.qq.com/events/007/index.html?ADTAG=sina";
        var _pic = "http://event.browser.qq.com/stdl/activity/007/img/share.jpg";
        var _title = "#QQ浏览器邀你看首映，免费电影票等你领！";
        var _description = "QQ浏览器请你免费看史上最昂贵电影——《007幽灵党》！想看高达3.5亿美元的总投资是怎么造的？速戳→_→";
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



(function(window,$){
    var timeHandle = null;
    var severTime = new Date().getTime();
    setTime(severTime);
    zHttp.send({actid: 71217}, function (res) {
        var curr = new Date().getTime();
        if ((curr - res.time * 1000 > 2000) || (curr - res.time * 1000 < -2000)) {
            severTime = res.time*1000;
            setTime(severTime); // test setTime();
        };
    });

    function setTime(severTime){
        severTime = severTime + 1000;
        clearTimeout(timeHandle); 
        var drawTime = {
            startDay: new Date(2015,10,6),
            endDay: new Date(2015,10,18),//不包括18号
            am_hours: [11,13], //不包括13点
            pm_hours: [16,21], //不报括21点
        };
        var now = new Date(severTime);
        var deadline = new Date();
        deadline.setDate(now.getDate());
        var minutes = now.getMinutes();
        var seconds = now.getSeconds();   
        if(now < drawTime.startDay || now >= drawTime.endDay){
            $('#btn_rob').removeClass().addClass('disabled');
            return false;
        };  
        var hour =  now.getHours();
        if(hour < drawTime.am_hours[0] ){
            deadline.setHours(drawTime.am_hours[0],0,0);
            countDown(now,deadline);
            if(!$(this).hasClass('btn_begin')){
                $('#btn_rob').removeClass().addClass('btn_begin'); 
            };               
        }else if(hour >= drawTime.pm_hours[0]){
           if(hour >= drawTime.pm_hours[0] && hour < drawTime.pm_hours[1] ){
                if(!$('#btn_rob').hasClass('btn_drawing')){
                    $('#btn_rob').removeClass().addClass('btn_drawing'); 
                };
                $('#btn_rob').addClass('btn_after');              
                countDown(now,now);  
           }else{
               var today = deadline.getDate();
               if(today + 1 < drawTime.endDay.getDate() ){
                    deadline.setDate(today + 1);
                    deadline.setHours(drawTime.am_hours[0],0,0);
                    countDown(now,deadline);
                    if(!$(this).hasClass('btn_begin')){
                        $('#btn_rob').removeClass().addClass('btn_begin'); 
                    };    
               }else{
                    countDown(now,now);
                    $('#btn_rob').removeClass().addClass('disabled');
               };
           }; 

        }else{
            if(hour >= drawTime.am_hours[0]  && hour < drawTime.am_hours[1] ){
                if(!$('#btn_rob').hasClass('btn_drawing')){
                    $('#btn_rob').removeClass().addClass('btn_drawing'); 
                };
                $('#btn_rob').addClass('btn_before');    
                countDown(now,now);
            }else{
                deadline.setHours(drawTime.pm_hours[0],0,0);
                countDown(now,deadline);
                if(!$(this).hasClass('btn_begin')){
                    $('#btn_rob').removeClass().addClass('btn_begin'); 
                }; 
            };
        };
        timeHandle = setTimeout(function(){
            setTime(severTime);
        },1000);
    };

    function setNum(key){
        if(key < 10){
            key = '0' + key;
        };
        return key;
    };

    function countDown(start,deadline){
        var odd = (deadline - start)/1000;
        var oddHours = parseInt(odd/3600);
        var oddMinutes = parseInt((odd - oddHours*3600)/60);
        var oddSeconds = parseInt(odd - oddHours*3600 - oddMinutes*60);
        $('#timebox').html('<span class="hour">'+setNum(oddHours)+'</span><span class="minutes">'+setNum(oddMinutes)+'</span><span class="second">'+setNum(oddSeconds)+'</span>');
    };


    $('#btn_rob').on('click', function(){
        if (!isQQBrowser()) {
            dialog.alert(tips['8']());
            return;
        };
        if (!qq.login.getUin()) {
            qq.login.open();
            return;
        };        
         zHttp.send({actid:71294},function(){});
         if( $(this).hasClass('btn_begin') ){
             dialog.alert(tips[5]());
         }else if( $(this).hasClass('btn_before')){
             page.getLucky(71290);
             report("BROWSER.ACTIVITY.007.GETLUCKY_AM");
         }else if( $(this).hasClass('btn_after')){
             page.getLucky(71291);
             report("BROWSER.ACTIVITY.007.GETLUCKY_PM");
         };
    });


}(window,jQuery));