/**
 * Created by rzm on 15/3/18.
 */


(function(W, $){
    try {
        document.domain = 'qq.com';
    } catch (e) {}

    if(typeof console === "undefined"){
        console = { log: function() { } };
    }

    var JSON = JSON || {};
    // implement JSON.stringify serialization
    JSON.stringify = JSON.stringify || function (obj) {
        var t = typeof (obj);
        if (t != "object" || obj === null) {
            // simple data type
            if (t == "string") obj = '"'+obj+'"';
            return String(obj);
        }
        else {
            // recurse array or object
            var n, v, json = [], arr = (obj && obj.constructor == Array);
            for (n in obj) {
                v = obj[n]; t = typeof(v);
                if (t == "string") v = '"'+v+'"';
                else if (t == "object" && v !== null) v = JSON.stringify(v);
                json.push((arr ? "" : '"' + n + '":') + String(v));
            }
            return (arr ? "[" : "{") + String(json) + (arr ? "]" : "}");
        }
    };

    var html; 
    /*tips 值说明：
     * 对应弹框方式：
     * * dialog.open()
     * 10：未知错误，活动太火爆
     * 9：非QQ浏览器提示语；
     * 8：活动已结束
     * 7：QQ浏览器版本过低
     * 0：type = 1 -> 电影票，type = 2 -> 海报，type = 3 -> 手机，type = 4 -> 谢谢参与
     * 1：设默被拦截
     */
    var tips = {
        10 : function(){
            html = "<p style='padding: 60px 0;font-size: 18px;'>活动太火爆了，请稍后再试！</p>\
                    <div class='btnBox'>\
                        <a href='javascript:void(0);' class='btn-auto' onclick='api.dialog.hide();'><span>确定</span></a>\
                    </div>";
            return html
        },
        9 : function(){
            html = "<p style='padding-top: 40px;font-size: 18px;padding-bottom: 10px;'>亲，本次活动已经结束</p>\
                    <p style='padding-bottom: 40px;font-size: 18px;'>敬请期待更多QQ浏览器特权活动！</p>\
                    <div class='btnBox'>\
                        <a href='javascript:void(0);' class='btn-auto' onclick='api.dialog.hide();'><span>确定</span></a>\
                    </div>";
            return html
        },
        8 : function(){
            html = "<p style='padding-top: 40px;font-size: 18px;padding-bottom: 10px;'>亲，用QQ浏览器才能参与本次活动哦~</p>\
                    <p style='padding-bottom: 40px;font-size: 18px;'>现在秒装一个（仅需4M），即可参加。</p>\
                    <div class='btnBox'>\
                        <a href='http://dldir1.qq.com/invc/tt/QQBrowser_Setup_ylhz.exe' class='btn-auto' onclick='api.dialog.hide();'><span>下载QQ浏览器</span></a>\
                    </div>";
            return html
        },
        7 : function(){
            var isQBLow = !!(/QQBrowser\/9/i.test(navigator.userAgent));
            if(isQBLow){
                html = "<p style='padding-top: 40px;font-size: 18px;padding-bottom: 10px;'>亲，您的QQ浏览器版本不符合</p>\
                            <p style='padding-bottom: 40px;font-size: 18px;'>请下载专用版本，即可参加。</p>\
                            <div class='btnBox'>\
                              <a href='http://dldir1.qq.com/invc/tt/QQBrowser_Setup_ylhz.exe' class='btn-auto' onclick='api.dialog.hide();'><span>下载专用版QQ浏览器</span></a>\
                            </div>";
            }else{
                html = "<p style='padding-top: 40px;font-size: 18px;padding-bottom: 10px;'>亲，您的QQ浏览器版本过低</p>\
                            <p style='padding-bottom: 40px;font-size: 18px;'>升级到最新版本，即可参加。</p>\
                            <div class='btnBox'>\
                              <a href='http://dldir1.qq.com/invc/tt/QQBrowser_Setup_ylhz.exe' class='btn-auto' onclick='api.dialog.hide();'><span>下载最新版QQ浏览器</span></a>\
                            </div>";
            }
            return html
        },
        0 : function(type, QB){
            var typeHtml = '',QBHtml = '';
            if(type == 1){
                typeHtml = "<p style='font-size: 40px;line-height:50px;font-family:\"宋体\";'>恭喜您！中奖了</p>\
                            <p style='height: 55px;line-height: 25px;font-weight: bold;'>恭喜你获得了iPhone6手机一部</p>\
                            <p class='hint'>请留下你的 <a href='http://vip.qq.com/my/index.html#address' target='_blank'>联系方式</a>，我们将会在活动结束后10个工作日内寄送。</p>";
            } else if(type == 2){
                typeHtml = "<p style='font-size: 40px;line-height:50px;font-family:\"宋体\";'>恭喜您！中奖了</p>\
                            <p style='height: 55px;line-height: 25px;font-weight: bold;'>恭喜你获得了《何以笙箫默》电影票一张</p>\
                            <p class='hint'>请留下你的 <a href='http://vip.qq.com/my/index.html#address' target='_blank'>联系方式</a>，我们将会在活动结束后10个工作日内寄送。</p>";
            } else if(type == 3){
                typeHtml = "<p style='font-size: 40px;line-height:50px;font-family:\"宋体\";'>恭喜您！中奖了</p>\
                            <p style='height: 55px;line-height: 25px;font-weight: bold;'>恭喜你获得了签名海报一张</p>\
                            <p class='hint'>请留下你的 <a href='http://vip.qq.com/my/index.html#address' target='_blank'>联系方式</a>，我们将会在活动结束后10个工作日内寄送。</p>";
            } else if(type == 4){
                var num = api.getRandomNum(4);
                var randomText = ['不够大力是抽不中的！<br>明天再来试试吧^_^','呜呜呜，今天没有抽中(┬＿┬)<br>明天再来试试吧！','虽然没有抽中，但明天还有机会哦~','五百次回眸才换来一次擦肩而过，明天再来吧~','一定是抽奖的姿势不对，换个姿势明天再来吧！'];
                typeHtml = "<p style='font-size: 40px;line-height:50px;font-family:\"宋体\";'>很遗憾</p>\
                            <p style='padding-top: 10px;padding-bottom: 20px;line-height: 20px;font-weight: bold;'>"+ randomText[num] +"</p>"
            } else if(type == 5){
                typeHtml = "<p style='font-size: 18px;padding: 50px 0;'>亲，您没有抽奖机会了</p>";
            }   else{
                typeHtml = "<p style='padding: 60px 0;font-size: 18px;'>活动太火爆了，请稍后再试！</p>"
            }
            if(!QB){
                if (type < 4) {
                    QBHtml = "<a href='http://vip.qq.com/my/index.html#address' target='_blank' class='btn-auto' onclick='api.dialog.hide()'><span>去填写</span></a>";
                } else {
                    QBHtml = "<a href='javascript:void(0);' class='btn-auto' onclick='api.dialog.hide()'><span>确定</span></a>";
                }
            }else{
                if (type < 4) {
                    QBHtml = "<a href='http://vip.qq.com/my/index.html#address' target='_blank' class='btn-auto' onclick='api.dialog.hide()' style='margin-right: 20px;'><span>去填写</span></a><a href='javascript:void(0);' class='btn-auto' id='defaultQB'><span>设为默认浏览器</span></a>\
                          <p style='font-size: 12px; color: #fff; line-height: 1.3em; padding-top: 10px;'>把QQ浏览器设为默认浏览器<br>可以获得一次抽奖机会哟~</p>";
                } else {
                    QBHtml = "<a href='javascript:void(0);' class='btn-auto' id='defaultQB'><span>设为默认浏览器</span></a>\
                          <p style='font-size: 12px; color: #fff; line-height: 1.3em; padding-top: 10px;'>把QQ浏览器设为默认浏览器<br>可以获得一次抽奖机会哟~</p>";
                }
            }
            html = typeHtml + QBHtml;
            return html
        },
        1 : function(type){
            if(type == 1){
                html = "<p style='padding: 45px 0;line-height: 24px;'>恭喜您，设置默认浏览器成功，并获得一次抽奖机会，赶快去试试手气吧^_^</p>\
                        <a href='javascript:void(0);' class='btn-auto' onclick='api.dialog.hide()'><span>确定</span></a>";
            } else if(type == 2){
                html = "<p style='padding-top: 45px;padding-bottom: 55px; '>设置默认浏览器的操作被拦截了</p>\
                        <a href='http://browser.qq.com/help_v7/faq6.html' target='_blank' class='btn-auto' onclick='api.dialog.open(api.tips[1](3));'><span>查看解决方法</span></a> 　 <a href='javascript:void(0);' class='btn-cancel' onclick='api.dialog.hide()'><span>不再提示</span></a>";
            }else{
                html = "<p style='padding-top: 45px;padding-bottom: 55px; font-size: 16px;'>设置默认浏览器的操作被拦截了</p>\
                        <a href='javascript:void(0);' class='btn-auto' id='defaultQB'><span>再试一次</span></a> 　 <a href='javascript:void(0);' class='btn-cancel' onclick='api.dialog.hide()'><span>下次再说</span></a>";
            }

            return html
        }
    };
    //var isQQBrowser = !!(/QQBrowser/i.test(navigator.userAgent));
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
    var isQQIE = (window.external && window.external.extension && /QQBrowser/i.test(navigator.userAgent)) ? true : false;
    var isQQCT = (window.getExtension && /Chrome.*QQBrowser/i.test(navigator.userAgent)) ? true : false;

    var getPCGuid = function(cb){
        if (isQQIE) {
            try {
                var guid = window.external.getGuid();
                guid ? cb(0, guid.split('-').join('')) : cb(-1);
            }catch(e){
                cb(-5);
            }
        }
        else if (isQQCT) {
            var web_page_extension_id = '{A3C609B3-3E61-4508-8953-117B7286068B}';
            var platform_extension_id = '{420DEFEE-20A8-468C-BFDA-61A09A99325D}';
            var extension;
            try {
                extension = window.getExtension(web_page_extension_id);
                extension.sendMessage(platform_extension_id, {serviceId: "hardware.getGuid", args: []}, function (data) {
                    data[0] ? cb(0, data[0].split('-').join('')) : cb(-2);
                });
            }catch(e){
                cb(-3);
            }
        }
        else{
            cb(-4);
        }
    };

    //return （-1）: 不是QQ浏览器
    //       （-2）: QQ浏览器版本太低
    //       （0,true）: QQ浏览器是默认浏览器
    //       （0,false）: QQ浏览器不是默认浏览器
    var isQBDefault = function(cb){
        if (isQQIE) {
            try {
                window.external.extension.nativeApi.isQQBrowserDefaultBrowser(function(ret){
                    cb(0, ret);
                });
            }catch(e){
                cb(-2);
            }
        }
        else if (isQQCT) {
            var web_page_extension_id = '{A3C609B3-3E61-4508-8953-117B7286068B}';
            var platform_extension_id = '{420DEFEE-20A8-468C-BFDA-61A09A99325D}';
            var extension;
            try {
                extension = window.getExtension(web_page_extension_id);
                extension.sendMessage(platform_extension_id, {serviceId: "nativeApi.isQQBrowserDefaultBrowser", args: []}, function (ret) {
                    cb(0, ret[0]);
                });
            }catch(e){
                cb(-2);
            }
        }
        else{
            cb(-1);
        }
    };

    var setQBDefault = function(cb){
        if (isQQIE) {
            try {
                window.external.extension.nativeApi.setQQBrowserDefaultBrowser(function(ret){
                    cb(0, ret);
                });
            }catch(e){
                cb(-2);
            }
        }
        else if (isQQCT) {
            var web_page_extension_id = '{A3C609B3-3E61-4508-8953-117B7286068B}';
            var platform_extension_id = '{420DEFEE-20A8-468C-BFDA-61A09A99325D}';
            var extension;
            try {
                extension = window.getExtension(web_page_extension_id);
                extension.sendMessage(platform_extension_id, {serviceId: "nativeApi.setQQBrowserDefaultBrowser", args: []}, function (ret) {
                    cb(0, ret[0]);
                });
            }catch(e){
                cb(-2);
            }
        }
        else{
            cb(-1);
        }
    };


/*
    param 可选
    param : {
        needQB， 是否限制必须PC上必须使用QB，默认true,IPAD上由于接口原因必须使用IAP QQ浏览器
        pc:{minVer}，minVer PC QQ浏览器允许的最低版本，如2959
    }
 */
    var ensureLogin = function(cb,param){
        var obj = param || {};
        var ver;
        var needQB = !(obj.needQB===false);
        if(!needQB){
            return zUtil.ensureLogin(cb);
        }

        if(!isQQBrowser()){
            return api.dialog.open(api.tips['8'](),true);
        }
        else if(obj.pc && obj.pc.minVer){
            //检查版本是否符合
            try {
                ver = navigator.userAgent.match(/QQBrowser\/(\d+)\.(\d+)\.(\d+)\.\d+/);
                if (ver && ver[3] >= obj.pc.minVer) {
                    getPCGuid(function (err) {
                        if (err) return  api.dialog.open(api.tips['7']());
                        else return zUtil.ensureLogin(cb);
                    });
                }
                else {
                    return  api.dialog.open(api.tips['7']());
                }
            }catch(e){
                return  api.dialog.open(api.tips['7']());
            }
        }
        else{
            //判断是否能取到GUID
            getPCGuid(function(err){
                if(err) return  dialog.open(tips['7']());
                else return zUtil.ensureLogin(cb);
            });
        }
    };

    //needQB  默认true ，意味着必须同时获取GUID
    var requestAMS = function(obj,cb){
        var param ={};
        if(obj.needQB === false){
            param.needQB = false;
        }
        ensureLogin(function(){ //只有ipad会返回 所以不需要用ua判断平台
            var _url = "http://festival.browser.qq.com/valentineOperation?";
            if(obj.needQB === false){
                zHttp.send(obj,cb);
            }
            else{
                getPCGuid(function(err,guid){ //error不需要验证，ensureLogin里面确认过了
                    obj.guid = guid;
                    zHttp.send(_url+ $.param(obj),cb);
                });
            }
        },param);
    };

    function clickReport(hottagValue) {
        if(typeof(pgvSendClick) == 'function') {
            pgvSendClick({hottag: hottagValue});
        }
    }
    function pvReport() {
        if (typeof(pgvMain) == 'function') {
            pgvMain("pathtrace", {pathStart: true, tagParamName: "ADTAG", useRefUrl: true, override: true, careSameDomainRef: false});
        }
    }

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
            popBox.innerHTML = '<div class="popTop"></div><div class="popWrap"><a href="javascript:void(0);" class="popClose" onclick="api.dialog.hide()" title="关闭"></a><div class="popContainer">'+ content +'</div></div><div class="popBottom"></div>';
            popBox.style.marginTop = popBox.offsetHeight/-2 +'px';
        },
        open : function(msg, flag){
            this.init(flag, msg);
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

    function getRandomNum(num){
        var x = num;
        var y = 0;
        return parseInt(Math.random() * (x - y + 1) + y);
    }

    W.api = {
        clickReport     : clickReport,
        pvReport        : pvReport,
        isQQBrowser     : isQQBrowser,
        isQQIE          : isQQIE,
        isQQCT          : isQQCT,
        tips            : tips,
        dialog          : dialog,
        requestAMS      : requestAMS,
        ensureLogin     : ensureLogin,
        isQBDefault     : isQBDefault,
        setQBDefault    : setQBDefault,
        getRandomNum    : getRandomNum
    };
})(window, jQuery);

;(function($,window){
    //图片轮播
    var kvblock = $('.kvblock');
    var perWidth = kvblock.width();
    var len =  kvblock.find('.kvtitle').length;
    var dot = $('.dotlist a');
    kvblock.data('index',0);
    var prevBtn = $('.kv .prev');
    var nextBtn = $('.kv .next');
    prevBtn.hide();
    prevBtn.click(function(){
        if( kvblock.is(':animated') ){ kvblock.stop(1,1); }
        var index = kvblock.data('index');
        if(index == 0 ){ prevBtn.hide(); return false;}
        index--;
        if(index == 0){
            prevBtn.hide()
        }else{
            prevBtn.show();
        };
        nextBtn.show();
        scroll(index);
        return false;
    });
    nextBtn.click(function(){
        if( kvblock.is(':animated') ){ kvblock.stop(1,1); }
        var index = kvblock.data('index');
        if(index==len-1){ return false;}
        index++;
        if(index==len-1){
            nextBtn.hide();
        }else{
            nextBtn.show();
        }
        prevBtn.show();
        scroll(index);
        return false;
    });
    dot.click(function(){
        if( kvblock.is(':animated') ){ kvblock.stop(1,1); }
        var cur = $(this).index();
        var index = kvblock.data('index');
        if(cur == index){ return false;}
        if(cur == 0){
            prevBtn.hide();
        }else{
            prevBtn.show();
        };
        if(cur == len-1){
            nextBtn.hide();
        }else{
            nextBtn.show();
        }
        scroll(cur);
        return false;
    });

    function scroll(num){
        kvblock.animate({'scrollLeft':perWidth*num+'px'},200);
        kvblock.data('index',num);
        dot.removeClass('active').eq(num).addClass('active');
    }

    //设置自动识别
    var $fixer = $('.fixer');
    var fixY = $fixer.height();
    //var anchorItem =
    //$fixer.css('margin-top',- fixY/2);
    $('.fixer a').on('focus',function(){
        $(this).blur();
    });

    $fixer.removeClass('fix_bar');
    //$fixer.css('position','absolute');
    var  arr = setAnchor();
    var  newArr = order(arr);
    var newArrlen = newArr.length -1;
    var scrollflag = false;
    var curNode ='';
    var _w = $(window).width();
    var showFlag = 1;
    setBar();
    $(window).on('resize',function(){
        setBar();
        setClass();
    });


    function setClass(){
        if($(document).scrollTop()>=630){
            $fixer.addClass('fixbar');
        }else{
            $fixer.removeClass('fixbar');
        }
    }

    function setBar(){
        var _w=$(window).width();
        if(_w>=1350 && _w < 1600 ){
            $fixer.css('left','10px');
            showFlag = 1;  //showFlag:1左侧浮动栏显示 0 不显示
            $fixer.show();
        }else if( _w>=1600 && _w<3000){
            $fixer.css('left','100px');
            showFlag = 1;
            $fixer.show();
        }else{
            showFlag  =0;
            $fixer.hide();
        }
    }

    $(window).on('scroll',function(){
        var screenY = $(window).height();
        if( showFlag == 1  && $(document).scrollTop() >= 630 ){
            $fixer.addClass('fix_bar');
        }else{
            $fixer.removeClass('fix_bar');
            $('ul.anchorlist li a').removeClass('active').eq(0).addClass('active');
        };
        //页面滚动时固定栏的变化
        var scrollY = $(document).scrollTop();
        var btmY = $(document).height() - screenY;
        var temp;
        for(var i=0;i<newArr.length;i++){
            if(scrollflag){ return;}
            if(scrollY>= btmY){
                temp = 'anchor_recommend';
            }else if(scrollY < 630){
                temp = 'anchor_movie';
            }else{
                if(scrollY>=630 && scrollY<1170){
                    temp = 'anchor_movie';
                }else if(scrollY>= 1170 && scrollY<= 1815){
                    temp = 'anchor_draw';
                }else if(scrollY>=1815 && scrollY<= 2328){
                    temp = 'anchor_view';
                }else if(scrollY>=2328){
                    temp = 'anchor_recommend';
                }
            };

            $('ul.anchorlist li a').removeClass('active');
            $('ul.anchorlist li a[data-url=\''+temp+'\']').addClass('active');
        }

    });

    //click触发时的菜单变化
    $('ul.anchorlist li a').click(function(){
        scrollflag = true;
        $('ul.anchorlist li a').removeClass('active');
        var url = $(this).attr('data-url');
        curNode = url;
        $(this).addClass('active');
        var offsetY = $('.'+url).offset().top - 45;
        $('html,body').animate({scrollTop:offsetY},300,function(){
            scrollflag = false;
        });
        return false;
    });


    /*关联数组*/
    function setAnchor(){
        var $liNode = $('ul.anchorlist li');
        var arr=[];
        for(var i=0;i<$liNode.length;i++){
            var key = $liNode.eq(i).find('a').attr('data-url');
            if( $('.'+key).length==0 ){ return;}
            var value = $('.'+key).offset().top;
            arr[''+key] = value;
        }

        return arr;
    };

    function order(arr){
        var newarr = new Array();
        for(var k in arr){
            newarr.push(k);
        }
        newarr.sort(function sortfunction(x,y){
            return arr[x]-arr[y];
        });
        return newarr;
    };

    /*fixer end*/

})(jQuery,window);
