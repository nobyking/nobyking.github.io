/**
 * Created by rzm on 15/6/20.
 */
var isSetQuestion = false,
    isWatching = false,
    haveMoney = false;
window.onload = function(){
    window.api.initHeader();

    initLucky();

    //获取参与人数
    zHttp.send('http://imp.qq.com/index.php/AUM/GetUv?src=qq', function (res) {
        if (res.code == 0) {
            var num = res.data.total;
            var str = num;
            var len = str.length, str2 = '', max = Math.floor(len / 3);
            for(var i = 0 ; i < max ; i++){
                var s = str.slice(len - 3, len);
                str = str.substr(0, len - 3);
                str2 = (',' + s) + str2;
                len = str.length;
            }
            str += str2;
            jQuery('#UV').text(str + '人已参与');
        }
    });

    jQuery('body').on('click','.setUser',function () {
        getUserInfo(function (res) {
            window.api.dialog.open(window.api.tips['2'](res),true);
        })
    });
    jQuery('body').on('focus','#user_phone', function () {
        if(jQuery(this).val() == userInfo.phone){
            jQuery(this).val('');
        }
    });
    jQuery('body').on('blur','#user_phone', function () {
        if(jQuery(this).val() == ''){
            jQuery(this).val(userInfo.phone);
        }
    });
    jQuery('body').on('click','#setUserBtn',function () {
        userContact = {
            name : jQuery('#user_name').val(),
            phone : jQuery('#user_phone').val(),
            email : jQuery('#user_email').val(),
            address : jQuery('#user_address').val()
        };
        setUserInfo(userContact, function(){
            window.api.dialog.hide();
        })
    });

    window.api.pvReport(); //pv上报
};


//设置抽奖次数
function setMoney(m){
    var me = jQuery('#money');
    var money = me.find('span');
    var k = 0;
    if(m === '++'){
        k = parseInt(money.text()) + 1;
    } else if (m === '--'){
        k = parseInt(money.text()) - 1;
    } else if(!isNaN(m)){
        k = m;
    }
    if(k < 0){
        k = 0;
    }
    me.html('你还有 <span>'+ k +'</span> 次抽奖机会');
    if(m === 'noLogin') {
        me.text('登录后查看抽奖次数');
    }
}

//获取用户信息
var userInfo = {};
function getUserInfo(cb){
    zUtil.ensureLogin(function() {
        zHttp.send("http://cgi.vip.qq.com/contact/getusercontact", function (res) {
            if (res.ret == 0) {
                userInfo = {
                    name: res.data.NAME,
                    phone: res.data.PHONE,
                    email: res.data.EMAIL,
                    address: res.data.POST_ADDR
                };
                cb ? cb(userInfo) : '';
            } else if (res.ret == -7) {
                qq.login.open();
            }
        })
    })
}
//设置用户信息
function setUserInfo(obj, cb){
    //清除前后的空格
    for ( var i in obj){
        obj[i] = obj[i].trim();
    }
    //判断是否修改
    var temp = 0;
    for (var k in obj) {
        if(obj[k] == userInfo[k]) {
            temp++;
        }
    }
    if(temp == 4){
        alert('联系信息未做修改！');
        return;
    }
    //验证姓名
    if (!(/^[a-zA-Z\u4e00-\u9fa5]{0,}$/).test(obj.name) || obj.name.length < 2){
        alert('您输入的姓名不合法！');
        return;
    }
    //验证手机号 并判断手机号是否修改
    var _url = 'http://cgi.vip.qq.com/contact/setusercontact?name='+ obj.name +'&phone='+ obj.phone +'&email='+ obj.email +'&post_address='+ obj.address +'&noChange_phone=';
    if (obj.phone == userInfo.phone){
        _url += "1";
    } else {
        _url += "0";
        if(isNaN(obj.phone) || obj.phone.length != 11){
            alert('请输入有效的手机号！');
            return;
        }
    }
    //验证 邮箱
    if(!(/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/).test(obj.email)){
        alert('请输入有效的电子邮箱！');
        return;
    }
    //验证 联系地址
    if(!(/^[a-z0-9\u4e00-\u9fa5]{0,}$/).test(obj.address)) {
        alert('非法的汉字和英文字符，请重新输入！');
        return;
    }

    //发送请求
    zUtil.ensureLogin(function() {
        zHttp.send(_url, function(res){
            if(res.ret == 0) {
                alert("修改成功！");
                cb ? cb() : '';
            } else if (res.ret == -7){
                qq.login.open();
            }
        })
    })
}

var initLucky = function(){
    (function (window,$) {
        Page = qv.zero.extend(qv.zero.AbstractPage,{
            userJsonID : 51419,
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
                if(!!qq.login.getUin()){
                    page.queryIsAddMoney();
                    page.queryMoney();
                }
                qq.login.bind('login', function () {
                    page.queryIsAddMoney();
                    page.queryMoney();
                });
                qq.login.bind('logout', function () {
                    setMoney('noLogin');
                });
            },
            addMoney: function(key, cb){
                if(!window.api.isQQBrowser()){
                    window.api.dialog.open(window.api.tips['7']());
                    return false;
                }
                if (key){
                    zUtil.ensureLogin(function(){
                        zHttp.send({'actid' : 51426}, function (res) {
                            if (res.ret == 0) {
                                setMoney('++');
                                isWatching = true;
                            }
                            else if (res.ret == 10002) {
                                qq.login.open();
                            }
                            else if(res.ret == 10001 || res.ret == 10004){
                                window.api.dialog.open(window.api.tips['9']());
                            }
                            else if (res.ret == 10601 || res.ret == 10603){
                                //
                            }
                            else {
                                zHttp.showResponse(res, res.actid, $.noop);
                            }
                            cb();
                        });
                    });
                    window.api.clickReport('BROWSER.ACTIVITY.NZCM.SEEVIDEOCLICK2');
                }
            },
            getLucky: function(){
                if(!window.api.isQQBrowser()){
                    window.api.dialog.open(window.api.tips['7']());
                    return false;
                }
                zUtil.ensureLogin(function(){
                    zUtil.ensureLogin(function(){
                        if(inGame){return;}
                        // _record_def_gift 为1时记录末等奖的奖品  ，不记录则不填写此字段
                        zHttp.send({actid: 51428, _record_def_gift: 1}, function (res) {
                            if (res.ret == 0) {
                                var key = res.data.op.diamonds;
                                var name = res.data.op.name;
                                page.queryMoney();
                                try{
                                    if(key > 0 && key <= 8){
                                        StartGame(key, function () {
                                            window.api.dialog.open(window.api.tips['0'](key, name))
                                        })
                                    } else {
                                        zHttp.showResponse(res, res.actid, $.noop);
                                    }
                                } catch (err) {
                                    zHttp.showResponse(res, res.actid, $.noop);
                                }
                                window.api.installPlugin();
                            }
                            else if (res.ret == 20801) {
                                window.api.dialog.open(window.api.tips['0']('-1'))
                            }
                            else if (res.ret == 10002) {
                                qq.login.open();
                            }
                            else if(res.ret == 10001 || res.ret == 10004){
                                window.api.dialog.open(window.api.tips['9']());
                            }
                            else {
                                zHttp.showResponse(res, res.actid, $.noop);
                            }
                        });
                    });

                });
                window.api.clickReport('BROWSER.ACTIVITY.NZCM.GETLUCKYCLICK2');
            },
            queryGift : function(){
                zUtil.ensureLogin(function() {
                    zHttp.send({actid: 51429}, function (res) {
                        if (res.ret == 0) {
                            var _html = '', _htmlArr = [], count = 0;
                            for (var i in res.data.op) {
                                var obj = res.data.op[i].val;
                                if (obj.actid === 51428) {
                                    if(obj.name === "谢谢参与"){continue;}
                                    _htmlArr.push(qv.string.format('<li><em>{time}</em><span>{value}</span></li>', {
                                        time: qv.date.format("Y-m-d", res.data.op[i].val.time * 1000),
                                        value: res.data.op[i].val.name
                                    }));
                                    count++;
                                }
                            }
                            if (count == 0) {
                                _htmlArr.push('<p class="noGifts">您还没有任何奖品哦~</p>');
                                _html = _htmlArr.join('');
                            } else {
                                _html = '<ul class="giftsList">'+ _htmlArr.join('') +'</ul>';
                            }
                            window.api.dialog.open(window.api.tips['1'](_html));
                        }else if(res.ret == 10002){
                            qq.login.open();
                        }
                        else if(res.ret == 10001 || res.ret == 10004){
                            window.api.dialog.open(window.api.tips['9']());
                        }
                        else{
                            zHttp.showResponse(res, res.actid, $.noop);
                        }
                    });
                });
                window.api.clickReport('BROWSER.ACTIVITY.NZCM.QUERYGIFTCLICK2');
            },
            queryMoney: function(){
                zHttp.send({'actid': 51435}, function (res) {
                    if(res.ret == 0){
                        var money = res.data.op;
                        setMoney(money);
                        if (money > 0) {
                            haveMoney = true;
                        } else {
                            haveMoney = false;
                        }
                    }
                })
            },
            queryIsAddMoney : function(){
                zHttp.send({ actid : 51432},function(res){
                    if(res.ret == 0) {
                        isSetQuestion = res.data.op.join['51425'];
                        isWatching = res.data.op.join['51426'];
                    }
                });
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
    circle_box_class,
    padding_img,
    inGame = false;
function StartGame(key, cb){
    if(inGame){
        cb();
        return;
    }

    inGame = true;

    var arr_map = [5,0,2,6,1,7,3,4];
    key = arr_map[key-1];
    arr_len = arr_map.length;
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
    circle_box_class = [];
    for(var i=0; i<arr_len;i++){
        circle_box.push(document.getElementById("lucky_box_"+i));
        if(i == 4){
            circle_box[i].className = 'lucky_box lucky_box2';
        } else {
            circle_box[i].className = 'lucky_box';
        }
        circle_box_class.push(circle_box[i].className);
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

    circle_box[prevIndex].className = circle_box_class[prevIndex];
    circle_box[index].className = circle_box_class[index] + ' active';

    index++;
    quick++;
}