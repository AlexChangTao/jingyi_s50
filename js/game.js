
$(function () {
    var gameImageBasePath = 'images/common/2/pic/',
        gameImageArr = ["1/sample.jpg", "2/sample.jpg", "3/sample.jpg", "4/sample.jpg", "5/sample.jpg"],
        gameImageCount = gameImageArr.length,
        gameImageLoaded = 0;

    for (var i = 0; i < gameImageCount; i++) {
        var image = new Image();
        image.src = gameImageBasePath + gameImageArr[i];

        if (image.complete) {
            detectionImageLoad();
        } else {
            image.onload = function() {
                detectionImageLoad();
            };

            image.onerror = function() {
                detectionImageLoad();
            }
        }
    }

    function detectionImageLoad () {
        gameImageLoaded++;
        if (gameImageLoaded == gameImageCount) {
            game.start();
        }
    }
});

var game = {
    basePath: "http://nana.s1.natapp.cc/carpool/",
    countSelected: 0,    //选中的碎片数量
    selectedArr: [],     //选中的碎片索引数组
    disabled: true,     //禁止点击碎片
    isLogin: false,     //是否登录
    setTime: 30000,      //设定游戏时间30秒
    picNum: null,       //当前游戏图片索引
    picCount: 5,        //总共5组图片
    start: function () {    //游戏开始
        this.login();
        this.bindHandlers();
    },
    bindHandlers: function () {     //绑定事件
        var self = this;
        //选择碎片
        $('#gameBox').on('click', 'li', function (e) {
            e.preventDefault();
            if (!self.disabled) {
                var index = $(this).index();

                if ($(this).hasClass('selected')) {     //已选中
                    for (var i = 0; i < self.countSelected; i++) {
                        if (index == self.selectedArr[i]) {
                            self.selectedArr.splice(i, 1);
                        }
                    }
                    $(this).removeClass('selected');
                    self.countSelected--;

                } else {    //未选中
                    self.countSelected++;
                    $(this).addClass('selected');
                    self.selectedArr.push(index);

                    if (self.countSelected == 2) {
                        self.disabled = !self.disabled;
                        setTimeout(function () {
                            $('#gameList li').removeClass('selected');
                            self.exchange(self.selectedArr[0], self.selectedArr[1]);
                        }, 50);
                    }
                }
            }
        });

        //查看游戏规则
        $('#ruleBtn').click(function() {
            self.showJigsawDialog('gameRule');
        });

        //查看排行榜
        $('#rankingBtn').click(function() {
            self.showJigsawDialog('gameRanking', self.queryRanking(function(){
                self.rankingSlider();
            }));
        });

        //关闭拼图弹窗
        $('.jigsaw_dialog_close').click(function() {
            self.closeJigsawDialog();
        });

        //关闭游戏弹窗
        $('.game_dialog_close').click(function () {
            /*self.hideGameDialog();
            $('#gameStartBox').show();*/
            self.gameReset();
        });

        //查看排行榜时禁止页面滚动
        $('#gameRanking').mouseenter(function() {
            isScroll = false;
        }).mouseleave(function() {
            isScroll = true;
        });

        //点击开始游戏按钮
        $('#gameStartBtn').click(function() {
            if (!self.isLogin) {    //未登录
                self.changeCode();  //切换验证码
                self.showGameDialog('notLogged');
            } else {    //已登录
                self.getStartTime();    //获取游戏开始时间
            }
        });

        //退出登录
        $('#logout').click(function() {
            self.logout();
        });

        //点击登录按钮
        $('#loginBtn').click(function() {
            if (typeof self.gameDialogId !== 'undefined' && self.gameDialogId !== '') {
                self.hideGameDialog();
            }
            self.showJigsawDialog('loginDialog');
        });

        //未登录弹窗确定按钮
        $('#notLoggedBtn').click(function() {
            self.hideGameDialog();
            self.showJigsawDialog('loginDialog');
        });

        //拼图失败确定按钮、拼图成功确定按钮
        $('#gameFalureBtn, #gameSuccBtn').click(function() {
            self.gameReset();
        });

        //改变验证码
        $('#verificationCode').click(function() {
            self.changeCode();
        });
    },
    createGamePic: function() {     //随机生成游戏图片
        var self = this;
        var num = Math.floor(Math.random()*5) + 1;
        if (num == self.picNum) {
            self.createGamePic();
        } else {
            self.picNum = num;
            $('#samplePic').html('<img src="images/common/2/pic/'+ num +'/sample.jpg" alt="'+ num +'">');
            var picList = '',
                ranNum = self.orderByRandom();
            for (var i = 0, len = ranNum.length; i < len; i++) {
                picList += '<li><a data-order="'+ ranNum[i] +'"><div class="fragment"><img src="images/common/2/pic/'+ num +'/debris/'+ ranNum[i] +'.jpg" alt=""></div><div class="layer"></div></a></li>';
            }
            $('#gameList').html(picList);
        }
    },
    orderByRandom: function () {    //随机排序
        var numList = [],
            len = 9,
            rnd,
            temp;
        for (var i = 1; i <= len; i++) {
            numList.push(i);
        }
        numList.sort(function () {
            return Math.random() > 0.5 ? 1 : -1;
        });

        for (var j = 0; j < len; j++) {
            rnd = Math.floor(Math.random() * len);
            temp = numList[j];
            numList[j] = numList[rnd];
            numList[rnd] = temp;
        }

        if (numList.join('') == '123456789') {
            return this.orderByRandom();
        } else {
            return numList;
        }
    },
    countDown: function () {    //倒计时
        var self = this;
        self.time = self.setTime;
        $('#leftTime').text(self.setTime/1000);
        self.interval = setInterval(function() {
            self.time -= 10;
            $('#leftTime').text((self.time/1000).toFixed(2));
            self.detectionGame();
        }, 10);
    },
    detectionGame: function () {    //检测游戏是否配对成功
        var self = this,
            complete = true,
            $li = $('#gameList > li'),
            order_1 = +$li.eq(0).find('a').attr('data-order');

        if (order_1 != 1) {
            complete = false;
        } else {
            for (var i = 0; i < 7; i++) {
                if (+$li.eq(i+1).find('a').attr('data-order') - +$li.eq(i).find('a').attr('data-order') != 1) {
                    complete = false;
                    break;
                }
            }
        }

        if (complete) {     //拼图成功
            //self.gameOver(1);
            self.getEndTime(1);  //获取游戏结束时间
        } else {
            if (self.time <= 0) {   //时间到
                clearInterval(self.interval);

                self.disabled = true;   //禁止游戏
                $('#gameCover').show();
                self.gameOver(30, 0);   //未完成
            }
        }
    },
    getStartTime: function () {     //获取游戏开始时间
        var self = this;
        $.ajax({
            //url: self.basePath + "Index/getStartTime",
        	url: 'index.php?/save_start_time',
            type: "post",
            dataType: "json",
            beforeSend: function (xhr) {
                $('#gameStartBox').hide();
            },
            success: function (result) {
                if (result.code == 0) {
                    self.disabled = false;
                    $('#gameCover').hide();
                    self.createGamePic();   //随机生成图片
                    self.countDown();       //30秒倒计时
                } else {
                    alert(result.msg);
                    $('#gameStartBox').show();
                }
            },
            error: function (xhr) {
                console.log('获取开始时间请求接口失败...');
            }
        });
    },
    getEndTime: function (flag) {   //获取游戏结束时间
        var self = this;
        $.ajax({
           // url: self.basePath + "Index/getEndTime",
        	url: 'index.php?/save_end_time',
            type: "post",
            dataType: "json",
            beforeSend: function() {
                clearInterval(self.interval);
                self.disabled = true;   //禁止游戏
                $('#gameCover').show();
            },
            success: function (result) {
                if (result.code == 0) {
                    self.gameOver(result.data, 1);
                } else {
                    alert(result.msg);
                    $('#gameStartBox').show();  //显示开始游戏弹窗
                }
            },
            error: function (xhr) {
                console.log('获取结束时间请求接口失败...');
            }
        });
    },
    gameOver: function (time, flag) {  //游戏结束
        var self = this,
            t2;

        t2 = (self.setTime/1000 - time).toFixed(2);
        self.time = 0;
        $('#takeTime').text(time);  //使用时间
        $('#leftTime').text(t2);    //剩余时间

        if (!flag) {    //失败
            self.showGameDialog('timeout');
        } else {    //成功
            self.showGameDialog('gameSuccess');
        }
    },
    gameReset: function() {     //游戏恢复初始数据
        clearInterval(this.interval);
        this.disabled = true;
        this.hideGameDialog();
        $('#leftTime').text(30);
        $('#gameCover, #gameStartBox').show();
    },
    exchange: function (index1, index2) {   //碎片交换
        var self = this;
        var content_1 = $('#gameList > li').eq(index1).html(),
            content_2 = $('#gameList > li').eq(index2).html();

        $('#gameList > li').eq(index1).html(content_2);
        $('#gameList > li').eq(index2).html(content_1);

        self.restore();
    },
    restore: function () {      //重置
        this.countSelected = 0;
        this.selectedArr = [];
        this.disabled = !this.disabled;
    },
    detectionIsLogin: function () {     //检测是否登录
        var self = this;
        $.ajax({
           // url: self.basePath + "Index/isLogin",
        	url: 'index.php?/is_login',
            type: "post",
            dataType: "json",
            success: function(result) {
                if (result.code == 0) {
                    self.isLogin = true;
                    $('#loginBtn').hide();
                    $('#logged').show();
                    $('#logged > span').html(result.data);  //用户名
                } else {
                    self.isLogin = false;
                    $('#logged').show();
                    $('#logged').hide();
                }
            },
            error: function(xhr) {
                console.log('检测登录接口请求失败...');
            }
        })
    },
    login: function () {    //登录
        var self = this;
        self.detectionIsLogin();    //检测是否登录

        if(!Modernizr.placeholder){
            $('.login_field_1').siblings('strong').show();
            $('.login_field_2').siblings('strong').show();

            $('.placeStrong').click(function() {
                $(this).siblings('input').focus();
            });

            $('.login_datum > input').keyup(function() {
                var value = $(this).val();
                if (value) {
                    $(this).siblings('strong').hide();
                } else {
                    $(this).siblings('strong').show();
                }
            });
        }

        self.isRefer = false;
        self.ismobile = /^1[(|3|4|5|7|8)]\d{9}$/;

        //删除错误样式
        $('#loginForm input').on('input', function() {
            $(this).parent().removeClass('error');
        });

        //表单提交
        $('#loginForm').submit(function() {
            if (self.verificationLogin()) {
                self.referLogin();
            }
            return false;
        });
    },
    logout: function () {   //退出登录
        var self = this;
        $.ajax({
           // url: self.basePath + "Logout/logout",
        	url: 'index.php?/logout',
            type: "post",
            dataType: "json",
            success: function(result) {
                if (result.code == 0) {
                    $('#loginBtn').show();
                    $('#logged').hide();
                    self.isLogin = false;
                    self.gameReset();    //游戏恢复初始数据
                }
            },
            error: function(xhr) {
                console.log('退出接口请求失败...');
            }
        })
    },
    verificationLogin: function () {    //验证登录表单
        if (this.isRefer) {
            return;
        }

        $('.login_datum').removeClass('error');

        var $tips = $('#loginTips');

        if(!$.trim($('#loginName').val())){
            $tips.text('请输入姓名...');
            $('#loginName').val('').focus();
            $('#loginName').parent().addClass('error');
            return false;
        }

        if(!$('#loginPhone').val()){
            $tips.text('请输入11位手机号...');
            $('#loginPhone').focus();
            $('#loginPhone').parent().addClass('error');
            return false;
        }

        if(!this.ismobile.test($('#loginPhone').val())){
            $tips.text('请输入正确的手机号...');
            $('#loginPhone').focus();
            $('#loginPhone').parent().addClass('error');
            return false;
        }

        if(!$.trim($('#loginCode').val())){
            $tips.text('请输入验证码...');
            $('#loginCode').val('').focus();
            $('#loginCode').parent().addClass('error');
            return false;
        }

        return true;
    },
    referLogin: function () {   //提交登录表单
        var self = this;
        $.ajax({
           // url: self.basePath + "Login/addOrUpdate",
        	url: 'index.php?/get_login',
            data: $('#loginForm').serialize(),
            type: "post",
            dataType: "json",
            beforeSend: function() {
                self.isRefer = true;
                $('#loginRefer').attr("disabled", true).val("正在提交...");
                $('#loginTips').text('');
            },
            complete: function() {
                self.isRefer = false;
                $('#loginRefer').attr("disabled", false).val("登   录");
                self.changeCode();  //切换验证码
            },
            success: function(result) {
                if (result.code == 0) {
                    self.loginSucc(result);
                } else {
                    $('#loginTips').text(result.msg);
                }
            },
            error: function(xhr) {
                console.log('提交登录请求失败...');
            }
        })
    },
    loginSucc: function(data) { //登录成功
        $('#loginBtn').hide();
        $('#logged').show();
        $('#logged > span').html($('#loginName').val());  //用户名
        this.closeJigsawDialog();
        this.isLogin = true;
        $('#loginCode').val('');
    },
    queryRanking: function (callback) { //查询排行榜
        var self = this;
        $.ajax({
            //url: self.basePath + "Login/getRank",
        	url: 'index.php?/rank',
            type: "post",
            dataType: "json",
            success: function(result) {
                if (result.code == 0) {
                    var list = '';
                    $.each(result.data, function(i, e) {
                        var className = "";
                        if (i % 2 == 1) {
                            className += "even ";
                        }
                        switch(i) {
                            case 0:
                                className += "one";
                                break;
                            case 1:
                                className += "two";
                                break;
                            case 2:
                                className += "three";
                                break;
                            default:
                                break;
                        }

                        list += '<li class="'+ className +'"><span class="ranking_rank">'+ (i+1) +'</span><span class="ranking_player">'+ e.truename +'</span><span class="ranking_phone">'+ e.mobile +'</span><span class="ranking_time">'+ e.account +'s</span></li>';
                    });

                    $('#rankingList').html(list);

                    $.isFunction(callback) && callback();

                } else {
                    $('#rankingList').html('<div style="padding-top: 50px; text-align: center; color: #000; font-size: 16px;;">查询排行榜失败...</div>');
                }
            },
            error: function (xhr) {
                $('#rankingList').html('<div style="padding-top: 50px; text-align: center; color: #000; font-size: 16px;;">查询排行榜失败...</div>');
            }
        });
    },
    rankingSlider: function () {    //排行榜绑定滚动插件
        var self = this;

        var h = $('#rankingList').height();
        h = $('#rankingList > li:eq(0)').outerHeight(true) * $('#rankingList > li').length;
        $('#rankingList').height(h);

        if (self.rankSlider) {
            self.rankSlider.reset();
        } else {
            self.rankSlider = new Slider({
                boxObj : '#rankingBox',
                sliderObj : '#rankingList',
                scrollbarWrap : "#rankingScrollbarWrap",
                scrollBar : "#rankingScrollbar",
                barFixed : true,        //滚动条固定高度
                onceScrollHeight : 200,
                scale: 1
            });
        }
    },
    showJigsawDialog: function (id, callback) { //显示拼图弹窗
        this.dialogId = id;
        $('#jigsawDialog').show();
        $('#jigsawCoverBg').stop().fadeIn(300);
        $('#' + id).stop().delay(200).fadeIn(300, function() {
            $.isFunction(callback) && callback();
        });
    },
    closeJigsawDialog: function () { //隐藏拼图弹窗
        var self = this;
        if (typeof this.dialogId !== 'undefined') {
            $('#' + this.dialogId).stop().fadeOut(300);
            $('#jigsawCoverBg').stop().fadeOut(300, function() {
                $('#jigsawDialog').hide();
                self.dialogId = '';
            });
        }
    },
    showGameDialog: function (id, callback) { //显示游戏弹窗
        this.gameDialogId = id;
        $('#' + id).stop().show();
    },
    hideGameDialog: function () {   //隐藏游戏弹窗
        var self = this;
        if (typeof this.gameDialogId !== 'undefined') {
            $('#' + this.gameDialogId).hide();
            self.gameDialogId = '';
        }
    },
    changeCode: function () {
        $('#verificationCode').html('<img src="index.php?/captcha?'+ Math.random() +'" alt="">');
    }
};
