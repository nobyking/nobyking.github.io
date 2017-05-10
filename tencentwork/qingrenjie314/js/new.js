/**
 * Created by rzm on 15/3/5.
 */

window.onload = function(){
    window.api.initHeader();

    selectQuestion(function(){
        eventBind();
    });
    window.api.pvReport(); //pv上报
};

var share = function(type){
    var url = '';
    if(window.qb.questionId) {
        url = window.api.getWebsiteUrl() + '/answer.html?id=' + window.qb.questionId + "&ADTAG=" + type;
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
        jQuery('.creation-tips').css('visibility','hidden');
        jQuery('.btn-creation').removeClass('btn-creation-disabled');
    }else{
        jQuery('.creation-tips').css('visibility','visible');
        jQuery('.btn-creation').addClass('btn-creation-disabled');
    }
};

var eventBind = function(){
    jQuery('.rand-one').click(function(){
        var id = parseInt(jQuery(this).parent().parent().attr('id').split('-')[1]);
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
        jQuery(this).parent().prev().html(_html).next().children('ul').html(_options);
        window.api.clickReport('BROWSER.ACTIVITY.LOVER.RANDONE');
        //console.log(window.qb.questions);
        forget();
    });

    jQuery('.question-options-list').delegate("li","click",function(){
        var id = jQuery(this).parent().parent().parent().attr('id').split('-')[1];
        jQuery(this).addClass('active').siblings('li').removeClass('active');
        window.qb.answers[id] = jQuery(this).index();
        forget();
    });

    jQuery('.contentx').delegate(".btn-sendQQ","click",function(){
        if(!window.qb.hasAddLucky) {
            window.qb.hasAddLucky = true;
            zHttp.page = {pcfg:{aid: "vip.gongneng.client.qqliulanqi_39711", et: 1425139196, g: "", n: "QQ浏览器白色情人节",oid: 111111,rid: "",st: 1423015200}};
            zHttp.send({actid: 39721});
        }
        var link = window.api.getWebsiteUrl() + '/answer.html?id=' + window.qb.questionId + "&ADTAG=qqpage";
        var _summary = '亲爱哒，刚参加了个情人节“真爱大考验”活动，给你出了套题，测你懂不懂我！答完还能抽奖，有日本双飞游+iPad mini+Q币+羊年公仔blabla，麻溜儿的！在线等你答题~一起抽奖~';
        var _title = '真爱大考验';
        var _url="http://connect.qq.com/widget/shareqq/index.html?url="+encodeURIComponent(link)
            +"&desc="+encodeURIComponent(_summary)
            +"&pics="+encodeURIComponent('http://stdl.qq.com/stdl/temp/qingrenjie_share.gif')
            +"&summary="+encodeURIComponent(_summary)
            +"&title="+encodeURIComponent(_title)
            +"&flash=&site=QB&style=100&width=98&height=22";
        window.open(_url);
        jQuery('.btn-lucky-href').addClass('btn-lucky-after');
        window.qb.hasSendQQ = true;
    });

    jQuery('.contentx').delegate(".btn-lucky-href","click",function(){
        if(!window.qb.hasSendQQ) {
            var _popHtml = '<p style="font-size: 24px;color:#9e041e;padding: 30px 0 40px;text-align: center;">要把题目发给TA以后才能获得抽奖机会哦~</p>';
            window.api.dialog({body: _popHtml});
        }
        else{
            location.href = "index.html#lucky";
        }
        window.api.clickReport('BROWSER.ACTIVITY.LOVER.NEWTOLUCKY');
    });

    //生成考题按钮
    var isClick = false;
    jQuery('.btn-creation').click(function(){
            var _forget = [];
            var _html;
            for (var i in window.qb.answers) {
                if (window.qb.answers[i] == -1) {
                    _forget.push(parseInt(parseInt(i) + 1));
                }
            }
            if (_forget.length > 0) {
                return false;
            } else {
                zUtil.ensureLogin(function () {
                    if(!isClick) {
                        isClick = true;
                        setTimeout(function () {
                            isClick = false;
                            window.api.setQuestion({
                                questions: window.qb.questions,
                                answers: window.qb.answers,
                                nickName: qv.zero.Util.getQQNick()
                            }, function (res) {
                                if (typeof  res === 'object' && res.ret == 0) {
                                    window.qb.questionId = res.questionId;
                                    var _url = window.api.getWebsiteUrl() + "/answer.html?id=" + res.questionId;
                                    var _href = '<p class="copyHref"><a href="' + _url + '" id="copyHref">复制题目链接</a></p>';
                                    _html = '<div class="tipsTxt">题目出好啦，赶快考验你的TA吧！</div>' +
                                    '<div class="btn-cont"><a href="javascript:;" class="btn btn-sendQQ">通过QQ发给TA</a>' + _href + ' </div><div class="btn-cont"><a href="javascript:;" class="btn btn-lucky-href">我要抽奖</a></div>';
                                    jQuery('.contentx').html(_html);
                                }
                            });
                        }, 400);
                    }
                });
            }
        window.api.clickReport('BROWSER.ACTIVITY.LOVER.CREATEQUESTION');
    });
    jQuery('.contentx').delegate("#copyHref","click",function(){
        var _href = window.api.getWebsiteUrl() + "/answer.html?id=" + window.qb.questionId;
        var _popHtml = '<p style="font-size: 24px;color:#9e041e;padding: 10px 0 25px;text-align: center;">复制下方链接，赶快发送给TA吧~</p>' +
                        '<input readonly="readonly" value="'+ _href +'" id="copyUrl" onfocus="this.select();" />';
        window.api.dialog({body:_popHtml});
        jQuery('#copyUrl').select();
        window.api.clickReport('BROWSER.ACTIVITY.LOVER.COPYLINK');
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
        if((k + 1) % 3 == 0){
            _class = 'question-block noRmg';
        }else{
            _class = 'question-block';
        }
        _html = '<div class="'+ _class +'" id="question-' + k + '">' +
            '<h3 class="question-name">Q'+ parseInt(k + 1) + ' : ' + window.qb.data[i].question + '</h3>' +
            '<div class="question-options">' +
            '<ul class="question-options-list">' + _options + '</ul>'+ _href +'' +
            '</div>' +
            '</div>';
        htmlArr.push(_html);
    }
    htmlArr.push('<p class="creation-tips">亲~每题都需要选出自己的答案哦~</p><div class="btn-cont"><a href="javascript:;" class="btn btn-creation btn-creation-disabled">生成考题</a></div>');
    jQuery('.contentx').html(htmlArr.join(""));

    cb();
};
