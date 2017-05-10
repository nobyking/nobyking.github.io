
var _pageUrl = location.protocol + '//' + location.host + location.pathname;

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
    me.text(k);
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
    //验证姓名
    if(obj.name.length == 0) {
        alert('姓名不能为空！');
        return;
    } else if(obj.name.length < 2 || !(/^[a-zA-Z\u4e00-\u9fa5]{0,}$/).test(obj.name)) {
        alert('姓名不合法，请重新输入！');
        return;
    }
    //验证手机号
    if(obj.phone.length == 0) {
        alert('手机号不能为空！');
        return;
    } else if(obj.phone != userInfo.phone) {
        if(isNaN(obj.phone) || obj.phone.length != 11){
            alert('请输入有效的手机号！');
            return;
        }
    }
    //验证 邮箱
    if(obj.email.length == 0) {
        alert('电子邮箱不能为空！');
        return;
    } else if(!(/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/).test(obj.email)){
        alert('请输入有效的电子邮箱！');
        return;
    }
    //验证 地址
    if(obj.address.length == 0) {
        alert('邮寄地址不能为空！');
        return;
    } else if(!(/^[a-z0-9\u4e00-\u9fa5]{0,}$/).test(obj.address)) {
        alert('邮寄地址不合法，请重新输入！');
        return;
    }
    //判断手机号是否修改
    var _url = 'http://cgi.vip.qq.com/contact/setusercontact?name='+ encodeURIComponent(obj.name) +'&phone='+ obj.phone +'&email='+ encodeURIComponent(obj.email) +'&post_address='+ encodeURIComponent(obj.address) +'&noChange_phone=';
    if (obj.phone == userInfo.phone){
        _url += "1";
    } else {
        _url += "0";
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


var userInfoDetail = {
    get : function(){
        var me = this;
        getUserInfo(function(res){
            me.show();
            jQuery('#user_name').val(res.name);
            jQuery('#user_phone').val(res.phone);
            jQuery('#user_email').val(res.email);
            jQuery('#user_address').val(res.address);
        })
    },
    set : function(){
        var me = this;
        userContact = {
            name : jQuery('#user_name').val(),
            phone : jQuery('#user_phone').val(),
            email : jQuery('#user_email').val(),
            address : jQuery('#user_address').val()
        };
        setUserInfo(userContact, function(){
            me.hide();
        })
    },
    show : function(){
        jQuery('#popBg,#popMsg').show();
    },
    hide : function(){
        jQuery('#popBg,#popMsg').hide();
    }
}

//填写联系地址函数
function getInfo() {
    zUtil.ensureLogin(function(){
        getUserInfo(function(res){
            jQuery('#popBg,#popMsg').show();
            jQuery('#user_name').val(res.name);
            jQuery('#user_phone').val(res.phone);
            jQuery('#user_email').val(res.email);
            jQuery('#user_address').val(res.address);
        })
    })
}
//提交联系地址函数
function setInfo() {
    userContact = {
        name : $('#user_name').val(),
        phone : $('#user_phone').val(),
        email : $('#user_email').val(),
        address : $('#user_address').val()
    };
    setUserInfo(userContact, function(){
        popHide();
    })
}



/*抽奖效果*/
var inGame = false;
function StartGame(key, cb){
    if(inGame){
        cb();
        return;
    }
    inGame = true;
    var arr_map = [5,3,6,4,7,0,1,2];
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

(function (window,$) {
    Page = qv.zero.extend(qv.zero.AbstractPage,{
        userJsonID : 73615,
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
                game: 'nz'
            });
            //已登录自动获取礼券数
            if(qq.login.getUin()){
                page.queryMoney();
            }
            qq.login.bind('login',function(){
                page.queryMoney();//查询礼券数
            });
            qq.login.bind('logout',function(){
                setMoney('0');
            });
        },
        queryMoney: function(){
            zUtil.ensureLogin(function(){
                zHttp.send({actid: 73704}, function (res) {
                    if (res.ret == 0) {
                        var m = res.data.op;
                        setMoney(m);
                    }
                });
            });
        },
        exchange: function(e,act){
            if(!isQQBrowser()){
                hint();
                return;
            }
            var index = act[0];
            var actid = [73669, 73674, 73679, 73680, 73681, 73682, 73683, 73688, 73689, 73690, 73691, 73692, 73693, 73694];
            var id = actid[index];
            var tipsWords = function(res) {
                if (res.ret == 0) {
                    if(index >= 7 && index <= 10) {
                        setMoney('-2');
                    } else if(index >= 11 && index <= 13) {
                        setMoney('-5');
                    }
                    zHttp.showResponse(res, res.actid, $.noop);
                } else if (res.ret == 10002) {
                    qq.login.open();
                } else if (res.ret == 10001 || res.ret == 10004) {
                    zMsg.alert("活动已经结束，敬请期待更多QQ浏览器特权活动！");
                } else if(res.ret == 60513) {
                    zMsg.alert("亲，您今天还没有登录TGP客户端哦~");
                } else {
                    zHttp.showResponse(res, res.actid, $.noop);
                }
            }
            zUtil.ensureLogin(function() {
                if(act[1] != 'true') {
                    page.svr.show({
                        send: function (args, callb) {
                            zHttp.send({'actid': id, area: args.area, roleid: args.roleid}, function (res) {
                                tipsWords(res);
                            });
                        }
                    });
                } else {
                    zHttp.send({'actid': id}, function (res) {
                        tipsWords(res);
                    });
                }
                report("BROWSER.ACTIVITY.TGP.EXCHANGEGIFTS" + index);
            });
        },
        shareQZ: function(){
            var f = {
                url: _pageUrl + "?pvsrc=qzoneshare&ADTAG=qzoneshare",
                summary: "TGP浪漫相约QQ浏览器，壕礼送不停~",
                title: "TGP浪漫相约QQ浏览器，壕礼送不停~",
                act_pic: "http://stdl.qq.com/stdl/game/pic/tgp_share.png",
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
                    zHttp.send({'actid': 73702}, function (res) {
                        if (res.ret==0) {
                            setMoney('++');
                            zHttp.showResponse(res, res.actid, $.noop);
                        } else if (res.ret == 10002) {
                            qq.login.open();
                        } else if (res.ret == 10001 || res.ret == 10004) {
                            zMsg.alert("活动已经结束，敬请期待更多QQ浏览器特权活动！");
                        } else {
                            zHttp.showResponse(res, res.actid, $.noop);
                        }
                    });
                });
                report("BROWSER.ACTIVITY.TGP.SHAREQZCLICK");
            });
        },
        signIn: function(){
            if(!isQQBrowser()){
                hint();
                return;
            }
            zUtil.ensureLogin(function(){
                zHttp.send({actid: 73687}, function (res) {
                    if (res.ret == 0) {
                        setMoney('++');
                        zHttp.showResponse(res, res.actid, $.noop);
                    } else if (res.ret == 10002) {
                        qq.login.open();
                    } else if (res.ret == 10001 || res.ret == 10004) {
                        zMsg.alert("活动已经结束，敬请期待更多QQ浏览器特权活动！");
                    } else {
                        zHttp.showResponse(res, res.actid, $.noop);
                    }
                });
                report('BROWSER.ACTIVITY.TGP.SNGNINCLICK');
            });
        },
        //抽奖
        getLucky: function(){
            if(!isQQBrowser()){
                hint();
                return;
            }
            zUtil.ensureLogin(function(){
                if(inGame){return;}
                // 记录奖品时 必须加字段 _record_gift_flow : 1 ， 若记录末等奖时 再加字段(不记录则不加) _record_def_gift : 1
                page.svr.show({
                    send: function (args, callb) {
                        zHttp.send({actid: 73697, area: args.area, roleid: args.roleid, _record_gift_flow: 1}, function (res) {
                            if (res.ret == 0) {
                                setMoney('--');
                                var key = res.data.op.diamonds;
                                try{
                                    if(key >= 1 && key <= 8){
                                        StartGame(key, function () {
                                            zHttp.showResponse(res, res.actid, $.noop);
                                        })
                                    } else {
                                        zHttp.showResponse(res, res.actid, $.noop);
                                    }
                                } catch (err) {
                                    zHttp.showResponse(res, res.actid, $.noop);
                                }
                            } else if (res.ret == 10002) {
                                qq.login.open();
                            } else if (res.ret == 10001 || res.ret == 10004) {
                                zMsg.alert("活动已经结束，敬请期待更多QQ浏览器特权活动！");
                            } else if(res.ret == 60513) {
                                zMsg.alert("亲，您今天还没有登录TGP客户端哦~");
                            } else {
                                zHttp.showResponse(res, res.actid, $.noop);
                            }
                        });
                    }
                });
                report('BROWSER.ACTIVITY.TGP.GETLUCKYCLICK');
            });
        },
        queryGifts: function(){
            zUtil.ensureLogin(function(){
                zHttp.send({actid: 73700}, function (res) {
                    if (res.ret == 0) {
                        var _htmlArr = [],
                            _html = '',
                            count = 0,
                            j = 0;
                        for (var i in res.data.op) {
                            var obj = res.data.op[i].val,
                                time = qv.date.format("Y-m-d", obj.time * 1000),
                                name = obj.name,
                                level = obj.level;
                            if (level <= 5) {
                                _htmlArr.push('<li>' + time + '&nbsp;&nbsp;' + name + '</li>');
                                count++;
                            }
                        }
                        if (count == 0) {
                            _html = '亲，您还没有抽中实物哦！';
                        } else {
                            _html =  _htmlArr.join("");
                        }
                        zMsg.show(_html);
                    } else if (res.ret == 10002) {
                        qq.login.open();
                    } else if (res.ret == 10001 || res.ret == 10004) {
                        zMsg.alert("活动已经结束，敬请期待更多QQ浏览器特权活动！");
                    } else {
                        zHttp.showResponse(res, res.actid, $.noop);
                    }
                });
                report('BROWSER.ACTIVITY.TGP.QUERYGIFTSCLICK');
            });
        }
    });
    window.page = new Page();
})(window,jQuery);

function subMenu(){
    var Stop = [780, 1590, 2650];
    var winW = jQuery(window).width();
    var winH = jQuery(window).height();
    var demo = jQuery('#menu');
    jQuery(window).bind('resize', function () {
        winW = jQuery(window).width();
        winH = jQuery(window).height();
        if(winW >= 1280){
            demo.show();
            if(winW < 1600){
                jQuery('#menu').css({'right':'0','margin-right':'0'});
            }else{
                jQuery('#menu').css({'right':'50%','margin-right':'-800px'});
            }
        }else{
            demo.hide();
        }
    });
    jQuery(window).bind('scroll', function () {
        var _top = jQuery(window).scrollTop();
        var _demoTop = winH/2 - demo.height();
        _demoTop = _demoTop <= 45 ? 45 : _demoTop;
        if(_top >= 780-_demoTop){
            jQuery('#menu').css({'position':'fixed','top': _demoTop + 'px'});
        }else{
            jQuery('#menu').css({'position':'absolute','top':'780px'});
        }
    });
    jQuery('#rightNav li').bind('click', function () {
        var k = jQuery(this).index();
        if(jQuery(window).scrollTop() == Stop[k]) return;
        jQuery('html,body').animate({'scrollTop' : Stop[k] + 'px'},{queue: false, duration: 600});
    });
    jQuery(window).resize();
    jQuery(window).scroll();
}

window.onload = function(){
    //右侧随屏滚动菜单
    subMenu();

};






