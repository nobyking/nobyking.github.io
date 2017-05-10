/**
 * Created by peng on 15/2/2.
 */


window.onload = function(){
    initLucky();
    window.qb.sid = 0;
    window.qb.qb_guid = 0; // window.api.getGuid 有可能不返回数据
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

var initLucky = function(){
    (function (window,$) {
        page = new qv.zero.Page({
            jsonid : 39711,

            getLucky: function(flag){
                if (!window.api.isQQBrowser()) {
                    window.api.notQBpop({type: window.api.isCanRun}); //type == 0 非QQ浏览器，type == 1 QQ浏览器版本低, type == 2 正常，type == 3 查看答案需要（提示语不同）
                    return false;
                }
                window.api.checkLogin(function(sign, sid){
                    if(sign){
                        if (inGame) {
                            return;
                        }
                        var _url = "http://festival.browser.qq.com/valentineOperation?_record_gift_flow=1&actid=39720&sid="+sid;
                        zHttp.send(_url, function (ret) {
                            // _record_def_gift 为1时记录末等奖的奖品  ，不记录则不填写此字段
                            if(ret.ret == 10002){
                                if(!flag){
                                    zHttp.send({actid: 40511, sid: sid},function(){
                                        page.getLucky(true);
                                    });
                                    return;
                                }else{
                                    zMsg.show("活动太火爆了，请稍后再试！");
                                    zHttp.send({actid: 40512, sid: sid});
                                }
                            }
                            else if (ret.ret == 0) {
                                try {
                                    var key = ret.data.op.diamonds;

                                    if (key >= 1 && key <= 16) {
                                        if (key >= 12 || key == 9) {
                                            key = parseInt(Math.random() * (16 - 12 + 1) + 12);
                                        }
                                        StartGame(key, function () {
                                            zHttp.showResponse(ret, ret.actid, $.noop);
                                        });
                                    }
                                    else {
                                        zHttp.showResponse(ret, ret.actid, $.noop);
                                    }
                                }
                                catch (e) {
                                    zHttp.showResponse(ret, ret.actid, $.noop);
                                }
                                //page.queryMoney(); //important
                            }
                            else if (ret.ret == -2) {
                                zMsg.show("您的浏览器已达到抽奖上限，同一个浏览器最多抽20次，剩余抽奖次数作废！");
                            }
                            else if (ret.ret == -1) {
                                window.api.notQBpop({type: 1});
                            }
                            else if (ret.ret == 10001 || ret.ret == 10004) {
                                zMsg.show("抽奖活动已经结束，敬请期待更多QQ浏览器特权活动！");
                            }
                            else {
                                zHttp.showResponse(ret, ret.actid, $.noop);
                            }
                        });
                    }else{
                        zMsg.show("请重新登录！");
                    }
                });
                window.api.clickReport('BROWSER.ACTIVITY.LOVERIPAD.LUCKYCLICK');
            },
            queryGift : function(){
                if (!window.api.isQQBrowser()) {
                    window.api.notQBpop({type: window.api.isCanRun});
                    return false;
                }
                window.api.checkLogin(function(sign, sid){
                    if(sign) {
                        zHttp.send({actid: 39719,sid: sid}, function (json) {
                            if (json.ret == 0) {
                                var _htmlArr = [], count = 0, _time, _value;
                                for (var i in json.data.op) {
                                    var obj = json.data.op[i].val;
                                    if (obj.name === "谢谢参与") {
                                        continue;
                                    }
                                    _time = window.api.dataFormat("yyyy-MM-dd", json.data.op[i].val.time * 1000);
                                    _value = json.data.op[i].val.name;
                                    _htmlArr.push('<li>'+ _time +' 获得 '+ _value +'</li>');
                                    count++;
                                }
                                if (count == 0) {
                                    _htmlArr.push('<li>您还没有任何奖品哦~</li>');
                                }
                                else {
                                    _htmlArr.push("<br>若抽中实物礼品，请<a style='color: red' target='_blank' href='http://vip.qq.com/my/info.html'>填写联系方式>></a>");
                                }
                                zMsg.show(_htmlArr.join(""));
                            } else if (json.ret == 10002) {
                                zMsg.show("活动太火爆了，请稍候再试！");
                            } else if(json.ret == 10001 || json.ret == 10004){
                                zMsg.show("抽奖活动已经结束，敬请期待更多QQ浏览器特权活动！");
                            }
                        });
                    }else{
                        zMsg.show("请重新登录！");
                    }
                });
                window.api.clickReport('BROWSER.ACTIVITY.LOVERIPAD.QUERYGIFT');
            },
            queryMoney : function(){
                if (!window.api.isQQBrowser()) {
                    window.api.notQBpop({type: window.api.isCanRun});
                    return false;
                }
                window.api.checkLogin(function(sign, sid){
                    if(sign) {
                        window.qb.sid = sid;
                        zHttp.send({actid: 39722, _c: 'view',sid:sid}, function (json) {
                            if (json.ret == 0) {
                                var _html = '<p style="font-size: 24px;color:#9e041e;padding: 30px 0 40px;text-align: center;">您还有 ' + json.data.op + ' 次抽奖机会</p>';
                                window.api.dialog({body:_html});
                            }
                            else if (json.ret == 10002) {
                                zMsg.show("活动太火爆了，请稍后再试！");
                            }
                        });
                    }else{
                        zMsg.show("请重新登录！");}
                });
                window.api.clickReport('BROWSER.ACTIVITY.LOVERIPAD.QUERYCHANCE');
            }
        });
    })(window,Zepto);
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
