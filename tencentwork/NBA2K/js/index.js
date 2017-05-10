//活动地址 不带任何参数
var _pageUrl = location.protocol + '//' + location.host + location.pathname;
var giftNumber = 0;
if(typeof(pgvMain) == 'function') {
    pgvMain("pathtrace", {pathStart: true, tagParamName: "ADTAG", useRefUrl: true, override: true, careSameDomainRef: false});
}

function hint(){
    var qb_dialog = new qv.zero.Dialog({
        title: "QQ浏览器用户专享",
        content: "<p>       亲，这是QQ浏览器用户的专属特权活动。</p><p>             用QQ浏览器打开即可参加。</p>",
        type: "alert",
        buttons: [{
            text: "下载QQ浏览器",
            click: function() {
                document.getElementById('downloadQBBtn').click();
                qb_dialog.hide();
            }
        }]
    });
    hint = function(){
        qb_dialog.show();
    };
    qb_dialog.show();
}


(function (window,$) {
    Page = qv.zero.extend(qv.zero.AbstractPage,{
        userJsonID : 109451,
        preloads : ['AreaSvrSelector'],
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
            page.svr = new qv.zero.AreaSvrSelector({
                game: 'nba2k'
            });
            if(!!qq.login.getUin()) {
                page.queryActivity(); //查询签到天数
            }
            qq.login.bind('login', function () {
                page.queryActivity(); //查询签到天数
            });
            qq.login.bind('logout', function () {
                jQuery('#gift_day_box .gift').removeClass('select disabled');
            });
        },
        //查询礼券数
        queryActivity: function () {
            var arrId = [109457,109458,109459,109460,109461,109462,109463],
                gifts = jQuery('#gift_day_box .gift');
            zHttp.send({'actid': 109464}, function (res) {
                if(res.ret == 0) {
                    var _join = res.data.op.join;
                    var k = 0,j = 0;
                    for(var i in _join) {
                        if(_join[i] == 1) {
                            jQuery(gifts[k]).addClass('disabled');
                            j++;
                        }
                        k++;
                    }
                    giftNumber = j;
                }
            });
        },
        //领取新手、特权、抽奖额外礼包
        exchange: function(e, act) {
            if(act[1] == 'true') {
                if(!api.isQQBrowser()){
                    hint();
                    return;
                }
            }
            var index = act[0];
                     //浏览器、 回归1、  回归2、 回归3
            var arr = [109453, 109454, 109455, 109456];
            var id = arr[index];
            zUtil.ensureLogin(function () {
                page.svr.show({
                    send: function (args, callb) {
                        zHttp.send({'actid': id, area: args.area, roleid: args.roleid}, function (res) {
                            if (res.ret == 0){
                                zHttp.showResponse(res, res.actid, $.noop);
                            } else if (res.ret == 10002){
                                qq.login.open();
                            } else if (res.ret == 10001 || res.ret == 10004){
                                zMsg.alert("活动已经结束，敬请期待更多QQ浏览器特权活动！");
                            } else {
                                zHttp.showResponse(res, res.actid, $.noop);
                            }
                        });
                    }
                });
                if (index == 0) {
                    api.report("BROWSER.ACTIVITY.NBA2K.TEQUANCLICK");
                } else if (index == 1) {
                    api.report("BROWSER.ACTIVITY.NBA2K.HUIGUICLICK_1");
                } else if (index == 2) {
                    api.report("BROWSER.ACTIVITY.NBA2K.HUIGUICLICK_2");
                } else if (index == 3) {
                    api.report("BROWSER.ACTIVITY.NBA2K.HUIGUICLICK_3");
                }
            });
        },
        //领取每日一次礼包
        exchange2: function () {
            var arrId = [109457,109458,109459,109460,109461,109462,109463];
            var gifts = jQuery('#gift_day_box .gift');
            var _id = -1;
            for(var i = 0; i < gifts.length; i++) {
                if(jQuery(gifts[i]).hasClass('select')) {
                    _id = jQuery(gifts[i]).index();
                }
            }
            if(giftNumber>6) {
                _id = -2;
            }
            zUtil.ensureLogin(function () {
                if(_id == -1) {
                    zMsg.alert("请选择您要领取的礼包！");
                    return;
                }
                if(_id == -2) {
                    zMsg.alert("您已经领取完了，感谢您的关注！");
                    return;
                }
                page.svr.show({
                    send: function (args, callb) {
                        zHttp.send({'actid': arrId[_id], area: args.area, roleid: args.roleid}, function (res) {
                            if(res.ret == 0) {
                                giftNumber++;
                                jQuery(gifts[_id]).addClass('disabled');
                                gifts.removeClass('select');
                                zHttp.showResponse(res, res.actid, $.noop);
                            } else if (res.ret == 10002){
                                qq.login.open();
                            } else if (res.ret == 10001 || res.ret == 10004){
                                zMsg.alert("活动已经结束，敬请期待更多QQ浏览器特权活动！");
                            } else {
                                zHttp.showResponse(res, res.actid, $.noop);
                            }
                        });
                    }
                });
                api.report("BROWSER.ACTIVITY.NBA2K.EVERYDAYGIFT_"+(_id+1));
            })
        },
        //查询中奖记录
        queryGift: function (temp) {
            zUtil.ensureLogin(function () {
                zHttp.send({actid: 109465}, function (res) {
                    var _records = [
                        {val:{actid: 109453, time: 1453532400, name: "QQ浏览器专属礼包", level: -1, info: "AAAAASFFGDFHHGFD"}},
                        {val:{actid: 109454, time: 1453532400, name: "回归专属礼包1", level: -1, info: "AAAAASFFGDFHHGFD"}},
                        {val:{actid: 109455, time: 1453532400, name: "回归专属礼包2", level: -1, info: "AAAAASFFGDFHHGFD"}},
                        {val:{actid: 109456, time: 1453532400, name: "回归专属礼包3", level: -1, info: "AAAAASFFGDFHHGFD"}},
                        {val:{actid: 109457, time: 1453532400, name: "现役巨星包×1", level: -1, info: "AAAAASFFGDFHHGFD"}},
                        {val:{actid: 109458, time: 1453532400, name: "特训卡×2", level: -1, info: "AAAAASFFGDFHHGFD"}},
                        {val:{actid: 109459, time: 1453532400, name: "记忆芯片×2", level: -1, info: "AAAAASFFGDFHHGFD"}},
                        {val:{actid: 109460, time: 1453532400, name: "紫色突破卡×2", level: -1, info: "AAAAASFFGDFHHGFD"}},
                        {val:{actid: 109461, time: 1453532400, name: "技能等级突破卡×1", level: -1, info: "AAAAASFFGDFHHGFD"}},
                        {val:{actid: 109462, time: 1453532400, name: "普通突破卡×10", level: -1, info: "AAAAASFFGDFHHGFD"}},
                        {val:{actid: 109463, time: 1453532400, name: "高级特训卡×1", level: -1, info: "AAAAASFFGDFHHGFD"}}
                    ];
                    if (res.ret == 0 || (temp > 0 && temp <= _records.length)) {
                        var records = [];
                        if(typeof temp == "number") {
                            for(var i = 0; i < temp; i++) {
                                records[i] = _records[i];
                            }
                        } else {
                            records = res.data.op;
                        }
                        var _htmlArr = [],
                            _html = '',
                            pageHtml = '';
                        PageCount = 0;
                        pageAll = 1;
                        pageNumber = 1;
                        for (var i = records.length-1; i >= 0; i--) {
                            var obj = records[i].val,
                                time = qv.date.format("Y-m-d H:m:s", obj.time * 1000),
                                name = obj.name,
                                cdkey = obj.info ? obj.info : '';

                            _htmlArr.push('<tr><td>'+ time +'</td><td>'+ name +'</td><td>'+ cdkey +'</td><td><a href="http://nba2k.qq.com/web201405/cdkey.shtml" target="_blank">兑换</a></td></tr>');
                            PageCount++;
                        }
                        if (PageCount == 0) {
                            _htmlArr.push('<tr><td colspan="4" class="noGifts">您尚未获得任何礼包</td></tr>');
                        }
                        if(PageCount >= 10) {
                            pageAll = parseInt((PageCount + 10 - 1) / 10);
                            pageHtml = '<div class="page"><a href="javascript:;" class="prev_page">上一页</a><span id="number_page">第'+ pageNumber +'/'+  pageAll+'页</span><a href="javascript:;" class="next_page">下一页</a></div>';
                        }
                        _html = '<table width="100%" class="giftsLists">\
                                    <thead><tr><th>时间</th><th>礼包内容</th><th>CDKEY</th><th>操作</th></tr></thead>\
                                    <tbody id="giftsCount">'+ _htmlArr.join("") +'</tbody>\
                                </table>' + pageHtml;
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
                        currentPage();
                    } else if (res.ret == 10002) {
                        qq.login.open();
                    } else if (res.ret == 10001 || res.ret == 10004) {
                        zMsg.alert("活动已经结束，敬请期待更多QQ浏览器特权活动！");
                    } else {
                        zHttp.showResponse(res, res.actid, $.noop);
                    }
                });
                api.report("BROWSER.ACTIVITY.DNF.QUERYGIFTSCLICK");
            });
        }
    });
    window.page = new Page();
})(window,jQuery);

//获奖记录分页
function currentPage() {
    jQuery('#number_page').html('第'+ pageNumber +'/'+  pageAll+'页');
    var pageDemo = jQuery('#giftsCount tr');
    pageDemo.hide();
    for(var i = (pageNumber-1)*10; i <= pageNumber*10 - 1; i++) {
        pageDemo.eq(i).show();
    }
    jQuery(window).resize();

}
function pageInit() {
    jQuery(document).on('click','.prev_page', function () {
        if(pageNumber <= 1) {
            pageNumber = 1;
            return;
        }
        pageNumber--;
        currentPage();
    });
    jQuery(document).on('click','.next_page', function () {
        if(pageNumber >= pageAll) {
            pageNumber = pageAll;
            return;
        }
        pageNumber++;
        currentPage();
    })
}



window.onload = function(){
    //头尾初始化
    api.initNav("header","footer",{ //对应header footer div的id
        background:"#000",  //footer的背景色，常常需要根据页面设计改变颜色 默认：黑色（可选）
        color:"#fff",  //footer中文字的颜色 默认：白色（可选）
        qblink:"http://dldir1.qq.com/invc/tt/QQBrowser_Setup_NBA2K.exe#?ADTAG=SNO=", //下载QB按钮的链接 默认：特权中心QB包（可选）
        report:"BROWSER.ACTIVITY.NBA2K.QBDOWNLOADCLICK", //点击流数据上报（可选）
        isTqHide:false //特权LOGO是否显示（可选）
    });

    pageInit();

    jQuery('.gift_day .gift').click(function () {
        var me = jQuery(this);
        if(me.hasClass('disabled')) return;
        jQuery(this).toggleClass('select').siblings().removeClass('select');
    })
};


