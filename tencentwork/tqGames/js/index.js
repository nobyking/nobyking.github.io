if(typeof console === "undefined"){
    console = { log: function() { } };
}
//AMS新集成
zHttp.baseUrl = "http://iyouxi3.vip.qq.com/ams3.0.php";
//活动地址 不带任何参数
var _pageUrl = location.protocol + '//' + location.host + location.pathname;
//获取AMS系统中设置的提示语
function getAmsMsg(res) {
    var msgCfg = zHttp.getMsgByState( res.data, res.actid, res.ret, $.noop );
    return zMsg.repair( msgCfg.m );
}

function hint(){
    var qb_dialog = new qv.zero.Dialog({
        title: "QQ浏览器用户专享",
        content: "<p>       亲，这是QQ浏览器用户的专属特权活动。</p><p>             用QQ浏览器打开前来参加。</p>",
        type: "alert",
        buttons: [{
            text: "下载QQ浏览器",
            click: function() {
                page.downloadQB();
            }
        }]
    });
    hint = function(){
        qb_dialog.show();
    };
    qb_dialog.show();
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



//填写联系方式
function tempContact(obj) {
    if(obj == undefined){
        obj = {'name':'','phone':'','email':'','address':''}
    }
    var _html = "<div class='userInfo'>\
                    <p><label>姓名</label><input id='user_name' type='text' value='"+ obj.name +"'></p>\
                    <p><label>手机号</label><input id='user_phone' type='text' value='"+ obj.phone +"'></p>\
                    <p><label>电子邮箱</label><input id='user_email' type='text' value='"+ obj.email +"'></p>\
                    <p><label>邮寄地址</label><input id='user_address' type='text' value='"+ obj.address +"'></p>\
                </div>";
    return _html;
}
function setUserContact(){
    api.getUserInfo(function(res){
        var userDialog = new qv.zero.Dialog({
            title: "填写联系方式",
            content: tempContact(res),
            type: "show",
            buttons: [{
                text: "提交",
                click: function() {
                    api.submitUserInfo("user_name","user_phone","user_email","user_address", function(){
                        alert("保存成功！");
                        userDialog.hide();
                    })
                }
            }]
        });
        userDialog.show();
    })
}


//抽奖动画
var index=0,
    prevIndex=0,
    Speed=300,
    Time,
    EndIndex=0,
    cycle=0,
    EndCycle=0,
    flag=false,
    quick= 0,
    circle_box,
    padding_img,
    inGame = false,
    oddClassName=[];
function StartGame(key, cb){
    if(inGame){
        cb();
        return;
    }
    inGame = true;
    var arr_map = [7,13,10,3,15,12,1,4,8,0,2,6,9,11,14,5];
    var arr_len = arr_map.length;
    key = arr_map[key-1];
    index=0;
    prevIndex=0;
    cycle=0;
    Speed=300;
    EndIndex=0;
    quick=0;
    EndCycle=0;
    flag=false;
    EndIndex=Math.floor(Math.random()*arr_len+1);
    circle_box=[];
    for(var i=0; i<arr_len;i++){
        circle_box.push(document.getElementById("lucky-box-"+i));
        if(oddClassName.length  < arr_len){
            oddClassName[i] = circle_box[i].className;
        }
        circle_box[i].className = oddClassName[i];
    }
    EndCycle=1;
    Time = setInterval(_Star(key,cb),Speed);
}
function _Star(key, cb){
    return function(){
        Star(key,cb);
    }
}
function Star(key,cb){
    if(flag==false){
        if(quick==5){
            clearInterval(Time);
            Speed=70;
            Time=setInterval(_Star(key,cb),Speed);
        }

        if((cycle==EndCycle+1) && (index==EndIndex)){
            clearInterval(Time);
            Speed=300;
            flag=true;
            Time=setInterval(_Star(key,cb),Speed);
        }
    }
    if(index >= circle_box.length){
        index=0;
        cycle++;
    }
    if(flag==true && (index==key)){
        quick=0;
        clearInterval(Time);
        setTimeout(function(){
            inGame = false;
            cb();
        },1000);
    }
    if(index>0)
        prevIndex=index-1;
    else{
        prevIndex=circle_box.length-1;
    }
    circle_box[prevIndex].className = oddClassName[prevIndex];
    circle_box[index].className = oddClassName[index] + " active";
    index++;
    quick++;
}


(function(window,$) {
    Page = qv.zero.extend(qv.zero.AbstractPage,{
        userJsonID : 153299,
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
            /*page.svr = new qv.zero.AreaSvrSelector({
                game: 'lol'
            });*/
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
        exchange: function(e,act){
            var index = +(act[0]),
                idArr = [153305,153320,153333,153337,153338,153339,153340,153341,153342,153343,153344,153345,153346],//逆战、神之浩劫、使命召唤、LOL1-10
                actid = idArr[index],
                game = act[1];
            if(!api.isQQBrowser()){
                hint();
                return;
            }
            if(!qb_guid) {
                getGuid();
            }
            zUtil.ensureLogin(function () {
                if(window['svr'] != game) {
                    page.svr = new qv.zero.AreaSvrSelector({
                        game: game
                    });
                    window['svr'] = game;
                }
                page.svr.show({
                    send: function (args, callb) {
                        zHttp.send({'actid': actid, area: args.area, roleid: args.roleid, guid: qb_guid}, function (res) {
                            if (res.ret == 0) {
                                zHttp.showResponse(res, res.actid, $.noop);
                            } else if (res.ret == 10002) {
                                qq.login.open();
                            } else if (res.ret == 10001 || res.ret == 10004) {
                                zMsg.alert("活动已经结束，敬请期待更多QQ浏览器特权活动！");
                            } else {
                                zHttp.showResponse(res, res.actid, $.noop);
                            }
                        });
                    }
                });
                api.report("BROWSER.ACTIVITY.TQGAMES.EXCHANGEGIFTSCLICK_"+index);
            });
        },
        getLucky: function(e,act){
            if(!api.isQQBrowser()){
                hint();
                return;
            }
            if(!qb_guid) {
                getGuid();
            }
            if(inGame) {
                return;
            }
            var game = 'lol';
            zUtil.ensureLogin(function(){
                if(window['svr'] != game) {
                    page.svr = new qv.zero.AreaSvrSelector({
                        game: game
                    });
                    window['svr'] = game;
                }
                page.svr.show({
                    send: function (args, callb) {
                        // 记录奖品时 必须加字段 _record_gift_flow : 1 ， 若记录末等奖时 再加字段(不记录则不加) _record_def_gift : 1
                        zHttp.send({actid: 153356, _record_gift_flow : 1, _record_def_gift : 1, area: args.area, roleid: args.roleid, guid: qb_guid}, function (res) {
                            if (res.ret == 0){
                                try{    //转起来
                                    var key = res.data.op.diamonds;
                                    if (key >= 1 && key <= 16) {
                                        StartGame(key, function () {
                                            zHttp.showResponse(res, res.actid, $.noop);
                                        })
                                    } else {
                                        zHttp.showResponse(res, res.actid, $.noop);
                                    }
                                }
                                catch (e){
                                    zHttp.showResponse(res, res.actid, $.noop);
                                }
                            } else if (res.ret == 10002) {
                                qq.login.open();
                            } else if (res.ret == 10001 || res.ret == 10004) {
                                zMsg.alert("活动已经结束，敬请期待更多QQ浏览器特权活动！");
                            } else {
                                zHttp.showResponse(res, res.actid, $.noop);
                            }
                        });
                    }
                });
                api.report('BROWSER.ACTIVITY.TQGAMES.GETLUCKYCLICK');
            });
        },
        //查询中奖记录
        queryRecord: function (temp) {
            zUtil.ensureLogin(function () {
                zHttp.send({actid: 153357}, function (res) {
                    if (res.ret == 0) {
                        var records = res.data.op;
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
                                cdkey = '-',
                                btn = '';
                            if(actid == 153305) {
                                btn = '<a href="http://nz.qq.com/web201606/cdkey.shtml" target="_blank">兑换</a>';
                                cdkey = obj.info;
                            } else if(actid == 153333){
                                btn = '<a href="http://codol.qq.com/web201507/pages/cdkey.shtml" target="_blank">兑换</a>';
                                cdkey = obj.info;
                            }
                            if(level >= 1 && level <= 5) {
                                btn = '<a href="javascript:;" onclick="setUserContact();">填写联系方式</a>';
                            }
                            _htmlArr.push('<tr><td>'+ time +'</td><td>'+ name +'</td><td>'+ cdkey +'</td><td>'+ btn +'</td></tr>');
                            PageCount++;
                        }
                        if (PageCount == 0) {
                            _htmlArr.push('<tr><td colspan="4" class="noGifts">您尚未获得任何礼包</td></tr>');
                        }
                        _html = '<table width="100%" class="giftsLists">\
                                    <thead><tr><th>获得时间</th><th>礼包名称</th><th>礼包详情</th><th>操作</th></tr></thead>\
                                    <tbody id="giftsContainer">'+ _htmlArr.join('') +'</tbody>\
                                </table>';
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
                    } else if (res.ret == 10002) {
                        qq.login.open();
                    } else if (res.ret == 10001 || res.ret == 10004) {
                        zMsg.alert("活动已经结束，敬请期待更多QQ浏览器特权活动！");
                    } else {
                        zHttp.showResponse(res, res.actid, $.noop);
                    }
                });
                api.report("BROWSER.ACTIVITY.TQGAMES.QUERYRECORDCLICK");
            });
        }
    });
    window.page = new Page();

})(window,jQuery);


(function(window,$){
    //头尾初始化
    api.initNav("header","footer",{ //对应header footer div的id
        background:"",  //footer的背景色，常常需要根据页面设计改变颜色 默认：黑色（可选）
        color:"#18344c",  //footer中文字的颜色 默认：白色（可选）
        qblink:"https://dldir1.qq.com/invc/tt/QQBrowser_Setup_9.5.9947.400.exe", //下载QB按钮的链接 默认：特权中心QB包（可选）
        report:"BROWSER.ACTIVITY.TQGAMES.QBDOWNLOADCLICK_TOP", //点击流数据上报（可选）
        isTqHide:false //特权LOGO是否显示（可选）
    });
    api.initUserInfo('user_phone');

    var hash = location.hash,
        keyword = '';
    if(/^#/.test(hash)) {
        keyword = hash.slice(1,4);
    }
    if(keyword == 'lol') {
        $('html,body').stop(true,false).animate({
            scrollTop: 2930
        }, 500);

    }
})(window,jQuery);
