/**
 * Created by rzm on 15/3/5.
 */

(function (window,$) {
    Page = qv.zero.extend(qv.zero.AbstractPage,{
        userJsonID : 41281,
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
        //抢物品
        exchange:function(act,cb,_actid){
            var index = act;
            var firstId = _actid ? _actid : 10000;
            var actid = [firstId,41591,41592,41593,41594,41595,41596,41597];
            var act = actid[index];
            api.requestAMS({actid:act, _record_gift_flow:1}, function(res){
                var name = res.data.actname;
                if(res.ret == 0){
                    //api.dialog.open(api.tips[0](1, name));
                    cb(res);
                }else if(res.ret == 10002){
                    cb(res);
                }else if (res.ret == 10001 || res.ret == 10004) {
                    api.dialog.open(api.tips[9]());//活动已结束
                }else if(res.ret == 10303 || res.ret == 10603 || res.ret == 10601 || res.ret == 10008 || res.ret == 10009){
                    //api.dialog.open(api.tips[0](2, name));
                    cb(res);
                }else{
                    api.dialog.open(api.tips[10]());//活动太火爆
                }
            });
            window.api.clickReport('BROWSER.ACTIVITY.YURENJIE.EXCHANGE_'+act);
        },
        //拆红包
        getLucky: function(cb){
            api.requestAMS({actid:41602, _record_gift_flow:1}, function(res){
                if(res.ret == 0) {
                    //var key = res.data.op.diamonds;
                    //api.dialog.show(api.tips[2](key));  //1-> 途牛券、 2-> QB、 3-> 谢谢参与、 else -> 未知错误类型
                    cb(res);
                }
                else if(res.ret == 10002){
                    //忽略10002
                }
                else if(res.ret == -1){
                    api.dialog.open(api.tips[7]());//QQ浏览器版本过低
                }
                else if(res.ret == 10601){
                    api.dialog.show(api.tips[2](4));
                }
                else if(res.ret == 10001 || res.ret == 10004){
                    api.dialog.open(api.tips[9]());//活动已结束
                }else if(res.ret == 10303 || res.ret == 10603 || res.ret == 20147 || res.ret == 10601 || res.ret == 10008 || res.ret == 10009){
                    api.dialog.show(api.tips[2](3, false));   
                }
                else{
                    api.dialog.show(api.tips[2](),true);//活动太火爆
                }
            });
            window.api.clickReport('BROWSER.ACTIVITY.YURENJIE.LUCKYCLICK');
        },
        queryGift : function(){
            api.requestAMS({actid: 42034, needQB: false}, function (res) {
                if (res.ret == 0) {
                    var _htmlArr = [], count = 0, explain = '', _html = '', k = 0;
                    for (var i in res.data.op) {
                        k = parseInt(i)+1;
                        k = k < 10 ? '0'+k : k;
                        var obj = res.data.op[i].val;
                        if(obj.name === "谢谢参与"){continue;}
                        if(obj.name === "途牛抵用券30元"){
                            _htmlArr.push(qv.string.format('<li>'+k+'.&nbsp;&nbsp;<span>{time}</span>{value}</li>', {
                                time: qv.date.format("Y-m-d", res.data.op[i].val.time * 1000),
                                value: "途牛抵用券30元"
                            }));
                        }else{
                            _htmlArr.push(qv.string.format('<li>'+k+'.&nbsp;&nbsp;<span>{time}</span>{value}</li>', {
                                time: qv.date.format("Y-m-d", res.data.op[i].val.time * 1000),
                                value: res.data.op[i].val.name
                            }));
                        }
                        count++;
                    }

                    if (count == 0) {
                        explain = '<p style="padding-top: 60px; font-size: 16px; text-align: center;">这里空空如也……还不快去抢购？！</p>';
                    }
                    else {
                        explain = " <ul class='gift-info'> " + _htmlArr.join('') + " </ul>\
                                    <ul class='gift-explain'>\
                                        <li>若抽中实物礼品，请<a target='_blank' href='http://vip.qq.com/my/index.html#address'>填写联系方式</a></li>\
                                        <li>若抽中途牛抵用券，请<a href='http://vip.qq.com/my/gift.html' style='color: red; text-decoration: underline;' target='_blank'>查看抵用券</a> 和  <a href='http://www.tuniu.com/help/content.shtml?5#q1?p=16388&cmpid=mkt_06019901&utm_campaign=Daohang&utm_source=hao.qq.com&utm_medium=referral&ADTAG=browser.qq.com&SNO=tencent' target='_blank'>兑换说明</a></li>\
                                        <li>若抽中Q币，请直接到<a href='http://my.pay.qq.com/account/index.shtml' target='_blank'>我的账户</a>中查看</li>\
                                    </ul>";
                    }
                    _html = "<div class='gift-list'>\
                                <h3 class='gift-title'>抢购记录</h3>\
                                " + explain +"\
                            </div>";
                    api.dialog.open(_html);
                }else if(res.ret == 10002){
                    //qq.login.open();
                }
                else if(res.ret == 10001 || res.ret == 10004){
                    api.dialog.open(api.tips[9]());//活动已结束
                }
            });
            window.api.clickReport('BROWSER.ACTIVITY.YURENJIE.QUERYGIFT');
        },
        queryLucky : function(cb, flag){ //查询当天有没有领红包的机会
            if(!api.isQQIpad){
                zUtil.ensureLogin(function() {
                    zHttp.send({actid: 41842, _c: 'view'}, function (json) {
                        json.ret == 0 ? cb(0, !json.data.op.count) : cb(1);
                    });
                });
            }
            else{
                api.isIpadLogin(function(isLogin,data){
                    if(isLogin && data.qbid){
                        api.delCookie('uin');
                        zHttp.send({ actid : 41842, _c : 'view',sid: data.qbid},function(json){
                            json.ret == 0 ? cb(0, !json.data.op.count) : cb(1);
                        });
                    }
                    else{
                        cb(1);
                    }
                },flag);
            }
            // window.api.clickReport('BROWSER.ACTIVITY.YURENJIE.QUERYCHANCE');
        },
        queryDefault : function(cb){ //查询有没有参与过设置默认
            /*zHttp.send({ actid : 41827, _c : 'view'},function(json){
             json.ret == 0 ? cb(0, !json.data.op.count) : cb(1);
             });*/
            if(!api.isQQIpad){
                zHttp.send({ actid : 41827, _c : 'view'},function(json){
                    json.ret == 0 ? cb(0, !json.data.op.count) : cb(1);
                });
            }
            else{
                cb(0,false);
            }
            //window.api.clickReport('BROWSER.ACTIVITY.YURENJIE.QUERYCHANCE');
        },
        setDefault : function(cb){  //成功设置默认
            zHttp.send({ actid : 41603},function(){
                cb();
            });
            window.api.clickReport('BROWSER.ACTIVITY.YURENJIE.SETDEFAULT');
        }
    });
    window.page = new Page();
})(window,jQuery);

(function (window,$) {

    window.qb = window.qb || {};
    window.qb.hasQueryLucky = false;
    window.qb.hasQueryDefault = false;
    window.qb.countArr = [0,0,0,0,0,0,0,0]; //倒计时
    window.qb.timeHandle = null;

    var queryLucky = function(err, result){
        if(!err){
            window.qb.hasQueryLucky = true;
            window.qb.hasLucky = result;
            if(result){
                api.dialog.alert(api.tips[6]());
            }
        }
    };
    var queryDefault = function(err, result){
        if(!err){
            window.qb.hasQueryDefault = true;
            window.qb.hasDefault = result;
        }
    };


    var qb_data = {
        gifts : [
            {
                "pic" : "images/gifts_1_1.jpg",
                "title" : "泰国曼谷-芭堤雅6日游",
                "intro" : "丛林骑大象，鳄鱼湖，泰餐全席",
                "actid" : "41585"
            },
            {
                "pic" : "images/gifts_1_2.jpg",
                "title" : "厦门双飞4日游",
                "intro" : "没有压抑，海风阳光，小清新之旅",
                "actid" : "41586"
            },
            {
                "pic" : "images/gifts_1_3.jpg",
                "title" : "韩国首尔5日游",
                "intro" : "泰迪熊博物馆，梨花壁画村",
                "actid" : "41587"
            },
            {
                "pic" : "images/gifts_1_4.jpg",
                "title" : "昆明大理丽江 雪山双飞6日游",
                "intro" : "浪漫丽江，震撼石林，玉龙雪山",
                "actid" : "41588"
            },
            {
                "pic" : "images/gifts_1_5.jpg",
                "title" : "清迈双飞5日游",
                "intro" : "象园自助餐，拜县大峡谷，悠闲小城",
                "actid" : "41589"
            },
            {
                "pic" : "images/gifts_1_6.jpg",
                "title" : "海南5日游",
                "intro" : "温泉酒店，三亚沙滩海岛，阳光椰旅",
                "actid" : "41590"
            }
        ],
        surplus : ["20" , "60" , "30" , "50" , "50" , "60" , "60" , "60"],
        timestamp : {
            0: [1427425200000,1427511600000,1427598000000,1427684400000,1427770800000,1427857200000],   //9:30:00   旅游
            1: [1427425200000,1427511600000,1427598000000,1427684400000,1427770800000,1427857200000],   //10:00:00  镜头
            2: [1427443200000,1427529600000,1427616000000,1427702400000,1427788800000,1427875200000],   //11:20:00  太阳眼镜
            3: [1427425200000,1427511600000,1427598000000,1427684400000,1427770800000,1427857200000],   //12:00:00  拍立得
            4: [1427443200000,1427529600000,1427616000000,1427702400000,1427788800000,1427875200000],   //13:00:00  移动电源
            5: [1427425200000,1427511600000,1427598000000,1427684400000,1427770800000,1427857200000],   //14:00:00  水下相机
            6: [1427443200000,1427529600000,1427616000000,1427702400000,1427788800000,1427875200000],   //15:30:00  储存卡
            7: [1427443200000,1427529600000,1427616000000,1427702400000,1427788800000,1427875200000]    //17:00:00  旅行箱
        }
    };
    var giveLucky = function(){
        var actname = window.qb.actname;

        if(window.qb.hasQueryLucky && window.qb.hasLucky){
            api.dialog.open(api.tips[0](2, actname));
        }
        else if(window.qb.hasQueryLucky){
            api.dialog.open(api.tips[0](3,actname));
        }
        else {
            page.queryLucky(function(err,result){
                if(!err && result){
                    api.dialog.open(api.tips[0](2, actname));
                    window.qb.hasQueryLucky = true;
                    window.qb.hasLucky      = true;
                }
                else{
                    api.dialog.open(api.tips[0](3,actname));
                    window.qb.hasQueryLucky = true;
                    window.qb.hasLucky      = false;
                }
            },true);
        }
    };


    var getLucky = function(){
        page.getLucky(function (res) {
            var key = res.data.op.diamonds;
            if(!window.qb.hasQueryLucky || window.qb.hasLucky){
                window.qb.hasQueryLucky = true;
                window.qb.hasLucky = false;
                window.api.isQBDefault(function(err,isDefault){
                    if(!err && isDefault) {
                        api.dialog.show(api.tips[2](key, false));
                    }
                    else{
                        if(window.qb.hasDefault){
                            api.dialog.show(api.tips[2](key, true));
                        }
                        else{
                            api.dialog.show(api.tips[2](key, false));
                        }
                    }
                })
            }
            else{ //这是设默的红包
                api.dialog.show(api.tips[2](key, false));
                window.qb.hasQueryDefault = true;
                window.qb.hasDefault = false;
            }
        })
    };
    var boxTop = (jQuery(window).height() * 0.2);
    jQuery.extend( jQuery.easing, {
        easeOutBack : function (x, t, b, c, d, s) {
            if (s == undefined) s = 1.70158;
            return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
        }
    });
    $(window).bind("scroll",function(){
        var offsetTop = boxTop + $(window).scrollTop();
        if(offsetTop <= 485){
            offsetTop = 485;
        }
        $("#balloon").animate({
            top: offsetTop + "px"
        },{
            //easing: 'easeOutBack',
            duration: 1000,
            queue: false    //此动画将不进入动画队列
        });
    });
    window.onload = function(){
        window.qb.isDebug = false;
        //右侧气球浮动
        $(window).scroll();
        $("#balloon a").click(function () {
            $(window).scrollTop(1645);
        });

        window.api.initHeader();

        page.queryLucky(queryLucky);
        page.queryDefault(queryDefault);
        try{
            setTimeout(function(){
                if(/#route/.test(location.hash)){
                    $(window).scrollTop(1645);
                }else {
                    $('body').scrollTop(0);
                }
            },200);
        }catch(e){}

        qq.login.bind('login',function(){
            if(!window.qb.hasQueryLucky) {
                page.queryLucky(queryLucky);
            }
            if(!window.qb.hasQueryDefault){
                page.queryDefault(queryDefault);
            }
        });

        window.api.pvReport(); //pv上报

        resetData();
        if(!window.qb.isDebug) {
            zHttp.send({actid: 41281}, function (res) {
                var curr = new Date().getTime();
                if ((curr - res.time * 1000 > 2000) || (curr - res.time * 1000 < -2000)) {
                    resetData(res.time * 1000);
                }
            });
        }

        $('body').on('click','#getLucky',function() {
            api.dialog.alert(api.tips[1]());
        }).on('click','.btn-open',function() {
            getLucky();
        }).on('click','#defaultQB',function(){
            window.api.setQBDefault(function (err,succ) {
                if(!err && succ){
                    page.setDefault(function(){ //设置成功之后赠送
                        api.dialog.alert(api.tips[1]()); //TODO 传文字进去
                    });
                }else{
                    api.dialog.open(api.tips[3](true));
                }
            });
        });

        $('.gifts-wrap').on('click', '.qiang',function(){
            if(!$(this).hasClass('btn-begin')){
                return;
            }
            var self = $(this);
            var id = $(this).attr('id');
            var index = $(this).parent().index();
            var _actid='';
            if(index == 0){
                _actid = self.attr("data-id");
            }
            page.exchange(index,function(res){
                //重新倒计时相关的逻辑
                if(window.qb.isDebug){
                    res.time = parseInt(new Date().getTime()/1000);
                }
                setTimeout(function() { //延时3秒等待其他异步逻辑都完成
                    var arr = qb_data.timestamp[index];
                    for (var i = 0; i < arr.length; i++) {
                        if (arr[i] > res.time * 1000) {
                            break;
                        }
                    }
                    if (i < arr.length) {
                        qb.countArr[index] = parseInt(arr[i] / 1000) - res.time - 3;
                        self.removeClass('btn-begin');
                    }
                    else {
                        self.removeClass('btn-begin').addClass('btn-finish');
                        $('#timeNum_'+ index).text("已抢完").hide();
                        $('#timeNum_'+ index).parent().append('<span class="pic-finish"></span>');
                        $('#surplus_'+index).text('0');
                    }
                },3000);

                //提示中奖或者抽红包的逻辑
                if(res.ret === 0){
                    api.dialog.open(api.tips[0](1, res.data.actname));
                }
                else{
                    window.qb.actname = res.data.actname;
                    giveLucky();
                }
            },_actid);

        });
    };



    //每天更换旅游路线
    function updated_everyday(date, cb){
        var _pic, _intro, _actid;
        _pic    = qb_data.gifts[date].pic;
        _intro  = qb_data.gifts[date].intro;
        _actid  = qb_data.gifts[date].actid;
        var html = '<div class="pic">\
                      <img src="'+ _pic +'" >\
                    </div>\
                    <p id="timeNum_0" class="countDown">        </p>\
                    <div class="info">\
                      <p>'+ _intro +'</p>\
                      <p class="surplus">剩余<span id="surplus_0">1</span></p>\
                    </div>\
                    <a href="javascript:void(0);" id="btn_0" data-id="'+_actid+'" class="btn btn-init qiang">0元抢</a>';
        $('#dayChange').html(html);
        for(var i = 0; i < qb_data.surplus.length; i++){
            $('#surplus_' + i).text(qb_data.surplus[i]);
        }
        cb ? cb() : '';
    }


    function resetData(currTime){ //1427169599000

        var curr = currTime || new Date().getTime();
        var i, j, len;
        var ts = qb_data.timestamp;

        var the_day = new Date(curr).setHours(0,0,0,0);
        for(i=0; i<ts[0].length; i++){
            if(the_day < ts[0][i]) break;
        }
        if(i >= ts[0].length){
            the_day =  ts[0].length-1;
        }
        else{
            the_day = i;
        }
        updated_everyday(the_day);


        for(i=0; i< 8; i++){
            len = ts[i].length;
            for(j=0; j<len; j++) {
                if (curr < ts[i][j]) break;
            }
            if(j<len){
                window.qb.countArr[i] = parseInt((ts[i][j]-curr)/1000); //换算成秒
            }
            else{
                window.qb.countArr[i] = -100; //已抢完
            }
        }

        clearInterval(window.qb.timeHandle);
        window.qb.timeHandle = setInterval(countDown,1000);
    }
    //小于10补0
    function fillNum(key){
        var _key = parseInt(key);
        if(_key < 10){
            _key = "0" + _key;
        }
        return _key;
    }
    //倒计时函数
    function countDown(){
        var i, j, k, h, m, s, str;
        var arr = window.qb.countArr;
        var len = arr.length;
        for(i = 0; i < len; i++) {
            if(arr[i] > 0){
                h = (Math.floor(arr[i] / 3600));
                m = Math.floor((arr[i] - h * 3600) / 60);
                s = Math.floor(arr[i] - h * 3600 - m * 60);
                str = "距离下次开奖还有 " + fillNum(h) + ":" + fillNum(m) + ":" + fillNum(s);
                $('#timeNum_'+ i).text(str);
                arr[i]--;
            }
            else if(arr[i] == 0){
                $('#btn_'+i).addClass('btn-begin');
                $('#timeNum_'+ i).text("开始抢购");
                arr[i]--; //减成-1 然后不管它了
            }
            else if(arr[i] >= -10){
                ; //no action
            }
            else{
                $('#timeNum_'+ i).text("已抢完").hide();
                $('#timeNum_'+ i).parent().append('<span class="pic-finish"></span>');
                $('#btn_'+i).addClass('btn-finish');
                $('#surplus_'+i).text('0');
                arr[i] = -1;
            }
        }
    }

})(window,jQuery);