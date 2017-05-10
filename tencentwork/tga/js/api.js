
(function(W, $){
    try {
        document.domain = 'qq.com';
    } catch (e) {}

    if(typeof console === "undefined"){
        console = { log: function() { } };
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
    var isQQIE = (window.external && window.external.extension && /QQBrowser/i.test(navigator.userAgent)) ? true : false;
    var isQQCT = (window.getExtension && /Chrome.*QQBrowser/i.test(navigator.userAgent)) ? true : false;


    //登录
    //基本参数、常量
    var COOKIE_INIT_ARG = {domain:'vip.qq.com',path:'/',expires:24*60*60};
    var m_temp = {
        notLogin: '<span class="ico_qq"></span>使用QQ帐号<a href="#" class="bt_login">登录</a>',
        isLogin: '<span class="user_pic"><img src="{avatar}" width="38" height="38" ></span><span class="user_nick" title="欢迎">{nick}</span><a class="mod_st_logout" href="#" title="退出">退出</a>'
    };

    //填充用户信息
    var _fillUserInfo = function(nick, uin){
        var _arHtml = [];
        var _data = {};
        if(nick){
            _data.nick = qv.string.encodeHTML(nick);
        }
        if(uin){
            _data.avatar = "http://q4.qlogo.cn/g?b=qq&nk=" + uin + "&s=40";
        }
        if(!qq.login.getUin()){
            _arHtml.push(m_temp.notLogin);
        }else{
            _arHtml.push(qv.string.format(m_temp.isLogin, _data));
        }
        $('#navUserInfo').html(_arHtml.join(''));
        //登录
        $('.bt_login').click(function(e) {
            e.preventDefault();
            qq.login.open(null, {appid: 8000201});
        });

        //退出
        $('.mod_st_logout').click(function(e) {
            e.preventDefault();
            qq.login.logout();
        });
        qq.login.trigger('navrendered');

    };

    //设置登录
    var _setLogin = function(){
        qq.login.init({
            loginMaskShow  : true,
            loginMaskStyle : {'z-index' : 1000},
            loginUIStyle   : {'z-index' : 1001},
            event: {
                login: function() { return false; },
                logout: function() { return false; }
            }
        });

        qq.login.bind('login', function() {
            var _uin = qv.cookie.get('_uin');
            var _nick = qv.cookie.get('_nick');

            if (_uin == qq.login.getUin() && _nick) {
                _fillUserInfo(_nick, _uin);
            } else {
                var options = {
                    url: 'http://pf.vip.qq.com/common/yii.php',
                    dataType: 'jsonp',
                    data: {
                        r: 'user/info',
                        g_tk: qq.security.getCSRFToken()
                    },
                    success: function(data, textStatus, jqXHR) {
                        qv.cookie.set('_uin', qq.login.getUin(), COOKIE_INIT_ARG);
                        qv.cookie.set('_nick', data.nickname, COOKIE_INIT_ARG);

                        _fillUserInfo(data.nickname, qq.login.getUin());
                        if(data.nickname === undefined){
                            qq.login.logout();
                        }
                    }
                };
                $.ajax(options);
            }
        });

        qq.login.bind('logout', function() {
            qv.cookie.clear('_uin');
            qv.cookie.clear('_nick');
            _fillUserInfo();
        });

        if (qq.login.getUin()) {
            qq.login.trigger('login');
        }else{
            _fillUserInfo();
        }
    };

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
            popBox.innerHTML = '<div class="popWrap">\
                                    <a href="javascript:void(0);" class="popClose" onclick="window.api.dialog.hide();" title="关闭"></a>\
                                    <div class="popTop"></div>\
                                    <div class="popContainer">'+ content +'</div>\
                                    <div class="popBottom"></div>\
                                </div>';
            popBox.style.marginTop = popBox.offsetHeight/-2 +'px';
        },
        alert : function(msg, flag){
            this.init(flag, msg);
        },
        show : function(msg, flag){
            this.init(flag, msg, '');
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
            html = "<p style='padding-top: 20px;'>活动已经结束！<br>敬请期待更多QQ浏览器特权活动！</p>\
                <div class='P_btns'>\
                    <a href='javascript:;' class='btn btn_pop' onclick='window.api.dialog.hide();'>确定</a>\
                </div>";
            return html;
        },
        8 : function(){
            html = "<p style='padding-top: 30px;padding-bottom: 10px;'>活动太火爆了，请稍后再试！</p>\
                <div class='P_btns'>\
                    <a href='javascript:;' class='btn btn_pop' onclick='window.api.dialog.hide();'>确定</a>\
                </div>";
            return html;
        },
        7 : function(k){
            html = "<p style='padding-top: 30px;padding-bottom: 10px;'>只有QQ浏览器才能参与领奖哦，快去安装吧！</p>\
                <div class='P_btns'>\
                    <a href='http://dldir1.qq.com/invc/tt/QQBrowser_Setup_ExternalForum.exe?ADTAG=&SNO=' class='btn btn_downloadQB' onclick='report(\"BROWSER.ACTIVITY.TGA.QBDOWNLOADCLICK\");window.api.dialog.hide();'><span>安装QQ浏览器</span></a>\
                </div>";
            return html;
        },
        6 : function(name, url, id){
            var _type = '',
                _attr = '';
            if(url == 'javascript:;') {
                _type = 'page.exchange('+ id +');report("BROWSER.ACTIVITY.TGA.EXCHANGEGAMEGIFTS'+ id +'");';
            } else {
                _attr = 'target="_blank"';
                _type = 'setTimeQuery("'+ name +'");report("BROWSER.ACTIVITY.TGA.EXCHANGEVIDEOGIFTS'+ id +'");';
            }
            html = "<p style='padding-top: 20px;'>您领取的是<strong style='font-size: 1.2em;color: #c42d2d;'>"+ name +"</strong>大礼包</p>\
                    <p>今日领取之后将不能领取其他礼包哦~</p>\
                    <div class='P_btns'>\
                        <a href='"+ url +"' class='btn btn_exchange2' "+ _attr +" onclick='"+ _type +"'>去领奖</a>　　<a href='javascript:;' class='btn btn_cancel' onclick='window.api.dialog.hide();window.onfocus=function(){}'>取消</a>\
                    </div>";
            return html;
        },
        5 : function (coin) {
            html = "<p style='padding-top: 30px;'>您已经观看了 "+ window.qb.coin +" 个游戏直播，还差 <strong style='color: #c42d2d;'>"+ parseInt(coin - window.qb.coin) +"</strong> 个游戏直播就能领取该礼包了</p>\
                    <p>赶快去看游戏直播吧^_^</p>\
                    <div class='P_btns'>\
                        <a href='http://video.browser.qq.com/live/' target='_blank' class='btn btn_seeVideo' onclick='report(\"BROWSER.ACTIVITY.TGA.SEEVIDEOCLICKPOPUP\")'><span>去观看</span></a>\
                    </div>";
            return html;
        },
        4 : function (name) {
            html = "<p style='padding-top: 30px;padding-bottom: 10px;'>恭喜您成功领取了<strong style='font-size: 1.2em;color: #c42d2d;'>"+ name +"</strong>大礼包</p>\
                <div class='P_btns'>\
                    <a href='javascript:;' class='btn btn_pop' onclick='window.api.dialog.hide();'>确定</a>\
                </div>";
            return html;
        },
        0 : function(name, cdkey){
            html = "<p style='padding-top: 5px;'>恭喜您成功领取<strong style='font-size: 1.2em;color: #c42d2d;'> "+ name +" </strong>大礼包</p>\
                    <p>CDKey：<span style='color: #c42d2d;'>"+ cdkey +"</span></p>\
                    <p>请及时去<a href='http://mirs.qq.com/act/a20150803ld/index.html?app_custom=qqexplorer.safeload' target='_blank' style='color: #c42d2d;text-decoration: underline;'>兑换></a></p>\
                    <div class='P_btns'>\
                        <a href='javascript:;' class='btn btn_pop' onclick='window.api.dialog.hide();'><span>确定</span></a>\
                    </div>";
            return html;
        },
        1 : function(key) {
            if (key == 1) {
                html = "<p style='padding-top: 30px;padding-bottom: 10px;'>您已经领取了该礼包，不能重复领取哦~</p>\
                <div class='P_btns'>\
                    <a href='javascript:;' class='btn btn_pop' onclick='window.api.dialog.hide();'>确定</a>\
                </div>";
            } else if (key == 2) {
                html = "<p style='padding-top: 30px;padding-bottom: 10px;'>今日礼包已发放完毕，请明天再来！</p>\
                <div class='P_btns'>\
                    <a href='javascript:;' class='btn btn_pop' onclick='window.api.dialog.hide();'>确定</a>\
                </div>";
            } else if (key == 3) {
                html = "<p style='padding-top: 30px;padding-bottom: 10px;'>该礼包已全部发完，赶快领取其它礼包吧^_^</p>\
                <div class='P_btns'>\
                    <a href='javascript:;' class='btn btn_pop' onclick='window.api.dialog.hide();'>确定</a>\
                </div>";
            } else if (key == 4)  {
                html = "<p style='padding-top: 20px;padding-bottom: 10px;'>您今日已经领取过了礼包<br>礼包一天只能领取一个哦~</p>\
                <div class='P_btns'>\
                    <a href='javascript:;' class='btn btn_pop' onclick='window.api.dialog.hide();'>确定</a>\
                </div>";
            }
            return html;
        }
    };


    //tgaSet接口
    var tgaSet = function (coin, cb) {
        var qb_coin = coin ? coin : '0';
        zHttp.send('http://cm.browser.qq.com/tga/set?qb_coin=' + qb_coin, cb);
    };
    //tgaQ接口
    var tgaGet = function (cb) {
        zHttp.send('http://cm.browser.qq.com/tga/get', cb);
    };
    //tgaQuery接口
    var tgaStatus = function (cb) {
        zHttp.send('http://cm.browser.qq.com/tga/status', cb);
    };
    //设置已领取的礼包
    var tgaConfirm = function (id) {
        zHttp.send('http://cm.browser.qq.com/tga/set/confirm?level=' + id)
    } ;

    W.api = {
        initHeader      : _setLogin,
        isQQBrowser     : isQQBrowser,
        dialog          : dialog,
        tips            : tips,
        tgaSet          : tgaSet,
        tgaGet          : tgaGet,
        tgaStatus       : tgaStatus,
        tgaConfirm      : tgaConfirm
    };
})(window, jQuery);

window.qb = {
    status : [],
    coin : 0,
    join : 0,
    number  : [2, 4, 6, 8],
    title    : [
        ['龙珠直播专属道具','传奇霸业独家道具'],
        ['龙珠直播专属道具','传奇霸业独家道具'],
        ['龙珠直播专属道具','传奇霸业独家道具'],
        ['龙珠直播专属道具','传奇霸业独家道具']
    ],
    pic     : [
        ['./images/gifts_tga_1.png','./images/gifts_game_1.png'],
        ['./images/gifts_tga_2.png','./images/gifts_game_2.png'],
        ['./images/gifts_tga_3.png','./images/gifts_game_3.png'],
        ['./images/gifts_tga_4.png','./images/gifts_game_4.png']
    ],
    _isOpen : [0,0,0,0],
    _href : ['http://tga.plu.cn/qqbrowser?level=','javascript:;'],
    _name : ['牛刀小试','初出茅庐','江湖侠客','高手大神'],
    _url : []
};