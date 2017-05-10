var EXTENSION_ID = 'ofcnochcdeimbkkhcndgakbegamneggp';
var CRX_URL = 'https://pcbrowser.dd.qq.com/pcbrowserbig/qbextension/qb_crx/halloween.crx';
//var EXTENSION_ID = 'fpbdfpimimonlkoapobdbldphmiplmml';
var has_extension_installed = false;
var has_extension_install_listen = false;
var prx = null; //用于跟插件通信
var lastCaptureTime = 0; //用于设默被拦截，多次绑定，回调会触发多次，只响应第一个回调
var drawCount = 0; //抽奖次数
var isSetDefault = false; //是否点击设默按钮

var initPrx = function(cb){
    if(!prx){
        prx = chrome.runtime.connect(EXTENSION_ID,{name: "halloween-default"});
    }
    setTimeout(function(){
        prx.onMessage.addListener(function(msg) {
            console.log(msg);
            if(msg.cmd == "halloween-lucky"){
                if(msg.status) {
                    updateCoin(setDrawCount);
                }
                updateCollectBtn(msg.actid);
            }
        });
        cb ? cb() : null;
    }, 100);
};

var openUrl = function(type){
    var obj = {
        cmd: 'halloween-open',
        tab: type
    };
    ensurePrx(function(){
        api.ensureLogin(function(){
            try {
                prx.postMessage(obj);
            }
            catch(e){
                location.href = location.href; //prx disconnect
            }
        });
    });
};


var updateCoin = function(cb){
    queryCoin(function(obj){
        //console.log(obj);
        for(var k in obj){
            $('#candy_'+k).text(obj[k]);
        }
        cb ? cb(obj) : null;
    });
};


var _updateCollectBtn = function(){
    var obj = collect_btn_disable;
    obj['0'] ? $('.btn_collery[data-index=0]').addClass('disabled') : null;
    obj['1'] ? $('.btn_collery[data-index=1]').addClass('disabled') : null;
    obj['2'] ? $('.btn_collery[data-index=2]').addClass('disabled') : null;
    obj['3'] ? $('.btn_collery[data-index=3]').addClass('disabled') : null;
};

var collect_btn_disable = {
    '0': false,
    '1': false,
    '2': false,
    '3': false,
    '68417': false,
    '68418': false,
    '68419': false,
    '68420': false,
    '68755': false,
    '68756': false,
    '68757': false
};

var updateCollectBtn = function(actid){
    var id;
    var obj = collect_btn_disable;

    if(!actid){
        api.requestAms(69051, function(res){
            if(res.ret === 0){
                var data = res.data.op.join;
                for(var k in data){
                    id = k.toString();
                    if(data[k] > 0){
                        obj[id] = true;
                        switch (id){
                            case '68418':
                                obj['68755'] ? obj['0'] = true : null;
                                break;
                            case '68419':
                                obj['68756'] ? obj['1'] = true : null;
                                break;
                            case '68420':
                                obj['68757'] ? obj['2'] = true : null;
                                break;
                            case '68755':
                                obj['68418'] ? obj['0'] = true : null;
                                break;
                            case '68756':
                                obj['68419'] ? obj['1'] = true : null;
                                break;
                            case '68757':
                                obj['68420'] ? obj['2'] = true : null;
                                break;
                            case '68417':
                                obj['3'] = true;
                                break;
                            default :
                                ;
                        }
                    }
                }
                _updateCollectBtn();
            }
            else if(res.ret === 10004 || res.ret === 10001){
                api.dialog.alert(tips['9']());                        
            }
        })
    }
    else{
        id = actid.toString();
        obj[id] = true;
        switch (id){
            case '68418':
                obj['68755'] ? obj['0'] = true : null;
                break;
            case '68419':
                obj['68756'] ? obj['1'] = true : null;
                break;
            case '68420':
                obj['68757'] ? obj['2'] = true : null;
                break;
            case '68755':
                obj['68418'] ? obj['0'] = true : null;
                break;
            case '68756':
                obj['68419'] ? obj['1'] = true : null;
                break;
            case '68757':
                obj['68420'] ? obj['2'] = true : null;
                break;
            case '68417':
                obj['3'] = true;
                break;
            default :
                ;
        }

        _updateCollectBtn();

        if(id === '68418' || id === '68756' || id === '68757'){
            $('.btn_sure2').eq(0).addClass('disabled');
        }
        else{
            $('.btn_sure2').eq(1).addClass('disabled');
        }
    }
};


var setDrawCount = function(obj){
    var arr = [];
    for(var j in obj){
        arr.push(obj[j]);
    };
    var count = (arr.length == 4 ? Math.min.apply(this,arr) : 0);
    $('#money').text(count);
    drawCount = count;
};

var _queryCoin = function(cb){
    api.requestAms(68429, function(res){
        if(res.ret === 0){
            if(res.data.op.join['68416']){
                cb($.parseParams(res.data.op.join['68416'].data));
            }
            else{
                cb({});
            }
        }
        /*else if(res.ret === 10002){
         qq.login.open(function(){});
         }*/
        else if(res.ret === 10703){
            setTimeout(function(){
                queryCoin(cb);
            },1200);
        }
        /*else{
         dealAmsErrorCode(res.ret);
         }*/
    });
};


var queryCoin = function(cb, noTimeOut){
    if(noTimeOut){
        return _queryCoin(cb);
    }
    setTimeout(function(){
        _queryCoin(cb);
    },1000);
};

var installExtension = function(cb){
    if(!has_extension_install_listen){
        has_extension_install_listen = true;
        chrome.management.onInstallFinished.addListener(function (id) {
            if(id === EXTENSION_ID){
                has_extension_installed = true;
                cb ? cb(true) : null;
            }
        });
    }
    chrome.management.install({id:EXTENSION_ID, crx_url:CRX_URL}, function (id,result) {});
};

var queryDefault  = function(cb){
    //return cb(false);
    chrome.runtime.sendMessage("hbkoccppnblkmobdjagebolnebjiajig", {msg:"isDefaultBrowser"}, function(response) {
        cb(response && response.isDefault);
    });
};

var setDefault = function(cb){
    //return cb(true);
    chrome.runtime.sendMessage("hbkoccppnblkmobdjagebolnebjiajig", {msg:"setDefaultBrowser"}, function(response) {
        cb(response && response.isDefault);
    });
};

var showPop = function(type){
    alert(type);
};



var getBigLucky = function(cb){
    if(!api.isQQBrowser9()){
        return api.dialog.alert(tips['8']());
    };
    
    if(!drawCount){
        return api.dialog.alert(tips['0'](-1));
    };

    api.ensureLogin(function(){
        if(inGame) { return; }
        api.requestAms(68703, function(res){
            if(res.ret === 0){
                return cb(res);
            }
            else if(res.ret === 10002){
                qq.login.open(function(){
                    return getBigLucky(cb);
                });
            }
            else{
                dealAmsErrorCode(res.ret);
            }
        })
    });
};

var ensurePrx = function(cb){
    if(prx){
        return cb();
    }

    if(has_extension_installed){
        return initPrx(cb);
    }

    chrome.management.get(EXTENSION_ID, function (installed) {
        if(installed){
            has_extension_installed = true;
            initPrx(cb);
        }
        else{
            installExtension(function(){
                setTimeout(function(){
                    initPrx(cb);
                },1000);
            });
        }
    });
};

var joinPartyClick = function(){
    api.ensureLogin();

    if(has_extension_installed){ //重复安装似乎没啥问题，而且也不会触发插件安装的监听，这三行可去掉，
        return;
    }

    installExtension(function(){
        setTimeout(function(){
            initPrx();
        },1200);
    });
};

var dealAmsErrorCode = function(code){
    if(code === 10005){
        api.dialog.alert(tips['9']('活动暂停中，请稍后再来'));
    }
    else if(code === 10001 || code === 10004){
        api.dialog.alert(tips['9']());
    }
    else {
        api.dialog.alert(tips['7']());
    }
};

var setDefaultClick = function(){
    setDefault(function(isDefault){
        if(isDefault){
                api.requestAms(68417, function(res){
                    if(res.ret === 0){
                        updateCoin(setDrawCount);
                        api.dialog.alert(tips['2'](0));
                        updateCollectBtn(68417);
                        if(isSetDefault) {
                            api.clickReport('SETDEFAULTQBSUCCEED');
                        }
                    }
                    else if(res.ret === 10601){
                        api.dialog.alert(tips['2'](0));
                        updateCollectBtn(68417);
                    }
                    else if(res.ret === 10002){
                        qq.login.open(function(){
                            setDefaultClick();
                        });
                    }
                    else{
                        dealAmsErrorCode(res.ret);
                    }
                });
        }
        else{
            api.dialog.alert(tips['2'](-1));
            if(isSetDefault) {
                api.clickReport('SETDEFAULTQBERROR');
            } else {
                api.clickReport('SETDEFAULTQBERROR2');
            }
        }
    })
};


var setEventListen = function(){
    $('#set-default').click(function(){
        api.ensureLogin(function(){
            setDefault(function(isDefault){
                //console.log(isDefault);
                var time = new Date().getTime();
                if(time - lastCaptureTime > 2000){
                    lastCaptureTime = time;
                    //alert(isDefault);
                    if(isDefault){
                        getDefaultLucky();
                    }
                    else{
                        alert('设置默认浏览器失败，请取消杀毒软件的拦截'); //弹窗引导用户
                    }
                }
            });
        });

    });



    $('.navigation').click(function(){
        if(api.isQQBrowser9()) {
            var type = $(this).attr('type');
            openUrl(type);
        }
        else{
            showPop('请使用QQ浏览器9');
        }
    });

    $('.news a').click(function(){
        var baseUrl = 'http://www.sogou.com/tx?ie=utf-8&hdq=sogou-clse-60a70bb05b08d6cd&query=';
        if(has_extension_installed){
            openUrl(baseUrl + encodeURI($(this).text()));
        }
        else{
            window.open(baseUrl + encodeURI($(this).text()));
        }

        api.clickReport('NEWSCLICK');
    });


    $('body').on('click','#setUserBtn',function () {
        userContact = {
            name : $('#user_name').val(),
            phone : $('#user_phone').val(),
            email : $('#user_email').val(),
            address : $('#user_address').val()
        };
        api.setUserInfo(userContact, function(){
            api.dialog.hide();
        })
    });

    $('body').on('click', '#getUserBtn', function () {
        api.getUserInfo(function(res) {
            api.dialog.show(tips['5'](res));
        })
    });

    $('body').on('click', '.btn_sure2', function () {
        if($(this).hasClass('disabled')){
            return;
        }

        var type = $(this).attr('data-href');
        openUrl(type);
        api.clickReport(type);
    });




    $('.btn_collery').click(function(){
        if(!api.isQQBrowser9()){
            return api.dialog.alert(tips['8']());
        }

        if($(this).hasClass('disabled')){
            return;
        }
        ensurePrx(function(){});

        var index = +($(this).attr('data-index'));

        api.ensureLogin(function(){

            if(index === 3){
                queryDefault(function(isDefault){
                    if(isDefault){
                        api.dialog.alert(tips['2'](1));
                    }
                    else{
                        api.dialog.alert(tips['2'](2));
                    }
                })
            }
            else{
                api.dialog.alert(tips['1'](index),'popSweet');
                var btnJQ = $('.btn_sure2');
                if(index === 0){
                    collect_btn_disable['68418'] ? btnJQ.eq(0).addClass('disabled') : null;
                    collect_btn_disable['68755'] ? btnJQ.eq(1).addClass('disabled') : null;
                }
                else if(index === 1){
                    collect_btn_disable['68756'] ? btnJQ.eq(0).addClass('disabled') : null;
                    collect_btn_disable['68419'] ? btnJQ.eq(1).addClass('disabled') : null;
                }
                else{
                    collect_btn_disable['68757'] ? btnJQ.eq(0).addClass('disabled') : null;
                    collect_btn_disable['68420'] ? btnJQ.eq(1).addClass('disabled') : null;
                }
            }
            api.clickReport('COLLECTCLICKLOGIN' + index);
        });
        api.clickReport('COLLECTCLICK' + index);
    });
};

//提示语
var PopHtml;
var tips = {
    11 : function(){
        PopHtml = "<div class='popContTit'>爱鲜蜂优惠码使用规则</div>\
                <div style='height: 270px;line-height: 24px; text-align: left;'>1.下载爱鲜蜂APP <a href='http://www.beequick.cn/' target='_blank'>http://www.beequick.cn/</a><br>2.活动期间通过qq浏览器活动入口获取爱鲜蜂优惠券兑换码（新用户15元，老用户5元）。<br>3. 此优惠券购买精选标签商品，限在线支付。<br>4. 优惠券使用有效期截止领取后7天。<br>5.每个用户活动期间限领取一张优惠券，该优惠券不可作为运费使用。<br>6.用户下载安装完进入爱鲜蜂应用内部，点右下角“我的”输入手机号并验证后，进入“我的优惠券”栏目中，输入兑换码，绑定优惠券。<br>7.目前服务覆盖城市为北京，上海，广州，深圳，南京，杭州，苏州，佛山，成都，三河（燕郊）。<br>8.本活动解释权归爱鲜蜂所有。</div>\
                <div class='P_btns'>\
                    <a href='javascript:;' class='btn btn_sure' onclick='api.dialog.hide();'><span>我知道了</span></a>\
                </div>";
        return PopHtml;
    },
    10 : function(){
        PopHtml = "<div style=' padding-top: 40px; padding-left: 50px; height: 130px; width: 350px; text-align: left; font-size: 16px; line-height: 30px;'>万圣节狂欢派对开始啦！<br>集糖果抽玫瑰金，还有百万Q币等你拿！</div>\
                <div class='P_btns'>\
                    <a href='javascript:;' class='btn btn_sure' onclick='api.dialog.hide();joinPartyClick();'><span>参加派对</span></a>\
                </div>";
        return PopHtml;
    },
    9 : function(info){
        var temp = info ? info : '活动已经结束！<br>敬请期待更多QQ浏览器特权活动！';
        PopHtml = "<p style='font-size: 18px; height: 120px; padding-top: 30px; line-height: 35px;'>" + temp + "</p>\
                <div class='P_btns'>\
                    <a href='javascript:;' class='btn btn_sure' onclick='api.dialog.hide();'><span>我知道了</span></a>\
                </div>";
        return PopHtml;
    },
    8 : function(){
        PopHtml = "<p style='font-size: 18px; padding:15px 0 10px;'>亲，这是QQ浏览器9的专属活动</p>\
                <p style='height: 105px; line-height: 30px; color: #967044; font-size: 16px;'>请用QQ浏览器9最新版参加哦<br>如果还未安装，请<span class='red'>点击下载</span>安装</p>\
                <div class='P_btns'>\
                    <a href='javascript:;' class='btn btn_sure' onclick='document.getElementById(\"header-qb\").click();api.dialog.hide();'><span>马上下载</span></a>\
                </div>";
        return PopHtml;
    },
    7 : function(){
        PopHtml = "<p style=' height: 100px; padding-top: 55px;'>亲，活动太火爆了，请稍后再试</p>\
                <div class='P_btns'>\
                    <a href='javascript:;' class='btn btn_sure' onclick='api.dialog.hide();'><span>我知道了</span></a>\
                </div>";
        return PopHtml;
    },
    6 : function (info) {
        PopHtml = "<div class='popContTit'>获奖记录</div>\
                <ul class='giftsList'>"+ info +"</ul>";
        return PopHtml;
    },
    5 : function (obj) {
        if(obj == undefined){
            obj = {'name':'','phone':'','email':'','address':''};
        }
        PopHtml = "<div class='popContTit'>填写联系方式</div>\
                <div class='userInfo'>\
                    <p><label>姓名</label><input id='user_name' type='text' value='"+ obj.name +"'></p>\
                    <p><label>手机号</label><input id='user_phone' type='text' value='"+ obj.phone +"'></p>\
                    <p><label>电子邮箱</label><input id='user_email' type='text' value='"+ obj.email +"'></p>\
                    <p><label>邮寄地址</label><input id='user_address' type='text' value='"+ obj.address +"'></p>\
                </div>\
                <div class='P_btns'>\
                    <a href='javascript:;' class='btn btn_sure' id='setUserBtn'><span>确认提交</span></a>\
                </div>";
        return PopHtml;
    },
    2 : function (k) {
        switch (k) {
            case -1 : PopHtml = "<p style='font-size: 18px; line-height: 30px; padding-top: 50px;; margin-bottom: 50px;'>T_T  设置失败...让我们看看怎么解决吧！<br><span style='color: #d82a2a;'>红色糖果</span> 在呼唤你~</p>\
                <div class='P_btns'>\
                    <a href='http://browser.qq.com/help_v8/faq6.html' target='_blank' class='btn btn_sure' onclick='api.dialog.alert(tips[\"2\"](2));'><span>查看帮助</span></a>\
                </div>";
                break;
            case 0 : PopHtml = "<table style='margin-bottom: 10px;'>\
                    <tr>\
                        <td width='257'><p style='font-size: 18px; color: #ff6712; text-align: left;'>恭喜你获得红色糖果！</p></td>\
                        <td rowspan='2'><img src='http://stdl.qq.com/stdl/halloween/images/sweets_red.png'></td>\
                    </tr>\
                    <tr>\
                        <td height='70' style='color: #967044;vertical-align: top; text-align: left; line-height: 20px;'>活动期间保持将QQ浏览器设置为默认浏览器，<br>即可每天领取一颗红色糖果</td>\
                    </tr>\
                </table>\
                <div class='P_btns'>\
                    <a href='javascript:;' class='btn btn_sure' onclick='api.dialog.hide();'><span>我知道了</span></a>\
                </div>";
                break;
            case 1 : PopHtml = "<div class='popLogo'></div>\
                    <p style='font-size: 18px; line-height: 30px; margin-bottom: 25px;'>您的默认浏览器是QQ浏览器，<br>可以领取一颗红色糖果！</p>\
                <div class='P_btns'>\
                    <a href='javascript:;' class='btn btn_sure' onclick='api.dialog.hide();setDefaultClick();'><span>立即领取</span></a>\
                </div>";
                api.clickReport('ISDEFAULTQB');
                break;
            case 2 : PopHtml = "<div class='popLogo'></div>\
                    <p style='font-size: 18px; line-height: 30px; margin-bottom: 25px;'>设置QQ浏览器为默认浏览器，<br>立即领取红色糖果！</p>\
                <div class='P_btns'>\
                    <a href='javascript:;' class='btn btn_sure' onclick='api.dialog.hide();isSetDefault = true;setDefaultClick();api.clickReport(\"SETDEFAULTQBCLICK\");'><span>设置默认</span></a>\
                </div>";
                api.clickReport('TOSETDEFAULTQB');
                break;
            default : PopHtml = "<p style='font-size: 18px; font-weight: bold; line-height: 30px; padding-top: 60px; margin-bottom: 65px;'>活动太火爆了，请稍后再试！</p>\
                <div class='P_btns'>\
                    <a href='javascript:;' class='btn btn_sure' onclick='api.dialog.hide();'><span>我知道了</span></a>\
                </div>";
        }
        return PopHtml;
    },
    1 : function(k){
        var task = {
            'img' : ['http://stdl.qq.com/stdl/halloween/images/sweets_1.png','http://stdl.qq.com/stdl/halloween/images/sweets_2.png','http://stdl.qq.com/stdl/halloween/images/sweets_3.png'],
            'detail' : [
                ['看看导航里的精彩内容','搜索“万圣节”相关内容'],
                ['订阅“视频中心”到桌面','订阅“直播中心”到桌面'],
                ['去领取您的专属特权','去玩玩最新热门游戏']
            ],
            'buttonName' : [
                ['看导航','去搜索'],
                ['去订阅','去订阅'],
                ['领特权','玩游戏']
            ],
            'url' : [
                ['daohang','sogou'],
                ['video','live'],
                ['tq','game']
            ]
        };
        var taskList = '' +
            '<tr><td width="220" height="50">1.'+ task.detail[k][0] +'</td><td style="padding-top: 3px;"><a class="btn btn_sure2" href="javascript:;" data-href="' + task.url[k][0] + '" target="_blank"><span>'+ task.buttonName[k][0] +'</span></a></td></tr>'
            +'<tr><td width="220" height="50">2.'+ task.detail[k][1] +'</td><td style="padding-top: 3px;"><a class="btn btn_sure2" href="javascript:;" data-href="' + task.url[k][1] + '" target="_blank"><span>'+ task.buttonName[k][1] +'</span></a></td></tr>';
        PopHtml = "<div style='width: 380px; margin: 0 auto; padding:0 0 0 45px;'>\
                    <p style='font-size: 18px; height: 77px; text-align: left; padding-bottom: 10px;'><span style='display: inline-block; padding-top: 40px; padding-right: 45px;'>在以下页面寻找宝箱抽取</span><img src='" + task.img[k] + "'></p>\
                    <table border='0' style='font-size: 16px;text-align: left;'>"+ taskList +"</table>\
                </div>";
        return PopHtml;
    },
    0 : function(k,name,cdkey){
        if(k == -1) {
            var _text = '',
                j = 0;
            for(var m in collect_btn_disable) {
                if(+(m) > 3) { break; }
                if(collect_btn_disable[m] == true) {
                    j++;
                }
            }
            if(j >= 4) {
                _text = "<p style=' height: 120px; padding-top: 35px; line-height: 30px;'>T_T，今天收集的糖果已经用光啦<br>明天再来收集糖果参加抽奖吧！</p>";
            } else {
                _text = "<p style=' height: 110px; padding-top: 45px; line-height: 30px;'>T_T，请先集齐4色糖果再来抽奖吧~</p>";
            }
            PopHtml = _text + "\
                <div class='P_btns'>\
                    <a href='javascript:;' class='btn btn_sure' onclick='api.dialog.hide();'><span>我知道了</span></a>\
                </div>";
        } else if(k == 1 || k == 2) {
            PopHtml = "<p style='font-size: 18px; padding-top: 15px; padding-bottom: 10px;'>恭喜您抽到了<span>"+ name +"</span>！</p>\
                <p class='gray' style='height: 105px; line-height: 30px;'>请填写您的联系方式，<br>我们将在活动结束后15天内将奖品发出。</p>\
                <div class='P_btns'>\
                    <a href='javascript:;' class='btn btn_sure' id='getUserBtn'><span>填写联系方式</span></a>\
                </div>";
        } else if(k == 3 || k == 4) {
            PopHtml = "<p style='font-size: 18px; padding-top: 40px; padding-bottom: 10px;'>恭喜您抽到了<span>"+ name +"</span>！</p>\
                <p class='gray' style='height: 80px; line-height: 30px;'>请在您的QQ账户中查收！</p>\
                <div class='P_btns'>\
                    <a href='javascript:;' class='btn btn_sure' onclick='shareQZ(function(){ api.dialog.hide(); })'><span>分享活动</span></a>\
                </div>";
        } else if(k == 5 || k == 7) {
            var imgSrc = '';
            if(k == 5) {
                imgSrc = 'http://stdl.qq.com/stdl/halloween/images/code_wp.jpg';
            } else {
                imgSrc = 'http://stdl.qq.com/stdl/halloween/images/code_ht.jpg';
            }
            PopHtml = "<p style='font-size: 18px; margin-top: -20px;'>恭喜您抽到了<span>"+ name +"</span>！</p>\
                <p class='gray' style='height: 150px; line-height: 40px;'>请扫描下面的二维码进行领取！<br><img src='"+ imgSrc +"' width='100'></p>\
                <div class='P_btns'>\
                    <a href='javascript:;' class='btn btn_sure' onclick='api.dialog.hide();'><span>我知道了</span></a>\
                </div>";
        } else if(k == 6 || k == 8) {
            var _url = "";
            if(k == 6) {
                _url = "http://m.beequick.cn/show/tuiguang?tg=20198";
            } else {
                _url = "http://gsactivity.diditaxi.com.cn/gulfstream/activity/v2/giftpackage/index?g_channel=c6df4a39577ca6ce380b49c655430b82";
            }
            PopHtml = "<p style='font-size: 18px; padding-top: 40px; padding-bottom: 10px;'>恭喜您抽到了<span>"+ name +"</span>！</p>\
                <p class='gray' style='height: 80px; line-height: 30px;'>请到产品官网兑换！</p>\
                <div class='P_btns'>\
                    <a href='"+ _url +"'  target='_blank' class='btn btn_sure'><span>去兑换</span></a>\
                </div>";
        }/* else if(k == 6) {
            PopHtml = "<p style='font-size: 18px; padding-top: 15px; padding-bottom: 10px;'>恭喜您抽到了<span>"+ name +"</span>！</p>\
                <p class='gray' style='height: 105px; line-height: 30px;'>CDKey： <span style='color: #ff0000'>"+ cdkey +"</span><br><a href='javascript:;' onclick='api.dialog.show(tips[\"11\"](),true)'>CDKey使用说明</a></p>\
                <div class='P_btns'>\
                    <a href='javascript:;' class='btn btn_sure' onclick='api.dialog.hide();'><span>我知道了</span></a>\
                </div>";
        } else if(k == 8) {
            PopHtml = "<p style='font-size: 18px; padding-top: 40px; padding-bottom: 10px;'>恭喜您抽到了<span>"+ name +"</span>！</p>\
                <p class='gray' style='height: 80px; line-height: 30px;'>请到产品官网兑换！</p>\
                <div class='P_btns'>\
                    <a href='http://gsactivity.diditaxi.com.cn/gulfstream/activity/v2/giftpackage/index?g_channel=20a73e4488df0dec49af841c62ed342d' target='_blank' class='btn btn_sure'><span>去兑换</span></a>\
                </div>";
        }*/ else if(k == 9 || k == 10) {
            if(k == 9) {
                name = 'TRG-21突击手(7天),微笑雪人帽(7天)';
            } else {
                name = 'MG3-(7天),SCAR-Light-狼牙(7天)';
            }
            PopHtml = "<p style='font-size: 18px; padding-top: 15px; padding-bottom: 10px;'>恭喜您抽到了<span>CF礼包</span>！</p>\
                <p class='gray' style='height: 105px; line-height: 24px;'>礼包内容："+ name +"<br>CDKey： <span style='color: #ff0000'>"+ cdkey +"</span><br>请复制CDKey到CF官网兑换！</p>\
                <div class='P_btns'>\
                    <a href='http://cf.qq.com/web201105/cdkey.shtml' target='_blank' class='btn btn_sure'><span>去兑换</span></a>\
                </div>";
        } else if(k == 11) {
            PopHtml = "<p style=' height: 120px; padding-top: 35px;'>恭喜你抽中特权中心20积分！<br>去看看能领取什么特权吧！</p>\
                <div class='P_btns'>\
                    <a href='http://tq.qq.com/?adtag=halloween' target='_blank' class='btn btn_sure' onclick='api.dialog.hide();'><span>领特权</span></a>\
                </div>";
        } else{
            PopHtml = "<p style=' height: 100px; padding-top: 55px;'>亲，活动太火爆了，请稍后再试</p>\
                <div class='P_btns'>\
                    <a href='javascript:;' class='btn btn_sure' onclick='api.dialog.hide();'><span>我知道了</span></a>\
                </div>";
        }
        return PopHtml;
    }
};

//抽奖动画
inGame = false;
function StartGame(key, cb){
    inGame = true;
    var keyArr = [15,305,126,342,53,90,163,235,199,199,270];
    $("#luckyGift").rotate({
        angle: 0,
        animateTo: parseInt(1080 + keyArr[key-1]),
        duration: 3000,
        easing: $.easing.easeInOutQuart,
        callback: cb
    });
};


$('.btn_lucky').click(function(){
    if(inGame){
        return;
    }

    getBigLucky(function(res){
        var key = res.data.op.diamonds;
        var name = res.data.op.name;
        var cdkey = res.data.op.cdkey || '';
        var k;

        StartGame(key, function(){
            inGame = false;
            api.dialog.alert(tips['0'](key,name,cdkey));
            updateCoin(setDrawCount);
        });
    });

    api.clickReport('LUCKYCLICK');
});

//查询中奖纪录
function queryGifts() {
    api.ensureLogin(function(){
        api.requestAms(68447, function(res){
            if(res.ret === 0){
                var _htmlArr = [],
                    _html = '',
                    count = 0,
                    j = 0;
                for (var i in res.data.op) {
                    var obj = res.data.op[i].val,
                        level = obj.level,
                        time = qv.date.format("Y.m.d", obj.time * 1000),
                        name = obj.name;
                    if (obj.name === "谢谢参与"){continue;}
                    if(level == 1 || level == 2) {
                        _htmlArr.push('<li><span class="p_time">'+ time +'</span><span class="p_name">'+ name +'</span><a href="javascript:;" id="getUserBtn">填写联系方式</a></li>');
                    } else if(level == 6 || level == 8) {
                        var _url = '';
                        if(level == 6) {
                            _url = "http://m.beequick.cn/show/tuiguang?tg=20198";
                        } else {
                            _url = "http://gsactivity.diditaxi.com.cn/gulfstream/activity/v2/giftpackage/index?g_channel=c6df4a39577ca6ce380b49c655430b82";
                        }
                        _htmlArr.push('<li><span class="p_time">'+ time +'</span><span class="p_name">'+ name +'</span><a href="'+ _url +'" target="_blank">去兑换</a></li>');
                    } else if(level == 9 || level == 10) {
                        _htmlArr.push('<li><span class="p_time">'+ time +'</span><span class="p_name">'+ name +'</span><a href="http://vip.qq.com/my/gift.html" target="_blank">查看CDK</a></li>');
                    } else {
                        _htmlArr.push('<li><span class="p_time">'+ time +'</span><span class="p_name">'+ name +'</span></li>');
                    }
                    count++;
                }
                if (count == 0) {
                    _html = '<li class="noGifts">亲，您还没有获得任何奖品哦~</li>';
                }else{
                    _html = _htmlArr.join("");
                }
                api.dialog.alert(tips['6'](_html),'popRecords');
            } else if(res.ret === 10002){
                qq.login.open();
            }
            else{
                dealAmsErrorCode(res.ret);
            }
        });
        api.clickReport('QUERYGIFTCLICK');
    });
}

/*分享*/
function shareQZ(cb) {
    api.ensureLogin(function () {
        var b = {
            url: "http://event.browser.qq.com/stdl/halloween/index.html?pvsrc=qzoneshare&ADTAG=qzoneshare",
            showcount: "1",
            desc: "哇，我刚在#QQ浏览器万圣节狂欢派对#中抽到了Q币，已经收到了！这个活动真好玩，还能抽玫瑰金！一起来玩吧~",
            summary: "哇，我刚在#QQ浏览器万圣节狂欢派对#中抽到了Q币，已经收到了！这个活动真好玩，还能抽玫瑰金！一起来玩吧~",
            title: "QQ浏览器万圣节狂欢派对",
            pics: "http://stdl.qq.com/stdl/halloween/img/share.jpg",
            style: "203",
            width: 98,
            height: 22
        };
        var s = [];
        for(var i in b){
            s.push(i + '=' + encodeURIComponent(b[i]||''));
        }
        window.open("http://sns.qzone.qq.com/cgi-bin/qzshare/cgi_qzshare_onekey?" + s.join('&'));
        cb ? cb() : null;
    });
}

window.onload = function(){
    window.api.initHeader(); //初始化登录头部，footer

    if(api.isQQBrowser9()) {
        //检查插件是否安装, 若安装设置prx
        try{
            chrome.management.get(EXTENSION_ID, function (installed) {
                if (installed) {
                    has_extension_installed = true;
                    initPrx();
                    api.ensureLogin();
                }
                else{
                    api.dialog.open(tips['10']());
                }
            });
            window.api.ensureNetService(); //确认NetService更新到新版
        } catch(e){
            api.requestAms(69853,function(){});
            api.dialog.alert(tips['7']());
        }
    }

    //更新货币数目
    updateCoin(setDrawCount);
    updateCollectBtn();
    qq.login.bind('login',function(){
        updateCoin(setDrawCount);
        updateCollectBtn();
    });

    setEventListen(); //绑定用户事件

    window.api.pvReport(); //pv上报


    $('.kvlist').slick({
        infinite: true,
        speed: 200,
        slidesToShow: 5,
        slidesToScroll: 1
    });


    $('.btn_getlucky').click(function(){
        $('.lucky').show();
        $('.masklayer').show();
        api.clickReport('LUCKYBTNCLICK');
    });


    $('.masklayer,.lucky_close').click(function(){
        $('.lucky').hide();
        $('.masklayer').hide();
    });

};