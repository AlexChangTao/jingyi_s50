// page scroll
var sw = $(window).width()
var initWidth = 1920;
var hd = "easeOutQuad"//缓动
var Speed_ = 400;
var box = $("#box");
var page = $(".page");
var pageNum = 7;//总页数
var curPage = 0;//当前页数
var Original = 0;//记录前一帧页数
var isScroll = true;//结束后才能点击
var menu_id = 0;
var dir = 1;

var Loading = {total: 0, loaded: 0, tl: null};  //load方法


$(function () {
    adaptive();  //调整元素宽高整屏幕自适应
    $(window).resize(adaptive);   //窗口调整大小
    Loading_Act();   //运行LOAD方法
    init();
    peizhics() //配置表

    yuyue()//预约试驾显示

});

//初始化+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
function init() {
    pageNum = page.length - 1;//总页数赋值
    //运行滚动插件jq.mousewheel
    $(".box").mousewheel(Win_wheel);
    menu(0);
}

//菜单+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
var menu_cur = [0, 1, 2, 6, 7, 8]		//导航点击跳转页码数组
function menu(n) {
    if (n > 1 && n < 6) {			//判断导航2的页数，如果大于1且小于30，为导航2
        n = 2;
    }
    if (n > 5) {          //判断导航3以下导航的页数，如果大于29，则减去28页。
        n = n - 3
    }
    //alert(n)

    $("#menu ul li").removeClass("cur")
    $("#menu ul li").eq(n).addClass("cur")

    for (var i = 0; i < 5; i++) {				//导航添加背景置顶
        $("#menu ul li").eq(i).css({"background-position": "right bottom"})
    }
}

$("#menu ul li").click(function () {
    //isScroll 防止点击过快
    if (isScroll == true) {
        var id = $("#menu ul li").index($(this));
        menu(menu_cur[id]);
        Original = menu_id;
        //$("#shuzitext").text(menu_id)
        if (menu_cur[id] == Original) {
            //$("#shuzitext").text("坑爹的!!!")
        } else {
            if (id > Original) {
                dir = 1;
            } else {
                dir = -1;
            }
            curPage = menu_cur[id];
            //$("#shuzitext").text("curPage"+curPage+"上一次值"+Original)
            Page_inout(curPage, Original)
            Original = menu_cur[id];
        }
    }//end isScroll

})

//卖点菜单点击
function nuin(d) {
    d = d - 2;
    $(".innavi_1 a").removeClass("cur")    //清空cur
    for (var i = 0; i <= d; i++) {
        $(".innavi_1 a").eq(i).addClass("cur").siblings().removeClass("cur")  //每个ID添加cur样式
    }
}

$(".innavi_1 a").click(function () {
    if (isScroll == true) {

        isScroll = false;
        var id = $(".innavi_1 a").index($(this)) + 2;     //声明ID等于当前值
        Original = menu_id;
        if (id == Original) {
            //	$("#shuzitext").text("坑爹的!!!")
        } else {
            nuin(id);      //运行方法nuin_cur

            //fun_into[Math.abs(id)]();//动画进场数组里面放方法

            if (id > Original) {
                dir = 1;
            } else {
                dir = -1;
            }
            curPage = id
            //$("#shuzitext").text("curPage"+curPage+"上一次值"+Original)
            Page_inout(curPage, Original)
            Original = id;
        }
    }
})

//配置表限制滚动翻页------------------------------------------
var phototrue = true;
/*$('.photo').mouseover(function(){
 phototrue=false;
 })

 $('.photo').mouseout(function(){
 phototrue=true;
 })*/

$('#ui-id-1,#ui-id-2,#ui-id-3,.heise,.yysj').mouseover(function () {
    phototrue = false;
})

$('#ui-id-1,#ui-id-2,#ui-id-3,.heise,.yysj').mouseout(function () {
    phototrue = true;
})

//显示预约试驾，关闭预约试驾
function yuyue() {
    $('.sjbtn').click(function () {
        $('.heise,.yysj_gb,.yysj').show();
    })
    $('.yysj_gb').click(function () {
        $('.heise,.yysj_gb,.yysj').hide();
    })
    $('.yycg_btn').click(function () {
        $('.heise_1,.yycg').hide();
    })
}


//配置参数
function peizhics() {

    /*$('#dealerMain').touchslider({
     scrollObj : '#dealerBox',
     scrollBarWrap : '#dealerScrollbarWrap',
     scrollBar :'#dealerScrollbar',
     onceScrollH :120
     });*/

    var h = $('#dealerBox').find('img:eq(0)').height();
    $('#dealerBox').height(h);

    var slider = new Slider({
        boxObj: '#dealerMain',
        sliderObj: '#dealerBox',
        scrollbarWrap: "#dealerScrollbarWrap",
        scrollBar: "#dealerScrollbar",
        barFixed: true,        //滚动条固定高度
        onceScrollHeight: 200,
        scale: 1,
        beforeCallback: function () {
            isScroll = false;
        },
        afterCallback: function () {
            isScroll = true;
        }
    });


}


//调整元素宽高整屏幕自适应++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
var adaptive = function () {
    var width = $(window).width(),
        winH = $(window).height();
    $('.same').each(function (index, element) {
        var oh = $(this).attr('oh');
        var ow = $(this).attr('ow');
        var scale = 0;
        var height;

        if (width / initWidth > winH / 900) {
            scale = width / initWidth;
        } else {
            scale = winH / 900;
        }

        height = scale * oh;
        var imgWidth = ow * scale;
        $(this).height(height + 'px').width(imgWidth + 'px');
    });
}


//鼠标滚动判断上下事件++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
function Touch_start(e) {
    touch.oy = e.pageY;
}

function Touch_move(e) {
    e.preventDefault();
    touch.move = true;
    touch.dy = e.pageY;
}

function Touch_end(e) {
    if (touch.move) {
        touch.move = false;
        var oy = touch.oy;
        var y = touch.dy;
        if (y - oy > 40) Win_wheel(e, 1, 0, 0);
        else if (oy - y > 40) Win_wheel(e, -1, 0, 0);
    }
}


/*鼠标滚动事件  delta=-1下 delta=1上*/
function Win_wheel(e, delta, deltaX, deltaY) {
    if (isScroll == true) {
        if (phototrue == true) {
            //pageNum=-(fun.length-1)
            dir = (delta > 0 ? -1 : 1);//反转delta 向下+1  向上-1
            Original = curPage;//记录上次值
            //alert(Original);
            var $this = $('#shuzitext'),
                timeoutId = $this.data('timeoutId');
            if (timeoutId) {
                clearTimeout(timeoutId);
            } else {
                curPage = curPage + dir;
                if (curPage < 0) {
                    curPage = 0;
                    return;
                }
                if (curPage > pageNum) {
                    curPage = pageNum;
                    return;
                }
                Page_inout(curPage, Original)
                isScroll = false;
            }
            //延迟滚动。防止滚动很多次
            $this.data('timeoutId', setTimeout(function () {
                $this.removeData('timeoutId');
                $this = null
            }, 200));

            return false;
        }

    }

}
//页面切换方法+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
function Page_inout(page_index, page_out) {
    //page_inde:下页数值，page_out:前面一个
    //fun_out[page_out]();  //动画出场数组里面放方法
    var h = $(window).height() / 900;
    var dir = page_index > page_out ? 900 : -900;
    menu_id = page_index;
    menu(page_index);//菜单传值

    //显示卖点导航
    if (page_index > 1 && page_index < 6) {
        nuin(page_index);
        /*$(".innavi").stop().animate({opacity:"1"},500,hd,function(){});*/
        $(".innavi").show();
    } else {
        /*$(".innavi").stop().animate({opacity:"0"},500,hd,function(){});*/
        $(".innavi").hide();
    }

    isScroll = false;
    //eleScrollTop(page_index); //动画进场数组里面放方法
    page.eq(page_index).addClass("active").css({
        "display": "block",
        "z-index": "3",
        "top": dir * h + "px"
    }).animate({top: "0"}, 800, hd, function () {
    });
    page.eq(page_out).addClass("active_out").css({
        "display": "block",
        "z-index": "1",
        "top": "0px"
    }).animate({top: -dir * h + "px"}, 800, hd, function () {
        //fun_into[Math.abs(page_index)]();  //动画进场数组里面放方法
        isScroll = true;
        page.eq(page_out).removeClass("active").css("display", "none");
        dh(page_index);  //运行动画
    });
}

//判断滑动时，动画的运行方法
function dh(TextNumber) {
    switch (TextNumber) {
        case 0:
            //首页
            into_0();
            out_1();
            break;
        case 1:
            //视频
            into_1();
            out_0();
            break;
        case 2:
            //精美车图
            out_1();
            break;
        case 3:
            //精美车图

            break;
        case 4:
            //精美车图

            break;
        case 5:
            //精美车图
            out_2();
            break;
        case 6:
            //媒体评测
            into_2();
            out_3();
            break;
        case 7:
            //车型配置
            into_3();
            out_2();
            out_4();
            break;
        case 8:		//车型配置
            into_4();
            out_3();
            break;
    }
}

//首页动画
function into_0() {
    $(".sy_a1").stop().animate({opacity: "1", left: "15.8%"}, 600, hd, function () {
        $(".sy_a2").stop().animate({opacity: "1", bottom: "3.22%"}, 600, hd, function () {
        }).css({flter: "Alpha(Opacity=100)"});
    }).css({flter: "Alpha(Opacity=100)"});
    $(".sy_a3").stop().delay(300).animate({opacity: "1"}, 600, hd, function () {
    }).css({flter: "Alpha(Opacity=100)"});
}
/*
 .sy_a1{ position:absolute; top:17.8%; left:20.8%; z-index:1; opacity:0; filter:Alpha(Opacity=0);}
 .sy_a2{ position:absolute; bottom:5%; left:6.1%; z-index:1; opacity:0; filter:Alpha(Opacity=0);}
 */
function out_0() {
    $(".sy_a1").stop().animate({opacity: "0", left: "20.8%"}, 100, hd, function () {
    }).css({flter: "Alpha(Opacity=0)"});
    $(".sy_a2").stop().animate({opacity: "0", bottom: "-1%"}, 100, hd, function () {
    }).css({flter: "Alpha(Opacity=0)"});
    $(".sy_a3").stop().animate({opacity: "0"}, 100, hd, function () {
    }).css({flter: "Alpha(Opacity=0)"});
}

//新车展示
function into_1() {
    /*$(".xc_zs").stop().animate({opacity: "1", top: "16%"}, 600, hd, function () {
        $(".hy_ys").stop().animate({opacity: "1", top: "25.2%"}, 600, hd, function () {
            $(".video_content").stop().animate({opacity: "1", left: "22%"}, 600, hd, function () {
            }).css({flter: "Alpha(Opacity=100)"});
        }).css({flter: "Alpha(Opacity=100)"});
    }).css({flter: "Alpha(Opacity=100)"});*/
}
/*
 .xc_zs{ position:absolute; left:0; top:21%; opacity:0; filter:Alpha(Opacity=0);}
 .hy_ys{position:absolute; left:0; top:30.2%; opacity:0; filter:Alpha(Opacity=0);}

 .video_content{ position:absolute; top:36.2%; left:27%; z-index:10; opacity:0; filter:Alpha(Opacity=0);}
 */
function out_1() {
    /*$(".xc_zs").stop().animate({opacity: "0", top: "21%"}, 100, hd, function () {
    }).css({flter: "Alpha(Opacity=0)"});
    $(".hy_ys").stop().animate({opacity: "0", top: "30.2%"}, 100, hd, function () {
    }).css({flter: "Alpha(Opacity=0)"});
    $(".video_content").stop().animate({opacity: "0", left: "27%"}, 100, hd, function () {
    }).css({flter: "Alpha(Opacity=0)"});*/
}

//媒体评测
function into_2() {
    $(".ban").stop().animate({opacity: "1", marginTop: "-222.5px"}, 600, hd, function () {
    }).css({flter: "Alpha(Opacity=100)"});
}
/*
 .ban{ width:1002px; height:445px; position:absolute; overflow:hidden; top:50%; left:50%; margin-left:-501px; margin-top:-122.5px; z-index:5; opacity:0; filter:Alpha(Opacity=0);}
 */
function out_2() {
    $(".ban").stop().animate({opacity: "0", marginTop: "-122.5px"}, 100, hd, function () {
    }).css({flter: "Alpha(Opacity=0)"});
}

//车型配置
function into_3() {
    $(".pzb_2").stop().animate({opacity: "1", marginTop: "-216px"}, 600, hd, function () {
    }).css({flter: "Alpha(Opacity=100)"});
}
/*
 .pzb_2{position:absolute; top:50%; margin-left:-633.5px; margin-top:-192px; left:50%; z-index:1; width:1267px; height:584px; opacity:0; filter:Alpha(Opacity=0);}
 */
function out_3() {
    $(".pzb_2").stop().animate({opacity: "0", marginTop: "-192px"}, 100, hd, function () {
    }).css({flter: "Alpha(Opacity=0)"});
}

//车型配置
function into_4() {
    $(".dealerInfo").stop().animate({opacity: "1"}, 600, hd, function () {
    }).css({flter: "Alpha(Opacity=100)"});
}
function out_4() {
    $(".dealerInfo").stop().animate({opacity: "0"}, 100, hd, function () {
    }).css({flter: "Alpha(Opacity=0)"});
}

//loading
function Loading_Act() {


    /*  TweenMax.set("#Loading_Rect",{transformOrigin:"0 0"});
     var tl=new TimelineMax({repeat:-1,repeatDelay:0.3});
     tl.to("#Loading_Rect",0.65,{left:60,top:40,rotation:-90,ease:Cubic.easeInOut},"t1")
     .to("#Loading_Rect",0.65,{left:100,top:40,rotation:-180,ease:Cubic.easeInOut},"t2")
     .to("#Loading_c",0.45,{rotation:90,ease:Cubic.easeInOut},"t1+=0.2")
     .to("#Loading_c",0.45,{rotation:180,ease:Cubic.easeInOut},"t2+=0.2");*/

//  $.get("main.html",function(c){
//    Stage.me.append(c);
//    Win.me.resize(Stage_resize);
//    Stage_resize();

    var imgs = $("#box img");//加载资源
    Loading.total = imgs.length;

    imgs.each(function () {
        if (this.complete) {
            loading();
        } else {
            $(this).load(loading).error(loading);
        }
    });
    if (Loading.loaded == Loading.total) {
        loading_over();
    }
    function loading() {
        Loading.loaded++;

        var d = Math.ceil(Loading.loaded * 100 / Loading.total);


        if (Loading.loaded == Loading.total) {
            imgs.off("load error");
            loading_over();
        } else {

            $("#Loading_num").html(d);
        }
    }

    function loading_over() {
        $("#Loading_num").html("100");
//      tl.tweenTo(tl.duration(),{onComplete:function(){
//      tl.clear();

        var tl2 = new TimelineMax({
            onComplete: function () {
                $("#Loading").remove();
                $("#box").css({"display": "block"})
                //$("#box").show();

                init();
                into_0()   //运行动画方法

                //Stage.me.removeClass("dn");
                //$(".Box:eq(0)").addClass("on");
                ////内容事件初始化
                //Main_event();
                //Home_Act();
            }
        });
        tl2.to("#Loading_Rect", 0.6, {opacity: 0, ease: Quad.easeOut}, "t1")
            .to("#Loading", 0.85, {opacity: 0, ease: Quad.easeInOut}, "t1+=0.2");
//      }});
    }

//  });
}



