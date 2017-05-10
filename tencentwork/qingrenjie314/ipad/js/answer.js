/**
 * Created by peng on 15/2/3.
 */
window.onload = function(){
        loadQuestion(function () {
            updateView();
            updateBind();
    });
    $('.bt_login').click(function(){
        window.qb.isHeaderLogin = true;
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


var loadQuestion = function(cb, flag){
    var questionId = qv.zero.URL.get("id");
    if(!questionId){
        location.href = "./";
    }
    window.api.getQuestionById(questionId,function(res) {
        if (res.ret == 1) { //开始答题吧
            window.qb.roleType = res.ret;
            window.qb.questions = res.questions;
            window.qb.answers = res.answers;
            window.qb.questionId = res.questionId;
            window.qb.quesUin = res.quesUin;
            window.qb.quesNickName = res.quesNickName;

            cb ? cb() : null;
        }
        else if (res.ret == 2) { //这套题已经答过了
            window.qb.roleType = res.ret;
            window.qb.questionId = res.questionId;
            window.qb.quesUin = res.quesUin;
            window.qb.quesNickName = res.quesNickName;
            window.qb.score = res.score;

            cb ? cb() : null;
        }
        else if (res.ret == 3 && flag) { //出题人来了
            location.href="./my.html";
        }
        else if (res.ret == -2) {
            //qq.login.open();
            if(!res.questionId){
                location.href="./";
                return;
            }
            window.qb.roleType = res.ret;
            window.qb.questionId = res.questionId;
            window.qb.quesUin = res.quesUin;
            window.qb.quesNickName = res.quesNickName;

            cb ? cb() : null;
        }
        else{
            location.href="./";
        }
    });
};
var updateView = function(){
    var _html;
    var t_uin = window.api.cookie.get('uin') || window.api.cookie.get('pt2gguin');

    if(window.qb.roleType == 1 || (window.qb.roleType == -2 && t_uin !== window.qb.quesUin)){
        _html = '<div class="layout-middle"><span class="nick-pic"><img src="'+ window.api.getAvatarUrl(window.qb.quesUin) +'" width="100" height="100" ></span></div>' +
            '<div class="nick-text">你的好友<span> '+ window.qb.quesNickName +' </span>发来了一条关于TA的题目，你敢来接受TA的真爱大考验么？</div>' +
            '<div class="btn-cont"><a href="javascript:;" class="btn btn-answer">我要答题</a></div>' +
            '<div class="layout-middle"><a href="index.html" target="_blank" class="detail" >了解活动详情</a></div>';

        $('.contentx').html(_html);
    }
    else if(window.qb.roleType == -2){ // && qv.cookie.get('uin') === window.qb.quesUin
        _html = '<div class="layout-middle"><span class="nick-pic"><img src="'+ window.api.getAvatarUrl(window.qb.quesUin) +'" width="100" height="100" ></span></div>' +
            '<div class="btn-cont"><a href="javascript:;" style="margin-top: 30px" class="btn btn-login">登录</a></div>' +
            '<div class="layout-middle"><a href="index.html" target="_blank" class="detail" >了解活动详情</a></div>';

        $('.contentx').html(_html);
    }
    else if(window.qb.roleType == 2){
        renderResult();
    }
};

var renderResult = function(){
    var score = window.qb.score;
    var wording_arr = window.qb.percent_wording[score];
    var num = window.api.getRandomNum(wording_arr.length-1);
    var _html = '<div class="layout-middle"><span class="nick-pic"><img src="'+ window.api.getAvatarUrl(window.qb.quesUin) +'" width="100" height="100" ></span></div>' +
        '<div class="nick-text">你和 <span> '+ window.qb.quesNickName +' </span> 的 <span class="heart">知心度</span> 为</div>' +
        '<div class="heart-result"><span>' + window.qb.percent[score] + '</span>%</div>' +
        '<div class="tips-result">' + wording_arr[num] + '</div>' +
        '<div class="btn-cont"><a href="new.html" onclick="window.api.clickReport(\'BROWSER.ACTIVITY.LOVERIPAD.IWANTASK\');" target="_blank" class="btn btn-set-question">我也要出题</a></div><br><br><br>' +
        '<div class="btn-cont"><a href="index.html#lucky" onclick="window.api.clickReport(\'BROWSER.ACTIVITY.LOVERIPAD.IWANTLUCKY\');" class="btn btn-lucky-href">我要抽奖</a></div>';
    $('.contentx').html(_html);
};

var loginHandle = function(){
    loadQuestion(function(){
        if(window.qb.roleType == 2){
            renderResult();
        }else {
            var _html = '',
                _options = '',
                _questions_cur = 0;
            _questions_cur = window.qb.questions[window.qb.response_curr];
            for (var j in window.qb.data[_questions_cur].option) {
                _options += '<li><em>' + window.qb.data[_questions_cur].letter[j] + '</em><span>' + window.qb.data[_questions_cur].option[j] + '</span></li>';
            }
            _html = '<div class="question-block question-answers" id="question-' + window.qb.response_curr + '">' +
            '<h3 class="question-name">Q1:' + window.qb.data[_questions_cur].question + '</h3>' +
            '<div class="question-options">' +
            '<ul class="question-options-list">' + _options + '</ul>' +
            '</div>' +
            '</div>';
            $('.contentx').html(_html);
        }
    }, true);

};

var updateBind = function(){
    var _options = '',
        _question = '',
        isChosen = false;
    $('.contentx').delegate('.btn-login','click',function(){
        window.qb.isHeaderLogin = false;
        if (!window.api.isQQBrowser()) {
            window.api.notQBpop({type: window.api.isCanRun});
            return false;
        }
        window.api.checkLogin(function(sign){
            if(sign){
                loginHandle();
            }else{
                zMsg.show("请重新登录！");
            }
        });
        window.api.clickReport('BROWSER.ACTIVITY.LOVERIPAD.BTNLOGINCLICK');
    });
    $('.contentx').delegate('.btn-answer','click',function(){
        window.qb.isHeaderLogin = false;
        if (!window.api.isQQBrowser()) {
            window.api.notQBpop({type: window.api.isCanRun});
            return false;
        }
        window.api.checkLogin(function(sign){
            if(sign){
                loginHandle();
            }else{
                zMsg.show("请重新登录！");
            }
        });
        window.api.clickReport('BROWSER.ACTIVITY.LOVERIPAD.BEGINANSWER');
    });

    $('.contentx').delegate(".question-options-list li",'click',function(){
        var _this = $(this);

        if(isChosen){
            return false;
        }
        isChosen = true;
        _options = '';
        _question = '';
        //设置点击后的样式
        $(this).addClass('active').siblings('li').removeClass('active');
        window.qb.response[window.qb.response_curr] = _this.index();
        window.qb.response_curr++;

        if(window.qb.response_curr > window.qb.questions.length - 1 ){
            var len = window.qb.questions.length;
            var correct = 0;
            for(var i = 0; i < len; i++){
                if(window.qb.answers[i] == window.qb.response[i]){
                    correct++;
                }
            }
            window.qb.score = correct;//答对题数
            var _nickname = undefined;
            if (!window.api.isQQBrowser()) {
                window.api.notQBpop({type: window.api.isCanRun});
                return false;
            }
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
            window.api.checkLogin(function (sign, sid, uin) {
                if(sign){
                    zHttp.send({actid:39847,sid:sid},function(result) {
                        if (result.ret == 0 || result.ret == 10002) {
                            if(result.ret == 10002){
                                _nickname = uin;
                            }else {
                                _nickname = result.data.op;
                            }
                            window.api.setAnswer({
                                questionId : window.qb.questionId,
                                score : window.qb.score,
                                answers : window.qb.response,
                                answersNickName : _nickname
                            }, function (res) {
                                if(typeof  res === 'object' && res.ret == 0) {
                                    zHttp.page = {pcfg:{aid: "vip.gongneng.client.qqliulanqi_38148", et: 1425139196, g: "", n: "QQ浏览器情人节",oid: 111111,rid: "",st: 1423015200}};
                                    addMoney(sid);
                                    setTimeout(renderResult,300);
                                }
                                else if(typeof  res === 'object' && res.ret == -2){
                                    zMsg.show("活动太火爆了，请稍后再试！");
                                }
                            });
                            return false;
                        }
                    });
                }else{
                    zMsg.show("请重新登录！");
                }
            });
        }else{
            var _questions_cur = window.qb.questions[window.qb.response_curr];
            for(var j in window.qb.data[_questions_cur].option){
                _options += '<li><em>' + window.qb.data[_questions_cur].letter[j] + '</em><span>' + window.qb.data[_questions_cur].option[j] + '</span></li>';
            }
            _question = 'Q'+ parseInt(window.qb.response_curr +1)+ ' : ' + window.qb.data[_questions_cur].question;

            setTimeout(function(){
                _this.parent().parent().parent().attr('id','question-' + window.qb.response_curr);
                _this.parent().parent().prev().text(_question).next().children('ul').html(_options);
                isChosen = false;
            },600);
        }
    });
};