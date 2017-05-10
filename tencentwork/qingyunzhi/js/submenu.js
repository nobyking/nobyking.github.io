;(function(window,$){
	//右侧随屏滚动菜单
    var menuClick = false,
        scrollTime = 600,//滚动时长
        setTimer = null,
        isStop = false;//是否滚动结束之后按钮才可点击，默认不是
    //右侧浮动菜单
    function subMenu(){
        var Stop = [690, 1240, 1790, 2400];
        var winW = jQuery(window).width();
        var winH = jQuery(window).height();
        var demo = jQuery('#menu');
        var topInit = demo.css('top').replace(/[^\d]/ig,'');
        var mRightInit = demo.css('margin-right').replace(/[^\d]/ig,'');
        jQuery(window).bind('resize', function () {
            winW = $(window).width();
            winH = $(window).height();
            if(winW >= 1640){
                demo.show();
                if(winW < 1750){
                    $('#menu').css({'right':'0','margin-right':'0'});
                }else{
                    $('#menu').css({'right':'50%','margin-right':mRightInit*-1+'px'});
                }
            }else{
                demo.hide();
            }
        });
        $(window).bind('scroll', function () {
            var _top = $(window).scrollTop(),
                _demoTop = winH/2 - demo.height(),
                cur = 0;
            _demoTop = _demoTop <= 45 ? 45 : _demoTop;
            if(_top >= topInit-_demoTop){
                $('#menu').css({'position':'fixed','top': _demoTop + 'px'});
            }else{
                $('#menu').css({'position':'absolute','top': topInit + 'px'});
            }
            /*if( _top >= btmY ){
                cur = Stop.length - 1;
            }else{
                for(var i = 0; i < Stop.length; i++){
                    if(_top >= Stop[i] - (winH / 2)){
                        cur = i;
                    }
                }
            }*/
            for(var i = 0; i < Stop.length; i++){
                if(_top >= Stop[i] - (winH / 2)){
                    cur = i;
                }
            }
            if(!menuClick) {
                $('#rightNav li').eq(cur).addClass('active').siblings().removeClass('active');
            }
        });
        $('#rightNav li').bind('click', function () {
            if(isStop && menuClick == true) return;
            clearTimeout(setTimer);
            menuClick = true;
            var k = $(this).index();
            if($(window).scrollTop() == Stop[k]) {
                menuClick = false;
                return;
            }
            $(this).addClass('active').siblings().removeClass('active');
            $('html,body').stop().animate({'scrollTop' : Stop[k] + 'px'},scrollTime);
            setTimer = setTimeout(function () {
                menuClick = false;
            },scrollTime);
        });
        $(window).resize();
        $(window).scroll();
    }

	window.QB_QINGYUN = window.QB_QINGYUN || {};
	window.QB_QINGYUN.subMenu = subMenu;


})(window,jQuery)