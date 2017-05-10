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

    //设置支持票数信息
    function setVoteDetail(arr, sum){
        var skinNumber = $('.skin-number'),
            skinBar = $('.skin-bar'),
            rate = 0;
        for(var i = 0; i< arr.length; i++) {
            rate = Math.ceil(arr[i] / sum * 100);
            skinNumber.eq(i).text(arr[i]);
            skinBar.eq(i).animate({'width': rate + '%'},300);
            //skinRate.eq(i).animate({'left': (rate * 2.28 - 28) + 'px'},300)
        }
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
            popBox.innerHTML = '<div class="popTop"></div><div class="popWrap"><a href="javascript:void(0);" class="popClose" onclick="QB_QINGYUN.dialog.hide()" title="关闭"></a><div class="popContainer">'+ content +'</div></div><div class="popBottom"></div>';
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
            html = "<div class='popTips'>\
                    <p>活动已经结束！</p>\
                    <p>敬请期待更多QQ浏览器特权活动！</p>\
                </div>\
                <div class='P_btns'>\
                    <a href='javascript:;' class='btn btn_pop' onclick='QB_QINGYUN.dialog.hide();'>确定</a>\
                </div>";
            return html;
        },
        8 : function(){
            html = "<div class='popTips'>\
                    <p>亲，这是QQ浏览器的专属活动</p>\
                    <p style='font-size: 16px;'>请用QQ浏览器参加哦，如果还未安装，请点击下载安装</p>\
                </div>\
                <div class='P_btns'>\
                    <a href='http://dldir1.qq.com/invc/tt/QB/QQBrowser_Setup_9.4.1_8188.exe' class='btn btn_downloadQB' onclick='api.report(\"BROWSER.ACTIVITY.QINGYUNZHI.DOWNLOADQBCLICK\")'>下载QQ浏览器</a>\
                </div>";
            return html;
        },
        7 : function(){
            html = "<div class='popTips'>\
                    <p>亲，您的QQ浏览器版本不符合</p>\
                    <p style='font-size: 16px; line-height: 22px;'>请使用最新版的QQ浏览器前来参加<br>若您是首次安装的QQ浏览器，请于48小时之后前来领取。</p>\
                </div>\
                <div class='P_btns'>\
                    <a href='http://dldir1.qq.com/invc/tt/QB/QQBrowser_Setup_9.4.1_8188.exe' class='btn btn_downloadQB' onclick='api.report(\"BROWSER.ACTIVITY.QINGYUNZHI.DOWNLOADQBCLICK\")'>下载QQ浏览器</a>\
                </div>";
            return html;
        },
        0 : function(key,name,cdkey,skin, share){
            if(key == 1) {
                html = "<div class='popContent giftsCenter'>\
                        <div class='gifts_cont'>\
                            <div class='gifts_l'>\
                                <img src='http://stdl.qq.com/stdl/activity/qyz/images/gift_vip.png' width='110' height='75' alt='腾讯视频VIP'>\
                            </div>\
                            <div class='gifts_r'>\
                                <h3>恭喜您抽中了<span class='blue'>"+ name +"</span></h3>\
                                <p>兑换码：<span class='blue'>"+ cdkey +"</span></p>\
                            </div>\
                        </div>\
                        <div class='gifts_tips'>\
                            <p>1.&nbsp;&nbsp;登录 <span class='blue'>http://film.qq.com/duihuan.html</span> 输入兑换码（请注意<br>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;区分大小写），即可开始好莱坞之旅。</p>\
                            <p>2.&nbsp;&nbsp;兑换码有效期至2016年12月31日，请在有效期内兑换使用。</p>\
                        </div>\
                    </div>\
                    <div class='P_btns'>\
                        <a href='http://film.qq.com/duihuan.html' target='_blank' class='btn btn_exchange'>立即兑换</a>\
                    </div>";
            } else if(key == 2) {
                html = "<div class='popContent giftsCenter'>\
                        <div class='gifts_cont gifts_qb'>\
                            <div class='gifts_l'>\
                                <img src='http://stdl.qq.com/stdl/activity/qyz/images/gift_qb.png' width='110' height='75' alt='Q币'>\
                            </div>\
                            <div class='gifts_r'>\
                                <h3>恭喜您抽中了<span class='blue cdkey'>"+ name +"</span></h3>\
                            </div>\
                        </div>\
                        <div class='gifts_tips'>\
                            <p>奖励将自动发放到您登录活动的QQ号中。电脑上请在“个人资料-—账户”中查看，手机上请在“QQ钱包-—账户”中查看。</p>\
                        </div>\
                    </div>\
                    <div class='P_btns'>\
                        <a href='javascript:;' class='btn btn_pop' onclick='QB_QINGYUN.dialog.hide();'>确定</a>\
                    </div>";
            } else {
                if (skin && !share) {
                    html = "<div class='popTips txtCenter'>\
                    <p>啊哦，手滑了，差一点就抽中了<br>分享活动还可以增加一次抽奖机会哦~</p>\
                </div>\
                <div class='P_btns'>\
                    <a href='javascript:;' class='btn btn_pop' onclick='QB_QINGYUN.dialog.hide();'>确定</a>\
                </div>";
                }  else if (!skin && share) {
                    html = "<div class='popTips txtCenter'>\
                    <p>啊哦，手滑了，差一点就抽中了<br>换上喜欢的青云志皮肤还可以增加一次抽奖机会哦~</p>\
                </div>\
                <div class='P_btns'>\
                    <a href='javascript:;' class='btn btn_pop' onclick='QB_QINGYUN.dialog.hide();'>确定</a>\
                </div>";
                } else {
                    html = "<div class='popTips txtCenter'>\
                    <p>啊哦，手滑了，差一点就抽中了<br>明天再来试试吧，中奖率会更高哦~</p>\
                </div>\
                <div class='P_btns'>\
                    <a href='javascript:;' class='btn btn_pop' onclick='QB_QINGYUN.dialog.hide();'>确定</a>\
                </div>";
                }
            }
            return html;

        },
        1 : function(skin, share){
            if(!skin && !share) {
                html = "<div class='popTips txtCenter'>\
                    <p>请先换上喜欢的青云志皮肤再抽奖。</p>\
                </div>\
                <div class='P_btns'>\
                    <a href='javascript:;' class='btn btn_pop' onclick='QB_QINGYUN.dialog.hide();'>确定</a>\
                </div>";
            } else if (skin && !share) {
                html = "<div class='popTips txtCenter'>\
                    <p>当前抽奖机会已用完，<br>分享活动可增加一次抽奖机会。</p>\
                </div>\
                <div class='P_btns'>\
                    <a href='javascript:;' class='btn btn_pop' onclick='QB_QINGYUN.dialog.hide();'>确定</a>\
                </div>";
            }  else if (!skin && share) {
                html = "<div class='popTips txtCenter'>\
                    <p>当前抽奖机会已用完，<br>换上喜欢的青云志皮肤可增加一次抽奖机会。</p>\
                </div>\
                <div class='P_btns'>\
                    <a href='javascript:;' class='btn btn_pop' onclick='QB_QINGYUN.dialog.hide();'>确定</a>\
                </div>";
            } else {
                html = "<div class='popTips txtCenter'>\
                    <p>今天抽奖机会已用完！<br>明天再来，中奖概率更高哦~</p>\
                </div>\
                <div class='P_btns'>\
                    <a href='javascript:;' class='btn btn_pop' onclick='QB_QINGYUN.dialog.hide();'>确定</a>\
                </div>";
            }
            return html;
        },
        2 : function (info) {
            html = "<div class='popContent giftsListContent'>"+ info +"</div>\
                <div class='P_btns'>\
                    <a href='javascript:;' class='btn btn_pop' onclick='QB_QINGYUN.dialog.hide();'>确定</a>\
                </div>";
            return html;
        },
        3 : function(title, flag){
            var _text = '',
                _btn = '';
            if(flag) {
                _text = "<br>并获得一次抽奖机会";
                _btn = "<a href='javascript:;' class='btn btn_toLucky' onclick='QB_QINGYUN.dialog.hide();window.scroll(0,1230);api.report(\"BROWSER.ACTIVITY.QINGYUNZHI.TOLUCKYCLICK\");'>去抽奖</a>";
            } else {
                _btn = "<a href='javascript:;' class='btn btn_pop' onclick='QB_QINGYUN.dialog.hide();'>确定</a>";
            }
            html = "<div class='popTips txtCenter'>\
                    <p>'恭喜您成功更换“"+ title +"”皮肤"+ _text +"！'</p>\
                </div>\
                <div class='P_btns'>\
                    "+ _btn +"\
                </div>";
            return html;
        },
        10 : function(tip){
            html = "<div class='popTips txtCenter'>\
                    <p>"+tip+"</p>\
                </div>\
                <div class='P_btns'>\
                    <a href='javascript:;' class='btn btn_pop' onclick='QB_QINGYUN.dialog.hide();'>确定</a>\
                </div>";
            return html;
        }
    };
    Page = qv.zero.extend(qv.zero.AbstractPage,{
        userJsonID : 119301,
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
            QB_QINGYUN.page.getVoteNum();
            if(!!qq.login.getUin()) {
                QB_QINGYUN.page.queryActivity();
            }
            qq.login.bind('login', function () {
                QB_QINGYUN.page.queryActivity();
            });
            qq.login.bind('logout', function () {
                QB_QINGYUN.changeSkin = false;
                QB_QINGYUN.isShare = false;
            });
        },
        queryActivity : function () {
            zHttp.send({'actid': 119518}, function (res) {
                if(res.ret == 0) {
                    var act = res.data.op.join;
                    if(act['119316'] > 0){
                        QB_QINGYUN.changeSkin = true;
                    }
                    if(act['119319'] > 0) {
                        QB_QINGYUN.isShare = true;
                    }
                }
            })
        },
        vote: function (id) {
            var _id = id;
            var demo = $('[data-id="'+_id+'"]');
            var title = demo.data('skin');
            var addVote = demo.find('.add-vote');
            var voteNumber = demo.find('.skin-number');
            zUtil.ensureLogin(function () {
                zHttp.send({'actid':119316, vote_uin: _id}, function (res) {
                    if(res.ret == 0) {
                        addVote.slideDown().fadeOut();
                        voteNumber.text(parseInt(voteNumber.text())+1);
                        QB_QINGYUN.changeSkin = true;
                        dialog.show(tips['3'](title, true));
                    } else if(res.ret == 10601) {//达到参与频率
                        dialog.show(tips['3'](title));
                    } else if(res.ret == 10001 || res.ret == 10004) {
                        //TODO 活动结束弹框
                        dialog.show(tips['9']());
                    } else {
                        dialog.alert(tips['10'](getAmsMsg(res)));
                    }
                });
                api.report('BROWSER.ACTIVITY.QINGYUNZHI.VOTE_' + _id);
            })
        },
        getVoteNum : function (cb) {
            var allnum = 6,
                uins = '1',
                vsDetail = [],
                number = 0,
                sum = 0;
            for(var i = 2 ; i <= allnum; i++) uins += ('_' + i);
            zHttp.send({_c : 'query',actid:119317,uins: uins},function(json){
                if(json.ret==0){
                    for(var j=1;j<=allnum;j++){
                        number = parseInt(json.data['119316_'+j]);
                        vsDetail[j-1] = number;
                        sum+=number;
                    }
                    setVoteDetail(vsDetail,sum);
                }
            });
        },
        getLucky : function(){
            if(!api.isQQBrowser()){
                //TODO 非QQ浏览器弹框
                dialog.show(tips['8']());
                return;
            }
            zUtil.ensureLogin(function () {
                zHttp.send({'actid':119320, guid: qb_guid},function(res){
                    if(res.ret == 0) {
                        var key = res.data.op.diamonds;
                        var name = res.data.op.name;
                        var cdkey = res.data.op.cdkey;
                        dialog.alert(tips['0'](key,name,cdkey,QB_QINGYUN.changeSkin,QB_QINGYUN.isShare));
                    } else if(res.ret == 40043) {
                        dialog.show(tips['7']());
                    } else if(res.ret == 20801) {
                        dialog.show(tips['1'](QB_QINGYUN.changeSkin,QB_QINGYUN.isShare));
                    } else if(res.ret == 10002) {
                        qq.login.show();
                    } else if(res.ret == 10001 || res.ret == 10004) {
                        dialog.show(tips['9']());
                    } else {
                        dialog.show(tips['10'](getAmsMsg(res)));
                    }
                });
                api.report('BROWSER.ACTIVITY.QINGYUNZHI.GETLUCKYCLICK');
            })
        },
        share: function(){
            zUtil.ensureLogin(function () {
                zHttp.send({'actid':119319}, function (res) {
                    if(res.ret == 0) {
                        //TODO 分享微博成功加才有将机会的弹框
                        QB_QINGYUN.isShare = true;
                        dialog.show(tips['10']('恭喜您获得了一次抽奖机会！'));
                    } else if(res.ret == 10002) {
                        qq.login.show();
                        return;
                    } else if(res.ret == 10001 || res.ret == 10004) {
                    //TODO 活动结束弹框
                        dialog.show(tips['9']());
                        return;
                    }
                    api.report('BROWSER.ACTIVITY.QINGYUNZHI.SHARESINA');
                    var _url = _pageUrl+"index.html?ADTAG=sina&pvsrc=sina";
                    var _pic = "http://stdl.qq.com/stdl/activity/qyz/images/share.jpg";
                    var _title = "#我要的现在就要# #换皮肤赢腾讯视频VIP和Q币#";
                    var _description = "我在#QQ浏览器#换了一款#诛仙青云志#主角皮肤，还能赢好莱坞会员和海量Q币！你也来试试吧~";
                    var shareUrl = "http://service.weibo.com/share/share.php?"
                        +"&title=" + encodeURIComponent(_description)
                        +"&pic=" + encodeURIComponent(_pic)
                        +"&url=" + encodeURIComponent(_url);
                    window.open(shareUrl);
                })
            })
        },
        //查询中奖记录
        queryGift: function () {
            zUtil.ensureLogin(function () {
                zHttp.send({actid: 119495}, function (res) {
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
                                _htmlArr.push('<li>'+ time +'&nbsp;&nbsp;'+ name +'&nbsp;&nbsp;兑换码： '+ cdkey +'</li>');
                            } else if (level == 2) {
                                _htmlArr.push('<li>'+ time +'&nbsp;&nbsp;'+ name +'</li>');
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
                        dialog.show(tips['2'](_html),'pop_record');
                    } else if (res.ret == 10002) {
                        qq.login.open();
                    } else if(res.ret == 10001 || res.ret == 10004) {
                        //TODO 活动结束弹框
                        dialog.show(tips['9']());
                    } else {
                        zHttp.showResponse(res, res.actid, $.noop);
                    }
                });
                api.report("BROWSER.ACTIVITY.QINGYUNZHI.QUERYGIFTSCLICK");
            });
        }
    });


    //头尾初始化
    api.initNav("header","footer",{ //对应header footer div的id
        background:"#000",  //footer的背景色，常常需要根据页面设计改变颜色 默认：黑色（可选）
        color:"#fff",  //footer中文字的颜色 默认：白色（可选）
        qblink:"http://dldir1.qq.com/invc/tt/QQBrowser_Setup_9.4.8699.400.exe", //下载QB按钮的链接 默认：特权中心QB包（可选）
        report:"BROWSER.ACTIVITY.QINGYUNZHI.QBDOWNLOADCLICK", //点击流数据上报（可选）
        isTqHide:false //特权LOGO是否显示（可选）
    });


    window.QB_QINGYUN = window.QB_QINGYUN || {};
    window.QB_QINGYUN.changeSkin = false;
    window.QB_QINGYUN.isShare = false;
    window.QB_QINGYUN.page = new Page();
    window.QB_QINGYUN.dialog = dialog;
    window.QB_QINGYUN.tips = tips;

})(window,jQuery);