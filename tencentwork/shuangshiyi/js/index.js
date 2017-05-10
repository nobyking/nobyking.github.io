if(typeof console === "undefined"){
    console = { log: function() { } };
}
var isTest = false;
//活动地址 不带任何参数
var _pageUrl = location.protocol + '//' + location.host + location.pathname;
//获取AMS系统中设置的提示语
function getAmsMsg(res) {
    var msgCfg = zHttp.getMsgByState( res.data, res.actid, res.ret, $.noop );
    return zMsg.repair( msgCfg.m );
}
var isLucky = false;
var activityJoins = {
    140622: 0,
    140623: 0,
    140624: 0,
    140625: 0,
    140626: 0,
    140627: 0,
    140628: 0,
    140629: 0,
    140630: 0,
    140631: 0
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

//生成桌面快捷方式图标
function generated(cb){
    try{
        chrome.runtime.sendMessage("hbkoccppnblkmobdjagebolnebjiajig", {
            msg: "addOnlineDesktopShellLink",
            shellLinkName: "天猫狂欢节.lnk",
            type: 10,
            linkArgument: "http://s.click.taobao.com/LvZ9XPx",
            shellLinkImageUrl: "http://stdl.qq.com/stdl/activity/shuangshiyi/shuangshiyi.ico",
            ignoreDeletedBehavior: true
        }, function(response) {
            cb && cb(response);
        })
    }catch(e){
        //
    }
}


//设置参与活动日程函数
function setCalendar(date, joins) {
    var day = qv.date.format('md', date);
    var activity = joins ? joins : activityJoins;
    var demo = jQuery('[data-actid]');
    var demoToday = jQuery('[data-day="'+ day +'"]');
    var todayActid = demoToday.data('actid');
    var thisDemo, thisDemoDay, thisDemoActid;
    var joinCount = 0, count = 0;
    var showNum = [0,0,1,1,1,3,3,3,9,9];
    //初始化dome样式
    demo.removeClass('active finish expired noReach');
    demo.find('.type').removeClass('lucky').children().remove();
    //根据当天日期来设置领取红包的actid
    var _id = demoToday.index();
    var id = _id < 0 ? 0 : _id;
    jQuery('#getRedPacket').attr('onclick','page.exchange('+ id +')');
    jQuery('#todayDate').removeClass().addClass('date_' + (id + 1));
    //判断是否已领、当天是否是可领取
    for(var i in activity) {
        if(activity[i] == 1) {
            joinCount++;
            jQuery('[data-actid="'+ i +'"]').addClass('finish');
        }
    }

    //如果当天没参与，移除finish expired, 添加active
    if(activity[todayActid] != 1) {
        demoToday.removeClass('finish expired').addClass('active');
        //参与天数小于2天，给当天的添加
        if(joinCount < 2) {
            demoToday.addClass('noReach');
        }
    }

    //判断过期和设置非过期抽奖的次数
    for(var i = 0; i < demo.length; i++) {
        //判断是否过期,是 移除finish active, 添加expired
        thisDemo = demo.eq(i);
        thisDemoDay = thisDemo.data('day');
        thisDemoActid = thisDemo.data('actid');
        if(thisDemoDay < day && activity[thisDemoActid] == 0) {
            thisDemo.removeClass('finish active').addClass('expired');
        }
        //根据过期的来显示其余可抽奖的次数
        if(!thisDemo.hasClass('expired')) {
            if(showNum[count] > 0) {
                thisDemo.find('.type').addClass('lucky').html('<span class="num num_'+ showNum[count] +'" data-count="'+ showNum[count] +'"></span>');
            }
            count++;
        }
    }
}

//填写、提交联系方式
function writeAddress() {
    api.getUserInfo(function(res) {
        dialog.show(tips['5'](res),'popUserInfo',true)
    })
}
function PostUserContact() {
    api.submitUserInfo("user_name","user_phone","user_email","user_address", function(){
        alert("保存成功！我们将在活动结束后15天内将奖品发出，请保持手机通畅。");
        dialog.hide();
    })
}

//分享
function share(type,cb) {
    var summary = '#领1111元大红包，还可抽iPhone7 plus#我刚刚在双11大作战中抽到了3个天猫双11主会场通用红包！！！还有好多大红包没有抽到，快来参加吧！';
    var title = '双11大作战 1111红包任你抢';
    var pic = 'http://stdl.qq.com/stdl/activity/shuangshiyi/images/share.png';
    var shareUrl = '';
    if(type == 'qq') {
        summary = '我刚刚在双11大作战中领到了1111元大红包，今年不用剁手啦！啦啦啦~别怪我没告诉你哟，快来领吧~';
    }
    switch (type) {
        case 'qq' :
            var p = {
                url: _pageUrl+'?ADTAG=shareQQ&pvsrc=shareQQ', /*获取URL，可加上来自分享到QQ标识，方便统计*/
                desc: summary, /*分享理由(风格应模拟用户对话),支持多分享语随机展现（使用|分隔）*/
                title: title, /*分享标题(可选)*/
                summary: summary, /*分享摘要(可选)*/
                pics: pic, /*分享图片(可选)*/
                flash: '', /*视频地址(可选)*/
                site: 'QQ浏览器特权中心', /*分享来源(可选) 如：QQ分享*/
                style: '101',
                width: 96,
                height: 24
            };
            var s = [];
            for(var i in p){
                s.push(i + '=' + encodeURIComponent(p[i]||''));
            }
            shareUrl = 'http://connect.qq.com/widget/shareqq/index.html?' + s.join('&');
            break;
        case 'qz' :
            var p = {
                url:  _pageUrl+'?ADTAG=shareQz&pvsrc=shareQz',
                showcount: '1', /*是否显示分享总数,显示：'1'，不显示：'0' */
                desc: '', /*默认分享理由(可选)*/
                summary: summary, /*分享摘要(可选)*/
                title: title, /*分享标题(可选)*/
                site: 'QQ浏览器特权中心', /*分享来源 如：腾讯网(可选)*/
                pics: pic, /*分享图片的路径(可选)*/
                style: '203',
                width: 98,
                height: 22
            };
            var s = [];
            for (var i in p) {
                s.push(i + '=' + encodeURIComponent(p[i] || ''));
            }
            shareUrl = 'http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?' + s.join('&');
            break;
        case 'sina' :
            shareUrl = "http://service.weibo.com/share/share.php?"
            +"&title=" + encodeURIComponent(summary)
            +"&pic=" + encodeURIComponent(pic)
            +"&url=" + encodeURIComponent(_pageUrl+'?ADTAG=shareSina&pvsrc=shareSina');
            break;
        default : return;
    }
    window.open(shareUrl);
    cb? cb() : '';

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

//提示语
var PopHtml;
var tips = {
    10 : function(tip){
        PopHtml = '<p style="font-size: 20px; height: 120px; padding-top: 80px; line-height: 35px;">' + tip + '</p>\
                <div class="share">\
                    分享到：<a class="btn_shareQQ" href="javascript:;" onclick="share(\'qq\')">QQ好友</a><a class="btn_shareQzone" href="javascript:;" onclick="share(\'qz\')">QQ空间</a><a class="btn_shareSina" href="javascript:;" onclick="share(\'sina\')">新浪微博</a>\
               </div>';
        return PopHtml;
    },
    9 : function(){
        var temp = '活动已经结束！<br>敬请期待更多QQ浏览器特权活动！';
        PopHtml = '<p style="font-size: 20px; height: 120px; padding-top: 80px; line-height: 35px;">' + temp + '</p>\
                <div class="share">\
                    分享到：<a class="btn_shareQQ" href="javascript:;" onclick="share(\'qq\')">QQ好友</a><a class="btn_shareQzone" href="javascript:;" onclick="share(\'qz\')">QQ空间</a><a class="btn_shareSina" href="javascript:;" onclick="share(\'sina\')">新浪微博</a>\
               </div>';
        return PopHtml;
    },
    6 : function (info) {
        PopHtml = '<div class="titRecord"></div>\
                <div class="giftsListCount">\
                    '+ info +'\
                    <i class="vertical"></i>\
                </div>\
                <div class="tipsText">您好，您的中奖纪录已在后台有详细记录，由于网络故障暂时展示不全；请抽中实物奖品的用户<a href="javascript:;" onclick="writeAddress()">填写联系方式</a>，活动结束后15天内我们会尽快安排发放实物奖品及Q币奖品；届时若未收到奖品的用户请到<a href="http://bbs.browser.qq.com/thread-221406-1-1.html" target="_blank">QQ浏览器论坛</a>反馈，信息核实正确我们会尽快补发~对您造成的困扰我们深表歉意</div>\
                <div class="share">\
                    分享到：<a class="btn_shareQQ" href="javascript:;" onclick="share(\'qq\')">QQ好友</a><a class="btn_shareQzone" href="javascript:;" onclick="share(\'qz\')">QQ空间</a><a class="btn_shareSina" href="javascript:;" onclick="share(\'sina\')">新浪微博</a>\
               </div>';
        return PopHtml;
    },
    5 : function (obj) {
        if(obj == undefined){
            obj = {'name':'','phone':'','email':'','address':''};
        }
        PopHtml = '<div class="userInfo">\
                    <p><label>姓名</label><input id="user_name" type="text" value="'+ obj.name +'"></p>\
                    <p><label>手机号</label><input id="user_phone" type="text" value="'+ obj.phone +'"></p>\
                    <p><label>电子邮箱</label><input id="user_email" type="text" value="'+ obj.email +'"></p>\
                    <p><label>邮寄地址</label><input id="user_address" type="text" value="'+ obj.address +'"></p>\
                </div>\
                <div class="P_btns">\
                    <a href="javascript:;" class="btn btn_submit" onclick="PostUserContact()"><span>确认提交</span></a>\
                </div>\
                <div class="share">\
                    分享到：<a class="btn_shareQQ" href="javascript:;" onclick="share(\'qq\')">QQ好友</a><a class="btn_shareQzone" href="javascript:;" onclick="share(\'qz\')">QQ空间</a><a class="btn_shareSina" href="javascript:;" onclick="share(\'sina\')">新浪微博</a>\
               </div>';
        return PopHtml;
    },
    0 : function(k){
        var share = '<div class="share">\
                分享到：<a class="btn_shareQQ" href="javascript:;" onclick="share(\'qq\')">QQ好友</a><a class="btn_shareQzone" href="javascript:;" onclick="share(\'qz\')">QQ空间</a><a class="btn_shareSina" href="javascript:;" onclick="share(\'sina\')">新浪微博</a>\
               </div>';
        if(k < 9 && k >= 0) {
            var key = k;
            var name = ['iPhone7 plus一个','器哥公仔一个', '18岁QQ公仔一个','时尚背包一个', '车载冷暖箱一个','喷雾运动水杯一个', '时尚抱枕一个', '5个Q币', '2个Q币'];
            var img = ['sj','qg','gz','sbao','bx','sbei','bz','qb5','qb2'];
            var address = '';
            if(key < 6) {
                address = '<p class="addressTips">请 <a href="javascript:;" onclick="writeAddress();">填写联系方式</a> 我们将在活动结束后15天内将奖品发出</p>';
            }
            PopHtml = '<div class="showGifts">\
                <div class="giftsPic"><img src="http://stdl.qq.com/stdl/activity/shuangshiyi/images/gifts_'+ img[key] +'.png" width="240" height="280"></div>\
                <div class="giftsName">\
                    <h2>恭喜你，获得'+ name[key] +'！</h2>\
                    '+ address +'\
                </div>\
            </div>'+ share;
        } else {
            PopHtml = '<div class="noneLucky">\
                    <div class="tryAgain">\
                        <a class="btn btn_again" href="javascript:;" onclick="dialog.hide();">再来一次</a>\
                    </div>\
               </div>'+ share +'';
        }
        return PopHtml;
    }
};

(function(window,$) {
    Page = qv.zero.extend(qv.zero.AbstractPage,{
        userJsonID : 140616,
        //preloads : ['AreaSvrSelector'],
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
            /*page.svr = new qv.zero.AreaSvrSelector({
                game: ''
            });    */
            if(!!qq.login.getUin()){
                page.queryActid();
                page.queryMoney();
            }
            qq.login.bind('login',function(){
                page.queryActid();
                page.queryMoney();
            });
            qq.login.bind('logout',function(){
                activityJoins = {
                    140622: 0,
                    140623: 0,
                    140624: 0,
                    140625: 0,
                    140626: 0,
                    140627: 0,
                    140628: 0,
                    140629: 0,
                    140630: 0,
                    140631: 0
                };
                var date = new Date().getTime();
                setCalendar(date, activityJoins);
                setMoney(0);
            });
        },
        //查询领取红包的详情
        queryActid: function () {
            zHttp.send({'actid': 140632}, function (res) {
                if(res.ret == 0) {
                    activityJoins = res.data.op.join;
                    var date = isTest ? new Date().getTime() : res.time*1000;
                    setCalendar(date, activityJoins);
                }
            });
        },
        //查询活动货币
        queryMoney: function () {
            zHttp.send({'actid': 140634}, function (res) {
                if(res.ret == 0) {
                    var m = res.data.op;
                    setMoney(m);
                }
            });
        },
        //添加活动货币
        addMoney: function (actid) {
            zHttp.send({'actid': 140633}, function (res) {
                if(res.ret == 0) {
                    //添加对应的货币数
                    var m = $('[data-actid="'+ actid +'"]').find('.num').data('count');
                    setMoney('+' + m);
                }
            });
        },
        exchange: function(index){
            var idArr = [140622,140623,140624,140625,140626,140627,140628,140629,140630,140631],//1,2,3,4,5,6,7,8,9,10
                actid = idArr[index];
            zUtil.ensureLogin(function () {
                zHttp.send({'actid': actid}, function (res) {
                    if (res.ret == 0) {
                        generated();
                        document.getElementById('packetHref').click();
                        var date = isTest ? new Date().getTime() : res.time*1000;
                        activityJoins[actid] = 1;
                        setCalendar(date, activityJoins);
                        page.addMoney(actid);
                    } else if (res.ret == 10002) {
                        qq.login.open();
                    } else if (res.ret == 10001 || res.ret == 10004) {
                        dialog.show(tips['9']());
                    }
                });
                api.report("BROWSER.ACTIVITY.SHUANGSHIYI_16.REDPACKET" + index);
            });
        },
        getLucky: function(e,act){
            if(isLucky) return;
            isLucky = true;
            zUtil.ensureLogin(function () {
                if(api.isQQBrowser()) {
                    zHttp.send({'actid': 142630});
                }
                zHttp.send({'actid': 140635, _record_gift_flow : 1, _record_def_gift : 1}, function (res) {
                    isLucky = false;
                    if (res.ret == 0) {
                        setMoney('--');
                        var key = res.data.op.diamonds;
                        dialog.show(tips['0'](key));
                    } else if (res.ret == 20801) {
                        dialog.show(tips['10']('亲，您没有抽奖机会了！'));
                    } else if (res.ret == 10002) {
                        qq.login.open();
                    } else if (res.ret == 10001 || res.ret == 10004) {
                        dialog.show(tips['9']());
                    } else {
                        dialog.show(tips['10'](getAmsMsg(res)));
                    }
                });
                api.report("BROWSER.ACTIVITY.SHUANGSHIYI_16.GETLUCKYCLICK");
            });
        },
        //查询中奖记录
        queryRecord: function (temp) {
            zUtil.ensureLogin(function () {
                zHttp.send({actid: 140690}, function (res) {
                    if (res.ret == 0) {
                        var records = [];
                        if(temp > 0 && temp <= 8) {
                            var _records = [
                                {val:{actid: 140635, time: 1477627000, name: "5Q币", level: 7, info: ""}},
                                {val:{actid: 140635, time: 1477627000, name: "2Q币", level: 8, info: ""}},
                                {val:{actid: 140635, time: 1477627000, name: "iPhone7 plus", level: 0, info: ""}},
                                {val:{actid: 140635, time: 1477627000, name: "器哥公仔", level: 1, info: ""}},
                                {val:{actid: 140635, time: 1477627000, name: "18岁QQ公仔", level: 2, info: ""}},
                                {val:{actid: 140635, time: 1477627000, name: "时尚背包", level: 3, info: ""}},
                                {val:{actid: 140635, time: 1477627000, name: "车载冷暖箱", level: 4, info: ""}},
                                {val:{actid: 140635, time: 1477627000, name: "喷雾运动水杯", level: 5, info: ""}},
                                {val:{actid: 140635, time: 1477627000, name: "时尚抱枕", level: 6, info: ""}}
                            ];
                            for(var i = 0; i < temp; i++) {
                                records[i] = _records[i];
                            }
                        } else {
                            records = res.data.op;
                        }
                        var _htmlArr = [],
                            _html = '',
                            _class = '',
                            PageCount = 0,
                            flag = false;
                        for (var i = records.length-1; i >= 0; i--) {
                            var obj = records[i].val,
                                actid = obj.actid,
                                time = qv.date.format("Y-m-d", obj.time * 1000),
                                name = obj.name,
                                level = obj.level,
                                btn = '';
                            if(level != 9) {
                                if(level <= 6 && !flag) {
                                    flag = true;
                                    _htmlArr.push('<li class="btn_write"><a href="javascript:;" onclick="writeAddress();">填写联系方式</a></li>');
                                }
                                _htmlArr.push('<li>'+ time +'&nbsp;&nbsp;'+ name +'</li>');
                                PageCount++;
                            }
                        }
                        if (PageCount == 0) {
                            _htmlArr.push('<li class="noGifts">您尚未获得任何礼包</li>');
                        }
                        if(flag) {
                            _class = 'hasKind';
                        }
                        _html = '<ul class="giftsList '+ _class +'">'+ _htmlArr.join('') +'</ul>';
                        dialog.show(tips['6'](_html));
                    } else if (res.ret == 10002) {
                        qq.login.open();
                    } else if (res.ret == 10001 || res.ret == 10004) {
                        zMsg.alert("活动已经结束，敬请期待更多QQ浏览器特权活动！");
                    } else {
                        zHttp.showResponse(res, res.actid, $.noop);
                    }
                });
                api.report("BROWSER.ACTIVITY.SHUANGSHIYI_16.QUERYRECORDCLICK");
            });
        }
    });
    window.page = new Page();

})(window,jQuery);


(function(window,$){
    //头尾初始化
    api.initNav("header","footer",{ //对应header footer div的id
        background:"#000",  //footer的背景色，常常需要根据页面设计改变颜色 默认：黑色（可选）
        color:"#fff",  //footer中文字的颜色 默认：白色（可选）
        qblink:"https://dldir1.qq.com/invc/tt/QQBrowser_Setup_9.5.9507.400.exe", //下载QB按钮的链接 默认：特权中心QB包（可选）
        report:"BROWSER.ACTIVITY.SHUANGSHIYI_16.DOWNLOADQBCLICK", //点击流数据上报（可选）
        isTqHide:false //特权LOGO是否显示（可选）
    });
    //填写联系方式的效果
    api.initUserInfo('user_phone');
    //领取红包日历初始化
    var date = new Date().getTime();
    setCalendar(date, activityJoins);
    //内部清单
    $('.middle_4').hide();
    //$('#downList').attr('href','###111');

})(window,jQuery);
