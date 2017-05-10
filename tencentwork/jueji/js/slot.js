;(function(window,$){
//活动地址 不带任何参数
    var _pageUrl = location.protocol + '//' + location.host + location.pathname;
    var qb_guid = 0;
    function getGuid(cb){
        try{
            qb_guid =  window.external.getGuid().split("-").join("");
            cb && cb();
        }catch(e){

            var web_page_extension_id = '{A3C609B3-3E61-4508-8953-117B7286068B}';
            var platform_extension_id = '{420DEFEE-20A8-468C-BFDA-61A09A99325D}';
            var extension;
            try {
                extension = window.getExtension(web_page_extension_id);
                extension.sendMessage(platform_extension_id, {serviceId: "hardware.getGuid", args: []}, function (data) {
                    data[0] ? qb_guid =  data[0].split("-").join("") : qb_guid = "";
                    cb && cb();
                });
            }catch(e){
                cb && cb();
            }

        }
    }
    getGuid();

//获取AMS系统中设置的提示语
    function getAmsMsg(res) {
        var msgCfg = zHttp.getMsgByState( res.data, res.actid, res.ret, $.noop );
        return zMsg.repair( msgCfg.m );
    }

    //读取cookie支持信息
    function setHeart() {
        var uin = qq.login.getUin();
        var cookieRecord = qv.cookie.get('actor_' + uin) || 'null|';
        var recordArr = cookieRecord.split('|');
        for(var i = 1; i < recordArr.length; i++) {
            $('[data-heartid="'+ recordArr[i] +'"]').addClass('active');
        }
    }
    function clearHeart(){
        $('.actor .icon-heart').removeClass('active');
    }

    //设置支持票数信息
    function setVoteDetail(arr){
        var dmo = $('.actor .val');
        for(var i = 0; i< arr.length; i++) {
            dmo.eq(i).text(arr[i]);
        }
        setHeart();
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
            popBox.innerHTML = '<div class="popTop"></div><div class="popWrap"><a href="javascript:void(0);" class="popClose" onclick="QB_JUEJI.dialog.hide()" title="关闭"></a><div class="popContainer">'+ content +'</div></div><div class="popBottom"></div>';
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
    var html;
    var tips = {
        9 : function(){
            html = '<div class="popTips txtCenter">\
                    <p>活动已经结束！</p>\
                    <p>敬请期待更多QQ浏览器特权活动！</p>\
                </div>\
                <div class="P_btns">\
                    <a href="javascript:;" class="btn btn_pop" onclick="QB_JUEJI.dialog.hide();">确定</a>\
                </div>';
            return html;
        },
        8 : function(){
            html = '<div class="popTips txtCenter">\
                    <p>亲，这是QQ浏览器的专属活动</p>\
                    <p style="font-size: 14px;">请用QQ浏览器参加哦，如果还未安装，请点击下载安装</p>\
                </div>\
                <div class="P_btns">\
                    <a href="http://dldir1.qq.com/invc/tt/QQBrowser_Setup_9.5.9244.400.exe" class="btn btn_downloadQB" onclick="api.report(\'BROWSER.ACTIVITY.JUEJI.DOWNLOADQBCLICK\')">下载QQ浏览器</a>\
                </div>';
            return html;
        },
        7 : function(){
            html = '<div class="popTips txtCenter">\
                    <p style="margin-top: -10px;">您的QQ浏览器版本过低</p>\
                    <p style="font-size: 16px; line-height: 20px;">请下载安装最新版的QQ浏览器前来换肤</p>\
                </div>\
                <div class="P_btns">\
                    <a href="http://dldir1.qq.com/invc/tt/QQBrowser_Setup_9.5.9244.400.exe" class="btn btn_downloadQB" onclick="api.report(\'BROWSER.ACTIVITY.JUEJI.DOWNLOADQBCLICK\')">下载QQ浏览器</a>\
                </div>';
            return html;
        },
        0 : function(key,cdkey){
            if(key == 1) {
                html = '<div class="popContent giftsCenter">\
                        <div class="gifts_cont gifts_cdk">\
                            <h3>恭喜您<br>获得《爵迹》电影票一张</h3>\
                            <p>兑换码：'+ cdkey +'</p>\
                        </div>\
                        <div class="gifts_tips">\
                            <h5>兑换码使用规则：</h5>\
                            <p>格瓦拉《爵迹》单片兑换码，可在2016年10月16日前在格瓦拉官网或手机APP兑换不高于80元的《爵迹》电影票（VIP厅、IMAX等特效厅及格瓦拉网站声明的特殊场次不可兑换），每个格瓦拉账户限用6张。如有操作问题，可拨打客服电话10101068。</p>\
                        </div>\
                    </div>';
            } else if(key == 2) {
                html = '<div class="popContent giftsCenter">\
                        <div class="gifts_cont gifts_code">\
                            <h3>恭喜您<br>获得《爵迹》电影红包一个</h3>\
                            <p class="code"><img src="http://stdl.qq.com/stdl/activity/jueji/images/QRcode-wp.png" width="144" height="144"></p>\
                            <p class="text">微信扫码领取</p>\
                        </div>\
                        <div class="gifts_tips">\
                            <h5>红包使用规则：</h5>\
                            <p>1、红包限微信电影票使用，不限影院，不限城市， 仅限爵迹影片</p>\
                            <p>2、红包仅用于在线选座购票影院，每个订单限用一张</p>\
                            <p>3、红包不可以转赠、分享并不能与影院其他优惠同时使用</p>\
                            <p>4、红包效期为：动态有效期从领取日起30天内有效</p>\
                            <p>5、10元红包限购买25元以上的影票使用</p>\
                            <p>6、活动期间每个用户只能领取一次红包</p>\
                        </div>\
                    </div>';
            } else {
                html = '<div class="popTips txtCenter">\
                    <p>啊哦，手滑了，差一点就抽中了</p>\
                </div>\
                <div class="P_btns">\
                    <a href="javascript:;" class="btn btn_pop" onclick="QB_JUEJI.dialog.hide();">确定</a>\
                </div>';
            }
            return html;
        },
        5 : function(){
            html = '<div class="popContent giftsCenter">\
                        <div class="gifts_cont gifts_code">\
                            <h3>《爵迹》电影红包</h3>\
                            <p class="code"><img src="http://stdl.qq.com/stdl/activity/jueji/images/QRcode-wp.png" width="144" height="144"></p>\
                            <p class="text">微信扫码领取</p>\
                        </div>\
                        <div class="gifts_tips">\
                            <h5>红包使用规则：</h5>\
                            <p>1、红包限微信电影票使用，不限影院，不限城市， 仅限爵迹影片</p>\
                            <p>2、红包仅用于在线选座购票影院，每个订单限用一张</p>\
                            <p>3、红包不可以转赠、分享并不能与影院其他优惠同时使用</p>\
                            <p>4、红包效期为：动态有效期从领取日起30天内有效</p>\
                            <p>5、10元红包限购买25元以上的影票使用</p>\
                            <p>6、活动期间每个用户只能领取一次红包</p>\
                        </div>\
                    </div>';
            return html;
        },
        6 : function(cdkey){
            html = '<div class="popContent giftsCenter">\
                        <div class="gifts_cont gifts_cdk">\
                            <h3>《爵迹》电影票</h3>\
                            <p>兑换码：'+ cdkey +'</p>\
                        </div>\
                        <div class="gifts_tips">\
                            <h5>兑换码使用规则：</h5>\
                            <p>格瓦拉《爵迹》单片兑换券，可在2016年10月16日前在格瓦拉官网或手机APP兑换不高于80元的《爵迹》电影票（VIP厅、IMAX等特效厅及格瓦拉网站声明的特殊场次不可兑换），每个格瓦拉账户限用6张。如有操作问题，可拨打客服电话10101068。</p>\
                        </div>\
                    </div>';
            return html;
        },
        1 : function(){
            html = '<div class="popTips txtCenter">\
                    <p>您当前还没有抽奖机会</p>\
                    <p style="font-size: 15px;">支持喜欢的角色可以获得一次抽奖机会，每天限三次。</p>\
                </div>\
                <div class="P_btns">\
                    <a href="javascript:;" class="btn btn_pop" onclick="QB_JUEJI.dialog.hide();">确定</a>\
                </div>';
            return html;
        },
        2 : function (info) {
            html = '<div class="popContent giftsListContent">'+ info +'</div>';
            return html;
        },
        3 : function(title){
            html = '<div class="popTips txtCenter">\
                    <p>您已为“'+ title +'”增加一点人气<br>恭喜您获得一次抽奖机会！</p>\
                </div>\
                <div class="P_btns hasMoney">\
                    <a href="javascript:;" class="btn btn_toLucky" onclick="QB_JUEJI.dialog.hide();window.scroll(0,2150);api.report(\'BROWSER.ACTIVITY.JUEJI.TOLUCKYCLICK\');">去抽奖</a>\
                </div>\
                <p>每天每位用户有3次增加人气值机会哦~</p>';
            return html;
        },
        4 : function(){
            html = '<div class="popTips txtCenter">\
                    <p>每天每位用户只能增加三次人气值哦</p>\
                </div>\
                <div class="P_btns hasMoney">\
                    <a href="javascript:;" class="btn btn_pop" onclick="QB_JUEJI.dialog.hide();">确定</a>\
                </div>';
            return html;
        },
        10 : function(tip){
            html = '<div class="popTips txtCenter">\
                    <p>'+tip+'</p>\
                </div>\
                <div class="P_btns">\
                    <a href="javascript:;" class="btn btn_pop" onclick="QB_JUEJI.dialog.hide();">确定</a>\
                </div>';
            return html;
        }
    };
    Page = qv.zero.extend(qv.zero.AbstractPage,{
        userJsonID : 133688,
        preloads : ['AreaSvrSelector'],
        loadExtHandler  : true,
        init : function () {
            Page.superclass.init.apply(this,arguments);
        },
        initEvent : function () {
            Page.superclass.initEvent.apply(this,arguments);
            $('body').on('click','a[href="#"]',function (e) {
                e.preventDefault();
            });
            if(!!qq.login.getUin()) {
                //QB_JUEJI.page.queryMoney();
            }
            qq.login.bind('login', function () {
                //QB_JUEJI.page.queryMoney();
                setHeart();
            });
            qq.login.bind('logout', function () {
                QB_JUEJI.luckyCount = 0;
                clearHeart();
            });
        },
        queryMoney : function () {
            zHttp.send({'actid': 134438}, function (res) {
                if(res.ret == 0) {
                    var m = res.data.op;
                    QB_JUEJI.luckyCount = m;
                }
            })
        },
        vote: function (id, cb) {
            var _id = id;
            var demo = $('.actor-' + _id);
            var title = demo.data('name');
            zUtil.ensureLogin(function () {
                zHttp.send({'actid':134432, vote_uin: _id}, function (res) {
                    if(res.ret == 0) {
                        dialog.show(tips['3'](title));
                        cb ? cb(res.time) : '';
                    } else if(res.ret == 10601) {//达到参与频率
                        dialog.show(tips['4']());
                    } else if(res.ret == 10001 || res.ret == 10004) {
                        dialog.show(tips['9']());
                    } else {
                        dialog.show(tips['10'](getAmsMsg(res)));
                    }
                });
                api.report('BROWSER.ACTIVITY.JUEJI.VOTE_' + _id);
            })
        },
        getVoteNum : function (cb) {
            var allnum = 12,
                uins = '1',
                vsDetail = [],
                number = 0,
                sum = 0;
            for(var i = 2 ; i <= allnum; i++) uins += ('_' + i);
            zHttp.send({_c : 'query',actid:134433,uins: uins},function(res){
                res.ret=0;
                if(res.ret==0){
                    for(var j=1;j<=allnum;j++){
                        number = parseInt(res.data['134432_'+j]);
                        vsDetail[j-1] = number;
                    }
                    setVoteDetail(vsDetail);
                }
            });
        },
        getLucky : function(){
            if(!api.isQQBrowser()){
                // 非QQ浏览器弹框
                dialog.show(tips['8']());
                return;
            }
            zUtil.ensureLogin(function () {
                zHttp.send({'actid':134436, guid: qb_guid},function(res){
                    if(res.ret == 0) {
                        var key = res.data.op.diamonds;
                        var cdkey = res.data.op.cdkey;
                        if(key == 1) {
                            dialog.show(tips['0'](key,cdkey),'pop-lucky');
                        } else if(key == 2) {
                            dialog.show(tips['0'](key,cdkey),'pop-lucky2');
                        } else if(key == 3) {
                            dialog.show(tips['0'](key,cdkey));
                        } else {
                            dialog.show(tips['10'](getAmsMsg(res)));
                        }
                    } else if(res.ret == 20801) {
                        dialog.show(tips['1']());
                    } else if(res.ret == 10002) {
                        qq.login.show();
                    } else if(res.ret == 10001 || res.ret == 10004) {
                        dialog.show(tips['9']());
                    } else {
                        dialog.show(tips['10'](getAmsMsg(res)));
                    }
                });
                api.report('BROWSER.ACTIVITY.JUEJI.GETLUCKYCLICK');
            })
        },
        //查询中奖记录
        record: function () {
            zUtil.ensureLogin(function () {
                zHttp.send({actid: 134437}, function (res) {
                    if (res.ret == 0) {
                        var records = res.data.op;
                        var _htmlArr = [],
                            _html = '',
                            PageCount = 0;
                        for (var i = records.length-1; i >= 0; i--) {
                            var obj = records[i].val,
                                time = qv.date.format("Y-m-d", obj.time * 1000),
                                name = obj.name,
                                level = obj.level,
                                cdkey = obj.info;
                            if (level == 1) {
                                _htmlArr.push('<li>'+ time +'&nbsp;&nbsp;<a href="javascript:;" onclick="QB_JUEJI.dialog.show(QB_JUEJI.tips[\'6\'](\''+ cdkey +'\'),\'pop-lucky\');">'+ name +'</a>&nbsp;&nbsp;兑换码： '+ cdkey +'</li>');
                            } else if (level == 2) {
                                _htmlArr.push('<li>'+ time +'&nbsp;&nbsp;<a href="javascript:;" onclick="QB_JUEJI.dialog.show(QB_JUEJI.tips[\'5\'](),\'pop-lucky2\');">'+ name +'</a></li>');
                            }
                            PageCount++;
                        }
                        if (PageCount == 0) {
                            _htmlArr.push('<li class="noGifts">您尚未获得任何礼包</li>');
                        }
                        _html = '<div class="giftsLists">\
                                    <div class="giftsTit">获奖记录</div>\
                                    <ul id="giftsCount">'+ _htmlArr.join("") +'</ul>\
                                </div>';
                        dialog.show(tips['2'](_html));
                    } else if (res.ret == 10002) {
                        qq.login.open();
                    } else if(res.ret == 10001 || res.ret == 10004) {
                        // 活动结束弹框
                        dialog.show(tips['9']());
                    } else {
                        zHttp.showResponse(res, res.actid, $.noop);
                    }
                });
                api.report("BROWSER.ACTIVITY.JUEJI.QUERYGIFTSCLICK");
            });
        }
    });



    window.QB_JUEJI = window.QB_JUEJI || {};
    window.QB_JUEJI.luckyCount = 0;
    window.QB_JUEJI.page = new Page();
    window.QB_JUEJI.dialog = dialog;
    window.QB_JUEJI.tips = tips;
    window.QB_JUEJI.setHeart = setHeart;

})(window,jQuery);