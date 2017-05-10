var qb_t1;
var qb_t2;
var inGame = false;

function report(hottagValue) {
    window.setTimeout(function() {
        pgvSendClick({
            hottag: hottagValue
        });
    }, 100);
};



if (typeof(pgvMain) == 'function') {
    pgvMain("pathtrace", {
        pathStart: true,
        tagParamName: "ADTAG",
        useRefUrl: true,
        override: true,
        careSameDomainRef: false
    });
};

function getQBVersion() {
    var version = 0;
    try {
        try {
            version = window.external.getVersion() || 1;
        } catch (e) {
            version = window.external.getbrowserversion() || 1;
        }
    } catch (e) {
        version = /QQBrowser/.test(navigator.userAgent) || "100.0.0.0";
    }
    return version;
}

function isQQBrowser() {
    var version = getQBVersion();
    var result = (version != "100.0.0.0") && (version != 0);
    isQQBrowser = function() {
        return result;
    };
    return result;
}

function hint() {
    var qb_dialog = new qv.zero.Dialog({
        title: "QQ浏览器用户专享",
        content: "       亲，这是QQ浏览器用户的专属特权活动。<p>              现在秒装1个（仅需4M），<\/p><p>             用QQ浏览器打开即可参加。<\/p>",
        type: "alert",
        buttons: [{
            text: "下载QQ浏览器",
            click: function() {
                document.getElementById('downloadJFZRQB').click();
                qb_dialog.hide();
            }
        }]
    });
    hint = function() {
        qb_dialog.show();
    };
    qb_dialog.show();
};


//AMS
(function(window, $) {
    Page = qv.zero.extend(qv.zero.AbstractPage, {
        userJsonID: 46155,
        preloads: ['AreaSvrSelector'],
        loadExtHandler: true,
        //vipmonth : 1,
        init: function() {
            Page.superclass.init.apply(this, arguments);
        },
        initEvent: function() {
            Page.superclass.initEvent.apply(this, arguments);
            $('body').on('click', 'a[href="#"]', function(e) {
                e.preventDefault();
            });
            page.svr = new qv.zero.AreaSvrSelector({
                game: 'jfzr'
            });
            if( qq.login.getUin()){
                page.initLotteryNum();
            };
            qq.login.bind('login', function() {
                page.initLotteryNum();
            });
            qq.login.bind('logout', function() {
                $('.cj_btn span').html('0次');
            });
        },
        getGift: function(event) {
            var ele = $(event.target);
            var setid;
            var setid_add;
            if (!ele.hasClass('gift_new')) {
                setid = 46163; //特权礼包
                setid_add = 46660;
                if (!isQQBrowser()) {
                    hint();
                    return;
                };
                report("BROWSER.ACTIVITY.JFZR.TEQUENCLICK");
            } else {
                setid = 46164; //新手礼包
                setid_add = 46160;
                report("BROWSER.ACTIVITY.JFZR.XINSHOWCLICK");
            };
            zUtil.ensureLogin(function() {
                page.svr.show({
                    send: function(args, callb) {
                        // _record_def_gift 为1时记录末等奖的奖品
                        zHttp.send({
                            actid: setid,
                            area: args.area,
                            roleid: args.roleid
                        }, function(res) {
                            if (res.ret == 0) {
                                zHttp.showResponse(res, res.actid, $.noop);
                                zHttp.send({
                                    actid: setid_add
                                }, function() {
                                    page.initLotteryNum();
                                });
                            } else if (res.ret == 10002) {
                                qq.login.open();
                                return;
                            } else if (res.ret == 10001 || res.ret == 10004) {
                                zMsg.alert("活动已经结束，敬请期待更多QQ浏览器特权活动！");
                                return;
                            } else {
                                zHttp.showResponse(res, res.actid, $.noop);
                            }
                        });

                    }
                });
            });
        },
        getGradeGift: function(event) {
            if (!isQQBrowser()) {
                hint();
                return;
            };
            var ele = $(event.target);
            var setid;
            if (ele.hasClass('get20')) { //20级
                setid = 46158;
                report("BROWSER.ACTIVITY.JFZR.GRADE20CLICK");
            } else if (ele.hasClass('get35')) { //35级
                setid = 46157;
                report("BROWSER.ACTIVITY.JFZR.GRADE35CLICK");
            } else if (ele.hasClass('get45')) { //45级
                setid = 46156;
                report("BROWSER.ACTIVITY.JFZR.GRADE45CLICK");
            };
            zUtil.ensureLogin(function() {
                page.svr.show({
                    send: function(args, callb) {
                        // _record_def_gift 为1时记录末等奖的奖品
                        zHttp.send({
                            actid: setid,
                            area: args.area,
                            roleid: args.roleid
                        }, function(res) {
                            if (res.ret == 0) {
                                zHttp.showResponse(res, res.actid, $.noop);
                            } else if (res.ret == 10002) {
                                qq.login.open();
                                return;
                            } else if (res.ret == 10001 || res.ret == 10004) {
                                zMsg.alert("活动已经结束，敬请期待更多QQ浏览器特权活动！");
                                return;
                            } else {
                                zHttp.showResponse(res, res.actid, $.noop);
                            };
                        });
                    }
                });
            });
        },
        getLucky: function() { //抽奖
            if (!isQQBrowser()) {
                hint();
                return;
            }
            zUtil.ensureLogin(function() {
                // 记录奖品时 必须加字段 _record_gift_flow : 1 ， 若记录末等奖时 再加字段(不记录则不加) _record_def_gift : 1
                page.svr.show({
                    send: function(args, callb) {
                        zHttp.send({
                            actid: 46162,
                            area: args.area,
                            roleid: args.roleid,
                            _record_gift_flow: 1,
                            _record_def_gift: 1
                        }, function(res) {
                            if (res.ret == 0) {
                                //抽奖动画
                                var key = res.data.op.diamonds;
                                var stopid = setStopid(key);
                                callFlashToRoll(stopid);
                                page.complete = function() {
                                    zHttp.showResponse(res, res.actid, $.noop);
                                    page.initLotteryNum();
                                };
                            } else if (res.ret == 10002) {
                                qq.login.open();
                                return;
                            } else if (res.ret == 10001 || res.ret == 10004) {
                                zMsg.alert("活动已经结束，敬请期待更多QQ浏览器特权活动！");
                                return;
                            } else {
                                zHttp.showResponse(res, res.actid, $.noop);
                            }
                        });
                    }
                });

            });
            report('BROWSER.ACTIVITY.JFZR.LUCKYCLICK');
        },
        initLotteryNum: function() { //初始化抽奖次数
            zUtil.ensureLogin(function() {
                zHttp.send({
                    actid: 46159
                }, function(res) {
                    if (res.ret == 0) {
                        var lottery_num = res.data.op;
                        $('.cj_btn span').html(lottery_num + '次');
                    };
                });
            })
        },
        queryRecord: function() {
            zUtil.ensureLogin(function() {
                zHttp.send({
                    actid: 46232
                }, function(res) {
                    if (res.ret == 0) {
                        var _htmlArr = [],
                            count = 0;
                        for (var i in res.data.op) {
                            _htmlArr.push(qv.string.format('<li>{time} 获得 {value}</li>', {
                                time: qv.date.format("Y-m-d", res.data.op[i].val.time * 1000),
                                value: res.data.op[i].val.name
                            }));
                            count++;
                        }
                        if (count == 0) {
                            _htmlArr.push('<li>您还没有任何奖品哦~</li>');
                        }
                        zMsg.alert(_htmlArr.join(""));
                    } else if (res.ret == 10002) {
                        qq.login.open();
                        return;
                    } else if (res.ret == 10001 || res.ret == 10004) {
                        zMsg.alert("活动已经结束，敬请期待更多QQ浏览器特权活动！");
                        return;
                    } else {
                        zHttp.showResponse(res, res.actid, $.noop);
                    }
                })
            });
        }
    });
    window.page = new Page();

})(window, jQuery);


//抽奖初始化
var SWFOBJ = FlashManager.init({
    'flashUrl': 'http://ossweb-img.qq.com/images/flash/lottery/lotterybox_2013_v1.swf',
    'width': 606, //flash 宽度
    'height': 435, //flash 高度
    'total': 8, //抽奖产品的总数
    'sbtnx': 202, // 开始抽奖按钮的位置x坐标
    'sbtny': 145, // 开始抽奖按钮的位置y坐标
    'sbtnw': 194, // 开始抽奖按钮的宽度
    'sbtnh': 137, // 开始抽奖按钮的高度
    'boxw': 194, // 奖品光效的宽度
    'boxh': 137, //奖品光效的高度  
    'position': "0_0,202_0,404_0,0_145,404_145,0_290,202_290,404_290",
    'contentId': 'swfcontent',
    'onClickRollEvent': callJsToStart,
    'onCompleteRollEvent': callJsToComplete
});

function callJsToStart() {
    window.page.getLucky();
    //callFlashToRoll(4);    
}

function callFlashToRoll(id) {
    if (SWFOBJ) SWFOBJ.stopRoll(id);
}

function callJsToComplete() {
    window.page.complete();
}

//索引值对应奖项

function setStopid(key) {
    switch (key) {
        case 1:
            id = 1;
            break;
        case 2:
            id = 4;
            break;
        case 3:
            id = 3;
            break;
        case 4:
            id = 7;
            break;
        case 5:
            id = 2;
            break;
        case 6:
            id = 0;
            break;
        case 7:
            id = 6;
            break;
        case 8:
            id = 5;
            break;
        default:
            id = 0;
    };
    return id;
};

/*
  author:cp  懒加载
*/

function loadjs(url) {
    var obj = document.createElement("script");
    obj.setAttribute("src", url);
    document.body.appendChild(obj);
    return obj;
}

function delay_js(url, succ, v) {
    var elem = loadjs(url);
    if (!succ) succ = function() {};
    if ((navigator.userAgent.indexOf('MSIE') == -1) ? false : true) {
        elem.onreadystatechange = function() {
            if (this.readyState && this.readyState == "loading") return;
            else succ(v);
        };
    } else elem.onload = function() {
        succ(v);
    };
    elem.onerror = function() {};
};

function addload(func) {
    var old = window.onload;
    if (typeof window.onload != "function") {
        window.onload = func;
    } else {
        window.onload = function() {
            old();
            func();
        }
    }
};
need(["biz.delayLoad"]);
