/**
 * Created by v_zmengren on 2016/11/4.
 */
var inGame = false;
var hasMoney = false;
var isIpad = false;
var ipadJoin = false;
if(typeof console === "undefined"){
    console = { log: function() { } };
}
//是否是ipad
isIpad = (function (){
        var useragent = window.navigator.userAgent;
        if(useragent.toString().indexOf("MQQBrowser") < 0){
            return false;
         }
            return true;
    })()
//活动地址 不带任何参数
var _pageUrl = location.protocol + '//' + location.host + location.pathname;
//获取AMS系统中设置的提示语
function getAmsMsg(res) {
    var msgCfg = zHttp.getMsgByState( res.data, res.actid, res.ret, $.noop );
    return zMsg.repair( msgCfg.m );
}

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
    if(!(/^[a-zA-Z0-9\u4e00-\u9fa5]{0,}$/).test(obj.address)) {
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
//设置用户信息
function setUserPhone(obj, cb){
    console.log(obj)
    //清除前后的空格
    for ( var i in obj){
        obj[i] = obj[i].trim();
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
        if(ObjCss == 'luckyPop') {
            popBg.className = "popBg popBg2";
        }
        document.body.appendChild(popBg);

        popBox = document.createElement('div');
        popBox.className = 'popMsg ' + ObjCss;
        popBox.id = 'popMsg_'+id;
        document.body.appendChild(popBox);

        var content = msg || '';
        popBox.innerHTML = '<a href="javascript:void(0);" class="popClose" onclick="dialog.hide()" title="关闭"></a><div class="popTop"></div><div class="popWrap"><div class="popContainer">'+ content +'</div></div><div class="popBottom"></div>';
        popBox.style.marginTop = popBox.offsetHeight/-2 + 15 +'px';
    },
    alert : function(msg, flag){
        this.init(flag, msg);
    },
    show : function(msg, className , flag){
        this.init(flag, msg, className);
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
var PopHtml;
var tips = {
    10 : function(tip){
        PopHtml = '<p style="height: 120px; padding-top: 10px; line-height: 35px;">' + tip + '</p>\
                <div class="P_btns">\
                    <a href="javascript:;" class="btn btn_pop" onclick="dialog.hide();"><span>我知道了</span></a>\
                </div>';
        return PopHtml;
    },
    9 : function(){
        var temp = '活动已经结束！<br>敬请期待更多QQ浏览器特权活动！';
        PopHtml = '<p style=" height: 120px; padding-top: 10px; line-height: 35px;">' + temp + '</p>\
                <div class="P_btns">\
                    <a href="javascript:;" class="btn btn_pop" onclick="dialog.hide();"><span>我知道了</span></a>\
                </div>';
        return PopHtml;
    },
    7 : function(){
        PopHtml = '<p style=" height: 120px; padding-top: 20px;">亲，活动太火爆了，请稍后再试</p>\
                <div class="P_btns">\
                    <a href="javascript:;" class="btn btn_pop" onclick="dialog.hide();"><span>我知道了</span></a>\
                </div>';
        return PopHtml;
    },
    6 : function (info) {
        PopHtml = '<div class="popContTit">获奖记录</div>\
                <ul class="giftsList">'+ info +'</ul>\
                <div class="P_btns">\
                    <a href="javascript:;" class="btn btn_pop" onclick="dialog.hide();"><span>我知道了</span></a>\
                </div>';
        return PopHtml;
    },
    5 : function (obj) {
        if(obj == undefined){
            obj = {'name':'','phone':'','email':'','address':''};
        }
        PopHtml = '<div class="popContTit">填写联系方式</div>\
                <div class="userInfo">\
                    <p><label>姓名</label><input id="user_name" type="text" value="'+ obj.name +'"></p>\
                    <p><label>手机号</label><input id="user_phone" type="text" value="'+ obj.phone +'"></p>\
                    <p><label>电子邮箱</label><input id="user_email" type="text" value="'+ obj.email +'"></p>\
                    <p><label>邮寄地址</label><input id="user_address" type="text" value="'+ obj.address +'"></p>\
                </div>\
                <div class="P_btns">\
                    <a href="javascript:;" id="submitUser" class="btn btn_pop"><span>确认提交</span></a>\
                </div>';
        return PopHtml;
    },
    4 : function (obj) {
        if(obj == undefined){
            obj = {'name':'','phone':'','email':''};
        }
        PopHtml = '<div class="popContTit">填写联系方式</div>\
                <div class="userInfo">\
                    <p><label>姓名</label><input id="user_name" type="text" value="'+ obj.name +'"></p>\
                    <p><label>手机号</label><input id="user_phone" type="text" value="'+ obj.phone +'"></p>\
                    <p style="display:none"><label>电子邮箱</label><input id="user_email" type="text" value="'+ obj.email +'"></p>\
                    <p style="display:none"><label>邮寄地址</label><input id="user_address" type="text" value="'+ obj.address +'"></p>\
                </div>\
                <div class="P_btns">\
                    <a href="javascript:;" id="submitUserPhone" class="btn btn_pop"><span>确认提交</span></a>\
                </div>';
        return PopHtml;
    },
    3 : function(){
        var _text = '<h3 class="red">：（对不起，您没有抽奖机会了...</h3><p>iPad QQ浏览器用户中奖机会+1，中奖几率翻倍！</p>';
        PopHtml = '<div style="height: 110px;">' + _text + '</div>\
                <div class="P_btns">\
                    <a href="javascript:;" class="btn btn_pop" onclick="dialog.hide();"><span>我知道了</span></a>\
                </div>';
        return PopHtml;
    },
    1 : function(){
        var _text = '<h3 class="red">：（手气不好，木有中奖...</h3><p>iPad QQ浏览器用户中奖机会+1，中奖几率翻倍！</p>';
        PopHtml = '<div style="height: 110px;">' + _text + '</div>\
                <div class="P_btns">\
                    <a href="javascript:;" class="btn btn_pop" onclick="dialog.hide();"><span>我知道了</span></a>\
                </div>';
        return PopHtml;
    },
    0 : function(key, title){
        var arr = title.split('|');
        var _tips = '', _text = '', _btn = '';
        if(arr[2] == 1) {
            _tips = '<p>请填写您的联系方式，我们将在活动结束后15天内发出奖品。</p>';
            _text = '<div class="giftsText"><p>礼品说明：该奖项为实物奖品，请填写收件人姓名、详细地址、手机号等收货信息，如未提供有效信息则视为自动放弃该奖项</p></div>';
            _btn = '<a href="javascript:;" class="btn btn_pop setUser" ><span>填写地址</span></a>';
        } else if(arr[2] == 2) {
             _tips = '<p>请填写您的联系方式，我们将在活动结束后15天内发出奖品。</p>';
            _text = '<div class="giftsText"><p>礼品说明：该奖项为电子门票品，请填写收件人姓名、手机号等信息，如未提供有效信息则视为自动放弃该奖项</p></div>';
            _btn = '<a href="javascript:;" class="btn btn_pop setPhone" ><span>填写信息</span></a>';
        } else if(arr[2] == 3) {
            _tips = '<p>已放入您登录的QQ账号中</p>';
            _btn = '<a href="javascript:;" class="btn btn_pop" onclick="dialog.hide();"><span>我知道了</span></a>';
        } else if(arr[2] == 4) {
            _tips = '<p>Q币将在活动结束后的10天之内统一发放。</p>';
            _btn = '<a href="javascript:;" class="btn btn_pop" onclick="dialog.hide();"><span>我知道了</span></a>';
        }
        var ornament = '<div class="popTitle"></div><span class="ribbon ribbon1"></span><span class="ribbon ribbon2"></span><span class="ribbon ribbon3"></span><span class="ribbon ribbon4"></span>';
        PopHtml = ornament + '<div class="showGifts">\
                    <div class="giftsName">\
                        <h2>恭喜获得 <strong>'+ arr[0] +'</strong>！</h2>\
                        '+ _tips +'\
                    </div>\
                    <div class="giftsImg"><img src="./images/gifts_'+ arr[1] +'.png" width="320" height="280"></div>\
                    '+ _text +'\
                </div>\
                <div class="P_btns">'+ _btn +'</div>';
        return PopHtml;
    }
};
//抽奖动画
function StartGame(key, cb){
    inGame = true;
    var keyArr = [15,135,285,165,45,315,345,255,195,105,75,225];
    jQuery("#luckyGift").rotate({
        angle: 0,
        animateTo: parseInt(1440 + keyArr[key-1]),
        duration: 5000,
        easing: jQuery.easing.easeInOutExpo,
        callback: cb
    });
     inGame = false;
}

//设置抽奖次数
function setMoney(m){
    var me = jQuery('#money');
    var meVal = parseInt(me.text());
    var k = 0;
    if(parseInt(m) < 0) {
        k = meVal + parseInt(m);
    } else if (m === '++') {
        k = meVal + 1;
    } else if (m === '--') {
        k = meVal - 1;
    } else if(!isNaN(m)) {
        if(m.toString().indexOf('-') >= 0 || m.toString().indexOf('+') >= 0) {
            k = meVal + parseInt(m);
        } else {
            k = m;
        }
    }
    if(k < 0){
        k = 0;
    }
    if(+k > 0) {
        hasMoney = true;
    } else {
		hasMoney = false;
	}
    me.text(k);
}


;(function (window,$) {
    Page = qv.zero.extend(qv.zero.AbstractPage,{
        userJsonID : 144071,
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
                page.queryMoney();
                page.addMoney();
            }
            qq.login.bind('login', function () {
                page.queryMoney();
                page.addMoney();
            });
            qq.login.bind('logout', function () {
                setMoney('0');
            });
        },
        //分享好友增加机会
        invite: function(){
            zUtil.ensureLogin(function () {
                var uin = qq.login.getUin();
                if(uin == 0 || uin == undefined){
                    qq.login.open();
                    return;
                }
                var p = {
                    url:  _pageUrl + "?ADTAG=share&pvsrc=share", /*获取URL，可加上来自分享到QQ标识，方便统计*/
                    desc: '每日登录免费抽奖！海量Q币、公仔、动漫盛典门票等你拿！', /*分享理由(风格应模拟用户对话),支持多分享语随机展现（使用|分隔）*/
                    title: 'iPad版QQ浏览器，请你看二次元宅舞！', /*分享标题(可选)*/
                    summary: '每日登录免费抽奖！海量Q币、公仔、动漫盛典门票等你拿！', /*分享摘要(可选)*/
                    pics: 'http://stdl.qq.com/stdl/game/xmj/pc/images/share.png', /*分享图片(可选)*/
                    flash: '', /*视频地址(可选)*/
                    site: 'QQ浏览器特权中心', /*分享来源(可选) 如：QQ分享*/
                    style: '101',
                    width: 96,
                    height: 24
                };
                var s = [];
                for(var i in p){
                    s.push(i + '=' + encodeURIComponent(p[i]||''));
                }
                var _url = 'http://connect.qq.com/widget/shareqq/index.html?' + s.join('&');
                var winW = jQuery(window).width();
                var winT = jQuery(window).scrollTop();
                zHttp.send({actid: 144082}, function (res) {
                    if (res.ret == 0) {
                        setMoney('++');
                        dialog.alert(tips['10']('恭喜您获得一次抽奖机会！'));
                    }
                })
                jQuery('.mod_pop_mask').show();
                jQuery('.friend_pop').show();
                jQuery('#txifr').attr('src',_url);
                jQuery('#friend_close').click(function(){
                    jQuery('.mod_pop_mask').hide();
                    jQuery('.friend_pop').hide();
                    jQuery('#txifr').removeAttr('src');
                });
                report('IPAD.ACTIVITY.XINGMANJIANG.INVITECLICK');
            });
        },
        //每日一次抽奖机会
        addMoney: function(){
            zHttp.send({actid:144078}, function (res) {
                if(res.ret == 0) {
                    setMoney('++');
                }
            });
        },
        //每日一次抽奖机会
        addMoneyIpad: function(){
            zHttp.send({actid:144081}, function (res) {
                if(res.ret == 0) {
                    setMoney('++');
                }
            });
        },
        //查询抽奖机会
        queryMoney: function(){
            zHttp.send({actid:144251}, function (res) {
                if(res.ret == 0) {
                    var m = res.data.op;
                    setMoney(m);
                }
            });
        },
        //抽奖
        getLucky: function(){
            zUtil.ensureLogin(function(){
                if(inGame){return;}
                var json = 'http://tq.qq.com/ipad?_record_gift_flow=1&actid=144497';
                zHttp.send(json, function (res) {
                    if (res.ret == 0) {
                        var key = res.data.op.diamonds;
                        var title = res.data.op.name;
                        setMoney('--');
                        inGame = false;
                        if (key >= 1 && key <= 12) {
                            try {
                                StartGame(key, function () {
                                    if (key == 12) {
                                        dialog.alert(tips['1']());
                                    } else {
                                        dialog.show(tips['0'](key, title), 'luckyPop');
                                    }
                                });
                            } catch (err) {
                                if (key == 12) {
                                    dialog.alert(tips['1']());
                                } else {
                                    dialog.show(tips['0'](key, title), 'luckyPop');
                                }
                            }
                        } else {
                            dialog.alert(tips['10'](getAmsMsg(res)));
                        }
                    } else if (res.ret == 20801) {
                        dialog.alert(tips['3']());  //没有抽奖机会
                    } else if (json.ret == 10002) {
                        qq.login.open();
                    } else if (json.ret == 10001 || json.ret == 10004) {
                        dialog.alert(tips['9']());
                    } else {
                        dialog.alert(tips['10'](getAmsMsg(res)));
                    }
                });
            });
            report("IPAD.ACTIVITY.XINGMANJIANG.GETLUCKYCLICK");
        },
        //查询中奖纪录
        queryGift : function(temp) {
            zUtil.ensureLogin(function () {
                zHttp.send({actid:144499}, function (res) {
                    if (res.ret == 0) {
                        var records = res.data.op;
                        var _htmlArr = [],
                            _html = '',
                            count = 0,
                            j = 0;
                        for (var i in records) {
                            var obj = records[i].val,
                                time = qv.date.format("Y-m-d", obj.time * 1000),
                                arr = obj.name.split('|'),
                                name = arr[0],
                                type = arr[2],
                                level = obj.level;
                            if (level == 12){continue;}
                            if (type == 1){
                                _htmlArr.push('<li><span class="time">'+ time +'</span><span class="info">'+ name +'</span><a class="setUser" href="javascript:;">修改联系方式</a></li>');
                            }else if(type == 2){
                                _htmlArr.push('<li><span class="time">'+ time +'</span><span class="info">'+ name +'</span><a class="setUserPhone" href="javascript:;">修改联系方式</a></li>');
                            } else{
                                _htmlArr.push('<li><span class="time">'+ time +'</span><span class="info">'+ name +'</span></li>');
                            }
                            count++;
                        }
                        if (count == 0) {
                            _html = '<li class="noGifts">亲，您还没有抽中任何奖品！</li>';
                        }else{
                            _html = _htmlArr.join("");
                        }
                        dialog.alert(tips['6'](_html));
                    } else if (res.ret == 10002) {
                        qq.login.open();
                    } else if (res.ret == 10001 || res.ret == 10004) {
                        dialog.alert(tips['9']());
                    } else {
                        dialog.alert(tips['10'](getAmsMsg(res)));
                    }
                });
                report("IPAD.ACTIVITY.XINGMANJIANG.QUERYGIFTSCLICK");
            });
        }
    });
    window.page = new Page();

    window.onload = function(){
        $('body').on('click','.setUser',function () {
            getUserInfo(function (res) {
                dialog.alert(tips['5'](res));
            })
        });
        $('body').on('click','.setUserPhone',function () {
            getUserInfo(function (res) {
                dialog.alert(tips['4'](res));
            })
        });
        $('body').on('click','.setPhone',function () {
            getUserInfo(function (res) {
                dialog.alert(tips['4'](res));
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
        $('body').on('click','#submitUser',function () {
            userContact = {
                name : $('#user_name').val(),
                phone : $('#user_phone').val(),
                email : $('#user_email').val(),
                address : $('#user_address').val()
            };
            setUserInfo(userContact, function(){
                dialog.hide();
            })
        });

        $('body').on('click','#submitUserPhone',function () {
            userContact = {
                name : $('#user_name').val(),
                phone : $('#user_phone').val(),
                email : $('#user_email').val(),
                address : $('#user_address').val()
            };
            setUserPhone(userContact, function(){
                dialog.hide();
            })
        });

        var light = $('#luckyLight');
        var _flag = true;
        setInterval(function () {
            if(_flag) {
                _flag = false;
                light.addClass('active');
            } else {
                _flag = true;
                light.removeClass('active');
            }
        },1000);
    };
})(window,jQuery);
;(function($){
    //漫画部分上报
   $('.middle_6 .box').on('click','.comic',function(){
        report('IPAD.ACTIVITY.XINGMANJIANG.COMIC'+this.id)
   })
    //视频部分上报
    $('.middle_4 .box').on('click','.comic',function(){
        report('IPAD.ACTIVITY.XINGMANJIANG.VIDEO'+this.id)
   })
    //顶部下载按钮部分上报
    $('.qbDown').on('click',function(){
      report('IPAD.ACTIVITY.XINGMANJIANG.DOWNQTOP')
    })
    //底部下载按钮部分上报
    $('.downQB').on('click',function(){
      report('IPAD.ACTIVITY.XINGMANJIANG.DOWNQBOTTOM')
    })
    //主会场按钮部分上报
    $('.enter').on('click',function(){
      report('IPAD.ACTIVITY.XINGMANJIANG.ENTER')
    })
})(jQuery)