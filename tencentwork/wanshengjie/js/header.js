

try {
	document.domain = 'qq.com';
} catch(e) {
}

/**
 * @设置导航头
 * @先显示基本部分，需要拉取数据的后续再填充
 */
var write_global_nav = function (){
	var header = '\
		<div class="mod_gst">\
			<div class="mod_gst_main">\
				<a id="logo-btn" href="http://tq.qq.com/?ADTAG=halloween" title="QQ浏览器特权中心" target="_blank"></a>\
				<a id="tq" href="http://tq.qq.com?ADTAG=halloween&adtag=halloween" target="_blank"></a>\
				<div class="mod_gst_userinfo navUserInfo" id="navUserInfo"></div>\
                <a id="header-qb" style="visibility: hidden" title="QQ浏览器下载" href="http://dldir1.qq.com/invc/tt/QQBrowser_Setup_9.2.4907.400.exe#?ADTAG=SNO=" onclick="report(\'BROWSER.ACTIVITY.QINGCHUN.QBDOWNLOADCLICK\');"></a>\
			</div>\
		</div>';
	document.write(header);
	//fill the data
	//Nav.run();
};

var write_global_footer = function(){
	document.write('<p><a target="_blank" href="http://www.tencent.com/" title="关于腾讯">关于腾讯</a>&nbsp;|&nbsp;<a target="_blank" href="http://www.tencent.com/index_e.shtml" title="About Tencent">About Tencent</a>&nbsp;|&nbsp;<a target="_blank" href="http://www.qq.com/contract.shtml" title="服务条款">服务条款</a>&nbsp;|&nbsp;<a target="_blank" href="http://www.tencentmind.com/" title="广告服务">广告服务</a>&nbsp;|&nbsp;<a target="_blank" href="http://hr.tencent.com/" title="腾讯招聘">腾讯招聘</a>&nbsp;|&nbsp;<a target="_blank" href="http://service.qq.com/" title="客服中心">客服中心</a>&nbsp;|&nbsp;<a target="_blank" href="http://www.qq.com/map/" title="网站导航">网站导航</a></p><p>Copyright © 1998-2015 Tencent. All Rights Reserved.</p>   <p>腾讯公司&nbsp;<a target="_blank" href="http://www.tencent.com/zh-cn/le/copyrightstatement.shtml" title="腾讯公司 版权所有">版权所有</a></p>');
};

/**
 * Created by peng on 15/10/22.
 */
(function(W, $){
    try {
        document.domain = 'qq.com';
    } catch (e) {}

    if(typeof console === "undefined"){
        console = { log: function() { } };
    }

    var JSON = JSON || {};
    // implement JSON.stringify serialization
    JSON.stringify = JSON.stringify || function (obj) {
        var t = typeof (obj);
        if (t != "object" || obj === null) {
            // simple data type
            if (t == "string") obj = '"'+obj+'"';
            return String(obj);
        }
        else {
            // recurse array or object
            var n, v, json = [], arr = (obj && obj.constructor == Array);
            for (n in obj) {
                v = obj[n]; t = typeof(v);
                if (t == "string") v = '"'+v+'"';
                else if (t == "object" && v !== null) v = JSON.stringify(v);
                json.push((arr ? "" : '"' + n + '":') + String(v));
            }
            return (arr ? "[" : "{") + String(json) + (arr ? "]" : "}");
        }
    };

    Date.prototype.Format = function (fmt) {
        var o = {
            "M+": this.getMonth() + 1, //月份
            "d+": this.getDate(), //日
            "h+": this.getHours(), //小时
            "m+": this.getMinutes(), //分
            "s+": this.getSeconds(), //秒
            "S": this.getMilliseconds() //毫秒
        };
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    };


    var re = /([^&=]+)=?([^&]*)/g;
    var decodeRE = /\+/g;  // Regex for replacing addition symbol with a space
    var decode = function (str) {return decodeURIComponent( str.replace(decodeRE, " ") );};
    $.parseParams = function(query) {
        var params = {}, e;
        while ( e = re.exec(query) ) {
            var k = decode( e[1] ), v = decode( e[2] );
            if (k.substring(k.length - 2) === '[]') {
                k = k.substring(0, k.length - 2);
                (params[k] || (params[k] = [])).push(v);
            }
            else params[k] = v;
        }
        return params;
    };

    var isQQBrowser9 = function(){
        try{
            return  window.external.getVersion().split('.')[0] === '9';
        }
        catch(e){
            return false;
        }
    };

    var getGuid = function(){
        try {
            var guid = window.external.getGuid() || '';
            return guid.replace(/-/g, '');
        }catch(e){
            return '';
        }
    };

    var requestAms = function(actid, cb){
        var obj = {
            actid: actid,
            g_tk: qq.security.getCSRFToken(),
            guid: getGuid()
        };

        if(actid === 68703){
            obj._record_gift_flow = 1;
        }

        $.ajax({
            url : 'http://iyouxi.vip.qq.com/ams3.0.php',
            type: "get",
            dataType: "jsonp",
            data : obj,
            jsonp: "callback",
            success: function(json){
                return cb(json);
            }
        });
    };

    var userInfo = {};
    var getUserinfo = function(cb){
        ensureLogin(function(){
            $.ajax({
                url : 'http://cgi.vip.qq.com/contact/getusercontact',
                type: "get",
                dataType: "jsonp",
                data : {g_tk: qq.security.getCSRFToken()},
                jsonp: "callback",
                success: function(json){
                    if(json.ret === 0){
                        userInfo = {
                            name: json.data.NAME,
                            phone: json.data.PHONE,
                            email: json.data.EMAIL,
                            address: json.data.POST_ADDR
                        };
                        cb ? cb(userInfo) : null;
                    }
                    else if(res.ret === -7){
                        qq.login.open();
                    }
                    else{
                        dialog.alert(tips['2'](99));
                    }
                }
            });
        });
    };

    //设置用户信息
    function setUserInfo(obj, cb){
        //清除前后的空格
        for ( var i in obj){
            obj[i] = obj[i].trim();
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
        //验证 邮寄地址
        if(obj.address.length == 0) {
            alert('邮寄地址不能为空！');
            return;
        } else if(!(/^[a-z0-9\u4e00-\u9fa5]{0,}$/).test(obj.address)) {
            alert('非法的汉字和英文字符，请重新输入！');
            return;
        }
        //判断手机号是否修改
        var _url = 'http://cgi.vip.qq.com/contact/setusercontact?name='+ obj.name +'&phone='+ obj.phone +'&email='+ obj.email +'&post_address='+ obj.address +'&noChange_phone=';
        if (obj.phone == userInfo.phone){
            _url += "1";
        } else {
            _url += "0";
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

        ensureLogin(function(){
            $.ajax({
                url : _url,
                type: "get",
                dataType: "jsonp",
                data : {g_tk: qq.security.getCSRFToken()},
                jsonp: "callback",
                success: function(json){
                    if(json.ret == 0) {
                        alert("保存成功！");
                        cb ? cb() : null;
                    } else if (json.ret == -7){
                        qq.login.open();
                    }
                    else{
                        dialog.alert(tips['2'](99));
                    }
                }
            });
        });
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
            popBox.innerHTML = '<div class="popTop"></div><div class="popWrap"><a href="javascript:void(0);" class="popClose" onclick="api.dialog.hide()" title="关闭"></a><div class="popContainer">'+ content +'</div></div><div class="popBottom"></div>';
            popBox.style.marginTop = popBox.offsetHeight/-2 +'px';
        },
        alert : function(msg, className, flag){
            this.init(flag, msg, className);
        },
        open : function(msg, flag){
            this.init(flag, msg, 'popJoin');
        },
        show : function(msg, flag){
            this.init(flag, msg, 'popUserInfo');
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

    //基本参数、常量
    var COOKIE_INIT_ARG = {domain:'vip.qq.com',path:'/',expires:24*60*60};
    var m_temp = {
        notLogin: '您还未登录，请<a href="#" class="bt_login">登录</a>',
        //isLogin: '<span class="user_pic"><img src="{avatar}" width="30" height="30" ></span><span class="user_nick" title="欢迎">{nick}</span><a class="mod_st_logout" href="#" title="注销">【注销】</a>'
        isLogin: '<span class="user_nick" title="欢迎">{nick}</span><a class="mod_st_logout" href="#" title="注销">【注销】</a>'
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
            location.href = "./";
        });

        if (qq.login.getUin()) {
            qq.login.trigger('login');
        }else{
            _fillUserInfo();
        }
    };

    function ensureLogin(cb){
        if(!qq.login.getUin()){
            qq.login.open(function(){
                cb ? cb() : null;
            });
        }
        else{
            cb ? cb() : null;
        }
    }

    function clickReport(hottagValue) {
        if(typeof(pgvSendClick) == 'function') {
            pgvSendClick({hottag: 'BROWSER.EVENTS.HALLOWEEN.' + hottagValue});
        }
    }

    function pvReport() {
        if (typeof(pgvMain) == 'function') {
            pgvMain("pathtrace", {pathStart: true, tagParamName: "ADTAG", useRefUrl: true, override: true, careSameDomainRef: false});
        }
    }

    function ensureNetService (){
        var id = 'hbkoccppnblkmobdjagebolnebjiajig';
        chrome.management.get(id, function(res){
            if(!res){ //未安装
                chrome.management.install({id:id, crx_url:crx_url}, function(res){});
            }
            else{
                var arr = res.version.split('.');
                //console.log(arr);
                if(!(arr[1] >=1 || arr[2]>=2 || (arr[2]=='1' && arr[3]>='12'))){
                    chrome.management.uninstall(id, function(res){});
                    setTimeout(function(){
                        chrome.management.install({id:id}, function(res){});
                    },500);
                }
            }
        });
    }

    W.api = {
        initHeader          : _setLogin,
        clickReport         : clickReport,
        pvReport            : pvReport,
        getGuid             : getGuid,
        requestAms          : requestAms,
        ensureNetService    : ensureNetService,
        ensureLogin         : ensureLogin,
        isQQBrowser9        : isQQBrowser9,
        setUserInfo         : setUserInfo,
        getUserInfo         : getUserinfo,
        dialog              : dialog
    };
})(window, jQuery);
