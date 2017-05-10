window.qb.view = 1; //判断按钮是否可点（礼包展示错误）

function report(hottagValue) {
    window.setTimeout(function () {
        pgvSendClick({hottag: hottagValue});
    }, 100);
}
if(typeof(pgvMain) == 'function') {
    pgvMain("pathtrace", {pathStart: true, tagParamName: "ADTAG", useRefUrl: true, override: true, careSameDomainRef: false});
}
if(typeof console === "undefined"){
    console = { log: function() { } };
}

jQuery(window).scroll(function(){
    if(jQuery(window).scrollTop() >= 510){
        jQuery('#rightMenu').css({'position':'fixed','top':'45px'});
    }else{
        jQuery('#rightMenu').css({'position':'absolute','top':'555px'});
    }
});
jQuery(window).resize(function(){
    var winW = jQuery(window).width();
    if(winW > 1400){
        jQuery('#rightMenu').css({'right':'50%','margin-right':'-700px'});
    }else{
        jQuery('#rightMenu').css({'right':'0','margin-right':'0'});
    }
});

window.onload = function(){
    //加载登录
    window.api.initHeader();
    //加载主框架
    initLucky();
    //右侧浮动
    jQuery(window).scroll();
    jQuery(window).resize();
    //展示礼包
    giftsView(function () {
        //设置按钮状态
        buttonView();
    });

//绑定按钮事件
    jQuery('.middle_1 .btn').click(function () {
        //礼包展示失败，禁止按钮动作
        if(window.qb.view == 0) {
            return;
        }
        var This = jQuery(this);
        var _id = This.index();
        //已领取，禁止按钮动作
        if(This.hasClass('disabled') || This.hasClass('isExchange')) {
            return;
        }
        //判断QQ浏览器
        if(!window.api.isQQBrowser()){
            window.api.dialog.alert(window.api.tips['7']());
            return false;
        }
        zUtil.ensureLogin(function () {
            buttonView(function () {
                if(window.qb.join == 0) {
                    if(window.qb._isOpen[_id] == 0) {
                        window.qb._url[_id] = window.qb._href[0] + parseInt(_id+1);
                    } else if(window.qb._isOpen[_id] == 1) {
                        window.qb._url[_id] = window.qb._href[1];
                    }
                    window.qb.coin = qv.cookie.get('tga_act_num');
                    if(!window.qb.coin){
                        window.qb.coin = 0;
                    }
                    if((window.qb.coin < parseInt(_id+1)*2)) {
                        window.api.dialog.alert(window.api.tips['5'](parseInt(_id+1)*2));
                    } else {
                        window.api.dialog.alert(window.api.tips['6'](window.qb._name[_id], window.qb._url[_id], _id));
                    }
                } else {
                    window.api.dialog.alert(window.api.tips['1'](4));
                }
            },true);
            report("BROWSER.ACTIVITY.TGA.EXCHANGEGIFTSCLICK" + _id);
        });
    })

};

//礼包展示
function giftsView(cb,flag){
    window.api.tgaStatus(function (res) {
        if(res.ret == 0) {
            var giftsArr = res.data;
            window.qb.status = giftsArr;
            var _id = 0,
                _style = '',
                _html = '';
            for(var i = 0; i < giftsArr.length; i++) {
                if(giftsArr[i] == true) {
                    _id = 0;
                    _style = 'padding-top: 40px;';
                } else {
                    _id = 1;
                    _style = 'padding-top: 20px;';
                }
                _html += '<div class="wrap gifts_'+ parseInt(i+1) +'">\
                    <h3>当日观看直播'+ window.qb.number[i] +'个</h3>\
                    <p style="'+ _style +'">'+ window.qb.title[i][_id] +'</p>\
                    <img src="'+ window.qb.pic[i][_id] +'">\
                </div>';
            }
            jQuery('#gifts_lists').html(_html);
        } else {
            if(!flag) {
                giftsView(cb,true);
                cb ? cb() : '';
            } else {
                window.qb.view = 0;
                report("BROWSER.ACTIVITY.TGA.GIFTSVIEWERROR");
                alert('网络异常，请稍候重试！');
            }
        }
    });
}

//设置按钮状态
function buttonView(cb,flag,sign){
    var coin = qv.cookie.get('tga_act_num');
    window.api.tgaSet(coin, function (res) {
        if(res.ret == 0) {
            window.qb.coin = res.data.coin;
            window.qb.join = res.data.join;
            setButton(window.qb.join);
            cb ? cb() : '';
        } else if(res.ret == 1002) {
            setButton(0);
        } else {
            if(!!flag) {
                if(!sign) {
                    buttonView(cb,true,true);
                } else {
                    report("BROWSER.ACTIVITY.TGA.BUTTONVIEWERROR");
                    alert('网络异常，请稍候再试！');
                }
            }
        }
    })
}
function setButton(join){
    var status = window.qb.status;
    var _className = ['','','',''];
    if(join != 0) {
        for(var k in _className) {
            if( k == join-1) {
                _className[k] = 'isExchange';
            } else {
                _className[k] = 'disabled';
            }
            window.qb._isOpen[k] = -1;
        }
    } else {
        for(var i = 0; i < status.length; i++) {
            if(status[i] === false) {
                window.qb._isOpen[i] = 1;
            } else {
                window.qb._isOpen[i] = 0;
            }
            _className[i] = '';
        }
    }
    //设置按钮状态
    jQuery('.middle_1 .btn').each(function (index) {
        jQuery(this).removeClass('isExchange disabled').addClass(_className[index]);
    });

}

//定时查询TGA礼包领取状态
function setTimeQuery(name) {
    window.onfocus = function () {
        window.api.tgaGet(function (res) {
            if(res.ret == 0) {
                var _join = res.data.join;
                if(_join != window.qb.join) {   //查询是否领取，成功则返回，并清空onfocus事件
                    window.api.dialog.alert(window.api.tips['4'](name));
                    window.qb.join = res.data.join;
                    setButton(window.qb.join);
                    window.onfocus = function () {}
                }
            }
        });
    };
}

var initLucky = function(){
    (function (window,$) {
        Page = qv.zero.extend(qv.zero.AbstractPage,{
            userJsonID : 58908,
            //preloads : [],
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
                qq.login.bind('login', function () {
                    buttonView();
                });
                qq.login.bind('logout', function () {
                    setButton(0);
                });
            },
            exchange: function(id){
                if(!window.api.isQQBrowser()){
                    window.api.dialog.alert(window.api.tips['7']());
                    return false;
                }
                var index = id;
                var arrid = [58944,58966,58967,58968];
                var actid = arrid[index];
                zUtil.ensureLogin(function(){
                    zHttp.send({'actid' : actid,'Tga' : '1'}, function (res) {
                        if (res.ret == 0) {
                            var name = res.data.actname;
                            var ccdkey = res.data.op.cdkey;
                            window.api.dialog.alert(window.api.tips['0'](name, ccdkey));
                            window.api.tgaConfirm(parseInt(index+1));
                            //领取成功设置按钮状态
                            window.qb.join = parseInt(index + 1);
                            setButton(window.qb.join);

                        } else if (res.ret == 10601 || res.ret == 10603) {  //已领取 || 领取上限
                            window.api.dialog.alert(window.api.tips['1'](1));
                        } else if (res.ret == 10303) {  //当天已发完
                            window.api.dialog.alert(window.api.tips['1'](2));
                        } else if (res.ret == 10309) {  //全部发完
                            window.api.dialog.alert(window.api.tips['1'](3));
                        } else if (res.ret == 10002) {
                            qq.login.open();
                        } else if(res.ret == 10001 || res.ret == 10004){
                            window.api.dialog.alert(window.api.tips['9']());
                        } else {
                            zHttp.showResponse(res, res.actid, $.noop);
                        }
                    });
                });
            }
        });
        window.page = new Page();
    })(window,jQuery);
};

