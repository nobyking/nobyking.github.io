function report(hottagValue) {
    window.setTimeout(function () {
        pgvSendClick({hottag: hottagValue});
    }, 100);
}
if(typeof(pgvMain) == 'function') {
    pgvMain("pathtrace", {pathStart: true, tagParamName: "ADTAG", useRefUrl: true, override: true, careSameDomainRef: false});
}

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

function hint(){
    var qb_dialog = new qv.zero.Dialog({
        title: "QQ浏览器用户专享",
        content: "       亲，这是QQ浏览器用户的专属特权活动。<p>              现在秒装1个（仅需4M），<\/p><p>             用QQ浏览器打开即可参加。<\/p>",
        type: "alert",
        buttons: [{
            text: "下载QQ浏览器",
            click: function() {
                document.getElementById('downloadQB').click();
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
        userJsonID : 43199,
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
                game: 'fifa'
            });
        },
        getQBGift : function(e,act){
            if(!isQQBrowser()){ hint(); return; }
            zUtil.ensureLogin(function () {
                page.svr.show({
                    send: function (args, callb) {
                        if(!isQQBrowser()){ hint(); return; }
                        zHttp.send({'actid': 43200, area: args.area, roleid: args.roleid}, function(res){
                            if (res.ret == 10002) {
                                qq.login.open();
                            }
                            else if (res.ret == 10001 || res.ret == 10004) {
                                zMsg.alert("活动已经结束，敬请期待更多QQ浏览器特权活动！");
                            }
                            else {
                                zHttp.showResponse(res, res.actid);
                            }
                        });
                        report("BROWSER.ACTIVITY.FIFA.QBGIFTCLICK");
                    }
                });
            });
        },
        getNewGift : function(e,act){
            zUtil.ensureLogin(function () {
                page.svr.show({
                    send: function (args, callb) {
                        zHttp.send({'actid': 43201, area: args.area, roleid: args.roleid}, function(res){
                            if (res.ret == 10002) {
                                qq.login.open();
                            }
                            else if (res.ret == 10001 || res.ret == 10004) {
                                zMsg.alert("活动已经结束，敬请期待更多QQ浏览器特权活动！");
                            }
                            else {
                                zHttp.showResponse(res, res.actid);
                            }
                        });
                        report("BROWSER.ACTIVITY.FIFA.NEWGIFTCLICK");
                    }
                });
            });
        },
        getGradeGift : function(e,act){
            if(!isQQBrowser()){ hint(); return; }
            zUtil.ensureLogin(function () {
                page.svr.show({
                    send: function (args, callb) {
                        zHttp.send({'actid': 43202, area: args.area, roleid: args.roleid}, function(res){
                            if (res.ret == 10002) {
                                qq.login.open();
                            }
                            else if (res.ret == 10001 || res.ret == 10004) {
                                zMsg.alert("活动已经结束，敬请期待更多QQ浏览器特权活动！");
                            }
                            else {
                                zHttp.showResponse(res, res.actid);
                            }
                        });
                        report("BROWSER.ACTIVITY.FIFA.GRADEGIFTCLICK");
                    }
                });
            });
        }
    });
    window.page = new Page();
})(window,jQuery);

window.onload = function(){
    window.onscroll();
};

window.onscroll = function(){
    var ScrollTop = window.scrollY;
    var Obj = document.getElementById('nav_side');
    if(ScrollTop >= 445){
        Obj.style.cssText = "position:fixed;top:200px;";
    }else{
        Obj.style.cssText = "position:absolute;top:645px;";
    }
};
