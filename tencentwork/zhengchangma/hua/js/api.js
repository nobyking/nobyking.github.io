/**
 * Created by peng on 15/6/20.
 */
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

    //安装插件
    function installPlugin(cb){
        if(qv.cookie.get("try_install")){
            return;
        }
        qv.cookie.set("try_install","1",{expires: 30*24*3600});
        if (isQQIE) {
            try{
                window.external.extension.queryExtension("{4F4CE0CB-AFD2-4F8C-AD1F-4C1EEBD7F2F8}",function(object){
                    if(!object.Installed){
                        window.external.extension.installExtension(
                            "{4F4CE0CB-AFD2-4F8C-AD1F-4C1EEBD7F2F8}",
                            "",
                            "",
                            function () {
                                cb ? cb() : '';
                            }
                        );

                    }
                });
            }
            catch(e){}
        }
        else if (isQQCT) {
            var web_page_extension_id = '{A3C609B3-3E61-4508-8953-117B7286068B}';
            var platform_extension_id = '{420DEFEE-20A8-468C-BFDA-61A09A99325D}';
            var extension;
            try {
                extension = window.getExtension(web_page_extension_id);
                extension.sendMessage(platform_extension_id, {serviceId: "extension.queryExtension", args: ["{4F4CE0CB-AFD2-4F8C-AD1F-4C1EEBD7F2F8}"]}, function (object) {
                    if(!object.Installed){
                        extension.sendMessage(platform_extension_id, {serviceId: "extension.installExtension", args: ["{4F4CE0CB-AFD2-4F8C-AD1F-4C1EEBD7F2F8}","",""]}, function (object) {
                            cb ? cb() : '';
                        })
                    }
                });
            }catch(e){}
        }
        else{}
    }

    //获取问题列表
    var getQuestionList = function(id, cb){
        var _url = 'http://panshi.qq.com/v2/vote/' + id + '?source=3';
        zHttp.send(_url,cb);
    };
    //获取问题列表答案
    var getAnswerList = function (id, cb) {
        var _url = 'http://panshi.qq.com/v2/vote/' + id + '/result?source=3';
        zHttp.send(_url,cb);
    };

    //登录
    //基本参数、常量
    var COOKIE_INIT_ARG = {domain:'vip.qq.com',path:'/',expires:24*60*60};
    var backHome = '';
    if (location.href.toLowerCase().indexOf('answer.html') == -1) {
        backHome = '';
    } else {
        backHome = '<a href="./index.html" class="backHome">返回首页</a>';
    }
    var m_temp = {
        notLogin: backHome + '您还未登录，请<a href="#" class="bt_login">登录</a>',
       isLogin: backHome + '<span class="user_pic"><img src="{avatar}" width="30" height="30" ></span><span class="user_nick" title="欢迎">{nick}</span><a class="mod_st_logout" href="#" title="注销">【注销】</a>'
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

    function clickReport(hottagValue) {
        if(typeof(pgvSendClick) == 'function') {
            pgvSendClick({hottag: hottagValue});
        }
    }
    function pvReport() {
        if (typeof(pgvMain) == 'function') {
            pgvMain("pathtrace", {pathStart: true, tagParamName: "ADTAG", useRefUrl: true, override: true, careSameDomainRef: false});
        }
    }

    var getRealUin = function(str){
        if(/(\d+)/.test(str)){
            return parseInt(RegExp.$1,10);
        }
        else{
            return 0;
        }
    };

    var getAvatarUrl = function(uin, size){
        var _uin = uin;
        var _size = size ? size : 100;
        if(typeof uin === 'string'){
            _uin = getRealUin(uin);
        }
        return "http://q4.qlogo.cn/g?b=qq&nk="+ _uin + "&s=" + _size;
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
            html = "<h5 style='padding-top: 30px;'>活动已经结束！<br>敬请期待更多QQ浏览器特权活动！</h5>\
                <div class='P_btns'>\
                    <a href='javascript:;' class='btn btn_pop' onclick='window.api.dialog.hide();'><span>确定</span></a>\
                </div>";
            return html;
        },
        8 : function(){
            html = "<h5 style='padding-top: 30px;'>活动太火爆了，请稍后再试！</h5>\
                <div class='P_btns'>\
                    <a href='javascript:;' class='btn btn_pop' onclick='window.api.dialog.hide();'><span>确定</span></a>\
                </div>";
            return html;
        },
        7 : function(k){
            html = "<p style='padding-top: 30px;'>只有QQ浏览器用户才能参与领福利哦，快去安装吧～</p>\
                <div class='P_btns'>\
                    <a href='http://qb.wsd.com/files/qbbuild_v8_channel/upload/QQBrowser_Setup_video_HCY.exe?ADTAG=&SNO=' class='btn btn_pop' onclick='window.api.clickReport('BROWSER.ACTIVITY.NZCM.QBDOWNLOADCLICK2');window.api.dialog.hide();'><span>安装QQ浏览器</span></a>\
                </div>";
            return html;
        },
        0 : function(key, prize){
            var type = key == 1 || key == 5 ? '一个' : '一张';
            if (key == 7 || key == 8 || key == -1) {
                var _temp = '';
                if (key == -1){
                    _temp = '<p style="padding-top: 30px;"></p>';
                } else {
                    _temp = '<p style="padding-top: 30px;">亲，您离中大奖已经很近了，再接再厉哦~</p>';
                }
                if (!isSetQuestion) {
                    html = _temp + "<p>您今天还没有去答题，快去答题测正常值，获得大福利哦～</p>\
                    <div class='P_btns'>\
                        <a href='./answer.html' class='btn btn_pop'><span>去答题</span></a>\
                    </div>";
                } else if (!isWatching) {
                    html = _temp + "<p>病还得治，药还得吃～<br>看《你正常吗》接受治疗，治愈后还可以再来一次！</p>\
                    <div class='P_btns'>\
                        <a href='http://video.browser.qq.com/detail.html?vid=3268204' target='_blank' class='btn btn_pop' onclick='page.addMoney(1,function(){window.api.dialog.hide();});'><span>去治病</span></a><a href='javascript:;' class='btn btn_pop2' onclick='window.api.dialog.hide();'><span>已弃疗</span></a>\
                    </div>";
                } else if (haveMoney) {
                    html = _temp + "\
                    <div class='P_btns'>\
                        <a href='javascript:;' class='btn btn_pop' onclick='window.api.dialog.hide();'><span>确定</span></a>\
                    </div>";
                } else {
                    html = "<p style='padding-top: 30px;'>您今天领取福利的机会已经用完了，明天再来吧～</p>\
                    <div class='P_btns'>\
                        <a href='javascript:;' class='btn btn_pop2' onclick='window.api.dialog.hide();'><span>明天再来</span></a>\
                    </div>";
                }
            } else {
                html = "<p style='padding-top: 30px;'>恭喜，获得<strong style='font-size: 20px;color:#ff009c;'>"+ prize +"</strong>"+ type +"！</p>\
                <div class='P_btns'>\
                    <a href='javascript:;' class='btn btn_pop setUser'><span>去领取</span></a>\
                </div>";
            }
            return html;
        },
        1 : function (info) {
            html = "<div class='popContTit'>中奖记录</div>\
                <div class='recordList'>"+ info +"</div><div class='P_btns'>\
                    <a href='javascript:;' class='btn btn_pop2' onclick='window.api.dialog.hide();'><span>关闭</span></a>\
                </div>";
            return html;
        },
        2 : function (obj) {
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

    var getMaxNum = function (arr) {
        var res = 0;
        var k = 0;
        for(var i = 0; i < arr.length; i++){
            if( arr[i] - res >= 0 ){
                res = arr[i];
                k = i;
            }
        }
        return k;
    };

    var getMathRandom = function (x, y) {//x最小数，y最大数
        return parseInt(Math.random() * ( y - x + 1 )) + x;
    };

    W.api = {
        getQuestionList : getQuestionList,
        getAnswerList   : getAnswerList,
        initHeader      : _setLogin,
        clickReport     : clickReport,
        pvReport        : pvReport,
        isQQBrowser     : isQQBrowser,
        installPlugin   : installPlugin,
        getAvatarUrl    : getAvatarUrl,
        getRealUin      : getRealUin,
        dialog          : dialog,
        tips            : tips,
        getMaxNum       : getMaxNum,
        getMathRandom   : getMathRandom
    };
})(window, jQuery);

window.qb = {
    hasAnswer       :   false,  //答题者是否已答过
    questionName    :   [],     //10道题目
    questionOptions :   [],     //10道题目选项列表
    questionInfo    :   [],     //10道题目各个选项的值（检查用）
    answers         :   [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],    //标准答案
    response        :   [-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],    //回答的结果
    response_curr   :   0,  //当前答题第几道题
    score           :   0,  //答对题数
    score_curr      :   0, //答对题数对应的百分比和提示语的下标
    percent         :   [-70, -50, -20, -10, 0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],//得分百分比
    questionId      :   [
        [10321567, 10001962, 10315538, 10315531, 10315527, 10310080, 10272011, 10308512, 10305077, 10305070],
        [10002188, 10312912, 10312910, 10312905, 10310083, 10306942, 10306920, 10305080, 10305073, 10304972],
        [10304213, 10300527, 10300409, 10002320, 10001882, 10298490, 10001905, 10297362, 10297358, 10001867],
        [10297347, 10296102, 10323599, 10296099, 10296086, 10296078, 10001615, 10292514, 10292503, 10002197],
        [10001817, 10292453, 10002406, 10288274, 10288272, 10288269, 10288267, 10283807, 10280221, 10278813],
        [10278810, 10278806, 10278802, 10278801, 10277791, 10277786, 10002057, 10276532, 10001732, 10001996],
        [10276503, 10276500, 10272019, 10272011, 10271996, 10271987, 10271957, 10002464, 10002415, 10002406],
        [10002405, 10002404, 10002320, 10002319, 10002318, 10002317, 10002200, 10304213, 10002198, 10002197],
        [10002196, 10002190, 10002189, 10002188, 10002187, 10002163, 10002140, 10002101, 10002070, 10002059],
        [10002058, 10002057, 10002014, 10002012, 10002011, 10001996, 10001985, 10001984, 10001983, 10001972],
        [10001962, 10001961, 10323604, 10001949, 10001948, 10001938, 10001928, 10001927, 10001918, 10001905],
        [10001894, 10001882, 10001868, 10001867, 10001866, 10001817, 10001615, 10001799, 10001732, 10001656]
    ],
    percent_wording :   [
        "你！居然在负分小分队还能负及格！给你跪了！请收下整个系统这一季所有的膝盖！！！从今天起你就是《你正常吗》新世界的学神了！",
        "内什么，你的世界头朝下脚朝天？这个分数实在太完美了，对称中透着一丝机智，简直让处女座的系统欲罢不能！！现在只有《你正常吗》配得上你了！",
        "你已经在一条神秘的道路上越走越远了，组织上决定对你进行重点培养，像你这样的不正常苗子还是很有栽培的意义滴！要勤奋观看《你正常吗》，苦练蛇精病技巧哦~",
        "你没看错，的确是负分！恭喜，你开启了新世界的大门！啥？新世界的空气味儿不太一样？那是因为查分系统炸裂没多久，赶快去看《你正常吗》适应一下吧！",
        "零分预警！！警察叔叔！就是这个人！查分系统已炸裂！赔我服务器！赶紧卖身去参加《你正常吗》！",
        "你以为10分是满分吗？呵呵哒，还有90分你是怎么扣掉的，躺在地上好好想想吧。墙裂建议你去参加《你正常吗》。帮你到这里，深藏功与名。P.S.不要问我墙裂是谁！",
        "只有20%的你还是正常人，我作为一个系统都看不下去了！电波频率不一样还怎么愉快地玩耍！快飞奔去《你正常吗》找同类！！",
        "真的逗B敢于直视蛇精病的人生。系统判断你已经无药可救，只能让《你正常吗》来拯救你了。勇敢的少年，快去创造奇迹。",
        "你卖，或者不卖萌，我就在这里，不离不弃。就让我任性一次，拯救一个不及格的你，带你看《你正常吗》，带你装X带你飞。",
        "当别人嘲笑你时，你总是假装看风景，你在假装看风景，看风景的人在楼上看你逗B。别张望了，快去看《你正常吗》这个节目，找到你的同类！",
        "壮士请留步！你的各项指标已经刚刚正常，是不是感觉自己萌萌哒？是不是60分万岁多一分浪费？赶快继续再补一季的《你正常吗》。",
        "我知道一个离优秀只差一点的你，此刻一定想静静……亲爱哒，我就是静静，莫慌，抱紧我，还有最后一个问题，腾讯视频《你正常吗》，约不约？",
        "你这个分数，应该用不着安慰了吧。当然我也不想夸奖你，毕竟你离隔壁满分的小明还差了一点。麻麻喊你参加补习班，送你一个“哦”，祝你在《你正常吗》补课愉快。一个系统机器人，留。",
        "小伙子，还有十分就满分，你很不错，跟我学做菜吧。放学憋走，操场东拐角，一起去《你正常吗》赢奖金，敢约吗？",
        "地球上60亿人里面，只有你是最正常的，好耀眼。站好，不要动，让我飞奔向你。想壁咚吗？满足你……毕竟《你正常吗》节目组已经命令我把你抓起来做标本了……么么哒。"
    ],
    data: [],
    log: function(){
        for(var k in window.qb){
            if(k !== 'data' && k !== 'log' && k !== 'percent_wording' && k !== 'questionId' && k !== 'percent'){
                console.log(k + ":  " + window.qb[k]);
            }
        }
    }
};
