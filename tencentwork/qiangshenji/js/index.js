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

function report(hottagValue) {
    window.setTimeout(function () {
        pgvSendClick({hottag: hottagValue});
    }, 100);
}
if(typeof(pgvMain) == 'function') {
    pgvMain("pathtrace", {pathStart: true, tagParamName: "ADTAG", useRefUrl: true, override: true, careSameDomainRef: false});
}



function hint(){
    var qb_dialog = new qv.zero.Dialog({
        title: "QQ浏览器用户专享",
        content: "       亲，这是QQ浏览器用户的专属特权活动。<p>              现在秒装1个（仅需4M），<\/p><p>             用QQ浏览器打开即可参加。<\/p>",
        type: "alert",
        buttons: [{
            text: "下载QQ浏览器",
            click: function() {
                window.open('http://dldir1.qq.com/invc/tt/QQBrowser_Setup_QSJ.exe');
                qb_dialog.hide();
                report("BROWSER.ACTIVITY.QSJ.QBDOWNLOAD");
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
        userJsonID : 49308,
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
                game: 'tps'
            });
        },
        exchange: function(e,act){
            if(!isQQBrowser()){
                hint();
                return;
            }
            var index = act[0];
            var arr = [49314, 49313, 49312, 49311, 49310];
            var id = arr[index];
            zUtil.ensureLogin(function () {
                page.svr.show({
                    send: function (args, callb) {
                        zHttp.send({'actid': id, area: args.area, roleid: args.roleid}, function (res) {
                            if(res.ret == 10002){
                                qq.login.open();
                            }else if (res.ret == 10001 || res.ret == 10004) {
                                zMsg.alert("活动已经结束，敬请期待更多QQ浏览器特权活动！");
                            }
                            else{
                                zHttp.showResponse(res, res.actid, $.noop);
                            }
                        });
                    }
                });
                if(index == 0){
                    report("BROWSER.ACTIVITY.QSJ.XINSHOUEXCHANGECLICK");
                } else if(index == 1){
                    report("BROWSER.ACTIVITY.QSJ.5JIEXCHANGECLICK");
                } else if(index == 2){
                    report("BROWSER.ACTIVITY.QSJ.10JIEXCHANGECLICK");
                } else if(index == 3){
                    report("BROWSER.ACTIVITY.QSJ.15JIEXCHANGECLICK");
                } else if(index == 5){
                    report("BROWSER.ACTIVITY.QSJ.HUOYUEEXCHANGECLICK");
                }
            });
        }
    });
    window.page = new Page();
})(window,jQuery);



window.onload = function (){
    //视频初始化；
    setTimeout(function(){
        window.video = new tvp.VideoInfo();
        video.setVid("w0016mjtbgq");
        window.player = new tvp.Player();
        player.create({
            width:355,
            height:217,
            video:video,
            modId:"videoBox", //mod_player是刚刚在页面添加的div容器
            autoplay:true
        });
        player.config.flashWmode = "transparent";
        player.config.vodFlashSkin = "http://imgcache.qq.com/minivideo_v1/vd/res/skins/TencentPlayerMiniSkin.swf";
    },2000);


    var w = document.documentElement.clientWidth;
    if(w >= 1410){
        document.getElementById("aside").style.display = "block";
        document.getElementById("aside").style.right = (w-1410)/2 + "px";
    }

};

window.onresize = function(){
    var w = document.documentElement.clientWidth;
    if(w >= 1410){
        document.getElementById("aside").style.display = "block";

    }
    else{
        document.getElementById("aside").style.display = "none";
    }
};
window.onscroll = function(){
    var St = document.documentElement.scrollTop || window.pageYOffset || document.body.scrollTop;
    var aside = document.getElementById("aside");
    if(St > 495){
        aside.style.position = "fixed";
        aside.style.top = "100px";
    }else{
        aside.style.position = "absolute";
        aside.style.top = "550px";
    }
};