if(typeof console === "undefined"){
    console = { log: function() { } };
}
//活动地址 不带任何参数
var _pageUrl = location.protocol + '//' + location.host + location.pathname;
//获取AMS系统中设置的提示语
function getAmsMsg(res) {
    var msgCfg = zHttp.getMsgByState( res.data, res.actid, res.ret, $.noop );
    return zMsg.repair( msgCfg.m );
}

//格式化CDK
function formatCdk(cdk) {
    var cdkey = cdk;
    var newArr = [];
    for(var i = 0; i<4; i++) {
        newArr[i] = cdkey.substr(i*4,4);
    }
    return newArr.join('-');
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
        popBox.innerHTML = '<div class="popTop"></div><div class="popWrap"><a href="javascript:void(0);" class="popClose" onclick="dialog.hide()" title="关闭"></a><div class="popContainer">'+ content +'</div></div><div class="popBottom"></div>';
        popBox.style.marginTop = popBox.offsetHeight/-2 +'px';
    },
    alert : function(msg, flag){
        this.init(flag, msg);
    },
    show : function(msg, className , flag){
        this.init(flag, msg, className);
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
;(function (window, $) {
    //提示语
    var html;
    var tips = {
        10 : function(tip){
            html = '<div class="txtCenter">\
                    <p>'+tip+'</p>\
                </div>\
                <div class="P_btns">\
                    <a href="javascript:;" class="btn btn_pop" onclick="dialog.hide();">确定</a>\
                </div>';
            return html;
        },
        9 : function(){
            html = '<div class="txtCenter">\
                    <p>活动已经结束！</p>\
                    <p>敬请期待更多QQ浏览器特权活动！</p>\
                </div>\
                <div class="P_btns">\
                    <a href="javascript:;" class="btn btn_pop" onclick="dialog.hide();">确定</a>\
                </div>';
            return html;
        },
        8 : function(){
            html = '<div class="txtCenter">\
                    <p>亲，这是QQ浏览器的专属活动</p>\
                    <p style="font-size: 16px;">请用QQ浏览器参加哦，如果还未安装，请点击下载安装</p>\
                </div>\
                <div class="P_btns">\
                    <a href="http://dldir1.qq.com/invc/tt/QB/QQBrowser_Setup_DY_dhxy.exe" class="btn btn_downloadQB2" onclick="api.report(\'BROWSER.ACTIVITY.DHXY.DOWNLOADQBCLICK\')">下载QQ浏览器</a>\
                </div>';
            return html;
        },
        0 : function(){
            html = '<div class="zc">\
                        <div class="zcTit line">\
                            <h3 class="tit tit-1"></h3>\
                            <p>活动期间，注册大话2账号并激活礼包的玩家可以参与抽奖，活动结束后在大话2游戏内公布结果。奖品包含：<strong>iPhone7、QQ限量版公仔、10Q币</strong></p>\
                        </div>\
                        <div class="jdBox line">\
                            <h4 class="sub-tit sub-tit-1"></h4>\
                            <div class="excBox">\
                                <a id="btn-jd" class="btn btn_exchange3" href="javascript:;" onclick="page.exchange(0);">我要领取</a>\
                                <input id="cdkey-jd" class="inp" disabled="disabled" value="">\
                            </div>\
                            <p class="giftTips">礼包价值<strong class="icon-188">188</strong>元，可在《大话西游2经典版》激活一次！</p>\
                            <p class="giftTips2">登录游戏，凭借序列号，在东海渔村的NPC推广大使处激活，即可领取情义新手礼包。</p>\
                        </div>\
                        <div class="mfBox">\
                            <h4 class="sub-tit sub-tit-2"></h4>\
                            <div class="excBox">\
                                <a id="btn-mf" class="btn btn_exchange4" href="javascript:;" onclick="page.exchange(1);">我要领取</a>\
                                <input id="cdkey-mf" class="inp" disabled="disabled" value="">\
                            </div>\
                            <p class="giftTips">礼包价值<strong class="icon-188">188</strong>元，可在《大话西游2免费版》激活一次！</p>\
                            <p class="giftTips2">登录游戏后在左上角礼包中心 —> 选择点击序列号激活 —> 点击游戏界面左上角礼包中心 —> 选择“2016周年庆礼包” —> 输入礼包码即可激活。</p>\
                        </div>\
                    </div>\
                    <div class="login">\
                        <h4 class="step_1"></h4>\
                        <div class="regBox"><iframe src="http://xy2.163.com/qqllq" width="100%" height="100%" frameborder="0"></iframe></div>\
                        <h4 class="step_2"></h4>\
                        <a class="btn btn_downloadGame" href="http://xy2.163.com/download/" target="_blank" onclick="api.report(\'BROWSER.ACTIVITY.DHXY.DOWNLOADQBCLICK\');">下载客户端</a>\
                    </div>\
                    <div class="clear"></div>\
                    <div class="icon-gifts"></div>';
            return html;
        },
        1 : function(){
            html = '<div class="zc">\
                        <div class="zcTit line">\
                            <h3 class="tit tit-2"></h3>\
                        </div>\
                        <div class="jdBox mt25">\
                            <div class="excBox">\
                                <a id="btn-jd" class="btn btn_exchange4" href="javascript:;" onclick="page.exchange(0);">我要领取</a>\
                                <input id="cdkey-jd" class="inp" disabled="disabled" value="">\
                            </div>\
                            <p class="giftTips">礼包价值<strong class="icon-188">188</strong>元，可在《大话西游2经典版》激活一次！</p>\
                            <div class="giftTips2">\
                                <p>使用说明：</p>\
                                <p>登录游戏，凭借序列号，在东海渔村的NPC推广大使处激活，即可领取情义新手礼包。</p>\
                                <p>可在2015年1月15日后开的新服内使用，每个游戏账号在同一服务器只可领取一次，与新服预约礼包（包括付费预约和序列号预约）互斥。</p>\
                                <p style="margin-top: 5px;">礼包奖励：</p>\
                                <p>师门贡献＊500000，九花玉露丸＊50，无常丹＊50，高级飞行旗＊1。</p>\
                            </div>\
                        </div>\
                    </div>\
                    <div class="login">\
                        <h4 class="step_1"></h4>\
                        <div class="regBox"><iframe src="http://xy2.163.com/qqllq" width="100%" height="100%" frameborder="0"></iframe></div>\
                        <h4 class="step_2"></h4>\
                        <a class="btn btn_downloadGame" href="http://xy2.163.com/download/" target="_blank" onclick="api.report(\'BROWSER.ACTIVITY.DHXY.DOWNLOADQBCLICK\');">下载客户端</a>\
                    </div>\
                    <div class="clear"></div>';
            return html;
        },
        2 : function(){
            html = '<div class="zc">\
                        <div class="zcTit line">\
                            <h3 class="tit tit-3"></h3>\
                        </div>\
                        <div class="jdBox mt25">\
                            <div class="excBox">\
                                <a id="btn-mf" class="btn btn_exchange4" href="javascript:;" onclick="page.exchange(1);">我要领取</a>\
                                <input id="cdkey-mf" class="inp" disabled="disabled" value="">\
                            </div>\
                            <p class="giftTips">礼包价值<strong class="icon-188">188</strong>元，可在《大话西游2免费版》激活一次！</p>\
                            <div class="giftTips2">\
                                <p>使用说明：</p>\
                                <p>2016年8月12日后新建的全新角色可以在大话2免费版任意服务器直接使用2016周年庆礼包。</p>\
                                <p>登录游戏后在左上角礼包中心 —> 选择点击序列号激活 —> 点击游戏界面左上角礼包中心 —> 选择“2016周年庆礼包” —> 输入礼包码即可激活。</p>\
                                <p style="margin-top: 5px;">礼包奖励：</p>\
                                <table class="tableGifts" width="100%;">\
                                    <tr><td>等级</td><td>名字</td><td>数量</td><td>名字</td><td>数量</td><td>名字</td><td>数量</td><td>名字</td><td>数量</td></tr>\
                                    <tr><td>10</td><td>白薇雪莲丸</td><td>1</td><td>灵山雪参丸</td><td>1</td><td>蓬莱仙泉水</td><td>1</td><td>师门贡献</td><td>500000</td></tr>\
                                    <tr><td>30</td><td>白薇雪莲丸</td><td>1</td><td>千年灵花</td><td>30</td><td>血烟石</td><td>30</td><td>装饰品-与歌同行</td><td>1</td></tr>\
                                    <tr><td>50</td><td>师门贡献</td><td>2000000</td><td>孔明灯</td><td>1</td><td>120九彩云龙珠</td><td>90</td><td>特效-佛光普济</td><td>1</td></tr>\
                                    <tr><td>70</td><td>蓝宝石</td><td>10</td><td>灵山雪参丸</td><td>1</td><td>任我行·单人</td><td>10</td><td>时装体验券-背部</td><td>1</td></tr>\
                                    <tr><td>90</td><td>绿宝石</td><td>2</td><td>灵山雪参丸</td><td>1</td><td>蓬莱仙泉水</td><td>1</td><td>时装体验券-服饰</td><td>1</td></tr>\
                                    <tr><td>1转82</td><td>师门贡献</td><td>2000000</td><td>绿宝石</td><td>2</td><td>蓬莱仙泉水</td><td>1</td><td>佩兰玄参丸</td><td>1</td></tr>\
                                </table>\
                            </div>\
                        </div>\
                    </div>\
                    <div class="login">\
                        <h4 class="step_1"></h4>\
                        <div class="regBox"><iframe src="http://dh2.163.com/qqllq" width="100%" height="100%" frameborder="0"></iframe></div>\
                        <h4 class="step_2"></h4>\
                        <a class="btn btn_downloadGame" href="http://dh2.163.com/download/" target="_blank" onclick="api.report(\'BROWSER.ACTIVITY.DHXY.DOWNLOADQBCLICK\');">下载客户端</a>\
                    </div>\
                    <div class="clear"></div>';
            return html;
        }
    };
    window.tips = tips;
})(window, jQuery)


/*分页*/
;(function (window,$) {
    var me = {
        init:function(args){
            return (function(){
                args.pageCount = parseInt((args.dataContainer.length - 1) / args.perPage) + 1;
                me.fillHtml(args);
                me.bindEvent(args);
            })();
        },
        //填充html
        fillHtml:function(args){
            return (function(){
                args.liftsContainer.empty();
                args.pageContainer.empty();
                //第一页
                if(args.firstAndLast) {
                    if(args.current > 1){
                        args.pageContainer.append('<a href="javascript:;" class="firstPage">第一页</a>');
                    } else {
                        args.pageContainer.append('<span class="disabled">第一页</span>');
                    }
                }
                //上一页
                if(args.current > 1){
                    args.pageContainer.append('<a href="javascript:;" class="prevPage">上一页</a>');
                }else{
                    args.pageContainer.remove('.prevPage');
                    args.pageContainer.append('<span class="disabled">上一页</span>');
                }
                //中间页码
                args.pageContainer.append('<span>第'+ args.current +'/'+ args.pageCount +'页</span>');
                //下一页
                if(args.current < args.pageCount){
                    args.pageContainer.append('<a href="javascript:;" class="nextPage">下一页</a>');
                }else{
                    args.pageContainer.remove('.nextPage');
                    args.pageContainer.append('<span class="disabled">下一页</span>');
                }
                //最后一页
                if(args.firstAndLast) {
                    if(args.current < args.pageCount){
                        args.pageContainer.append('<a href="javascript:;" class="lastPage">最后一页</a>');
                    } else {
                        args.pageContainer.append('<span class="disabled">最后一页</span>');
                    }
                }
                //列表
                var _star = (args.current - 1) * args.perPage,
                    _end = args.current * args.perPage;
                args.liftsContainer.append(args.dataContainer.slice(_star, _end).join(''));
                if(typeof(args.backFn)=="function"){
                    args.backFn({current: args.current});
                }
            })();
        },
        //绑定事件
        bindEvent:function(args){
            return (function(){
                //上一页
                args.pageContainer.on("click","a.prevPage",function(){
                    if(args.current > 1) {
                        args.current--;
                    }
                    me.fillHtml(args);
                });
                //下一页
                args.pageContainer.on("click","a.nextPage",function(){
                    if(args.current < args.pageCount) {
                        args.current++
                    }
                    me.fillHtml(args);
                });
                //第一页、最后一页
                if(args.firstAndLast) {
                    args.pageContainer.on("click","a.firstPage",function(){
                        args.current = 1;
                        me.fillHtml(args);
                    });
                    args.pageContainer.on("click","a.lastPage",function(){
                        args.current = args.pageCount;
                        me.fillHtml(args);
                    });
                }
            })();
        }
    };
    createPage = function (options) {
        var args = $.extend(
            {
                dataContainer: [],
                liftsContainer: $('#liftsContainer'),//列表容器
                pageContainer: $('#pageContainer'),//分页容器
                perPage : 10,//每页显示数
                pageCount : 0,//总页数
                current : 1,//当前页码
                startPage : 1,//初始页
                firstAndLast: false,//是否显示第一页、最后一页
                backFn : function(){}
            },
            options
        );
        me.init(args);
    }
})(window, jQuery);

(function(window,$) {
    Page = qv.zero.extend(qv.zero.AbstractPage,{
        userJsonID : 135254,
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
            if(!!qq.login.getUin()){
                //
            }
            qq.login.bind('login',function(){
                //
            });
            qq.login.bind('logout',function(){
                //
            });
        },
        exchange: function(index){
            var _flag;
            if(_flag) {
                return
            }
            _flag = true;
            var idArr = [135260,135261],//经典、免费
                actid = idArr[index];
            var demo_jd = $('#cdkey-jd'),
                demo_mf = $('#cdkey-mf'),
                btn_jd = $('#btn-jd'),
                btn_mf = $('#btn-mf');
            if(index == 0 && btn_jd.hasClass('disabled') || index == 1 && btn_mf.hasClass('disabled')) {
                return;
            }
            zUtil.ensureLogin(function () {
                zHttp.send({'actid': actid}, function (res) {
                    _flag = false;
                    if (res.ret == 0) {
                        var cdk = formatCdk(res.data.op.cdkey);
                        if(index == 0) {
                            demo_jd.val(cdk);
                            btn_jd.addClass('disabled');
                            setTimeout(function () {
                                btn_jd.removeClass('disabled');
                            },3000);
                        } else {
                            demo_mf.val(cdk);
                            btn_mf.addClass('disabled');
                            setTimeout(function () {
                                btn_mf.removeClass('disabled');
                            },3000);
                        }
                    } else if (res.ret == 10601) {
                        dialog.show(tips['10']("您已达到今天的领取上限，如果还需要，请明天再来<br>珍惜资源请不要浪费哦 (●'◡'●)"),'',true);
                    }  else if (res.ret == 10603) {
                        dialog.show(tips['10']("您领取的礼包已经很多了<br>珍惜资源请不要浪费哦 (●'◡'●)"),'',true);
                    } else if (res.ret == 10002) {
                        qq.login.open();
                    } else if (res.ret == 10001 || res.ret == 10004) {
                        dialog.show(tips['9']());
                    } else {
                        dialog.show(tips['10'](getAmsMsg(res)),'',true);
                    }
                });
                api.report("BROWSER.ACTIVITY.DHXY.EXCHANGEGIFTSCLICK" + index);
            });
        },
        //查询中奖记录
        queryRecord: function (temp) {
            zUtil.ensureLogin(function () {
                zHttp.send({actid: 135326}, function (res) {
                    res.ret = 0;
                    if (res.ret == 0) {
                        var records = [];
                        if(temp > 0 && temp <= 15) {
                            var _records = [
                                {val:{actid: 133741, time: 1474855000, name: "经典版", level: -1, info: "AAAAASFFGDFHHGFD"}},
                                {val:{actid: 133742, time: 1474855000, name: "免费版", level: -1, info: "AAAAASFFGDFHHGFD"}},
                                {val:{actid: 133741, time: 1474855000, name: "经典版", level: -1, info: "AAAAASFFGDFHHGFD"}},
                                {val:{actid: 133742, time: 1474855000, name: "免费版", level: -1, info: "AAAAASFFGDFHHGFD"}},
                                {val:{actid: 133741, time: 1474855000, name: "经典版", level: -1, info: "AAAAASFFGDFHHGFD"}},
                                {val:{actid: 133742, time: 1474855000, name: "免费版", level: -1, info: "AAAAASFFGDFHHGFD"}},
                                {val:{actid: 133741, time: 1474855000, name: "经典版", level: -1, info: "AAAAASFFGDFHHGFD"}},
                                {val:{actid: 133742, time: 1474855000, name: "免费版", level: -1, info: "AAAAASFFGDFHHGFD"}},
                                {val:{actid: 133741, time: 1474855000, name: "经典版", level: -1, info: "AAAAASFFGDFHHGFD"}},
                                {val:{actid: 133742, time: 1474855000, name: "免费版", level: -1, info: "AAAAASFFGDFHHGFD"}},
                                {val:{actid: 133741, time: 1474855000, name: "经典版", level: -1, info: "AAAAASFFGDFHHGFD"}},
                                {val:{actid: 133742, time: 1474855000, name: "免费版", level: -1, info: "AAAAASFFGDFHHGFD"}},
                                {val:{actid: 133741, time: 1474855000, name: "经典版", level: -1, info: "AAAAASFFGDFHHGFD"}},
                                {val:{actid: 133742, time: 1474855000, name: "免费版", level: -1, info: "AAAAASFFGDFHHGFD"}},
                                {val:{actid: 133741, time: 1474855000, name: "经典版", level: -1, info: "AAAAASFFGDFHHGFD"}},
                                {val:{actid: 133742, time: 1474855000, name: "免费版", level: -1, info: "AAAAASFFGDFHHGFD"}}
                            ];
                            for(var i = 0; i < temp; i++) {
                                records[i] = _records[i];
                            }
                        } else {
                            records = res.data.op;
                        }

                        var _htmlArr = [],
                            _html = '';
                        PageCount = 0;
                        pageAll = 1;
                        pageNumber = 1;
                        for (var i = records.length-1; i >= 0; i--) {
                            var obj = records[i].val,
                                actid = obj.actid,
                                time = qv.date.format("Y-m-d", obj.time * 1000),
                                name = obj.name,
                                level = obj.level,
                                cdkey = obj.info.indexOf('|') == -1 ? obj.info : '-';
                            _htmlArr.push('<tr><td>'+ time +'</td><td>'+ name +'</td><td>'+ formatCdk(cdkey) +'</td></tr>');
                            PageCount++;
                        }
                        if (PageCount == 0) {
                            _htmlArr.push('<tr><td colspan="4" class="noGifts">您尚未获得任何礼包</td></tr>');
                        }
                        _html = '\
                                <table width="100%" class="giftsLists">\
                                    <thead><tr><th>获得时间</th><th>礼包内容</th><th>CDKEY</th></tr></thead>\
                                    <tbody id="giftsContainer"></tbody>\
                                </table>\
                                <div id="pageContainer"></div>';
                        var giftsDialog = new qv.zero.Dialog({
                            width: 600,
                            title: "查询获奖记录",
                            content: _html,
                            type: "show",
                            buttons: [{
                                text: "确定",
                                click: function() {
                                    giftsDialog.hide();
                                }
                            }]
                        });
                        giftsDialog.show();
                        var _createPage = new createPage({
                            dataContainer: _htmlArr,//列表数据 Array类型
                            liftsContainer: $('#giftsContainer'),//列表容器
                            pageContainer: $('#pageContainer'),//分页容器
                            backFn:function(p){
                                //解决dialog弹框自动居中，若未使用zMsg弹框，可删除
                                $(window).resize();
                            }
                        })
                    } else if (res.ret == 10002) {
                        qq.login.open();
                    } else if (res.ret == 10001 || res.ret == 10004) {
                        zMsg.alert("活动已经结束，敬请期待更多QQ浏览器特权活动！");
                    } else {
                        zHttp.showResponse(res, res.actid, $.noop);
                    }
                });
                api.report("BROWSER.ACTIVITY.DHXY.QUERYRECORDCLICK");
            });
        }
    });
    window.page = new Page();

})(window,jQuery);

function exchange(k) {
    if(!api.isQQBrowser()){
        dialog.show(tips['8']());
        return;
    }
    zUtil.ensureLogin(function () {
        switch (k) {
            case 0 : dialog.show(tips['0'](),'popMsg2'); break;
            case 1 : dialog.show(tips['1'](),'popMsg3'); break;
            case 2 : dialog.show(tips['2'](),'popMsg3'); break;
            default : dialog.show(tips['10']('参数错误，请刷新页面重试！'));
        }
    })
}

(function(window,$){
    //头尾初始化
    api.initNav("header","footer",{ //对应header footer div的id
        background:"#170303",  //footer的背景色，常常需要根据页面设计改变颜色 默认：黑色（可选）
        color:"#791b1b",  //footer中文字的颜色 默认：白色（可选）
        qblink:"http://dldir1.qq.com/invc/tt/QQBrowser_Setup_Nizhan.exe", //下载QB按钮的链接 默认：特权中心QB包（可选）
        report:"BROWSER.ACTIVITY.DHXY.QBDOWNLOADCLICK_TOP", //点击流数据上报（可选）
        isTqHide:false //特权LOGO是否显示（可选）
    });

    $('.middle_3 .btn').click(function () {
        var i = $(this).index();
        api.report('BROWSER.ACTIVITY.DHXY.LINKSCLICK_' + i);
    });
    $('.btn_jd,.btn_mf,.middle_2 .btn').click(function () {
        var i = $(this).index();
        api.report('BROWSER.ACTIVITY.DHXY.EXCHANGEBTNTOPCLICK_' + i);
    });
    $('.middle_2 .btn').click(function () {
        var i = $(this).index();
        api.report('BROWSER.ACTIVITY.DHXY.EXCHANGEBTNCLICK_' + i);
    });
})(window,jQuery);
