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
//删除数组中指定的元素
Array.prototype.indexOf = function(val) {
    for (var i = 0; i < this.length; i++) {
        if (this[i] == val) return i;
    }
    return -1;
};
Array.prototype.remove = function(val) {
    var index = this.indexOf(val);
    if (index > -1) {
        this.splice(index, 1);
    }
};
Array.prototype.toUrlString = function () {
    var arr = this,
        newArr = [],
        str;
    for(var i = 0; i < arr.length; i++) {
        if(i == 1 || i == 2) {
            newArr.push(arr[i].join('|'));
        } else {
            newArr.push(arr[i]);
        }
    }
    str = newArr.join(',');
    return encodeURIComponent(str);
};

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
var html;
var tips = {
    10 : function(tip, tit, btn, link){
        var title = tit ? tit : '暗黑契约',
            btnTxt = btn ? btn : '确定',
            links = link ? link : 'javascript:;',
            target = link ? '_blank' : '_self';
        html = '<div class="popTips" style="padding-top: 10px;">\
                    <p class="poptit">'+ title +'</p>\
                    <p>'+tip+'</p>\
                </div>\
                <div class="P_btns">\
                    <a href="'+ links +'" target="'+ target +'" class="btn_pop" onclick="dialog.hide();">'+ btnTxt +'</a>\
                </div>';
        return html;
    },
    9 : function(type){
        var text = '';
        if(type == 1) {
            text = '<p class="poptit">兑换失败</p>\
                    <p>很遗憾，《流放之路》夺魂内测资格已经兑换完<br>毕，请前往官网参加其它活动。</p>';
        } else {
            text = '<p style="padding-top: 20px;">活动已经结束！</p>\
                    <p>敬请期待更多QQ浏览器特权活动！</p>';
        }
        html = '<div class="popTips">\
                    '+ text +'\
                </div>\
                <div class="P_btns">\
                    <a href="javascript:;" class="btn_pop" onclick="dialog.hide();">确定</a>\
                </div>';
        return html;
    },
    8 : function(){
        html = '<div class="popTips" style="padding-top: 30px;">\
                    <p>亲，这是QQ浏览器的专属活动</p>\
                    <p style="font-size: 14px;">请用QQ浏览器参加哦，如果还未安装，请点击下载安装</p>\
                </div>\
                <div class="P_btns">\
                    <a href="https://dldir1.qq.com/invc/tt/QQBrowser_Setup_9.5.9947.400.exe" class="btn_pop" onclick="api.report(\'BROWSER.ACTIVITY.JUEJI.DOWNLOADQBCLICK\')">下载QQ浏览器</a>\
                </div>';
        return html;
    },
    7 : function(){
        html = '<div class="popTips" style="padding-top: 30px;">\
                    <p>抱歉，您的QQ浏览器版本不符合</p>\
                    <p style="font-size: 14px;">请使用最新版的QQ浏览器前来参加，如果是首次安装的QQ浏览器，请稍后再试！</p>\
                </div>\
                <div class="P_btns">\
                    <a href="https://dldir1.qq.com/invc/tt/QQBrowser_Setup_9.5.9947.400.exe" class="btn_pop" onclick="api.report(\'BROWSER.ACTIVITY.JUEJI.DOWNLOADQBCLICK\')">下载QQ浏览器</a>\
                </div>';
        return html;
    },
    5 : function(info){
        html = '<div class="popTips">\
                    '+info+'\
                </div>';
        return html;
    },
    1 : function(cdkey){
        html = '<div class="popTips">\
                    <p class="poptit">赢取激活码</p>\
                    <p>恭喜您，获得《流放之路》夺魂内测</p>\
                    <p>激活码：'+ cdkey +'</p>\
                </div>\
                <div class="P_btns">\
                    <a href="http://poe.qq.com/web201604/active.shtml?ADTAG=main.btn.active" target="_blank" class="btn_pop">立即激活</a>\
                </div>';
        return html;
    },
    0 : function(type, score){
        var text = '';
        if(type == 1) {
            text = '<p>您的问卷得分是：'+ score +'，恭喜您获得以388QQ浏览器积分兑换《流放之路》夺魂内测资格。</p>';
        } else {
            text = '<p>您的问卷得分是：'+ score +'，很抱歉您未获得以388QQ浏览器积分兑换《流放之路》夺魂内测资格。</p>';
        }
        html = '<div class="popTips" style="padding: 0 80px;">\
                    <p class="poptit">暗黑契约</p>\
                    '+ text +'\
                </div>\
                <div class="P_btns">\
                    <a href="javascript:;" class="btn_pop" onclick="dialog.hide();">确定</a>\
                </div>';
        return html;
    }
};

(function(window,$) {
    Page = qv.zero.extend(qv.zero.AbstractPage,{
        userJsonID : 152384,
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
                game: 'poe'
            });
        },
        //提交答案
        submitAnswer: function (str, cb) {
            var url = 'http://tq.qq.com/lfzl_answer?actid=152386&answer=' + str;
            zUtil.ensureLogin(function () {
                zHttp.send(url, function (res) {
                    if(res.ret == 0) {
                        var score = res.data.score;
                        var type = score >=20 ? 1 : 0;
						if(type) {
							zHttp.send({'actid':153716});
						} else {
							zHttp.send({'actid':153717});
						}
                        dialog.show(tips['0'](type, score));
                    } else if(res.ret == 1 || res.ret == 2) {
                        dialog.show(tips['10'](res.msg));
                    } else if (res.ret == 10002) {
                        qq.login.open();
                    } else if (res.ret == 10001 || res.ret == 10004) {
                        dialog.show(tips['9']());
                    } else {
                        dialog.show(tips['10'](getAmsMsg(res)));
                    }
                    cb ? cb() : '';
                });
                api.report('BROWSER.ACTIVITY.POE_161215.ANSWERCLICK');
            })
        },
        exchange: function(e,act){
            if(!api.isQQBrowser()){
                dialog.show(tips['8']());
                return;
            }
            if(!qb_guid) {
                getGuid();
            }
            var title, text, btn, link;
            zUtil.ensureLogin(function () {
                zHttp.send({'actid': 152390, guid: qb_guid}, function (res) {
                    if (res.ret == 0) {
                        var cdkey = res.data.op.cdkey;
                        dialog.alert(tips['1'](cdkey));
                    } else if (res.ret == 40043) {
                        dialog.show(tips['7']());
                    } else if (res.ret == 60513) {
                        dialog.show(tips['10']('您的电脑已达到最大的领取限量！'));
                    } else if(res.ret == 10603) {
                        title = '兑换失败';
                        text = '您已拥有《流放之路》夺魂内测资格，无需再次兑换！';
                        dialog.show(tips['10'](text, title));
                    } else if(res.ret == 20801) {
                        title = '兑换失败';
                        text = '对不起，您的QQ浏览器积分不足！';
                        btn = '赚积分';
                        link = 'http://i.browser.qq.com/';
                        dialog.show(tips['10'](text, title, btn, link));
                    } else if (res.ret == 10002) {
                        qq.login.open();
                    } else if (res.ret == 10001 || res.ret == 10004) {
                        dialog.show(tips['9'](1));
                    } else {
                        dialog.show(tips['10'](getAmsMsg(res)));
                    }
                });
                api.report("BROWSER.ACTIVITY.POE_161215.EXCHANGECDKEYGIFTSCLICK");
            });
        },
        exchange2: function(e,act){
			//alert('即将开放，敬请期待！');
            if(!api.isQQBrowser()){
                dialog.show(tips['8']());
                return;
            }
            if(!qb_guid) {
                getGuid();
            }
            zUtil.ensureLogin(function () {
                page.svr.show({
                    send: function (args, call) {
                        zHttp.send({'actid': 152391, area: args.area, roleid: args.roleid, guid: qb_guid}, function (res) {
                            if (res.ret == 0) {
                                dialog.show(tips['10'](getAmsMsg(res), '领取成功'));
                            } else if (res.ret == 40043) {
                                dialog.show(tips['7']());
                            } else if (res.ret == 60513) {
                                dialog.show(tips['10']('您的电脑已达到最大的领取限量！'));
                            } else if (res.ret == 10002) {
                                qq.login.open();
                            } else if (res.ret == 10001 || res.ret == 10004) {
                                dialog.show(tips['9']());
                            } else {
                                dialog.show(tips['10'](getAmsMsg(res)));
                            }
                        });
                    }
                });
                api.report("BROWSER.ACTIVITY.POE_161215.EXCHANGETQGIFTSCLICK");
            });
        },
        //查询中奖记录
        queryRecord: function (temp) {
            zUtil.ensureLogin(function () {
                zHttp.send({actid: 152478}, function (res) {
                    res.ret = 0;
                    if (res.ret == 0) {
                        var records = [];
                        if(temp >= 0 && temp <= 14) {
                            var _records = [

                                {val:{actid: 152391, time: 1481281556, name: "QQ浏览器专属礼包", level: -1, info: ""}},
                                {val:{actid: 152390, time: 1481281556, name: "激活码", level: -1, info: "DRTMRAAAABBdVGMp"}}
                            ];
                            for(var i = 0; i < temp; i++) {
                                records[i] = _records[i];
                            }
                        } else {
                            records = res.data.op;
                        }
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
                            if (actid == 152390) {
                                cdkey = obj.info;
                                btn = '<a href="http://poe.qq.com/web201604/active.shtml?ADTAG=main.btn.active" target="_blank" class="btn_pop btn_pop2">立即激活</a>';
                                _htmlArr.push('<tr><td>'+ time +'</td><td>'+ cdkey +'</td><td>'+ btn +'</td></tr>');
                            } else {
                                _htmlArr.push('<tr><td>'+ time +'</td><td>'+ name +'</td><td>'+ btn +'</td></tr>');
                            }
                            PageCount++;
                        }
                        if (PageCount == 0) {
                            _htmlArr.push('<tr><td colspan="3" class="noGifts">您尚未获得任何礼包</td></tr>');
                        }
                        _html = '<table width="100%" class="pop1-tab">\
                                    <tbody id="giftsContainer">'+ _htmlArr.join('') +'</tbody>\
                                </table>';
                        dialog.show(tips['5'](_html));
                    } else if (res.ret == 10002) {
                        qq.login.open();
                    } else if (res.ret == 10001 || res.ret == 10004) {
                        dialog.show(tips['9']());
                    } else {
                        dialog.show(tips['10'](getAmsMsg(res)));
                    }
                });
                api.report("BROWSER.ACTIVITY.POE_161215.QUERYRECORDCLICK");
            });
        }
    });
    window.page = new Page();

})(window,jQuery);

//弹窗视频
function TGDialogS(e){
    need("biz.dialog-min",function(Dialog){
        Dialog.show({
            id:e,
            bgcolor:'#000', //弹出“遮罩”的颜色，格式为"#FF6600"，可修改，默认为"#fff"
            opacity:70      //弹出“遮罩”的透明度，格式为｛10-100｝，可选
        });
    });
}
function closeDialog(){
    need("biz.dialog-min",function(Dialog){
        Dialog.hide();
    });
}
function playVideo() {
    var video = new tvp.VideoInfo();
    video.setVid('u0335y24d0n');
    var player = new tvp.Player();
    player.create({
        flashWmode:'Opaque',
        width:800,
        height:500,
        video:video,
        autoplay: true,
        vodFlashSkin:"http://imgcache.qq.com/minivideo_v1/vd/res/skins/TencentPlayerMiniSkin.swf",
        modId:"video"
    });
}
function popVideo() {
    TGDialogS('pop-video');
    playVideo();
    api.report('BROWSER.ACTIVITY.POE_161215.VIDEO');
}
function hideVideo() {
    var flv_s = document.getElementById("video");
    if (flv_s){flv_s.innerHTML= "";}
    closeDialog();
}


(function(window,$){
    //头尾初始化
    api.initNav("header","",{ //对应header footer div的id
        background:"#000",  //footer的背景色，常常需要根据页面设计改变颜色 默认：黑色（可选）
        color:"#fff",  //footer中文字的颜色 默认：白色（可选）
        qblink:"https://dldir1.qq.com/invc/tt/QQBrowser_Setup_9.5.9947.400.exe", //下载QB按钮的链接 默认：特权中心QB包（可选）
        report:"BROWSER.ACTIVITY.POE_161215.QBDOWNLOADCLICK", //点击流数据上报（可选）
        isTqHide:false //特权LOGO是否显示（可选）
    });

    //答题
    var picI = 0;
    var answer = [];
    $('.par1-op').find('em').each(function(){
        $(this).click(function(){
            answer[picI] = $(this).data('option');
            $(this).addClass('on').parent().siblings().children('em').removeClass('on');
            setBtn(answer);
        })
    });
    $('.par1-op2').find('em').each(function(){
        $(this).click(function(){
            cid = $(this).index();
            if($(this).hasClass('on')) {
                $(this).removeClass('on');
                answer[picI].remove($(this).data('option'));
            } else {
                try {
                    if(answer[picI].length >= 3) {
                        alert('最多只能选三项哦！');
                        return;
                    }
                } catch (err){
                    answer[picI] = [];
                }
                $(this).addClass('on');
                answer[picI].push($(this).data('option'));
            }
            setBtn(answer);
        })
    });
    //设置按钮状态
    function setBtn(arr) {
        var k = 0;
        for(var i=0; i<arr.length;i++) {
            if(typeof arr[i] != 'undefined' && arr[i] != '') {
                k++;
            }
        }
        if(k == 8 && arr[1].length > 0 && arr[2].length > 0) {
            $('.par1-btn1').addClass('par1-btn3');
        } else {
            $('.par1-btn1').removeClass('par1-btn3');
        }
        //console.log(arr);
    }
    //上一题下一题
    var picL = $(".par1-que").length;
    $(".par1-prev").click(function(){
        picI--;
        if(picI<0){
            picI = picL-1;
        }
        //console.log(picI);
        picShow();
    });
    $(".par1-next").click(function(){
        picI++;
        if(picI>picL-1){
            picI = 0;
        }
        //console.log(picI);
        picShow();
    });
    function picShow(){
        $('.par1-que').eq(picI).show().siblings('.par1-que').hide()
    }
    //答题提交
    var isSubmit = false;
    $('.par1-nav').on('click', '.par1-btn3', function () {
        if(isSubmit) return;
        isSubmit = true;
        for(var i in answer[1]) {
            if(answer[1][i] == 'P') {
                if($('#othertxt').val().length > 30) {
                    alert('您输入的其他游戏有误，请重新输入！');
                    picI = 1;
                    picShow();
                    isSubmit = false;
                    return;
                }
                answer[1][i] = 'P-' + $('#othertxt').val();
            }
        }
        //console.log(answer.toUrlString());
        page.submitAnswer(answer.toUrlString(), function () {
            isSubmit = false;
        });
    });


    //上下滑动
    $('a[href*=#],area[href*=#]').click(function() {
        if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
            var $target = $(this.hash);
            $target = $target.length && $target || $('[name=' + this.hash.slice(1) + ']');
            if ($target.length) {
                var targetOffset = $target.offset().top;
                $('html,body').stop(true,false).animate({
                        scrollTop: targetOffset
                    },
                    500);
                return false;
            }
        }
    });
    //侧边栏
    var fixE = $("#float");
    $(window).bind('scroll.fixed', function() {
        if ($(window).scrollTop() >= 350) {
            fixE.removeClass("float").addClass('fixed');
        } else {
            fixE.removeClass("fixed").addClass('float');
        }
    }).trigger('scroll.fixed');
})(window,jQuery);
