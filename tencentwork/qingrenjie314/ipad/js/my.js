/**
 * Created by peng on 15/2/4.
 */
window.onload = function(){
   if (!window.api.isQQBrowser()) {
        window.api.notQBpop({type: window.api.isCanRun});
        return false;
    }
    window.api.checkLogin(function(sign,sid){
        if(sign) {
            window.qb.sid = sid;
            loadMyQuestion(function () {
                updateView();
                updateBind();
            });
        }else{
            zMsg.show("请重新登录！");
        }
    });
};

var loadMyQuestion = function(cb){
    api.getQuestionList(function(res){
        if(res.ret === 0){
            window.qb.questionIdList = res.questionIdList;
            cb();
        }else if(res.ret === -2){
            zMsg.show("请重新登录！");
        }
    });
};


var share = function(type){
    if(type == "weixin"){
        window.api.weixinPop();
    }
    else{
        window.api.share(type);
    }
};




var createListById = function(current) {
    if (current > window.qb.questionIdList.length - 1) {
        return;
    }

    var questionIdArr = window.qb.questionIdList;
    var questionId = questionIdArr[current];
    var questionArr = [];

    window.api.getQuestionById(questionId, function (res) {
        var questionList = '',
            answerList = '',
            questionPage = '';
        var j;
        if (res.ret == 3) { //出题人
            qb.resultList[res.questionId] = res;

            qb.resultList[res.questionId].current_page = 0; //分页用 当前的page

            //important 尽早去请求下一轮数据
            var _current = current + 1;
            createListById(_current);

            if (res.dataList.length > 0) {
                var max = 5;
                if(res.dataList.length <= 5){
                    max = res.dataList.length;
                    questionPage = '<p class="page"><a class="page-up" href="javascript:;" style="display: none;">上一页</a><a class="page-down" href="javascript:;" style="display: none;">下一页</a></p>';
                }
                else{
                    questionPage = '<p class="page"><a class="page-up" href="javascript:;" style="display: none;">上一页</a><a class="page-down" href="javascript:;">下一页</a></p>';
                }

                for (j =0; j < max; j++) {
                    answerList += '<li><div class="answerNick"><span class="nick-pic"><img src="' + window.api.getAvatarUrl(res.dataList[j].answersUin) + '" width="54" height="54" ></span>' + res.dataList[j].answersNickName + '</div><a class="answerScore" href="javascript:;" >知心度<em>' + qb.percent[res.dataList[j].score] + '</em>%</a></li>';
                }
                questionList += '<div class="myList">' +
                    '<div class="myListTit"><span>' + (current+1) + '</span></div>' +
                    '<ul class="answerWipper">' + answerList +
                    '</ul>' + questionPage +
                    '</div>';
            }
            else{ //nothing
                questionList += '<div class="myList">' +
                    '<div class="myListTit"><span>' + (current+1) + '</span></div>' +
                    '<div class="noResponse"><p>暂时还没有回答<br><a href="javascript:;">快找TA来答题吧</a></p></div>'+
                    '</div>';
            }
            questionArr.push(questionList);
            $('.listWipper').append(questionArr.join(''));
            //console.log(questionIdArr.length);
            if (questionIdArr.length <= 2){
                $('.listWipper').addClass('listWipper_middle');
            }
        }
        else if (res.ret == -2) {
            zMsg.show("请重新登录！");
        }
    });
};

var updateView = function(){
    var _html, btnClass, _topHtml;
    var questionIdArr = window.qb.questionIdList;
    if(questionIdArr.length > 0){
        btnClass = 'btn-set-question2';
        _topHtml = '';
    }else{
        btnClass = 'btn-set-question3';
        _topHtml = '<p style="font-size: 20px; color: #9e041e; text-align: center; padding-bottom: 25px;">亲，你还没有出过题哦，赶快出题考考TA吧~还有惊喜大奖等你来拿！</p>';
    }

    _html = _topHtml + '<div class="btn-cont"><a href="new.html" class="btn '+ btnClass +'">再出一套题</a></div>';
    _html += '<div class="myQuestionList">' +
                '<div class="listWipper">' +
                '</div>' +
             '</div>';
    $('.contentx').html(_html);

    if(questionIdArr.length > 0){
        createListById(0);
    }
};

var updateBind = function(){
    $('.listWipper').delegate(".myList .noResponse p a",'click',function(){
        //点击快找TA来答题吧

        var _this = $(this);
        var p_seq = _this.parent().parent().parent().index();
        var questionId = qb.questionIdList[p_seq];
        var _href = window.api.getWebsiteUrl() + "/ipad/answer.html?id=" + questionId;
        var _popHtml = '<p style="font-size: 24px;color:#9e041e;padding: 10px 0;text-align: center;">复制下方链接，赶快发送给TA吧~</p>' +
            '<p id="copyUrl">'+ _href +'</p>';
        window.api.dialog({body:_popHtml});
        return false;
    });

    $('.listWipper').delegate(".myList .answerWipper li",'click',function(){
        if(!window.api.isQQBrowser()){
            if(window.api.isCanRun == 0){
                window.api.isCanRun =3;
            }
            /*window.api.notQBpop({type:window.api.isCanRun});
            return false;*/
        }
        var _this = $(this);
        var p_seq = _this.parent().parent().index();
        var questionId = qb.questionIdList[p_seq];
        var dataList =  qb.resultList[questionId];
        var seq = _this.index();

        var questions   = dataList.questions;
        var answers     = dataList.realAnswers;

        var seq_tem    = (dataList.current_page) * 5 + seq;
        var responser   = dataList.dataList[seq_tem];
        var response    = responser.answers;

        var nickname = responser.answersNickName;
        var nickPic = responser.answersUin;

        var _header = '<span class="nick-pic"><img src="' + window.api.getAvatarUrl(nickPic) + '" width="54" height="54" ></span> ' + nickname + ' 和你的<span class="titRes">知心度 <em>'+ qb.percent[responser.score] +'</em>%</span>';

        var _html, _options, _class, k,_resClass,_error;
        var _htmlArr = [];
        for(var i=0; i<questions.length; i++) {
            _options = '';
            k = questions[i];

            if(answers[i] === response[i]){
                _error = false;
            }else{
                _error = true;
            }
            for(var j in window.qb.data[k].option){
                if(answers[i] == j){
                    _resClass = 'class="active"';
                }else{
                    _resClass = '';
                }
                if(_error){
                    if(response[i] == j){
                        _resClass = 'class="error"';
                    }
                    if(answers[i] == j){
                        _resClass = 'class="correct"';
                    }
                }
                _options += '<li '+ _resClass +'><em>' + window.qb.data[k].letter[j] + '</em><span>' + window.qb.data[k].option[j] + '</span></li>';
            }
            _html = '<div class="question-block" id="question-' + i + '">' +
            '<h3 class="question-name">' + window.qb.data[k].question + '</h3>' +
            '<div class="question-options">' +
            '<ul class="question-options-list">' + _options + '</ul>'+
            '</div>' +
            '</div>';
            _htmlArr.push(_html);
        }
        var popH = '';
        if(document.body.offsetWidth > 768){
            popH = '766px';
        }else{
            popH = '1120px';
        }
        var popStyle = "width:95%;height:"+ popH +";margin:0;position:absolute;left:2.25%;top:"+ parseInt($(window).scrollTop()) +"px;";
        api.dialog({header:_header,body:_htmlArr.join(''),style:popStyle,type:3});
    });

    $('.listWipper').delegate(".myList .page .page-down",'click',function(){
        var _this = $(this);
        var _parent = _this.parent().parent();
        var seq = _parent.index();
        var questionId = qb.questionIdList[seq];
        var dataList =  qb.resultList[questionId];
        var len = dataList.dataList.length;
        var start = (dataList.current_page + 1) * 5;
        if(len-1 < start){
            return;
        }

        var needHide = false;
        var end = start + 5;
        if(len-start <= 5){
            end = len;
            needHide = true;
        }

        var answerArr = [];
        for (var j = start; j < end; j++) {
            answerArr.push('<li><div class="answerNick"><span class="nick-pic"><img src="' + window.api.getAvatarUrl(dataList.dataList[j].answersUin) + '" width="54" height="54" ></span>' + dataList.dataList[j].answersNickName + '</div><a class="answerScore" href="javascript:;" >知心度<em>' + qb.percent[dataList.dataList[j].score] + '</em>%</a></li>');
        }

        _this.parent().parent().find('.answerWipper').html(answerArr.join(''));
        dataList.current_page += 1;

        if(needHide){
            _this.hide();
        }
        _this.parent().find('.page-up').show();
    });

    $('.listWipper').delegate(".myList .page .page-up",'click',function(){
        var _this = $(this);
        var _parent = _this.parent().parent();
        var seq = _parent.index();
        var questionId = qb.questionIdList[seq];
        var dataList =  qb.resultList[questionId];
        var len = dataList.dataList.length;
        if(dataList.current_page == 0){
            return;
        }
        var start = (dataList.current_page -1) * 5;
        var end = start + 5;

        var answerArr = [];
        for (var j = start; j < end; j++) {
            answerArr.push('<li><div class="answerNick"><span class="nick-pic"><img src="' + window.api.getAvatarUrl(dataList.dataList[j].answersUin) + '" width="54" height="54" ></span>' + dataList.dataList[j].answersNickName + '</div><a class="answerScore" href="javascript:;" >知心度<em>' + qb.percent[dataList.dataList[j].score] + '</em>%</a></li>');
        }

        _this.parent().parent().find('.answerWipper').html(answerArr.join(''));
        dataList.current_page -= 1;

        if(dataList.current_page == 0){
            _this.hide();
        }
        _this.parent().find('.page-down').show();
    });
};