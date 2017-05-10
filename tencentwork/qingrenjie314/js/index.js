/**
 * Created by rzm on 15/3/5.
 */

window.onload = function(){
    window.api.initHeader();

    initLucky();
    page.queryChance();
    qq.login.bind('login',function(){
        page.queryChance();
    });

    window.qb.qb_guid = 0; // window.api.getGuid 有可能不返回数据
    window.api.getGuid(function(err, guid){
        if(err == 0){
            window.qb.qb_guid = guid || 0;
            if(guid === '' && api.isQQBrowser){
                zHttp.send({ actid : 39718});
            }
        }
        else{
            api.isQQBrowser ? page.errorReport(err) : null;
        }
    });
    window.api.pvReport(); //pv上报
};

var share = function(type){
    if(type == "weixin"){
        window.api.weixinPop();
    }
    else{
        window.api.share(type);
    }
};

 function chance(num){
     if(num >= 0){
         jQuery('#money').text(num);
     }
 }

var initLucky = function(){
    (function (window,$) {
        Page = qv.zero.extend(qv.zero.AbstractPage,{
            userJsonID : 39711,
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
            },

            getLucky: function(){
                if(!window.api.isQQBrowser){
                    window.api.notQBpop({type:1});
                    return false;
                }

                if(window.qb.qb_guid == 0 || window.qb.qb_guid === ''){
                    window.api.notQBpop({type:3});
                    return false;
                }

                zUtil.ensureLogin(function(){
                    if(inGame){return;}
                    var _url = "http://festival.browser.qq.com/valentineOperation?_record_gift_flow=1&actid=39720&guid="+window.qb.qb_guid;
                    zHttp.send(_url, function(ret){
                    // _record_def_gift 为1时记录末等奖的奖品  ，不记录则不填写此字段
                        if(ret.ret == 0) {
                            try {
                                var key = ret.data.op.diamonds;

                                if (key >= 1 && key <= 16) {
                                    if(key >= 12 || key == 9){
                                        key = parseInt(Math.random() * (16 - 12 + 1) + 12);
                                    }
                                    StartGame(key, function () {
                                        zHttp.showResponse(ret, ret.actid, $.noop);
                                    });
                                }
                                else{
                                    zHttp.showResponse(ret, ret.actid, $.noop);
                                }
                            }
                            catch(e){
                                zHttp.showResponse(ret, ret.actid, $.noop);
                            }
                            page.queryChance(); //important
                        }
                        else if(ret.ret == 10002){
                            qq.login.open();
                        }
                        else if(ret.ret == -2){
                            zMsg.alert("您的浏览器已达到抽奖上限，同一个浏览器最多抽20次，剩余抽奖次数作废！");
                        }
                        else if(ret.ret == -1){
                            window.api.notQBpop({type:3});
                        }
                        else if(ret.ret == 10001 || ret.ret == 10004){
                            zMsg.alert("抽奖活动已经结束，敬请期待更多QQ浏览器特权活动！");
                        }
                        else{
                            zHttp.showResponse(ret, ret.actid, $.noop);
                        }
                    });

                });
                window.api.clickReport('BROWSER.ACTIVITY.LOVER.LUCKYCLICK');
            },
            queryGift : function(){
                zUtil.ensureLogin(function() {
                    zHttp.send({actid: 39719}, function (res) {
                        if (res.ret == 0) {
                            var _htmlArr = [], count = 0;
                            for (var i in res.data.op) {
                                var obj = res.data.op[i].val;
                                if(obj.name === "谢谢参与"){continue;}
                                _htmlArr.push(qv.string.format('<li>{time} 获得 {value}</li>', {
                                    time: qv.date.format("Y-m-d", res.data.op[i].val.time * 1000),

                                    value: res.data.op[i].val.name
                                }));
                                count++;
                            }

                            if (count == 0) {
                                _htmlArr.push('<li>您还没有任何奖品哦~</li>');
                            }
                            else {
                                _htmlArr.push("<br>若抽中实物礼品，请<a style='color: red' target='_blank' href='http://vip.qq.com/my/info.html'>填写联系方式>></a>");
                            }
                            zMsg.alert(_htmlArr.join(""));
                        }else if(res.ret == 10002){
                            qq.login.open();
                        }
                        else if(res.ret == 10001 || res.ret == 10004){
                            zMsg.alert("抽奖活动已经结束，敬请期待更多QQ浏览器特权活动！");
                        }
                        else{
                            zHttp.showResponse(res, res.actid, $.noop);
                        }
                    });
                });
                window.api.clickReport('BROWSER.ACTIVITY.LOVER.QUERYGIFT');
            },
            queryChance : function(){
                zHttp.send({ actid : 39722, _c : 'view'},function(json){
                    if(json.ret == 0) {
                        chance(json.data.op);
                    }
                    else if(json.ret == 10002){
                        ;
                    }
                });
                window.api.clickReport('BROWSER.ACTIVITY.LOVER.QUERYCHANCE');
            },
            errorReport : function(error){
                var _error = error;
                _error = error + 1094;
                zHttp.send({ actid : 39717+_error},function(json){
                    if(json.ret == 10002){
                        ;
                    }
                });
                window.api.clickReport('BROWSER.ACTIVITY.LOVER.ERRORREPORT');
            }
        });
        window.page = new Page();
    })(window,jQuery);
};


//抽奖
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
    inGame = false;
function StartGame(key, cb){
    if(inGame){
        cb();
        return;
    }

    inGame = true;

    var arr_map = [4,1,12,15,7,9,13,5,16,10,2,0,3,6,8,11,14];
    key = arr_map[key-1];

    index=0;
    prevIndex=0;
    cycle=0;
    Speed=300;
    EndIndex=0;
    quick=0;
    EndCycle=0;

    flag=false;
    EndIndex=Math.floor(Math.random()*16+1);
    circle_box=[];
    for(var i=0; i<16;i++){
        circle_box.push(document.getElementById("lucky-box-"+i));
        circle_box[i].className = 'lucky-box';
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
    circle_box[prevIndex].className = 'lucky-box';
    circle_box[index].className = 'lucky-box active';

    index++;
    quick++;
}