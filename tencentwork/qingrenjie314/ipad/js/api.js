/**
 * Created by peng on 15/2/2.
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

    var isQQBrowser = function(){
        var version = window.navigator.userAgent.match(/MQQBrowser\/([^\s]+)\s/);
        var isIpad = (window.navigator.platform.toLowerCase().indexOf("ipad") > -1);
        if (!version && !isIpad) {
            window.api.isCanRun = 0;
        }
        else if (!version && isIpad) {
            window.api.isCanRun = 0;
        }
        else if (version[1] < '4.7.1'  && isIpad) {
            window.api.isCanRun = 1;
        }
        else {
            window.api.isCanRun = 2;
        }
        if(window.api.isCanRun != 2){
            return 0;
        }else{
            return window.api.isCanRun;
        }
    };
    var isQQIE = (window.external && window.external.extension && /QQBrowser/i.test(navigator.userAgent)) ? true : false;
    var isQQCT = (window.getExtension && /Chrome.*QQBrowser/i.test(navigator.userAgent)) ? true : false;

    var notQBpop = function(obj){
        var _type = 0;  //值为1：普通的非QB提示；值为2：QB版本过低; 值为3：查看答案详情时的非QB提示；
        if(obj !== undefined){
            _type = obj.type || '';
        }
        var _html = '';
        if(_type == 0){
            _html = '<p style="text-align: center;font-size: 20px;padding-bottom: 10px;">亲，这是QQ浏览器的专属活动</p><p style="text-align: center;font-size: 20px;padding-bottom: 20px;">使用QQ浏览器打开即可抽奖~<\/p>';
        }else if(_type == 1){
            _html = '<p style="text-align: center;font-size: 20px;">您的QQ浏览器版本过低，请下载最新版QQ浏览器。</p><br><br><br>';
        }else if(_type == 3){
            _html = '<p style="text-align: center;font-size: 20px;padding-bottom: 10px;">亲，查看TA的答案需要使用QQ浏览器哦</p><p style="text-align: center;font-size: 20px;padding-bottom: 20px;">还有惊喜大奖等你来拿！<\/p>';
        }
        _html += '<div class="btn-cont"><a onclick="this.href = \'https://itunes.apple.com/cn/app/id426097375\';clickReport(\'BROWSER.ACTIVITY.LOVERIPAD.QBDOWNLOADCLICK\');" href="javascript:;" class="btn btn-downloadQB">下载QQ浏览器</a></div>';
        dialog({body:_html});
    };

    var getGuid = function(cb){
        if (isQQIE) {
            try {
                var guid = window.external.getGuid();
                guid ? cb(0, guid.split('-').join('')) : cb(-1);
            }catch(e){
                cb(-5);
            }
        }
        else if (isQQCT) {
            var web_page_extension_id = '{A3C609B3-3E61-4508-8953-117B7286068B}';
            var platform_extension_id = '{420DEFEE-20A8-468C-BFDA-61A09A99325D}';
            var extension;
            try {
                extension = window.getExtension(web_page_extension_id);
                extension.sendMessage(platform_extension_id, {serviceId: "hardware.getGuid", args: []}, function (data) {
                    data[0] ? cb(0, data[0].split('-').join('')) : cb(-2);
                });
            }catch(e){
                cb(-3);
            }
        }
        else{
            cb(-4);
        }
    };

    var getWebsiteUrl = function(){
        return "http://lover.browser.qq.com";
    };

    var dealAjax = function(url, data, cb){
        if(typeof data !== 'object'){
            return;
        }
        data.t = new Date().getTime();
        $.ajax({
            url: getWebsiteUrl() + url,
            type: 'POST',
            dataType: 'json',
            data: JSON.stringify(data),
            //crossDomain: true,
            success:function(res){
                //console.log(res);
                if(cb) {
                    cb(res);
                }
            }
        });
    };
    var getQuestionList = function(cb){
        dealAjax('/get_question_list', {}, cb);
    };

    var setQuestion = function(data, cb){
        dealAjax('/set_question', data, cb);
    };

    var setAnswer = function(data,cb){
        dealAjax('/set_answer', data, cb);
    };

    var getQuestionById = function(id, cb){
        dealAjax('/get_question', {questionId:id}, cb);
    };


    function delCookie(name) {
        var date = new Date();
        date.setTime(date.getTime() - 10000);
        document.cookie = name + "=; expire=" + date.toGMTString() + "; path=/;domain=.qq.com";
    }

    // 检测登录
    function checkLogin(cb){
        //delCookie('uin');
        delCookie('skey');
        x5.exec(function(data){
            if(typeof data === 'object'){
                if(data.uin && data.sid){
                    window.api.cookie.set("uin", data.uin);
                    cb(true, data.sid, data.uin);
                }
                else{
                    cb(false);
                }
            }
        }, function(err){
            cb(false);
        }, "login", "getSidAndUin",[]);
    }
    //操作COOKIE
    var cookie = {
        set : function(name,value){
            var temp = 'o';
            var Days = 30;
            var exp = new Date();
            exp.setTime(exp.getTime() + Days*24*60*60*1000);
            if(!isNaN(value)){
                for(var i = 0; i < 10 - value.length; i++){
                    temp += '0';
                }
                value = temp + value;
            }
            document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString() + ";Domain=qq.com;Path=/";
        },
        get : function(name){
            var arr,reg=new RegExp("(^| )"+name+"=([^;]*)(;|$)");
            if(arr=document.cookie.match(reg))
                return unescape(arr[2]);
            else
                return null;
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

    var dialog = function(obj){
        var title = '',
            content = '',
            wrap_css = '';
        if(obj !== undefined){
            title = obj.header || '';
            content = obj.body || '';
            ObjCss = obj.style || '';
            if(obj.type == 3){
                wrap_css = 'style="margin-left:-25px;margin-right:-25px;"';
            }
        }
        var ObjCss,popWrap,popBox,popClose;

        var pop = document.getElementById('popMsg');
        if(pop){
            document.body.removeChild(pop);
        }

        popBox = document.createElement('div');
        popBox.className = 'popMsg';
        popBox.id = 'popMsg';
        popBox.style.cssText = ObjCss;
        document.body.appendChild(popBox);
        popWrap = document.createElement('div');
        popWrap.className = 'popWrap';
        popBox.appendChild(popWrap);
        popWrap.innerHTML = '<div class="popTit">'+ title +'</div><div class="popContainer" '+ wrap_css +'>'+ content +'</div>';
        popClose = document.createElement('a');
        popClose.className = 'popClose';
        popBox.appendChild(popClose);
        if(popBox.style.position == 'fixed'){
            popBox.style.marginTop = (popBox.offsetHeight / 2) + "px";
        }
        popClose.onclick = function(){
            document.body.removeChild(popBox);
        };
    };
    var getRandomNum = function(num){ //获得0-num(num小于60)之间的随机数
      return new Date().getSeconds() % (num+1);
    };

    //分享组件
    var shareFunc = function(type,url){
        var shareObj={
            qzone: function(a) {
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
                var b = {
                    resourceUrl: a.url,
                    srcUrl:a.url,
                    pic: a.pic || null,
                    description: a.description
                };
                var s = [];
                for(var i in b){
                    s.push(i + '=' + encodeURIComponent(b[i]||''));
                }
                return "http://widget.renren.com/dialog/share?" + s.join('&');
            },
            sina: function(a) {
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
            url: getWebsiteUrl()+"?ADTAG="+type,
            pic: "http://stdl.qq.com/stdl/temp/qingrenjie_share2.gif",
            title: "白色情人节真爱大考验，参与赢日本双飞游+iPad mini，还有海量Q币疯狂送",
            description: "白色情人节真爱大考验，参与赢日本双飞游+iPad mini，还有海量Q币疯狂送！最满意身体哪个部位，洗澡最先洗哪里，让你面红耳赤的问题大集锦！你和ta的专属秘密，敢测，才是真爱！快来考考ta吧~"
        };
        if(url){
            wording.url = url;
        }

        window.open(shareObj[type](wording));
    };

    //微信弹框
    function weixinPop(url){
        var _image;
        if(url){
            _image = '<img src="http://qr.liantu.com/api.php?w=240&m=0&text='+encodeURIComponent(url)+'">';
        }
        else{
            _image = '<img src="http://stdl.qq.com/stdl/temp/lover_share.png">';
        }
        var _html = '<p style="text-align: center; z-index:10001; position: relative; top: -35px">' + _image + '</p><p style="font-size: 20px;text-align: center;">微信扫一扫</p>';
        dialog({body:_html});
    }
    function dataFormat(expr,date){
        expr=expr||'yyyy-MM-dd hh:mm:ss';
        date;
        if(arguments.length==1){
            date=new Date();
        }else if(!(date instanceof Date)){
            date=new Date(parseInt(date)||0);
        }
        var o = {
            "M+": date.getMonth() + 1, //月份
            "d+": date.getDate(), //日
            "h+": date.getHours(), //小时
            "m+": date.getMinutes(), //分
            "s+": date.getSeconds(), //秒
            "q+": Math.floor((date.getMonth() + 3) / 3), //季度
            "S": date.getMilliseconds() //毫秒
        };
        if (/(y+)/.test(expr)) expr = expr.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(expr)) expr = expr.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return expr;
    }

    W.api = {
        getQuestionList : getQuestionList,
        getQuestionById : getQuestionById,
        setQuestion     : setQuestion,
        setAnswer       : setAnswer,
        checkLogin      : checkLogin,
        clickReport     : clickReport,
        pvReport        : pvReport,
        isQQBrowser     : isQQBrowser,
        notQBpop        : notQBpop,
        getAvatarUrl    : getAvatarUrl,
        getRealUin      : getRealUin,
        dialog          : dialog,
        getRandomNum    : getRandomNum,
        getWebsiteUrl   : getWebsiteUrl,
        share           : shareFunc,
        getGuid         : getGuid,
        weixinPop       : weixinPop,
        cookie          : cookie,
        dataFormat      : dataFormat
    };
})(window, Zepto);


window.qb = {
    roleType: -1,                   //3 - 出题者  1/2-答题者
    hasAnswer : false,             //答题者是否已答过
    questions: [-1,-1,-1,-1,-1,-1], //选中的6个问题
    answers:   [-1,-1,-1,-1,-1,-1], //问题答案
    response: [-1,-1,-1,-1,-1,-1], // 回答的结果
    response_curr: 0,               //当前答题第几道题
    score:0,                       //答对题数
    percent: [0,17,34,50,67,84,100],//得分百分比
    resultList: {}, //用于存储出题者所有题目的答题情况
    percent_wording:[
        ["亲爱的你还能再多错一道不？","再见，路人甲","你哪位？","你是个好人！","敢情伦家在你眼里就一空气柱！伤心太平洋...","你为什么背着我爱别人！"],
        ["等着被关小黑屋吧！","拉出去枪毙半小时！","就了解我这么一丢丢你好意思答题~","我妈让我自己回家过年…"],
        ["come on 保证不打死你！","爱过！","我敬你是条“汉子”！"],
        ["懒得动手了，自行了断吧~","小祖宗，敢不敢再长点心~","嗯….常联系~","慢走，不送！"],
        ["约么？","来世再约~","想当我的“小蛔虫”，还差一丢丢哦~"],
        ["中国好“蛔虫”~","约约约，立马约！","偷窥人家好久了吧…羞羞","一步之遥~ 回家再收拾你！"],
        ["我们结婚吧~","你是不是跟踪狂魔啊这么懂我！","Yes,I do!","带你回家过年带你飞！","命中注定我爱你！","我的眼里只有你！"]
    ],
    data: [
        {
            "question": "和你约会,碰到了前任我会怎么做？",
            "option" : ["礼貌问好","抱紧你显得很亲密","亲一下你的脸颊","立马松开你的手,装没事发生","装作不认识"],
            "letter" : ["A","B","C","D","E"]
        },
        {
            "question": "我对自己哪个部位最满意？",
            "option" : ["腿","腰","手","胸","脸"],
            "letter" : ["A","B","C","D","E"]
        },
        {
            "question": "最近一次吵架是什么时候？",
            "option" : ["最近刚吵完","一周前","一个月前","一年前","其他"],
            "letter" : ["A","B","C","D","E"]
        },
        {
            "question": "为什么每次我洗完澡就觉得自己特别美？",
            "option" : ["脑子进水了","天生丽质","镜子起雾了","没带眼镜","一周没洗澡了"],
            "letter" : ["A","B","C","D","E"]
        },
        {
            "question": "第一次KISS是在几岁？",
            "option" : ["12岁以下","12-18岁","18-24岁","24岁以上","还没KISS过"],
            "letter" : ["A","B","C","D","E"]
        },
        {
            "question": "我觉得和恋人认识多久才可以结婚？",
            "option" : ["一年之内","1-2年","2-3年","3年以上","没想过结婚"],
            "letter" : ["A","B","C","D","E"]
        },
        {
            "question": "我接吻时一般都在想什么？",
            "option" : ["嘴唇好软","吃了TA","怎么才能让TA更兴奋呢","一会儿要用哪个姿势呢","大脑一片空白"],
            "letter" : ["A","B","C","D","E"]
        },
        {
            "question": "我最长的一次恋爱时间是？",
            "option" : ["一年之内","1-3年","3-5年","5年以上","还没谈过恋爱呢"],
            "letter" : ["A","B","C","D","E"]
        },
        {
            "question": "我的酒量怎么样？",
            "option" : ["一杯倒","一瓶倒","五六七八瓶","酒神,千杯不醉","不喝酒"],
            "letter" : ["A","B","C","D","E"]
        },
        {
            "question": "无聊的时候我一般做什么？",
            "option" : ["听歌","看电影","逛街","去酒吧","挑逗你"],
            "letter" : ["A","B","C","D","E"]
        },
        {
            "question": "我谈过几次恋爱？",
            "option" : ["1次","2-5次","5-10次","恋爱达人，10次以上","光棍一个，没人爱"],
            "letter" : ["A","B","C","D","E"]
        },
        {
            "question": "如果有时光机，我最想去什么时候？",
            "option" : ["婴儿期","童年","学生时代","中年","老年"],
            "letter" : ["A","B","C","D","E"]
        },
        {
            "question": "我的前任突然出现在我的婚礼上,我会怎么办？",
            "option" : ["向朋友一样把TA介绍给另一半","不敢直视,也不会去招待TA","赶紧告诉家人,以防TA闹事","质问TA为什么来","其他"],
            "letter" : ["A","B","C","D","E"]
        },
        {
            "question": "起床看时间已经迟到1小时了,我会怎么办？",
            "option" : ["给boss打电话请假","爬起来就飞奔上班","去单位后说路上遇到变态","装不知道,继续睡","其他"],
            "letter" : ["A","B","C","D","E"]
        },
        {
            "question": "我最喜欢别人骂我什么？",
            "option" : ["有钱了不起啊","脸大了不起啊","长得帅了不起啊","只要被骂都喜欢"],
            "letter" : ["A","B","C","D"]
        },
        {
            "question": "我的血型是？",
            "option" : ["A型","B型","O型","AB型","其他"],
            "letter" : ["A","B","C","D","E"]
        },
        {
            "question": "如果我失恋了我会做些什么？",
            "option" : ["彻夜买醉","抽烟解愁","向朋友哭诉","乞求TA不要离开","很快进入下一段感情"],
            "letter" : ["A","B","C","D","E"]
        },
        {
            "question": "我的体重大概是多少？",
            "option" : ["100斤以下","100-120斤","120-130斤","130-150斤","150斤以上"],
            "letter" : ["A","B","C","D","E"]
        },
        {
            "question": "我脸上的哪个部位我认为比较完美？",
            "option" : ["鼻子","嘴巴","眼睛","眉毛","脸蛋"],
            "letter" : ["A","B","C","D","E"]
        },
        {
            "question": "我觉得世界上什么人最辛苦？",
            "option" : ["清洁工","A片的摄影师","自己","服务员","妈妈"],
            "letter" : ["A","B","C","D","E"]
        },
        {
            "question": "我这辈子做过最后悔的事情是什么？",
            "option" : ["五岁那年拿我哥房间的纸巾擦我姐房间里的黄瓜吃","后悔没做过后悔的事情","每件事情做完了就后悔","吵完架才想起来怎么还嘴","其他"],
            "letter" : ["A","B","C","D","E"]
        },
        {
            "question": "我为什么和前任分手？",
            "option" : ["三观不同","我爱上你了","对方出轨","腻了","家长不同意"],
            "letter" : ["A","B","C","D","E"]
        },
        {
            "question": "如果我的情敌掉进水里不会游泳,我会怎么做？",
            "option" : ["站在水边跳小苹果","跳进水里在他面前游来游去","先把他救上来,在他说谢谢的时候,说个不客气,再把他推下去","往河里撒尿","救他上来,高冷地转身就走"],
            "letter" : ["A","B","C","D","E"]
        },
        {
            "question": "我最怕的事情或者东西是什么？",
            "option" : ["最怕结婚的对象不是你","最怕你哭","最怕毛毛虫","最怕没钱"],
            "letter" : ["A","B","C","D"]
        },
        {
            "question": "我们第一次KISS是什么时候？",
            "option" : ["在一起之前","在一起一周内","在一起一个月内","在一起一年内","还没KISS呢"],
            "letter" : ["A","B","C","D","E"]
        },
        {
            "question": "我最讨厌什么样的人？",
            "option" : ["爱装逼的","斤斤计较的","口是心非的","八卦的","其他"],
            "letter" : ["A","B","C","D","E"]
        },
        {
            "question": "我最喜欢参与的活动是？",
            "option" : ["夜店唱K跳舞","组饭局喝酒","打麻将玩桌游","户外运动","死宅"],
            "letter" : ["A","B","C","D","E"]
        },
        {
            "question": "我周末过得快不快乐？",
            "option" : ["宅着哪有快不快乐","嗨翻天","只要跟你在一起就快乐","只要不加班就快乐","其他"],
            "letter" : ["A","B","C","D","E"]
        },
        {
            "question": "我在乎别人对我的看法么？",
            "option" : ["无所谓啦，我就是我","在意，害怕别人指指点点","一般，看对于什么事了","特别在意，对别人的看法非常敏感"],
            "letter" : ["A","B","C","D"]
        },
        {
            "question": "为什么我喜欢暗恋？",
            "option" : ["暗恋是最省事的恋爱","不敢表白","表白从未成功过","暧昧是爱情最美妙的时期","心理变态"],
            "letter" : ["A","B","C","D","E"]
        },
        {
            "question": "亲热的时候我喜欢谁主动？",
            "option" : ["ta主动","我主动","都主动","都羞涩"],
            "letter" : ["A","B","C","D"]
        },
        {
            "question": "我最喜欢什么季节？",
            "option" : ["春","夏","秋","冬"],
            "letter" : ["A","B","C","D"]
        },
        {
            "question": "我的鞋是多少码的？",
            "option" : ["34-37","38-40","41-43","44-46","其他"],
            "letter" : ["A","B","C","D","E"]
        },
        {
            "question": "我睡觉的时候穿几件衣服？",
            "option" : ["1件","2件","3件","4件","全裸哦"],
            "letter" : ["A","B","C","D","E"]
        },
        {
            "question": "我喜欢哪种音乐？",
            "option" : ["古典","摇滚","R&B","流行","广场舞配乐"],
            "letter" : ["A","B","C","D","E"]
        },
        {
            "question": "我喜欢哪儿被吻？",
            "option" : ["额头","嘴唇","耳朵","脖子","其他哦"],
            "letter" : ["A","B","C","D","E"]
        },
        {
            "question": "我想要几个小孩儿？",
            "option" : ["不要小孩","1个","2个","3~4个","一个足球队"],
            "letter" : ["A","B","C","D","E"]
        },
        {
            "question": "我愿不愿意和对方父母一起住？",
            "option" : ["求之不得","可以住近点，但不想住一起","不愿意","无所谓"],
            "letter" : ["A","B","C","D"]
        },
        {
            "question": "我最喜欢ta怎么称呼我？",
            "option" : ["老公/老婆","宝贝儿/小心肝儿/小祖宗","司令/领导","直呼大名","旺财/二狗子"],
            "letter" : ["A","B","C","D","E"]
        },
        {
            "question": "我最喜欢你身体哪个部位？",
            "option" : ["腿或腰","手或脸","胸","屁股","其他"],
            "letter" : ["A","B","C","D","E"]
        },
        {
            "question": "我喜欢用哪只手牵着你？",
            "option" : ["左手","右手","看情况","不牵"],
            "letter" : ["A","B","C","D"]
        },
        {
            "question": "如果只能养一样宠物，我会养？",
            "option" : ["猫","狗","水族类","养你啦","养小三"],
            "letter" : ["A","B","C","D","E"]
        },
        {
            "question": "我的胸围是？",
            "option" : ["A","B","C","D及以上","飞机场"],
            "letter" : ["A","B","C","D","E"]
        },
        {
            "question": "以下哪件事在我眼里最不可原谅？",
            "option" : ["精神出轨","身体出轨","骑驴找马","一脚踏N只船"],
            "letter" : ["A","B","C","D"]
        },
        {
            "question": "我多久洗一次澡？",
            "option" : ["一天一次","两天一次","一周一次","能不洗就不洗"],
            "letter" : ["A","B","C","D"]
        },
        {
            "question": "我哪里最怕痒？",
            "option" : ["脚心","胳肢窝","腰","耳朵","随便挠,纹丝不动"],
            "letter" : ["A","B","C","D","E"]
        },
        {
            "question": "我想什么时候结婚？",
            "option" : ["20-23","24-27","28-30","30以上","不想结婚,单身万岁"],
            "letter" : ["A","B","C","D","E"]
        },
        {
            "question": "我平常几点睡觉？",
            "option" : ["晚上9-10点","晚上11-12点","晚上1-2点","我昼伏夜出","没准儿"],
            "letter" : ["A","B","C","D","E"]
        },
        {
            "question": "我平常几点起床？",
            "option" : ["7点以前","7点~8点","8点~9点","9点~12点","下午"],
            "letter" : ["A","B","C","D","E"]
        },
        {
            "question": "我喝酸奶舔不舔酸奶盖儿？",
            "option" : ["必须舔","现在不舔了","不舔","连瓶舔","不喝酸奶"],
            "letter" : ["A","B","C","D","E"]
        },
        {
            "question": "我起床后是先洗脸还是先刷牙？",
            "option" : ["先洗脸","先刷牙","看心情","不洗簌","不起床"],
            "letter" : ["A","B","C","D","E"]
        },
        {
            "question": "我刷完牙，牙刷怎么摆？",
            "option" : ["头朝上","头朝下","横着摆","随便一扔"],
            "letter" : ["A","B","C","D"]
        },
        {
            "question": "在饭店吃饭我喜欢坐在什么位置？",
            "option" : ["角落里","靠窗","越显眼越好","随意,听服务员安排"],
            "letter" : ["A","B","C","D"]
        },
        {
            "question": "我性幻想的对象是？",
            "option" : ["即将答题的你","前任","初恋","男/女神","反正不是你"],
            "letter" : ["A","B","C","D","E"]
        },
        {
            "question": "我最喜欢的歌手是哪里的人？",
            "option" : ["欧美","港澳台","东南亚","大陆","爱斯基摩人"],
            "letter" : ["A","B","C","D","E"]
        },
        {
            "question": "面对喜欢的食物，我会怎么吃？",
            "option" : ["先吃好吃的部分","先吃不好吃的部分","只吃好吃的部分","一口吞"],
            "letter" : ["A","B","C","D"]
        },
        {
            "question": "我最喜欢什么类型的电影？",
            "option" : ["动作片","爱情片","搞笑片","恐怖片","动画片"],
            "letter" : ["A","B","C","D","E"]
        },
        {
            "question": "听到旁边有人说我坏话，我会怎么办？",
            "option" : ["当没听见","马上上前质问","偷偷听完他们的对话","立即开战炮轰"],
            "letter" : ["A","B","C","D"]
        },
        {
            "question": "我会怎么向喜欢的人表白？",
            "option" : ["精心安排，约TA到一个浪漫的地点，隆重表白","一不小心没憋住，说漏嘴了","直接了当问TA愿意做男/女朋友吗","约TA去看爱情电影，借着冲动趁机表白","其他"],
            "letter" : ["A","B","C","D","E"]
        },
        {
            "question": "我喜欢看哪个国家的成人电影？",
            "option" : ["日本","韩国","欧美","国产","其他"],
            "letter" : ["A","B","C","D","E"]
        },
        {
            "question": "我大学最后悔的一件事？",
            "option" : ["挂科","没谈恋爱","没玩好也没学好","还是个处"],
            "letter" : ["A","B","C","D"]
        },
        {
            "question": "我喜欢怎样的旅行？",
            "option" : ["报团","自驾","自助","徒步搭车"],
            "letter" : ["A","B","C","D"]
        },
        {
            "question": "见到异性我第一眼会关注ta哪个部位？",
            "option" : ["脸","胸","腰","屁股","腿"],
            "letter" : ["A","B","C","D","E"]
        },
        {
            "question": "我会和前任做朋友吗？",
            "option" : ["老死不相往来","想但是不敢，怕被现任发现","前任都已发展成为蓝颜知己","看前任长相啦"],
            "letter" : ["A","B","C","D"]
        },
        {
            "question": "我在做错事得罪人的时候，会怎么做？",
            "option" : ["一笑而过","大声说：能把我咋地","勇敢做自己","我从不得罪人"],
            "letter" : ["A","B","C","D"]
        },
        {
            "question": "我最喜欢岛国动作片里的哪个女神?",
            "option" : ["苍井空","松岛枫","波多野结衣","小泽玛利亚","其他"],
            "letter" : ["A","B","C","D","E"]
        },
        {
            "question": "我最向往什么样的生活?",
            "option" : ["够吃够喝就行","自由自在最难得","中产阶级","一掷千金"],
            "letter" : ["A","B","C","D"]
        },
        {
            "question": "我多久换一次内内?",
            "option" : ["每天","3天","一周","能不换就不换","我不穿内内"],
            "letter" : ["A","B","C","D","E"]
        },
        {
            "question": "我最大的缺点是什么？",
            "option" : ["脆弱","愤青","没耐心","没主见","太优秀"],
            "letter" : ["A","B","C","D","E"]
        },
        {
            "question": "我有变弯的潜力吗？",
            "option" : ["太直了，不可能","有时候会对同性有好感","已经在变弯的道路上越走越远","不仅弯弯，还是个受"],
            "letter" : ["A","B","C","D"]
        },
        {
            "question": "哪三个字可以哄我开心？",
            "option" : ["我爱你","嫁给我","随便买","你真美","哥养你"],
            "letter" : ["A","B","C","D","E"]
        },
        {
            "question": "我的怪癖是什么？",
            "option" : ["喜欢挤痘痘","戴耳机的时候必须分左右","强迫症","上厕所前先冲水，上完之后再冲一遍","被子一定要分头和尾"],
            "letter" : ["A","B","C","D","E"]
        },
        {
            "question": "我注重自己的外表吗？",
            "option" : ["比别人都爱美","不注意怎么泡妹子/勾汉子","外表能值几个钱","一件衣服穿到破"],
            "letter" : ["A","B","C","D"]
        },
        {
            "question": "我喜欢穿什么风格的衣服？",
            "option" : ["欧美英伦","嘻哈宽大","运动休闲","商务正式","其他"],
            "letter" : ["A","B","C","D","E"]
        },
        {
            "question": "我手机被偷了之后会有什么反应？",
            "option" : ["报警","哭","向旁人求助联系亲人朋友","正好可以换个新的","察言观色，看身边谁比较像小偷"],
            "letter" : ["A","B","C","D","E"]
        },
        {
            "question": "如果给我100万，我最不会做什么事？",
            "option" : ["还了","挥霍","分你一半","捐了"],
            "letter" : ["A","B","C","D"]
        },
        {
            "question": "12星座，我最希望哪个星座消失？",
            "option" : ["双子座","处女座","水瓶座","天蝎座","其他"],
            "letter" : ["A","B","C","D","E"]
        },
        {
            "question": "和恋人吵架后，我会怎么做？",
            "option" : ["冷静下来，主动找对方求和","只要对方示好，就没事了","必须等自己气消了才好","冷战"],
            "letter" : ["A","B","C","D"]
        },
        {
            "question": "如果要文雅的表达我要便便，我会怎么说？",
            "option" : ["我要去洗手间","内急","干大事","我要拉屎"],
            "letter" : ["A","B","C","D"]
        },
        {
            "question": "爱情公寓里我最喜欢谁？",
            "option" : ["吕子乔","曾小贤","胡一菲","陈美嘉","唐悠悠"],
            "letter" : ["A","B","C","D","E"]
        },
        {
            "question": "以下哪件事我最可能做过？",
            "option" : ["和前任纠缠不清","劈腿","见到陌生异性谎称自己是单身","毫无前科，问心无愧"],
            "letter" : ["A","B","C","D"]
        },
        {
            "question": "如果我的TA出轨了我会怎么办？",
            "option" : ["分手没商量","睁一只眼闭一只眼","和小三撕逼","和TA摊牌，要TA做出选择","其他"],
            "letter" : ["A","B","C","D","E"]
        }
  ],
    log: function(){
        var temp = '';
        function cb(){
            temp = '';
            for(var k in window.qb){
                if(k !== 'data' && k !== 'log' && k !== 'percent' && k !== 'percent_wording'){
                    temp += k + ":  " + window.qb[k];
                    temp += "<br>"
                }
            }
            temp += 'questionList: ' + window.qb.questionIdList + '<br>';
            temp += 'uin: ' + api.cookie.get('uin');
            return temp;
        }
        temp = cb();
        if(document.getElementById('DIV')) {
            document.getElementById('DIV').innerHTML = cb();
        }else{
            DIV = document.createElement('div');
            DIV.id = 'DIV';
            CSS = "position:fixed;top:10px;left:10px;z-index:99999999;color:blue;font-size:14px;";
            DIV.style.cssText = CSS;
            document.body.appendChild(DIV);
            DIV.innerHTML = temp;
        }
    }
};
//qb.log();