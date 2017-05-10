
(function(){
window.debug_key = 0;
window.debug_record = 0;

var inGame = false;

var guid = "";


var giftConfig = {
    msg:{
        0:{
            id:"pop-download",
            title:"亲，这是QQ浏览器的专属活动，<br>请用QQ浏览器参加哦~",
            txt:"如果还未安装，请点击下载安装：",
            btn:"下载QQ浏览器",
            link:"http://dldir1.qq.com/invc/tt/QQBrowser_Setup_Privilegecenter.exe"
        },
        1:{
            id:"pop-out",
            title:"T_T…没有抽中奖品哦~",
            txt:"没关系，每天都来试试手气，多重特权等你赢！",
            btn:"确  定",
            link:"javascript:void(0)",
            click:"g.closePop()"
        },
        6:{
            id:"pop-no-gift",
            title:"(⊙o⊙)…好像还没有获得奖品呢~",
            txt:"没关系，每天都来试试手气，多重特权等你赢！",
            btn:"确  定",
            link:"javascript:void(0)",
            click:"g.closePop()"
        },
        7:{
            id:"pop-userinfo-ok",
            title:"邮寄地址提交成功！",
            txt:"您的奖品将尽快为您寄出，请查收~",
            btn:"确  定",
            link:"javascript:void(0)",
            click:"g.closePop()"
        },
        8:{
            id:"pop-time",
            title:"亲，抽奖一天只能参与一次哦~",
            txt:"明天再来试试运气吧！",
            btn:"确  定",
            link:"javascript:void(0)",
            click:"g.closePop()"
        },
        9:{
            id:"pop-subscirbe",
            title:"亲，只有订阅到桌面才能参与抽奖哦~",
            txt:"快去订阅吧，多重特权等你赢！",
            btn:"确  定",
            link:"javascript:void(0)",
            click:"g.closePop()"
        },
        999:{
            id:"pop-over",
            title:"本次活动已结束",
            txt:"敬请期待下一期视频中心专题活动，<br>海量奖品等你拿！",
            btn:"前往视频中心",
            link:"http://video.browser.qq.com"
        }

    },
/**
 * @type:3  coupon  pop-coupon 有券号，点击链接兑换 、pop-coupon-2 只有二维码 、 pop-coupon-3 有券号，扫描二维码下载APP
 * @type:4  实物
 * @type:5  Q币
 * @type:6  直接跳转
 */
    gift:{
        1:{
            id:"pop-shiwu",
            type:4,
            title:"乐视超级手机Le1",
            img:"./images/phone.jpg",
        },
        2:{
            id:"pop-shiwu",
            type:4,
            title:"芈月传签名海报",
            img:"./images/pic.jpg",
            style:"width:147px;margin-left:16px;"
        },
        3:{
            id:"pop-shiwu",
            type:4,
            title:"芈月传手机壳",
            img:"./images/sjk.jpg",
        },
        4:{
            id:"pop-coupon",
            type:3,
            title:"乐视7天会员",
            img:"./images/leshi.jpg",
            link:"http://zhifu.letv.com/exchange",
            txt:"点击乐视网会员频道右上角【兑换码】，进入兑换页面",
            style:"margin-top:10px;"
        }
    }
    
}


function showPop(popEle,data){
    var type = 0,
        isSys = false;
    if(typeof data === "object"){
        type = data.gift.type
    }
    else{
        type = data;
        isSys = true
    }

    $(".pop").hide();
    $(".pop-cont").hide();
    var id;
    // 系统提示
    if(isSys && giftConfig.msg[type]){
        id = giftConfig.msg[type].id
        if(!$("#"+id).length){
            var html = '<div id="'+id+'" class="pop-cont">\
                            <div class="content">\
                                <p class="title">'+giftConfig.msg[type].title+'</p>\
                                <p class="txt">'+giftConfig.msg[type].txt+'</p>\
                            </div>\
                            <div class="btn-wrapper">\
                                <a class="btn" href="'+giftConfig.msg[type].link+'"'+(giftConfig.msg[type].click ? 'onclick="'+giftConfig.msg[type].click+'"':'')+'>'+giftConfig.msg[type].btn+'</a>\
                            </div>\
                        </div>';
            
            $(html).appendTo(popEle).show();
        }
        else{
            $("#"+id).show();
        }
    }
    //cdkey
    else if(type == 3 ){
        var gift = data.gift;
        id = gift.id
        if(!$("#"+id).length){

                var html = '<div id="'+id+'" class="pop-cont">\
                        <div class="content">\
                            <img id="gift-coupon" src="'+gift.img+'" alt="'+gift.title+'" style="'+gift.style+'"/>\
                            <p class="title">恭喜你获得</p>\
                            <p class="name">'+gift.title+'</p>\
                            <p id="cdkey">会员码 <span>'+data.cdkey+'</span></p>\
                        </div>\
                        <div class="btn-wrapper">\
                            <p style="margin:22px 0"><a class="btn exchange-btn" target="_blank" href="'+gift.link+'">立即兑换</a></p>\
                            <p class="txt">'+gift.txt+'</p>\
                        </div>\
                    </div>';
            $(html).appendTo(popEle).show();
        }
        else{
            $("#"+id).show();
        }
        
    }
     //最终抽奖  实物 
    else if(type == 4){
        var gift = data.gift;
        id = gift.id
        if(!$("#"+id).length){
            var html = '<div id="'+id+'" class="pop-cont">\
                        <div class="content">\
                            <img id="gift-shiwu" src="'+gift.img+'" alt="'+gift.title+'" style="'+gift.style+'"/>\
                            <p class="title">恭喜你获得</p>\
                            <p class="name">'+gift.title+'</p>\
                        </div>\
                        <div class="btn-wrapper">\
                            <a class="btn user-info-btn" href="javascript:void(0)">填写联系方式</a>\
                            <p class="txt" style="position: relative;top: 20px;">即日起五个工作日内未填写邮寄地址视为自动放弃<br>如因用户填写信息有误无法收到奖品，则由用户本人负责</p>\
                        </div>\
                    </div>';
            $(html).appendTo(popEle).show();
        }
        else{
             $("#"+id).show();
        }
    }
    //用户信息
    else if(type == 10){
        api.getUserInfo(function(res) {
            $("#user_name").val(res.name);
            $("#user_phone").val(res.phone);
            $("#user_email").val(res.email);
            $("#user_address").val(res.address);
            $(".pop-cont").show();
            popEle = "#userinfoPop";
            $(popEle).show();
            $(".mask").show();
        })
        
    }
    if(popEle == "#pop" & id == "pop-coupon"){
        $(popEle).addClass('pop-coupon-height');
    }
    else{
        $(popEle).removeClass('pop-coupon-height')
    }
    $(popEle).show();
    $(".mask").show();


}

function closePop(){
    $(".pop").hide();
    $(".mask").hide();
}

function verify(cb,isVerify){
    if(isVerify === false){
        cb();
        return;
    }

    if(api.isQB){
        zUtil.ensureLogin(function(){
            cb();
        })
    }
    else{
        showPop("#pop",0);
    }
}

function send(obj,cb,isVerify){
    verify(function(){
        

        obj.guid = guid;

        
        zHttp.send(obj,function(res){
            if(res.ret == 10002){
                qq.login.open();
            }
            else if(res.ret == 10004){
                    showPop("#pop",999)
            }
            else{

                cb && cb(res);
            }
        })
    },isVerify)
    
}



(function (window,$) {
    Page = qv.zero.extend(qv.zero.AbstractPage,{
        userJsonID : 75754,
        preloads : ['AreaSvrSelector'],
        loadExtHandler  : true,
        //vipmonth : 1,
        init : function () {
        },
        initEvent : function () {
        },
        queryGiftRecord: function(cb){
            send({'actid':75762,'_c':'view'},function(json){               
                if(json.ret == 0){
                    var records = json.data.op;
                    var html = "";
                    
                    
                    if(records.length === 0){
                        return showPop("#pop",6);
                    }
                    for(var i = 0; i < records.length; i++){
                        var record = records[i].val;

                        var name = record.name.split("|")[0],
                            gift_type = record.name.split("|")[1] || 0,
                            cdkey = record.info,
                            desc = record.name.split("|")[2] || "",
                            url = record.name.split("|")[3] || "";

                        html += '<li><span class="record-index">'+(i+1)+'</span>';

                        //1 券 2 QB 3 实物
                        if(gift_type == 1){
                            html += '<div>\
                                        <div class="content"><p class="record-subtitle">'+name+'</p>\
                                        <p class="record-cdkey">会员码:<span>'+cdkey+'</span></p>\
                                        <p class="record-desc">'+desc+'</p></div>'
                                        +(url ? '<a target="blank" class="btn exchange-btn" href="'+url+'">立即兑换</a>':'')
                                    +'</div>'
                        }
                        else if(gift_type == 2){
                            html += '<div>\
                                        <div class="content"><p class="record-subtitle">'+name+'</p>\
                                        <p class="record-desc">已自动充值到您的账号中</p></div>\
                                        <a target="blank" class="btn" href="http://pay.qq.com">立即查看</a>\
                                    </div>'
                        }
                        else if(gift_type == 3){
                            html += '<div>\
                                        <div class="content"><p class="record-subtitle">'+name+'</p>\
                                        <p class="record-desc">请在五个工作日内填写邮寄地址</p></div>\
                                        <a class="user-info-btn btn"  href="javascript:void(0)">立即填写</a>\
                                    </div>'
                        }

                        html += '<p class="clear"></p></li>';
                        
                    }
                    $("#record").html(html);
                    $("#pop-record").show();
                    $(".mask").show();

                }
            },false);
        },
        getLucky:function(cb){
            var _this = this;
            send({'actid':75761},function(res){
                 var data = {};
                if(res.ret == 0){
                    var key = res.data.op.diamonds ;
                    // var giftIndex = {1:10,2:2,3:7,4:3,5:6,6:8,7:1,8:5,9:3,10:9};
                    key = debug_key || key;
                    data.gift = giftConfig.gift[key];
                    res.data.op.cdkey ? data.cdkey =  res.data.op.cdkey : null ;
                

                }
                else if(res.ret == 10601 || res.ret == 10603 || res.ret == 30301){

                    return showPop("#pop",8);
                }
                else{  
                    return showPop("#pop",1);
                }

                StartGame(key, function(){
                    inGame = false;
                    data.gift ? showPop("#pop",data) : showPop("#pop",1)
                });
            });

            
        },
    });
    window.page = new Page();
})(window,jQuery);

function StartGame(key, cb){
    inGame = true;
    var keyArr = [255,105,50,330,180];

    $("#luckyGift").rotate({
        angle: 0,
        animateTo: parseInt(1080 + keyArr[key-1]),
        duration: 3000,
        easing: $.easing.easeInOutQuart,
        callback: cb
    });
};

function subscribe(cb){
    try{
        chrome.runtime.sendMessage("hbkoccppnblkmobdjagebolnebjiajig", {
            msg: "addOnlineDesktopShellLink",
            shellLinkName: "芈月传.lnk",
            type: 10,
            linkArgument: " "+location.href+"?ADTAG=miyueDesk",
            shellLinkImageUrl: "http://stdl.qq.com/stdl/qbvideo/main/img/without-hash/content.ico",
            ignoreDeletedBehavior: true
        }, function(response) {
            cb && cb(response)
        })
    }catch(e){
        alert("请用QQ浏览器9 chrome内核 使用该功能哦~");
    }
}
function bindEvents(){
    
    $(".subscribe").on('click', function(event) {
        event.preventDefault();
        if(!api.isQB){
            showPop("#pop",0);
        }
        else{
            subscribe(function(){
                var body = document.getElementsByTagName("body")[0];
                var toast = document.createElement('div');
                var htmlStr = '';
                toast.id = 'qb-subscribe';
                htmlStr = '<p class="toast-title">订阅成功</a>';
                htmlStr += '<p class="toast-desc">点击桌面图标可直接观看最新内容！</p>';
                toast.innerHTML = htmlStr;
                body.appendChild(toast);

                setTimeout(function(){
                    $("#qb-subscribe").remove();
                },2000)


                api.report('BROWSER.EVENTS.MIYUE.LESH.SUBSCRIBE');
            })
            
        }
    });

    $('#lucky-btn').click(function(){
        if(inGame){
            return;
        }
        if(!api.isQB){
            return showPop("#pop",0);
        }
        try{
            chrome.runtime.sendMessage("hbkoccppnblkmobdjagebolnebjiajig", 
                {msg:"existDesktopLink",shellLinkName:"芈月传.lnk",type:10}, function(response) {     
                    if(response && response.isExist){
                        page.getLucky();
                    }
                    else{
                        showPop("#pop",9);
                    }
            })
        }
        catch(e){
            alert("请用QQ浏览器9 chrome内核 才能参与活动哦~");
        }
        
        
        api.report('BROWSER.EVENTS.MIYUE.LESH.LUCKY');

    });

    $('body').on('click','a[href="#"]',function (e) {
        e.preventDefault();
    });
    $(".mask").on('click',function(event) {
        closePop();
    });
    
    $("#check-gift").on('click', function(event) {
        api.report('BROWSER.EVENTS.MIYUE.LESH.CHECKGIFTCLICK');
        page.queryGiftRecord();
    });

    $(".pop").on('click', '.x', function(event) {
         closePop();
    })
    .delegate('.user-info-btn', 'click', function(event) {
       showPop("#pop-userinfo",10);
    })
    .delegate('#submit-btn', 'click', function(event) {
        var userContact = {
            name : $('#user_name').val(),
            phone : $('#user_phone').val(),
            email : $('#user_email').val(),
            address : $('#user_address').val()
        };
        api.setUserInfo(userContact, function(){
            showPop("#pop",7);
        })
    })
    .delegate('#desk-check', 'click', function(event) {
       $(this).toggleClass('active');

    })
    .delegate('.exchange-btn', 'click', function(event) {
        api.report('BROWSER.EVENTS.MIYUE.LESH.EXCHANGECLICK');
    });

    
    $(".middle").on('selectstart',function(event) {
        return false;
    });


    $(".videoListNav").on('click','li.active',function(event) {
        $(this).siblings().removeClass('current').end().addClass('current');
        var i = $(this).index() + 1;
        $(".videoList a").hide();
        $(".tab"+i).css({"display":"inline-block"});
    });

    $("#fold").on('click', function(event) {
        var desc = $(".videoDesc:eq(2)").attr("data-desc");
        if($(this).text().match(/展开/)){
            
            $("#video-desc").text(desc);
            $("#fold").text("收起<<");
        }
        else{
            $("#video-desc").text(desc.substr(0,152)+"...");
            $("#fold").text("展开>>");
        }
        
    });

    $(".videoList").on('click', 'a', function(event) {
        api.report('BROWSER.EVENTS.MIYUE.LESH.EPISODE');
    });



    
}

function getGuid(cb){
    try{
        guid =  window.external.getGuid().split("-").join("");
        cb && cb();
    }catch(e){

        var web_page_extension_id = '{A3C609B3-3E61-4508-8953-117B7286068B}';
        var platform_extension_id = '{420DEFEE-20A8-468C-BFDA-61A09A99325D}';
        var extension;
        try {
            extension = window.getExtension(web_page_extension_id);
            extension.sendMessage(platform_extension_id, {serviceId: "hardware.getGuid", args: []}, function (data) {
                data[0] ? guid =  data[0].split("-").join("") : guid = "";
                cb && cb();
            });
        }catch(e){
           cb && cb();
        }

    }
}

function renderList(){
    var html = "";
    $.ajax({
        url: "http://api.letv.com/mms/out/album/videos?id=93334&cid=2&platform=pc&relvideo=1&relalbum=1&vid=24093058",
        type: "GET",
        dataType:"jsonp",
        jsonpCallback:"callback",
        success:function(res){
            var list = res.data;
            var len = list.length;
            $(".videoListNav li:lt("+Math.ceil(len/25)+")").addClass('active');
            for(var i=0;i<len;i++){
                var o = list[i];

                html += '<a href="'+o.url+'?ch=qqmiyuezhuan" target="_blank" class="'+("tab"+Math.ceil((+o.episode+1)/25))+'">'
                + o.episode
                + ((o.title.match(/预告/) ? '<span></span>':''))
                + '</a>';

                if(i >= 80){break;}
            }
            $(".videoList:eq(0)").html(html);
            $(".tab1").css("display","inline-block");

        }
    });
    
}
window.onload = function(){

    

    getGuid(function(){
        bindEvents();
    });

    renderList();

    

};

api.initNav("header","footer",{
    report:"BROWSER.EVENTS.MIYUE.LESH.TOPQBDOWNLOADCLICK",
    isTqHide:true,
    background:"#1d0a04",
    color:"rgba(255,255,255,0.2)"
})

api.report('BROWSER.EVENTS.MIYUE.LESH.PV');



window.g = {
    closePop : closePop,
    showPop  : showPop
}



})();


