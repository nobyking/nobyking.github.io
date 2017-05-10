/**
 * Created by peng on 15/2/3.
 */

window.onload = function(){
    selectQuestion(function(){
        eventBind();
    });
    window.api.pvReport(); //pv上报
};

var share = function(type){
    var url = '';
    if(window.qb.questionId) {
        url = window.api.getWebsiteUrl() + '/ipad/answer.html?id=' + window.qb.questionId + "&ADTAG=" + type;
    }
    if(type == "weixin"){
        window.api.weixinPop(url);
    }
    else{
        window.api.share(type, url);
    }
};

var forget = function(){
    var _forget = [];
    for (var i in window.qb.answers) {
        if (window.qb.answers[i] == -1) {
            _forget.push(parseInt(i + 1));
        }
    }
    if (_forget.length === 0) {
        $('.creation-tips').css('visibility','hidden');
        $('.btn-creation').removeClass('btn-creation-disabled');
    }else{
        $('.creation-tips').css('visibility','visible');
        $('.btn-creation').addClass('btn-creation-disabled');
    }
};

var eventBind = function(){
    $('.rand-one').click(function(){
        var id = parseInt($(this).parent().parent().attr('id').split('-')[1]);
        //console.log(id);
        var data_id = randOneQuestion();
        window.qb.current = data_id;
        window.qb.answers[id] = -1;
        window.qb.questions[id] = data_id;
        //console.log(data_id);
        //var _href = '<a href="javascript:;" class="rand-one">换一个</a>';
        var _html = 'Q' + parseInt(id + 1) + ' : ' + window.qb.data[data_id].question;
        var _options = '';
        for(var j in window.qb.data[data_id].option){
            _options += '<li><em>' + window.qb.data[data_id].letter[j] + '</em><span>' + window.qb.data[data_id].option[j] + '</span></li>';
        }
        $(this).parent().prev().html(_html).next().children('ul').html(_options);
        window.api.clickReport('BROWSER.ACTIVITY.LOVERIPAD.RANDONE');
        //console.log(window.qb.questions);
        forget();
    });

    $('.question-options-list').delegate("li","click",function(){
        var id = $(this).parent().parent().parent().attr('id').split('-')[1];
        $(this).addClass('active').siblings('li').removeClass('active');
        window.qb.answers[id] = $(this).index();
        forget();
        return false;
    });
    //添加抽奖机会
    function addMoney(sid,flag){
        zHttp.send({actid:39721,sid:sid},function(json){
            if(json.ret == 10002) {
                if (!flag) {
                    zHttp.send({actid: 40511, sid: sid},function(){
                        addMoney(sid, true);
                    });
                    return;
                } else {
                    zMsg.show("活动太火爆了，请稍后再试！");
                    zHttp.send({actid: 40512, sid: sid});
                }
            }
        });
    }
    $('.contentx').delegate(".btn-sendQQ","click",function(){
        if(!window.qb.hasAddLucky) {
            window.qb.hasAddLucky = true;
            zHttp.page = {pcfg:{aid: "vip.gongneng.client.qqliulanqi_39711", et: 1425139196, g: "", n: "QQ浏览器情人节",oid: 111111,rid: "",st: 1423015200}};
            if (!window.api.isQQBrowser()) {
                window.api.notQBpop({type: window.api.isCanRun});
                return false;
            }
            window.api.checkLogin(function (sign, sid) {
                window.qb.sid = sid;
                if (sign) {
                    addMoney(sid);
                }else{
                    zMsg.show("请重新登录！");
                }
            })
        }
        var shareTips = document.createElement('div');
        shareTips.className = "share-tips";
        shareTips.innerHTML = "<img src='images/share-tips.png'/>";
        document.body.appendChild(shareTips);
        shareTips.onclick = function(){
            document.body.removeChild(shareTips);
        };
        $('.btn-lucky-href').addClass('btn-lucky-after');
        window.qb.hasSendQQ = true;
    });

    $('.contentx').delegate(".btn-lucky-href","click",function(){
        if(!window.qb.hasSendQQ) {
            var _popHtml = '<p style="font-size: 24px;color:#9e041e;padding: 30px 0 40px;text-align: center;">要把题目发给TA以后才能获得抽奖机会哦~</p>';
            window.api.dialog({body: _popHtml});
        }
        else{
            location.href = "index.html#lucky";
        }
        window.api.clickReport('BROWSER.ACTIVITY.LOVERIPAD.NEWTOLUCKY');
    });

    //生成考题按钮
    var isClick = false;
    var _nickname = undefined;
    $('.btn-creation').click(function(){
        var _forget = [];
        for (var i in window.qb.answers) {
            if (window.qb.answers[i] == -1) {
                _forget.push(parseInt(parseInt(i) + 1));
            }
        }
        if (_forget.length > 0) {
            return false;
        } else {
            if (!window.api.isQQBrowser()) {
                window.api.notQBpop({type: window.api.isCanRun});
                return false;
            }
            window.api.checkLogin(function (sign, sid, uin) {
                window.qb.sid = sid;
                if(sign){
                    if(!isClick) {
                        isClick = true;
                        zHttp.send({actid:39847,sid:sid},function(result){
                            if (result.ret == 0 || result.ret == 10002) {
                                if(result.ret == 10002){
                                    _nickname = uin;
                                }else {
                                    _nickname = result.data.op;
                                }
                                setTimeout(function () {
                                    isClick = false;
                                    window.qb.quesNickName = _nickname;
                                    window.api.setQuestion({
                                        questions: window.qb.questions,
                                        answers: window.qb.answers,
                                        nickName: _nickname
                                    }, function (res) {
                                        if (typeof  res === 'object' && res.ret == 0) {
                                            window.qb.questionId = res.questionId;
                                            var _url = window.api.getWebsiteUrl() + "/ipad/answer.html?id=" + res.questionId;
                                            var _href = '<p class="copyHref"><a href="' + _url + '" id="copyHref">复制题目链接</a></p>';
                                            var _html = '<div class="tipsTxt">题目出好啦，赶快考验你的TA吧！</div>' +
                                                '<div class="btn-cont"><a href="#id=' + res.questionId + '" class="btn btn-sendQQ">通过QQ发给TA</a>' + _href + ' </div><div class="btn-cont"><a href="javascript:;" class="btn btn-lucky-href">我要抽奖</a></div>';
                                            $('.contentx').html(_html);
                                        }
                                    });
                                }, 400);
                            }
                        });
                    }
                }else{
                    zMsg.show("请重新登录！");
                }
            });
        }
        window.api.clickReport('BROWSER.ACTIVITY.LOVERIPAD.CREATEQUESTION');
    });

    $('.contentx').delegate("#copyHref","click",function(){
        var _href = window.api.getWebsiteUrl() + "/ipad/answer.html?id=" + window.qb.questionId;
        var _popHtml = '<p style="font-size: 24px;color:#9e041e;padding: 10px 0;text-align: center;">复制下方链接，赶快发送给TA吧~</p>' +
                        '<div id="copyUrl">'+ _href +'</div>';
        window.api.dialog({body:_popHtml});
        window.api.clickReport('BROWSER.ACTIVITY.LOVERIPAD.COPYLINK');
        return false;
    });
};

var randOneQuestion = function(){
    var curr    = window.qb.current;
    var arr     = window.qb.questions;
    var maxLen  = window.qb.data.length-1; //important
    curr = (curr < maxLen) ? curr+1 : 0;

    var hasFind = false;
    var i;
    while(!hasFind) {
        for (i = 0; i < arr.length; i++) {
            if (arr[i] == curr) {
                curr = (curr < maxLen) ? curr + 1 : 0;
                break;
            }
        }
        if(i >= arr.length){
            hasFind = true;
        }
    }
    return curr;
};
var randonSixnum = function(){
    var retArr = [];
    var num,i;
    var max = window.qb.data.length - 1;
    retArr[0] = Math.floor(Math.random()*max);
    while(true){
        num = Math.floor(Math.random()*max);
        for(i=0; i<retArr.length; i++){
            if(retArr[i] === num){ break;}
        }
        if(i === retArr.length){retArr.push(num)}
        if(retArr.length === 6) { break;}
    }
    return retArr;
};

var selectQuestion = function(cb){
    window.qb.questions = randonSixnum();
    window.qb.current   = window.qb.questions[5];
    var htmlArr = [];
    var _html, _options, _class;
    var _href = '<a href="javascript:;" class="rand-one">换一个</a>';
    var i, j, k;
    var len = window.qb.questions.length;
    for(k=0; k<len; k++) {
        i = window.qb.questions[k];
        _options = '';
        for(j in window.qb.data[i].option){
            _options += '<li><em>' + window.qb.data[i].letter[j] + '</em><span>' + window.qb.data[i].option[j] + '</span></li>';
        }
        _html = '<div class="question-block" id="question-' + k + '">' +
            '<h3 class="question-name">Q' + parseInt(k + 1) + ' : ' + window.qb.data[i].question + '</h3>' +
            '<div class="question-options">' +
            '<ul class="question-options-list">' + _options + '</ul>'+ _href +'' +
            '</div>' +
            '</div>';
        htmlArr.push(_html);
    }
    htmlArr.push('<p class="creation-tips">亲~每题都需要选出自己的答案哦~</p><div class="btn-cont"><a href="javascript:;" class="btn btn-creation btn-creation-disabled">生成考题</a></div>');
    $('.contentx').html(htmlArr.join(""));

    cb();
};
