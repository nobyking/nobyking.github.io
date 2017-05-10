
function report(hottagValue) {
    window.setTimeout(function () {
        pgvSendClick({hottag: hottagValue});
    }, 100);
}
if(typeof(pgvMain) == 'function') {
    pgvMain("pathtrace", {pathStart: true, tagParamName: "ADTAG", useRefUrl: true, override: true, careSameDomainRef: false});
}


$(function() {
    if(navigator.appName == "Microsoft Internet Explorer"){
        $("body").addClass("IE");
    }

    $("#copytime").html((new Date()).getFullYear());

    $("#ovpage").click(function(g) {
        g.preventDefault();
        $("html, body").animate({
                scrollTop: $("#container").height()
            },
            1000)
    });
    var d = $(".ipage");
    var e = [],
        b = [];
        a = $(window).height();
    $(window).resize(function() {
        a = $(window).height()
    });
    $(d).each(function(g, h) {
        e[g] = $(h).offset().top + Math.floor($(h).height() / 2) - a/10;
        b[g] = $(h).find(".imgwrap")
    });
    
    function showClass(){
        var g = $(window).scrollTop();
        $(e).each(function(h, j) {
            if (Math.floor(a / 2) + g >= j) {
                if (!$(b[h]).hasClass("showbg")) {
                    $(b[h]).addClass("showbg");
                    var k=b[h];
                    for(i=0;i < k.length;i++){
                        if($(k[i]).hasClass("LIn")){
                            $(k[i]).addClass("leftIn");
                        }else if($(k[i]).hasClass("RIn")){
                            $(k[i]).addClass("rightIn");
                        }else if($(k[i]).hasClass("FOut")){
                            $(k[i]).addClass("fadeOut");
                        }
                    }

                }
            }
        })
    }
    showClass();
    $(window).scroll(function() {
        showClass();
    });
});



function share(type, isMy){
    var shareObj={
        qzone: function(a) {
            report('BROWSER.ACTIVITY.GANENJIE.SHARECLICK_QZONE');
            var b = {
                url: a.url,
                showcount: "1",
                desc: a.title || "",
                //summary: a.summary || "",
                title: a.title,
                pics: a.pic || null,
                style: "203",
                width: 98,
                height: 22
            };
            var s = [];
            for(var i in b){
                s.push(i + '=' + encodeURIComponent(b[i]||''));
            }
            return "http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?" + s.join('&');
        },
        tencent: function(a) {
            report('BROWSER.ACTIVITY.GANENJIE.SHARECLICK_TENCENT');
            var b = {
                title: a.title || "",
                url: a.url,
                pic: a.pic
            };
            var s = [];
            for(var i in b){
                s.push(i + '=' + encodeURIComponent(b[i]||''));
            }
            return "http://share.v.t.qq.com/index.php?c=share&a=index&" + s.join('&');
        },
        renren: function(a) {
            report('BROWSER.ACTIVITY.GANENJIE.SHARECLICK_RENREN');
            var b = {
                resourceUrl: a.url,
                srcUrl:a.url,
                pic: a.pic || null,
                description: a.title
            };
            var s = [];
            for(var i in b){
                s.push(i + '=' + encodeURIComponent(b[i]||''));
            }
            return "http://widget.renren.com/dialog/share?" + s.join('&');
        },
        sina: function(a) {
            report('BROWSER.ACTIVITY.GANENJIE.SHARECLICK_SINA');
            var b = {
                title: a.title,
                frefer: a.url,
                url: a.url,
                pic: a.pic||null
            };
            var s = [];
            for(var i in b){
                s.push(i + '=' + encodeURIComponent(b[i]||''));
            }
            return "http://service.weibo.com/share/share.php?uid=1&" + s.join('&');
        }
    };

    var wording = {
        url: "http://event.browser.qq.com/stdl/activity/parents/index.html?ADTAG=share",
        title: "#QQ浏览器感恩献礼# 据统计，70%的人工作后每年陪在爸妈身边的时间不会超过7天。这个感恩节，就让QQ浏览器关爱版替你道声谢，让他们一年365天感受你的关爱。"
    };

    window.open(shareObj[type](wording));
}


function openSendMsg(){
    report('BROWSER.ACTIVITY.GANENJIE.TOPARENTS');
    var text = '不能在严寒里送你一件温暖的衣衫，不能在厨房里给你炖一锅香浓的鸡汤，只因孩子身在远方，不能陪伴你的身旁。在感恩节里，谢谢我最亲最爱的人，希望能用这个小礼物帮我陪在你身旁';

    var url = 'http://connect.qq.com/widget/shareqq/index.html?url=' + encodeURIComponent("http://event.browser.qq.com/stdl/activity/parents/index.html?ADTAG=qq")
        + '&desc=' + encodeURIComponent(text)
        + '&title='+ encodeURIComponent('QQ浏览器关爱版')
        + '&summary='+ encodeURIComponent(text)
        + '&flash=&site=&style=201&width=32&height=32';
        window.open(url, '_blank');
}

function isQQBrowser9(){
    try{
        return  window.external.getVersion().split('.')[0] === '9';
    }
    catch(e){
        return false;
    }
};


function installPlugin(){
    if(!isQQBrowser9()){ return;}
    var id = 'cmjpofhobdbemechkhemhinjhdeadbni';
    try{
        chrome.management.install({id:id}, function (id,result) {
            //console.log(result);
        });
        chrome.management.onInstallProgress.addListener(function (id,result) {
            $('#pluginBar').css('width', result + '%').parents().addClass('after');
        });
        chrome.management.onInstallFinished.addListener(function (id) {
            updateBijia(3);
        }); 
    }
    catch(e){}
}

function getPlugin() {
    if(!isQQBrowser9()){ return;}
    var id = 'cmjpofhobdbemechkhemhinjhdeadbni';
    var res = 0;
    try{
        chrome.management.get(id, function (result) {
            if(result === undefined) {
                //没有安装插件
                updateBijia(2);
            } else {
                //已安装插件
                updateBijia(4);
            }
        });
    }
    catch(e){}
    return res;
}


function updateBijia(type){
    var btn = $('#bijia');
    if(type == 1) {
        btn.addClass('btn_downloadQB').removeClass('btn_plug')
           .attr({'href':'http://dldir1.qq.com/invc/tt/QQBrowser_Setup_thanksgiving2015.exe','title':'下载QQ浏览器最新版'});
    } else if(type == 2) {
        btn.addClass('btn_plug').removeClass('btn_downloadQB')
           .attr({'href':'javascript:;','title':'安装比价插件'})
           .click(function () {
                installPlugin();
                report('BROWSER.ACTIVITY.GANENJIE.INSTALL_BIJIA');
        });
    } else if(type == 3) {
        btn.addClass('disabled').removeClass('btn_downloadQB btn_plug after')
        .attr({'href':'javascript:;','title':''}).click(function(){return;});
    }  else if(type == 4) {
        btn.removeClass('btn_downloadQB btn_plug after disabled')
        .attr({'href':'javascript:;','title':''});
    } 
}

window.onload = function(){
    $('#toParents').add($('#toParents2')).click(function(){
        openSendMsg();
    });

    if(!isQQBrowser9()) {
        //非QB9
        updateBijia(1);
    } else {
        getPlugin();
    }
};