/**
 * Created by v_zmengren on 2015/6/11.
 */
var inGame = false;
var isSigin = false;//是否领取管家登录
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

//分享组件
var shareFunc = function(type,url){
    var shareObj={
        qq: function(a){
            report('BROWSER.ACTIVITY.2015SUMMER.SHARECLICK_QQ');
            var b = {
                url: a.url,
                desc: a.description || "",
                pics: a.pic,
                summary: a.description || "",
                title: a.title || "",
                flash: '',
                site: 'QQ浏览器暑期新片0元看',
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
            report('BROWSER.ACTIVITY.2015SUMMER.SHARECLICK_QZONE');
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
            report('BROWSER.ACTIVITY.2015SUMMER.SHARECLICK_TENCENT');
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
        renren: function(a) {
            report('BROWSER.ACTIVITY.2015SUMMER.SHARECLICK_RENREN');
            var b = {
                resourceUrl: a.url,
                srcUrl:a.url,
                pic: a.pic || null,
                description: a.title
            };
            var s = [];
            for(var i in b){
                s.push(i + '=' + encodeURIComponent(b[i]||''));
            }
            return "http://widget.renren.com/dialog/share?" + s.join('&');
        },
        sina: function(a) {
            report('BROWSER.ACTIVITY.2015SUMMER.SHARECLICK_SINA');
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
        url: "http://event.browser.qq.com/stdl/2015summer/index.html?pvsrc="+type,
        pic: "http://stdl.qq.com/stdl/game/pic/2015summer_share.jpg",
        title: "起来嗨！QQ浏览器暑期新片0元看！",
        description: "QQ浏览器携手腾讯电脑管家送你免费视觉盛宴！新片兑换券，微票儿代金券100%中奖，速抢！"
    };
    if(url){
        wording.url = url;
    }
    window.open(shareObj[type](wording));
};
//微信
function weixinPop(){
    dialog.open("<p><img src='./images/codeWeixin.png'></p>");
}

//获取用户信息
var userInfo = {};
function getUserInfo(cb){
    zUtil.ensureLogin(function() {
        zHttp.send("http://cgi.vip.qq.com/contact/getusercontact", function (res) {
            if (res.ret == 0) {
                userInfo = {
                    name: res.data.NAME,
                    phone: res.data.PHONE,
                    email: res.data.EMAIL,
                    address: res.data.POST_ADDR
                };
                cb ? cb(userInfo) : '';
            } else if (res.ret == -7) {
                qq.login.open();
            }
        })
    })
}
//设置用户信息
function setUserInfo(obj, cb){
    //清除前后的空格
    for ( var i in obj){
        obj[i] = obj[i].trim();
    }
    //验证 邮箱
    if(!(/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/).test(obj.email)){
        alert('请输入有效的电子邮箱！');
        return;
    }
    //验证 联系地址
    if(!(/^[a-z0-9\u4e00-\u9fa5]{0,}$/).test(obj.address)) {
        alert('非法的汉字和英文字符，请重新输入！');
        return;
    }
    //验证手机号 并判断手机号是否修改
    var _url = 'http://cgi.vip.qq.com/contact/setusercontact?name='+ obj.name +'&phone='+ obj.phone +'&email='+ obj.email +'&post_address='+ obj.address +'&noChange_phone=';
    if (obj.phone == userInfo.phone){
        _url += "1";
    } else {
        _url += "0";
        if(isNaN(obj.phone) || obj.phone.length != 11){
            alert('请输入有效的手机号！');
            return;
        }
    }
    //判断是否修改
    var temp = 0;
    for (var k in obj) {
        if(obj[k] == userInfo[k]) {
            temp++;
        }
    }
    if(temp == 4){
        alert('联系信息未做修改！');
        return;
    }
    zUtil.ensureLogin(function() {
        zHttp.send(_url, function(res){
            if(res.ret == 0) {
                alert("修改成功！");
                cb ? cb() : '';
            } else if (res.ret == -7){
                qq.login.open();
            }
        })
    })
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
                <div class='P_btns'>\
                    <a href='javascript:;' class='btn btn_pop' onclick='dialog.hide();'><span>确定</span></a>\
                </div>";
        return html;
    },
    8 : function(){
        html = "<h3 style='font-size: 22px; padding:15px 0 10px;'>亲，这是QQ浏览器的专属活动</h3>\
                <p>请用QQ浏览器参加哦<br>如果还未安装，请<span class='red'>点击下载</span>安装</p>\
                <div class='P_btns'>\
                    <a href='javascript:;' class='btn btn_pop' onclick='document.getElementById(\"QBDownload\").click();dialog.hide();'><span>下载QQ浏览器</span></a>\
                </div>";
        return html;
    },
    7 : function(k){
        var _css = '';
        if(k){
            _css = 'font-weight:normal';
        }
        html = "<h3 style='font-size: 22px; padding:15px 0 10px; "+ _css +"'>您的QQ浏览器版本不符合要求</h3>\
                <p>请<span class='red'>点击下载</span>安装专用版QQ浏览器来参加活动</p>\
                <div class='P_btns'>\
                    <a href='javascript:;' class='btn btn_pop' onclick='document.getElementById(\"QBDownload\").click();dialog.hide();'><span>下载专用版QQ浏览器</span></a>\
                </div>";
        return html;
    },
    6 : function(){
        html = "<h3 style='font-size: 22px; padding:15px 0 10px;'>QQ浏览器抽奖次数已达上限</h3>\
                <p>谢谢您的关注</p>\
                <div class='P_btns'>\
                    <a href='javascript:;' class='btn btn_pop' onclick='dialog.hide();'><span>确定</span></a>\
                </div>";
        return html;
    },
    0 : function(k,type,cdkey){
        if(k == 1){
            html = "<p>恭喜，获得<strong style='font-size: 20px;'>"+ type +"</strong>电影票1张，</p>\
                <p>兑换码将在该影片上映前发送给您。</p>\
                <div class='P_btns'>\
                    <a href='javascript:;' target='_blank' class='btn btn_pop setUser'><span>填写联系方式</span></a>\
                </div>";
        } else if(k == 2){
            var _code = '',
                _count = '';
            if(type == '1'){
                _code = "<span style='display: block;width: 140px;background: #fff;margin-top:5px;'><img src='./images/code1.jpg' width='140' height='140'></span>";
                _count = "<p style='padding-top: 5px;'>恭喜，获得 <span style='font-size: 20px;font-weight: bold;'>微信电影票选座通兑码</span> ,</p><p>通兑码是：<span style='color:red;'>"+ cdkey +"</span></p><p>请使用微信客户端扫描左侧二维码关注“电影演出票”公众号</p><p>选择“我的->VIP通兑”进行兑换。</p>";
            } else {
                _code = "<span style='display: block;width: 130px;padding: 5px;background: #fff;'><img src='./images/code2.png' width='130' height='130'></span>";
                _count = "<p style='padding-top: 33px;padding-bottom: 10px;'>恭喜，获得 <span style='font-size: 20px;font-weight: bold;'>微信电影票红包20元</span> ,</p><p>请扫描二维码到微信客户端领取。</p>";
            }
            html = "<div style='width: 460px;margin:0 auto;overflow: hidden;'>\
                    <div style='float: left;width:140px;' id='createCode'>"+ _code +"</div>\
                    <div style='float: right;width: 300px;'>"+ _count +"</div>\
                </div>";
        } else if(k == 3){
            if (isSigin){
                html = "<p style='padding-top: 50px; font-weight: bold;'>╮(╯▽╰)╭  很遗憾，没抽中，少侠明日再战吧~</p>";
            } else {
                html = "<p style='padding-top: 50px; font-weight: bold;'>╮(╯▽╰)╭  很遗憾，没抽中，登录QQ电脑管家可以再战一次哦~</p>";
            }
        } else if(k == 4){
            if (isSigin){
                html = "<p style='padding-top: 50px; font-weight: bold;'>╮(╯▽╰)╭ 您没有抽奖机会了,少侠明日再战吧~</p>";
            } else {
                html = "<p style='padding-top: 50px; font-weight: bold;'>╮(╯▽╰)╭  亲，您没有抽奖机会了，登录QQ电脑管家可以再战一次哦~</p>";
            }
        } else if(k == 5){
            html = "<p style='padding-top: 50px; font-weight: bold;'>亲，活动太火爆了，请稍后再试</p>";
        }
        return html;
    },
    1 : function(){
        html = "<p style='font-weight: bold; padding-bottom: 15px;'>亲~ 你还没有登录管家哦～请按照以下步骤操作，确认登录电脑管家：</p>\
                <table border='0' style='font-size: 16px;text-align: left;'>\
                    <tr style='height: 45px;'>\
                        <td width='70' style='font-weight: bold;vertical-align: middle;'>步骤一：</td>\
                        <td width='240' style='vertical-align: middle;'>确认已安装管家10以上版本</td>\
                        <td style='vertical-align: middle;'><a href='http://dlied6.qq.com/invc/xfspeed/qqpcmgr/download/QQPCDownload72740.exe#?ADTAG=SNO=' class='btn btn_pop' onclick='dialog.hide();'><span>安装QQ电脑管家</span></a></td>\
                    </tr>\
                    <tr style='height: 20px;'><td></td><td></td><td></td></tr>\
                    <tr>\
                        <td style='font-weight: bold;'>步骤二：</td>\
                        <td>点击管家左上角使用QQ登录<strong style='display:block;font-size: 14px;color:#9e7818;padding-top:5px;'>注：登录电脑管家的QQ帐号需<br>要和活动页面保持一致</strong></td>\
                        <td style='vertical-align: top;'><img src='./images/pic.png'></td>\
                    </tr>\
                </table>";
        return html;
    },
    2 : function (info) {
        html = "<div class='popContTit'>获奖记录</div>\
                <div style='padding-top: 38px;text-align: left;'>"+ info +"</div>";
        return html;
    },
    3 : function (obj) {
        if(obj == undefined){
            obj = {'name':'','phone':'','email':'','address':''}
        }
        html = "<div class='popContTit'>填写联系方式</div>\
                <div class='userInfo'>\
                    <p><label>姓名</label><input id='user_name' type='text' value='"+ obj.name +"'></p>\
                    <p><label>手机号</label><input id='user_phone' type='text' value='"+ obj.phone +"'></p>\
                    <p><label>电子邮箱</label><input id='user_email' type='text' value='"+ obj.email +"'></p>\
                    <p><label>邮寄地址</label><input id='user_address' type='text' value='"+ obj.address +"'></p>\
                </div>\
                <div class='P_btns'>\
                    <a href='javascript:;' target='_blank' class='btn btn_pop' id='setUserBtn'><span>确认提交</span></a>\
                </div>";
        return html;
    }
};

//抽奖动画
function StartGame(key, cb){
    inGame = true;
    var keyArr = [135,315,0,270,180,90,45,45,225];
    jQuery("#luckyGift").rotate({
        angle: 0,
        animateTo: parseInt(1080 + keyArr[key-1]),
        duration: 3000,
        easing: jQuery.easing.easeInOutQuart,
        callback: cb
    });
}

//设置抽奖次数
function setMoney(m){
    var me = jQuery('#money');
    var k = 0;
    if(m === '++'){
        k = parseInt(me.text()) + 1;
    } else if (m === '--'){
        k = parseInt(me.text()) - 1;
    } else if(!isNaN(m)){
        k = m;
    }
    if(k < 0){
        k = 0;
    }
    me.text(k);
}


(function (window,$) {
    Page = qv.zero.extend(qv.zero.AbstractPage,{
        userJsonID : 50281,
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
            if(!!qq.login.getUin()){
                page.querySigin();
                page.queryMoney();
            }
            qq.login.bind('login', function () {
                page.querySigin();
                page.queryMoney();
            });
            qq.login.bind('logout', function () {
                setMoney('0');
            });
        },
        //领取管家机会
        signIn: function(){
            if(!isQQBrowser()){
                dialog.open(tips['8']());
                return;
            }
            zUtil.ensureLogin(function() {
                zHttp.send({'actid': 50287}, function (res) {
                    if (res.ret == 0) {
                        setMoney('++');
                        isSigin = true;
                        dialog.open("<h3 style='padding-top: 50px;font-size: 18px;'>恭喜您获得了一次抽奖机会，赶快去抽大奖吧！</h3>");
                    } else if (res.ret == 10002){
                        qq.login.open();
                    } else if (res.ret == 10001 || res.ret == 10004) {
                        dialog.open(tips['9']());
                    } else if (res.ret == 10601) {
                        dialog.open("<h3 style='padding-top: 50px;font-size: 18px;'>亲，您已经领取过了，请明天再来哦^_^</h3>");
                    } else if (res.ret == 10603) {
                        dialog.open("<h3 style='padding-top: 50px;font-size: 18px;'>亲，您已经达到领取上限，感谢您的关注^_^</h3>");
                    }  else if (res.ret == 40037) {
                        dialog.open(tips['1']());
                    } else {
                        zHttp.showResponse(res, res.actid, $.noop);
                    }
                });
            });
            report("BROWSER.ACTIVITY.2015SUMMER.EXCHANGEWUANJIACLICK");
        },
        //查询是否领取了登录管家的机会
        querySigin: function(){
            zHttp.send({'actid': 50359}, function (res) {
                if(res.ret == 0) {
                    isSigin = res.data.op.join['50287'];
                }
            });
        },
        //查询抽奖机会
        queryMoney: function(){
            zHttp.send({'actid': 50362}, function (res) {
                if(res.ret == 0) {
                    zHttp.send({'actid': 50437}, function (json) {
                        if(json.ret == 0){
                            var k = json.data.op.count;
                            var m = res.data.op;
                            var n = k == 0 ? 1 : 0;
                            var money = parseInt(n + m);
                            setMoney(money);
                        }
                    })
                }
            });
        },
        //抽奖
        getLucky: function(){
            if(!isQQBrowser()){
                dialog.open(tips['8']());
                return;
            }
            if(qb_guid == 0){
                dialog.open(tips['7'](1));
                return;
            }
            zUtil.ensureLogin(function(){
                if(inGame){return;}
                var _url = "http://festival.browser.qq.com/valentineOperation?_record_gift_flow=1&actid=50323&guid="+qb_guid;
                zHttp.send(_url, function (res) {
                    if (res.ret == 0) {
                        try{
                            var key = res.data.op.diamonds;
                            var name = res.data.op.name;
                            var ccdkey = res.data.op.cdkey;
                            if (key >= 1 && key <= 9) {
                                StartGame(key, function () {
                                    if (key >= 1 && key <= 6){
                                        dialog.open(tips['0'](1,name));
                                    } else if (key == 7){
                                        dialog.open(tips['0'](2, '1',ccdkey)); //选座券
                                    } else if ( key == 8){
                                        dialog.open(tips['0'](2, '2')); //红包兑换券
                                    } else if ( key == 9) {
                                        dialog.open(tips['0'](3));  //未抽中
                                    } else {
                                        dialog.open(tips['0'](5));  //太火爆
                                    }
                                    setMoney('--');
                                    inGame = false;
                                });
                            }
                            else {
                                zHttp.showResponse(res, res.actid, $.noop);
                            }
                        }catch(err) {
                            zHttp.showResponse(res, res.actid, $.noop);
                        }
                    } else if (res.ret == -1){
                        zHttp.send({actid:50470});//GUID无效上报
                        dialog.open(tips['7']());
                    } else if (res.ret == -2){
                        dialog.open(tips['6']());
                    } else if (res.ret == 20801) {
                        dialog.open(tips['0'](4));  //没有抽奖机会
                    } else if (json.ret == 10002) {
                        qq.login.open();
                    } else if (json.ret == 10001 || json.ret == 10004) {
                        dialog.open(tips['9']());
                    } else {
                        zHttp.showResponse(res, res.actid, $.noop);
                    }
                });
            });
            report("BROWSER.ACTIVITY.2015SUMMER.GETLUCKYCLICK");
        },
        //查询中奖纪录
        queryGift : function() {
            zUtil.ensureLogin(function () {
                zHttp.send({actid: 50358}, function (res) {
                    if (res.ret == 0) {
                        var _htmlArr = [],
                            _html = '',
                            count = 0,
                            j = 0;
                        for (var i in res.data.op) {
                            var obj = res.data.op[i].val,
                                time = qv.date.format("Y.m.d", obj.time * 1000),
                                name = obj.name;
                            if (obj.name === "谢谢参与"){continue;}
                            if (obj.name === "微信电影票选座通兑码"){
                                _htmlArr.push('<li><span class="time">'+ time +'</span><span class="info">'+ name +'</span>　<a href="http://vip.qq.com/my/gift.html" target="_blank">查看通兑码</a></li>');
                            } else{
                                _htmlArr.push('<li><span class="time">'+ time +'</span><span class="info">'+ name +'</span></li>');
                            }
                            count++;
                        }
                        if (count == 0) {
                            _html = '<div class="noGifts">亲，您还没有抽中任何奖品！</div>';
                        }else{
                            _html = '<ul class="giftsList">'+ _htmlArr.join("") +'</ul>';
                        }
                        dialog.open(tips['2'](_html));
                    } else if (res.ret == 10002) {
                        qq.login.open();
                    } else if (res.ret == 10001 || res.ret == 10004) {
                        dialog.open(tips['9']());
                    } else {
                        zHttp.showResponse(res, res.actid, $.noop);
                    }
                });
                report("BROWSER.ACTIVITY.2015SUMMER.QUERYGIFTSCLICK");
            });
        }
    });
    window.page = new Page();

    window.onload = function(){
        $('body').on('click','.setUser',function () {
            getUserInfo(function (res) {
                dialog.open(tips['3'](res));
            })
        });
        $('body').on('focus','#user_phone', function () {
            if(jQuery(this).val() == userInfo.phone){
                jQuery(this).val('');
            }
        });
        $('body').on('blur','#user_phone', function () {
            if(jQuery(this).val() == ''){
                jQuery(this).val(userInfo.phone);
            }
        });
        $('body').on('click','#setUserBtn',function () {
            userContact = {
                name : $('#user_name').val(),
                phone : $('#user_phone').val(),
                email : $('#user_email').val(),
                address : $('#user_address').val()
            };
            setUserInfo(userContact, function(){
                dialog.hide();
            })
        })
    };
})(window,jQuery);
