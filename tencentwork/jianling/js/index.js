//活动地址 不带任何参数
var _pageUrl = location.protocol + '//' + location.host + location.pathname;
//获取AMS系统中设置的提示语
function getAmsMsg(res) {
    var msgCfg = zHttp.getMsgByState( res.data, res.actid, res.ret, $.noop );
    return zMsg.repair( msgCfg.m );
}

var qb_guid = 0; // window.api.getGuid 有可能不返回数据
var getGuid = function () {
    try {
        var guid = window.external.getGuid();
        qb_guid = guid.split('-').join('');
    }catch(e){
        var web_page_extension_id = '{A3C609B3-3E61-4508-8953-117B7286068B}';
        var platform_extension_id = '{420DEFEE-20A8-468C-BFDA-61A09A99325D}';
        var extension;
        try {
            extension = window.getExtension(web_page_extension_id);
            extension.sendMessage(platform_extension_id, {serviceId: "hardware.getGuid", args: []}, function (data) {
                qb_guid = data[0].split('-').join('');
            });
        }catch(e){
            qb_guid = 0;
        }
    }
};
getGuid();

//终极宝箱热度条
function hotBar(k){ //k = 0-100
    var bar = jQuery('#hotBar');
    bar.animate({'width': k+'%'},500);
}
function setHotBar(timer) {
    var Timer = new Date('2016/07/17').getTime(),
        month = +qv.date.format('m',timer),
        day =  +qv.date.format('d',timer),
        percent = 0;
    if(timer < Timer) {
        percent = 85 - parseInt(((Timer - timer) / 86400000) * 6);
    } else {
        percent = 85 + parseInt(((timer - Timer) / 86400000) * 4);
    }
    percent = percent>100 ? 100 : percent;
    hotBar(percent);//85
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
        popBox.innerHTML = '<div class="popTop"></div><div class="popContent"></div><div class="popBottom"></div><div class="popWrap"><a href="javascript:void(0);" class="popClose" onclick="dialog.hide()" title="关闭"></a><div class="popContainer">'+ content +'</div></div>';
        popBox.style.marginTop = popBox.offsetHeight/-2 +'px';
        window.onresize = function () {
            popBox.style.marginTop = popBox.offsetHeight/-2 +'px';
        }
    },
    alert : function(msg, ClassName, flag){
        this.init(flag, msg, ClassName);
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



//提示语
var html;
var tips = {
    9 : function(){
        html = "<div class='txtCenter'>\
                    <p style='padding-top: 15px;'>活动已经结束！</p>\
                    <p style=' padding-bottom: 5px;'>敬请期待更多QQ浏览器特权活动！</p>\
                </div>\
                <div class='P_btns'>\
                    <a href='javascript:;' class='btn_pop' onclick='dialog.hide();'>确 定</a>\
                </div>";
        return html;
    },
    8 : function(){
        html = "<div class='txtCenter'>\
                    <p style='padding-top: 15px;'>亲，这是QQ浏览器的专属活动</p>\
                    <p style=' padding-bottom: 5px;'>请点击下载最新版的QQ浏览器来参加活动</p>\
                </div>\
                <div class='P_btns'>\
                    <a href='http://dldir1.qq.com/invc/tt/QQBrowser_Setup_Jianling.exe' class='btn_pop btn_downloadQB2' onclick='api.report(\"BROWSER.ACTIVITY.JIANLING.QBDOWNLOADCLICK_POP\")'>下载最新版QQ浏览器</a>\
                </div>";
        return html;
    },
    7 : function(k){
        var _css = '';
        if(k){
            _css = 'font-weight:bold';
        }
        html = "<div class='txtCenter'>\
                    <p style='padding-top: 15px;"+ _css +"'>您的QQ浏览器版本不符合要求</p>\
                    <p>请点击下载最新版的QQ浏览器来参加活动</p>\
                    <p style='padding-bottom: 5px;'>若您是首次安装的QQ浏览器，请于48小时之后前来领取。</p>\
                </div>\
                <div class='P_btns'>\
                    <a href='http://dldir1.qq.com/invc/tt/QQBrowser_Setup_Jianling.exe' class='btn_pop btn_downloadQB2' onclick='api.report(\"BROWSER.ACTIVITY.JIANLING.QBDOWNLOADCLICK_POP2\")'>下载最新版QQ浏览器</a>\
                </div>";
        return html;
    },
    0 : function(name){
        html = "<div class='txtCenter'>\
                    <p style='padding-top: 35px; padding-bottom: 15px;'>恭喜您砸中了"+ name +"！</p>\
                </div>\
                <div class='P_btns'>\
                    <a href='javascript:;' class='btn_pop' onclick='dialog.hide();'>确 定</a>\
                </div>";
        return html;
    },
    1 : function(name){
        html = "<div class='txtCenter'>\
                    <p style='padding-top: 35px; padding-bottom: 15px;'>恭喜您抽中了"+ name +"！</p>\
                </div>\
                <div class='P_btns'>\
                    <a href='javascript:;' class='btn_pop' onclick='dialog.hide();'>确 定</a>\
                </div>";
        return html;
    },
    2 : function (tip) {
        html = "<div class='txtCenter'>\
                    "+ tip +"\
                </div>";
        return html;
    },
    10 : function(tip){
        html = "<div class='txtCenter'>\
                    <p style='padding-top: 35px; padding-bottom: 15px;'>"+ tip +"</p>\
                </div>\
                <div class='P_btns'>\
                    <a href='javascript:;' class='btn_pop' onclick='dialog.hide();'>确 定</a>\
                </div>";
        return html;
    }
};


//设置抽奖次数
function setMoney(m){
    var me = jQuery('#money');
    var meVal = parseInt(me.text());
    var k = 0;
    if(parseInt(m) < 0) {
        k = meVal + parseInt(m);
    } else if (m === '++') {
        k = meVal + 1;
    } else if (m === '--') {
        k = meVal - 1;
    } else if(!isNaN(m)) {
        if(m.toString().indexOf('-') >= 0 || m.toString().indexOf('+') >= 0) {
            k = meVal + parseInt(m);
        } else {
            k = m;
        }
    }
    if(k < 0){
        k = 0;
    }
    me.text(k);
}


(function(window,$) {
    Page = qv.zero.extend(qv.zero.AbstractPage,{
        userJsonID : 114205,
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
                game: 'bns'
            });
            page.queryTicket(); //查询礼券数
            qq.login.bind('login',function(){
                page.queryTicket(); //查询礼券数
            });
            qq.login.bind('logout',function(){
                setMoney('0');
            });
        },
        //查询砸蛋次数
        queryTicket: function () {
            zHttp.send({'actid': 114318}, function (res) {
                if(res.ret == 0) {
                    var m = parseInt(res.data.op);
                    setMoney(m);
                }
                var sysTime = res.time*1000;
                setHotBar(sysTime);
            });
        },
        exchange: function(e,act){
            if(act[1] == 'true') {
                if(!api.isQQBrowser()){
                    dialog.alert(tips['8']());
                    return;
                }
            }
            if(qb_guid) {
                getGuid();
            }
            var index = act[0],
                idArr = [114307,114308,114309,114310,114311],//浏览器、新手、新手特权、回归、回归特权
                actid = idArr[index];
            zUtil.ensureLogin(function () {
                page.svr.show({
                    send: function (args, callb) {
                        zHttp.send({'actid': actid, area: args.area, roleid: args.roleid, guid: qb_guid}, function (res) {
                            if (res.ret == 0) {
                                var name = res.data.actname;
                                dialog.alert(tips['10']('恭喜您成功领取了' + name));
                            } else if (res.ret == 40043) {
                                dialog.alert(tips['7']());
                                zHttp.send({'actid':116553});
                            } else if (res.ret == 60513) {
                                dialog.alert(tips['10']('您已达到每台电脑QQ浏览器的领取上限，感谢您的关注！'));
                            } else if (res.ret == 10002) {
                                qq.login.open();
                            } else if (res.ret == 10001 || res.ret == 10004) {
                                dialog.alert(tips['9']());
                            } else {
                                dialog.alert(tips['10'](getAmsMsg(res)));
                            }
                        });
                    }
                });
                if( index == 0) {
                    api.report("BROWSER.ACTIVITY.JIANLING.TEQUANGIFTSCLICK");
                } else if ( index == 1) {
                    api.report("BROWSER.ACTIVITY.JIANLING.XINSHOUGIFTSCLICK");
                } else if ( index == 2) {
                    api.report("BROWSER.ACTIVITY.JIANLING.XINSHOUTEQUANGIFTSCLICK");
                } else if ( index == 3) {
                    api.report("BROWSER.ACTIVITY.JIANLING.HUIGUIGIFTSCLICK");
                } else if ( index == 4) {
                    api.report("BROWSER.ACTIVITY.JIANLING.HUIGUITEQUANGIFTSCLICK");
                }
            });
        },
        addTicket: function (e,act) {
            if(!api.isQQBrowser()){
                dialog.alert(tips['8']());
                return;
            }
            zUtil.ensureLogin(function () {
                page.svr.show({
                    send: function (args, callb) {
                        zHttp.send({'actid': 114313, area: args.area, roleid: args.roleid}, function (res) {
                            if (res.ret == 0) {
                                setMoney('++');
                                dialog.alert(tips['10'](getAmsMsg(res)));
                            } else if (res.ret == 10002) {
                                qq.login.open();
                            }  else if (res.ret == 10001 || res.ret == 10004) {
                                dialog.alert(tips['9']());
                            } else {
                                dialog.alert(tips['10'](getAmsMsg(res)));
                            }
                        });
                    }
                });
                api.report("BROWSER.ACTIVITY.JIANLING.ADDTICKET");
            });
        },
        shareQZ: function(){ //分享到空间
            zUtil.ensureLogin(function() {
                var p = {
                    url:  _pageUrl + "?ADTAG=share&pvsrc=share",
                    showcount: '1', /*是否显示分享总数,显示：'1'，不显示：'0' */
                    desc: '', /*默认分享理由(可选)*/
                    summary: '亲爱的灵芝，你的好友邀请您一起领取烛魔真气，限时领取', /*分享摘要(可选)*/
                    title: '剑灵限时活动', /*分享标题(可选)*/
                    site: 'QQ浏览器特权中心', /*分享来源 如：腾讯网(可选)*/
                    pics: 'http://stdl.qq.com/stdl/game/pic/jianling_share.jpg', /*分享图片的路径(可选)*/
                    style: '203',
                    width: 98,
                    height: 22
                };
                var s = [];
                for (var i in p) {
                    s.push(i + '=' + encodeURIComponent(p[i] || ''));
                }
                var _url = 'http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?' + s.join('&');
                var winW = jQuery(window).width();
                var winT = jQuery(window).scrollTop();
                if (winW < 960) {
                    jQuery('.friend_pop').css({"position": "absolute", "top": winT + "px"});
                }
                zHttp.send({'actid': 114314}, function (res) {
                    if (res.ret == 0) {
                        setMoney('++');
                        dialog.alert(tips['10'](getAmsMsg(res)));
                    }
                });
                jQuery('.mod_pop_mask').show();
                jQuery('.friend_pop').show();
                jQuery('#txifr').attr('src', _url);
                jQuery('#friend_close').click(function () {
                    jQuery('.mod_pop_mask').hide();
                    jQuery('.friend_pop').hide();
                });
            });
            api.report('BROWSER.ACTIVITY.JIANLING.SHAREQZCLICK');
        },
        getLucky: function(index){
            zUtil.ensureLogin(function(){
                page.svr.show({
                    send: function (args, callb) {
                        // 记录奖品时 必须加字段 _record_gift_flow : 1 ， 若记录末等奖时 再加字段(不记录则不加) _record_def_gift : 1
                        zHttp.send({actid: 114315, _record_gift_flow : 1, _record_def_gift : 1, area: args.area, roleid: args.roleid}, function (res) {
                            if (res.ret == 0){
                                setMoney('--');
                                try{    //转起来
                                    var key = res.data.op.diamonds,
                                        name = res.data.op.name;
                                    if (key >= 1 && key <= 10) {
                                        jQuery('.egg').eq(index).addClass('egg_' + key);
                                        dialog.alert(tips['0'](name));
                                    } else {
                                        dialog.alert(tips['10'](getAmsMsg(res)));
                                    }
                                }
                                catch (e){
                                    dialog.alert(tips['10'](getAmsMsg(res)));
                                }
                            } else if (res.ret == 10002) {
                                qq.login.open();
                            } else if (res.ret == 10001 || res.ret == 10004) {
                                dialog.alert(tips['9']());
                            } else {
                                dialog.alert(tips['10'](getAmsMsg(res)));
                            }
                        });
                    }
                });
                api.report('BROWSER.ACTIVITY.JIANLING.GETLUCKYCLICK');
            });
        },
        getUltimate: function(e,act){
            zUtil.ensureLogin(function(){
                page.svr.show({
                    send: function (args, callb) {
                        // 记录奖品时 必须加字段 _record_gift_flow : 1 ， 若记录末等奖时 再加字段(不记录则不加) _record_def_gift : 1
                        zHttp.send({actid: 114320, area: args.area, roleid: args.roleid}, function (res) {
                            if (res.ret == 0){
                                try{    //转起来
                                    var key = res.data.op.diamonds,
                                        name = res.data.op.name;
                                    if (key >= 1 && key <= 4) {
                                        dialog.alert(tips['1'](name))
                                    } else {
                                        dialog.alert(tips['10'](getAmsMsg(res)));
                                    }
                                }
                                catch (e){
                                    dialog.alert(tips['10'](getAmsMsg(res)));
                                }
                            } else if (res.ret == 10002) {
                                qq.login.open();
                            } else if (res.ret == 10001 || res.ret == 10004) {
                                dialog.alert(tips['9']());
                            } else {
                                dialog.alert(tips['10'](getAmsMsg(res)));
                            }
                        });
                    }
                });
                api.report("BROWSER.ACTIVITY.JIANLING.GETULTIMATEGIFTSCLICK");
            });
        },
        //查询中奖记录
        record: function (temp) {
            zUtil.ensureLogin(function () {
                zHttp.send({actid: 114319}, function (res) {
                    res.ret = 0;
                    if (res.ret == 0) {
                        var records = [];
                        if(temp > 0 && temp <= 21) {
                            var _records = [
                                {val:{actid: 114315, time: 1467734400, name: "高级神圣佩饰箱*1", level: 1, info: ""}},
                                {val:{actid: 114315, time: 1467734400, name: "洪门黑衣（永久）", level: 2, info: ""}},
                                {val:{actid: 114315, time: 1467734400, name: "洪门白衣（永久）", level: 3, info: ""}},
                                {val:{actid: 114315, time: 1467734400, name: "守护石包*1", level: 4, info: ""}},
                                {val:{actid: 114315, time: 1467734400, name: "副本重置石板*1", level: 5, info: ""}},
                                {val:{actid: 114315, time: 1467734400, name: "守护石粉末*2", level: 6, info: ""}},
                                {val:{actid: 114315, time: 1467734400, name: "万年雪莲露*2", level: 7, info: ""}},
                                {val:{actid: 114315, time: 1467734400, name: "月夜花*1", level: 8, info: ""}},
                                {val:{actid: 114315, time: 1467734400, name: "洪门神功快速成长护符*1", level: 9, info: ""}},
                                {val:{actid: 114315, time: 1467734400, name: "幸运秘药*1", level: 10, info: ""}},
                                {val:{actid: 114315, time: 1467734400, name: "幸运秘药*1", level: 10, info: ""}},
                                {val:{actid: 114315, time: 1467734400, name: "幸运秘药*1", level: 10, info: ""}},
                                {val:{actid: 114315, time: 1467734400, name: "幸运秘药*1", level: 10, info: ""}},
                                {val:{actid: 114315, time: 1467734400, name: "幸运秘药*1", level: 10, info: ""}},
                                {val:{actid: 114315, time: 1467734400, name: "幸运秘药*1", level: 10, info: ""}},
                                {val:{actid: 114315, time: 1467734400, name: "幸运秘药*1", level: 10, info: ""}},
                                {val:{actid: 114315, time: 1467734400, name: "幸运秘药*1", level: 10, info: ""}},
                                {val:{actid: 114315, time: 1467734400, name: "幸运秘药*1", level: 10, info: ""}},
                                {val:{actid: 114315, time: 1467734400, name: "幸运秘药*1", level: 10, info: ""}},
                                {val:{actid: 114315, time: 1467734400, name: "幸运秘药*1", level: 10, info: ""}},
                                {val:{actid: 114315, time: 1467734400, name: "幸运秘药*1", level: 10, info: ""}}
                            ];
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
                                actid = obj.actid,
                                time = qv.date.format("Y-m-d", obj.time * 1000),
                                name = obj.name,
                                level = obj.level;
                            _htmlArr.push('<tr><td>'+ time +'</td><td>'+ name +'</td></tr>');
                            PageCount++;
                        }
                        if (PageCount == 0) {
                            _htmlArr.push('<tr><td colspan="4" class="noGifts">您尚未获得任何礼包</td></tr>');
                        }
                        if(PageCount >= 10) {
                            pageAll = parseInt((PageCount + 10 - 1) / 10);
                            pageHtml = '<div class="page"><a href="javascript:;" class="prev_page">上一页</a><span id="number_page">第'+ pageNumber +'/'+  pageAll+'页</span><a href="javascript:;" class="next_page">下一页</a></div>';
                        }
                        _html = '<h2 class="popTit">获奖记录</h2>\
                                <table width="100%" class="giftsLists">\
                                    <thead><tr><th class="first">获得时间</th><th>获得奖励</th></tr></thead>\
                                    <tbody id="giftsCount">'+ _htmlArr.join("") +'</tbody>\
                                </table>' + pageHtml;
                        dialog.alert(tips['2'](_html), 'popRecord');
                        currentPage();
                    } else if (res.ret == 10002) {
                        qq.login.open();
                    } else if (res.ret == 10001 || res.ret == 10004) {
                        dialog.alert(tips['9']());
                    } else {
                        zHttp.showResponse(res, res.actid, $.noop);
                    }
                });
                api.report("BROWSER.ACTIVITY.JIANLING.RECORDCLICK");
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

//tab 切换
function tab(i){
    jQuery('.tab_title span').eq(i).addClass('active').siblings().removeClass('active');
    jQuery('.tab_container .wrap').eq(i).show().siblings().hide();
}


(function(window,$){
    //头尾初始化
    api.initNav("header","footer",{ //对应header footer div的id
        background:"#000",  //footer的背景色，常常需要根据页面设计改变颜色 默认：黑色（可选）
        color:"#fff",  //footer中文字的颜色 默认：白色（可选）
        qblink:"http://dldir1.qq.com/invc/tt/QQBrowser_Setup_Jianling.exe", //下载QB按钮的链接 默认：特权中心QB包（可选）
        report:"api.report('BROWSER.ACTIVITY.JIANLING.QBDOWNLOADCLICK_TOP')", //点击流数据上报（可选）
        isTqHide:false //特权LOGO是否显示（可选）
    });
    //初始化分页
    pageInit();

    jQuery('.tab_title span strong').mouseenter(function () {
        var n = jQuery(this).parent('span').index();
        tab(n);
    });

    //绑定抽奖
    jQuery('.egg').bind('click', function () {
        var index = jQuery(this).index();
        page.getLucky(index);
    });
})(window,jQuery);
