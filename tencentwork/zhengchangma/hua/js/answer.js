/**
 * Created by rzm on 15/6/20.
 */
isQQCT = (window.getExtension && /Chrome.*QQBrowser/i.test(navigator.userAgent)) ? true : false;
window.onload = function(){
    window.api.initHeader();
    initFuli();
    loadQuestion(function () {
        updateView();
        updateBind();
    });
    window.api.pvReport(); //pv上报
};


var loadQuestion = function(cb){
    var today = new Date();
    var day = today.getDate() % 12;
    var _id = Math.floor(Math.random()*10);
    var QId = window.qb.questionId[day][_id];
    //获取题目和选项
    window.api.getQuestionList(QId, function (res) {
        if(res.code == 0){
            for(var i = 0; i < res.data.subject.length; i++){
                window.qb.questionName[i] = res.data.subject[i].title;
                window.qb.questionOptions[i] = [];
                for (var k in res.data.subject[i].option){
                    window.qb.questionOptions[i].push(res.data.subject[i].option[k].title);
                }
            }
            if (window.qb.questionName.length == 0) {
                alert("网络异常请刷新页面！");
            } else {
                console.log(window.qb.questionName);
                //获取题目的答案
                window.api.getAnswerList(QId, function (res) {
                    if(res.code == 0){
                        var result = [];
                        for(var i = 0; i < 10; i++){
                            var option = res.data.subject[i].option;
                            result[i] = [];
                            for(var k in option){
                                result[i][k] = option[k].selected;
                            }
                            window.qb.answers[i] = window.api.getMaxNum(result[i]);
                            window.qb.questionInfo[i] = result[i];  //检查用
                        }
                        if (window.qb.answers.length == 0) {
                            alert("网络异常请刷新页面！");
                        } else {
                            console.log(window.qb.answers);
                            cb();
                        }
                    }
                });
            }
        }
    });
};

//初始化页面
var updateView = function(){
    var _html = '';
    var Q_html = '';
    var _class = '';
    var letter = ['A','B','C','D','E','F','G','H'];
    for(var i = 0; i < 10; i++){
        var _options = '';
        for(var k  in window.qb.questionOptions[i]){
            _options += '<dd><em>'+ letter[k] +'</em>'+ window.qb.questionOptions[i][k] +'</dd>';
        }
        _options += '';
        Q_html += '<div class="Q_list" id="question_'+ i +'">\
                    <div class="Q_layer"></div>\
                    <dl class="Q_cont">\
                        <dt>'+ window.qb.questionName[i] +'</dt>\
                        '+ _options +'\
                    </dl>\
                </div>';
    }
    _html = '<div class="a_banner"></div>\
            <div class="question_list">\
                <div class="question_wrap">\
                    '+ Q_html +'\
                </div>\
            </div>\
            <div class="btns">\
                <a href="javascript:;" class="btn btn_submite disabled">交卷</a>\
            </div>';
    jQuery('#content').html(_html);
};

//展示结果页
var resultView = function () {
    var _html = '<div class="s_banner_hua">\
                    <div class="score">\
                        <span>'+ window.qb.percent[window.qb.score_curr] +'</span>\
                        <p>你的正常指数</p>\
                    </div>\
                </div>\
                <div class="r_tips">'+ window.qb.percent_wording[window.qb.score_curr] +'</div>\
                <div class="btns">\
                    <a href="javascript:;" class="btn brn_addMoney">去领福利</a><a href="http://video.browser.qq.com/detail.html?vid=3268204" target="_blank" class="btn btn_seeProgram">看节目</a><a href="http://weibo.com/5061558889/CgAno1vzq?from=page_1006065061558889_profile&wvr=6&mod=weibotime&type=comment#_rnd1434613124447" target="_blank" class="btn btn_setQuestion">去出题</a>\
                </div>';
    jQuery('#content').html(_html);
};

//绑定按钮事件
var updateBind = function(){
    if (isQQCT) {
        jQuery('#content .Q_list').eq(0).addClass('active QQCT');
    } else {
        jQuery('#content .Q_list').eq(0).addClass('active');
    }
    jQuery('#content').on('click', '.Q_list .Q_cont dd', function () {
        var _this = jQuery(this);
        var _parent = _this.parent().parent();
        if(_parent.attr('class').indexOf('disabled') == -1){
            var k = _parent.index();
            _this.addClass('active');
            _parent.addClass('disabled');
            window.qb.response[k] = _this.index() - 1;
            if (isQQCT) {
                _parent.next().addClass('active QQCT');
            } else {
                _parent.next().addClass('active');
            }
            window.qb.response_curr++;
        }

        if(window.qb.response_curr == 10){
            if (jQuery('.btn_submite').hasClass('disabled')){
                jQuery('.btn_submite').removeClass('disabled');
                console.log(window.qb.response);
            }
        }
    });
    jQuery('#content').on('click', '.btn_submite', function () {
        var _this = jQuery(this);
        if (!_this.hasClass('disabled') && window.qb.response_curr == 10) {
            var _temp = 0;
            for (var i = 0; i < 10; i++) {
                if(window.qb.answers[i] == window.qb.response[i]){
                    _temp++;
                }
            }
            window.qb.score = _temp;
            if (window.qb.score <= 2) {
                window.qb.score_curr = window.api.getMathRandom(0,6);
            } else {
                window.qb.score_curr = window.qb.score + 4;
            }
            resultView();
            window.api.installPlugin();
        }
    });
    jQuery('#content').on('click', '.brn_addMoney', function () {
        page.addMoney(function () {
            if (!window.qb.addSuccess) {
                window.api.dialog.open(window.api.tips['8']());
            } else {
                window.location = './';
            }
        });
    })
};

var initFuli = function(){
    (function (window,$) {
        Page = qv.zero.extend(qv.zero.AbstractPage,{
            userJsonID : 51419,
            //preloads : [],
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
            },

            addMoney: function(cb){
                zUtil.ensureLogin(function(){
                    zHttp.send({'actid' : 51425}, function (res) {
                        if (res.ret == 0) {
                            window.qb.addSuccess = true;
                        }
                        else if (res.ret == 10002) {
                            qq.login.open();
                            window.qb.addSuccess = true;
                        }
                        else if(res.ret == 10001 || res.ret == 10004){
                            window.api.dialog.open(window.api.tips['9']());
                            window.qb.addSuccess = true;
                        }
                        else if (res.ret == 10601 || res.ret == 10603){
                            window.qb.addSuccess = true;
                        }
                        else {
                            zHttp.showResponse(res, res.actid, $.noop);
                            window.qb.addSuccess = false;
                        }
                        cb();
                    });
                });
                window.api.clickReport('BROWSER.ACTIVITY.NZCM.ANSWERCLICK2');
            }
        });
        window.page = new Page();
    })(window,jQuery);
};