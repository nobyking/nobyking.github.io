
//抽奖
var inGame = false;
function numRand() {
    var x = 2; //上限
    var y = 0; //下限
    return parseInt(Math.random() * (x - y + 1) + y);
}
function randKey(){
    var GKey = [], k = 3;
    for(var i = 0; i < k; i++){
        GKey[i] = numRand();
    }
    while((GKey[2] == GKey[1]) && (GKey[2] == GKey[0])){
        GKey[2] = numRand();
    }
    return GKey;
}
var myesaing = {
    easeInOutCirc: function (x, t, b, c, d) {
        if ((t/=d/2) < 1) return -c/2 * (Math.sqrt(1 - t*t) - 1) + b;
        return c/2 * (Math.sqrt(1 - (t-=2)*t) + 1) + b;
    }
};
function gameAuto(){
    jQuery(".slotitem").each(function(index){
        var _num = jQuery(this);
        var _num_t = _num.css('text-indent').replace('px','');
        _num_t = parseInt(parseInt(_num_t) + 224);
        _num.animate({
            'text-indent':_num_t
        },{
            step: function(now, fx) {
                jQuery(fx.elem).css("background-position", "center "+now+"px");
            },
            duration: 500,
            easing: myesaing.easeInOutCirc(),
            complete: function(){}
        });
    });
}
function game(key,fn){
    if(inGame){
        fn();
        return;
    }
    inGame = true;
    var u = 224, len = 3;
    var result = [];
    jQuery(".slotitem").css({'background-position':'50% 0','text-indent':0});
    if(key >= 4){
        result = randKey();
    }else{
        if(key == 1){
            result = [0,0,0];
        }else{
            for(var i = 0; i < len; i++){
                result[i] = key - 1;
            }
        }
    }
    jQuery(".slotitem").each(function(index){
        var _num = jQuery(this);
        setTimeout(function(){
            _num.animate({
                'text-indent': parseInt((u*60) - (u*result[index]))
            },{
                step: function(now, fx) {
                    jQuery(fx.elem).css("background-position", "center "+now+"px");
                },
                duration: 6000+index*3000,
                easing: myesaing.easeInOutCirc(),
                complete: function(){
                    if(index==2){
                        fn();
                    }
                }
            });

        }, index * 300);
    });
}

//AMS
(function (window,$) {
    Page = qv.zero.extend(qv.zero.AbstractPage,{
        userJsonID : 44872,
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
        },
        queryGift : function(){
            zUtil.ensureLogin(function () {
                zHttp.send({'actid': 45130}, function (res) {
                    if (res.ret == 0) {
                        var _htmlArr = [], count = 0, _html = '', k = 0;
                        for (var i in res.data.op) {
                            k = parseInt(i)+1;
                            k = k < 10 ? '0'+k : k;
                            var obj = res.data.op[i].val;
                            if(obj.name === "谢谢参与"){continue;}
                            _htmlArr.push(qv.string.format('<li>'+k+'.&nbsp;&nbsp;<span>{time}</span>{value}</li>', {
                                time: qv.date.format("Y-m-d", res.data.op[i].val.time * 1000),
                                value: res.data.op[i].val.name
                            }));
                            count++;
                        }

                        if (count == 0) {
                            _html = '<p style="padding-top: 60px; font-size: 16px; text-align: center;">您还没有获得奖品~</p>';
                        }
                        else {
                            _html = "<h3 class='popTit'>获奖记录</h3>\
                                <ul class='popList'>"+ _htmlArr.join('') + "</ul>\
                                <a href='javascript:void(0);' class='btn-auto' onclick='api.dialog.hide();'><span>确定</span></a>";
                        }
                        api.dialog.open(_html);
                    }else if(res.ret == 10002){
                        //qq.login.open();
                    }
                    else if(res.ret == 10001 || res.ret == 10004){
                        api.dialog.open(api.tips[9]());//活动已结束
                    }
                });
            });
            window.api.clickReport('BROWSER.ACTIVITY.HYSXM.QUERYGIFT');
        },
        signIn : function(cb){
            zUtil.ensureLogin(function () {
                zHttp.send({'actid': 44903}, function (res) {
                    cb();
                });
            });
        },
        getLucky: function(cb){
            if(!window.api.isQQBrowser()){
                api.dialog.open(api.tips[8]());//非QQ浏览器
                return;
            }
            if(inGame){return;}
            zUtil.ensureLogin(function () {
                zHttp.send({'actid': 44906, _record_gift_flow:1}, function (res) {
                    if(res.ret == 0) {
                        //var key = res.data.op.diamonds;
                        //api.dialog.open(api.tips[0](key));  //1-> iPhone6、 2-> 电影票、 3-> 海报、 4-> 谢谢参与、 else -> 未知错误类型
                        var key = res.data.op.diamonds;
                        var me = jQuery('#star');
                        if(setTime == undefined){
                            setTime = '';
                        }
                        clearInterval(setTime);
                        setTime = '';
                        try{
                            if(key >= 1 && key <= 4){
                                me.parent().addClass('active');
                                game(key, function () {
                                    inGame = false;
                                    me.parent().removeClass('active');
                                    cb(res);
                                })
                            }else {
                                cb(res);
                            }
                        }
                        catch (e){
                            key = key-1;
                            var t = [[0,0,0],[-224,-224,-224],[-448,-448,-448],[448,448,0]];
                            if(key < 0 || key > 3){
                                key = 3;
                            }
                            jQuery(".slotitem").each(function(index){
                                jQuery(".slotitem").eq(index).css({'background-position' : '50% ' + t[key][index] + 'px' ,'text-indent' : t[key][index]});
                            });
                            cb(res);
                        }
                    }
                    else if(res.ret == 10002){
                        qq.login.open();
                    }
                    else if(res.ret == -1){
                        api.dialog.open(api.tips[7]());//QQ浏览器版本过低
                    }
                    else if(res.ret == -2){
                        api.dialog.open("<p style='padding: 50px 0;line-height: 28px;font-size: 20px;'>警告！您已触发QQ浏览器活动刷奖限制<br>已加入黑名单</p><p><a href='javascript:void(0);' class='btn-auto' onclick='api.dialog.hide();'><span>确定</span></a></p>");//超过QQ浏览器抽奖上限
                    }
                    else if(res.ret == 10601 || res.ret == 20801){//没有抽奖机会
                        var flag = window.qb.hasDefault && (window.api.isQQIE || window.api.isQQCT);
                        api.dialog.open(api.tips[0](5,flag));
                    }
                    else if(res.ret == 10001 || res.ret == 10004){
                        api.dialog.open(api.tips[9]());//活动已结束
                    }else if(res.ret == 10303 || res.ret == 10603){
                        api.dialog.open(api.tips[0](5));
                    }
                    else{
                        api.dialog.open(api.tips[10]());//活动太火爆
                    }
                });
            });
            window.api.clickReport('BROWSER.ACTIVITY.HYSXM.GETLUCKYCLICK');
        },
        queryDefault : function(cb){ //查询有没有参与过设置默认
            zHttp.send({ actid : 44934, _c : 'view'},function(json){
                json.ret == 0 ? cb(0, !json.data.op.count) : cb(1);
            });
        },
        setDefault : function(cb){  //成功设置默认
            zHttp.send({ actid : 44904},function(){
                cb();
            });
            window.api.clickReport('BROWSER.ACTIVITY.HYSXM.SETDEFAULT');
        },
        shareQZ: function(){
            var f = {
                url: "http://tq.qq.com/g/hysxm/index.html?pvsrc=qzoneshare",
                summary: "我发现QQ浏览器送《何以笙箫默》电影票和签名海报啦，爱不将就，我要的礼品现在就要!",
                title: "QQ浏览器携手《何以笙箫默》送电影票啦",
                act_pic: "http://stdl.qq.com/stdl/temp/hysxm_share.jpg",
                zone_pic: '',
                desc : '',
                music_url :  '',
                topic : '',
                music_title : '',
                music_author : '',
                video_pic : '',
                video_url : '',
                play_url : '',
                isSendWeibo :0,
                isSendQzone : 1,

                gtk_type: 0  

            };
            zUtil.ensureLogin(function() {
                zHttp.send(zURL.appendParams(f, "http://iyouxi.vip.qq.com/share_new.php?ipvsrc%5Bweibo%5D=12&ipvsrc%5Bqzone%5D=7"), function() {
                    zHttp.send({'actid':44905}, function(res) {
                        if(res.ret == 0){
                            api.dialog.open("<p style='padding: 50px 0;'>恭喜您分享成功，并获得一次抽奖机会！</p><p><a href='javascript:void(0);' class='btn-auto' onclick='api.dialog.hide();'><span>确定</span></a></p>");
                        }
                        else if(res.ret == 10603 || res.ret == 10601){
                            api.dialog.open("<p style='padding: 50px 0;'>您已经分享过了！重复分享不会增加抽奖机会！</p><p><a href='javascript:void(0);' class='btn-auto' onclick='api.dialog.hide();'><span>确定</span></a></p>");
                        }
                        else if(res.ret == 10002){
                            qq.login.open();
                        }
                        else if(res.ret == 10001 || res.ret == 10004){
                            api.dialog.open(api.tips[9]());
                        }
                        else{
                            zHttp.showResponse(res, res.actid, $.noop);
                        }
                    });
                    window.api.clickReport('BROWSER.ACTIVITY.HYSXM.SHARECLICK');
                });
            });
        }
    });
    window.page = new Page();
})(window,jQuery);


(function (window,$) {

    window.qb = window.qb || {};
    window.qb.hasQueryDefault = false;

    var queryDefault = function(err, result){
        if(!err){
            window.qb.hasQueryDefault = true;
            window.qb.hasDefault = result;
        }
    };

    var getLucky = function(){
        page.getLucky(function (res) {
            inGame = false;
            var key = res.data.op.diamonds;
            if(!window.qb.hasQueryDefault || window.qb.hasDefault){
                window.api.isQBDefault(function(err,isDefault){
                    if(!err && isDefault) {
                        api.dialog.open(api.tips[0](key, false));
                    }
                    else{
                        if (isDefault) {
                            window.qb.hasQueryDefault = true;
                            window.qb.hasDefault = false;
                        }
                        if(window.qb.hasDefault && (window.api.isQQIE || window.api.isQQCT)){
                            api.dialog.open(api.tips[0](key, true));
                        }
                        else{
                            api.dialog.open(api.tips[0](key, false));
                        }
                    }
                });
            }else{
                api.dialog.open(api.tips[0](key, false));
            }
        })
    };

    function leftMenu(){
        jQuery(window).scroll(function () {
            var scrollTop = jQuery(window).scrollTop();
            if(scrollTop > 614){
                jQuery('#mod-fixLeft').css({'position':'fixed','top':'45px'});
            }else{
                jQuery('#mod-fixLeft').css({'position':'absolute','top':'660px'});
            }
        });
        jQuery(window).resize(function () {
            var w = jQuery(window).width();
            if(w < 1280){
                jQuery('#mod-fixLeft').hide(0);
            }else if(w >= 1280 && w < 1440){
                jQuery('#mod-fixLeft').show(0);
                jQuery('#mod-fixLeft').css('margin-left','-700px');
            }else{
                jQuery('#mod-fixLeft').show(0);
                jQuery('#mod-fixLeft').css('margin-left','-750px');
            }
        });
        jQuery(window).scroll();
        jQuery(window).resize();
        jQuery('#mod-fixLeft li').click(function(){
            var me = jQuery(this);
            var k = me.index();
            var mId = me.find('a').attr('href');
            var mTop = jQuery(mId).offset().top - 45;
            jQuery(window).scrollTop(mTop);
            me.addClass('active').siblings('li').removeClass('active');
            return false;
        });
    }

    window.onload = function(){
        zUtil.ensureLogin = function (fn,context){
            var me=this;
            if(!qq.login.getUin()){
                qq.login.open(function(){
                    OZ&&OZ.report({operID:1,operType:"登录",operDesc:"登录访问页面"});
                    fn.call(context||me)
                });
                var loginTop = jQuery(window).scrollTop();
                setTimeout(function(){
                    window.scroll(0,loginTop);
                },100);
                return false
            }else{
                return fn.call(context||me)}
        };
        //左侧按钮
        leftMenu();
        //视频初始化；
        window.video = new tvp.VideoInfo();
        video.setVid("b0152hp8uqq");
        window.player = new tvp.Player();
        player.create({
            width:580,
            height:385,
            video:video,
            modId:"video", //mod_player是刚刚在页面添加的div容器
            autoplay:false
        });
        player.config.flashWmode = "transparent";

        page.queryDefault(queryDefault);

        qq.login.bind('login',function(){
            if(!window.qb.hasQueryDefault){
                page.queryDefault(queryDefault);
            }
        });

        window.api.pvReport(); //pv上报

        $('body').on('click','#defaultQB',function(){
            window.api.setQBDefault(function (err,succ) {
                if(!err && succ){
                    page.setDefault(function(){ //设置成功之后赠送
                        api.dialog.open(api.tips[1](1));
                        window.qb.hasQueryDefault = true;
                        window.qb.hasDefault = false;
                    });
                }else{
                    api.dialog.open(api.tips[1](2));
                }
            });
        });
        jQuery('#star').click(function () {
            page.signIn(function () {
                getLucky();
            });
        });
        //抽奖
        var ran = randKey();
        var _t;
        jQuery(".slotitem").each(function(index){
            _t = parseInt(ran[index] * 224);
            jQuery(this).css({'background-position' : '50% ' + _t + 'px' ,'text-indent' : _t});
        });
        setTime = setInterval(gameAuto,2200);
    };

})(window,jQuery);


