//预约试驾++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//自动定位
var province_ = remote_ip_info.province;
var city_ = remote_ip_info.city;
var province_id;
var city_id;
var province = [];//省
var city = [];//城市
var shop = [];//经销商

var shop_Code = [];//经销商
var dealerName_;//经销商名称--------------------
var dealerCode_;//经销商CODE--------------------
var city_name;//城市名称-----------------------
var province_name//省份名称
var shop_Address = [];//经销商地址
var shop_Tel = [];//经销商电话
var proInfo = '';

$(function () {

    var $result; //用以存储获取的xml数据
    var cbox = $(".ik-combobox :text").val($("#ui-id-1").find('a:first').text());//显示第一个城市在TEXT里面
    var cbox3 = $(".ik-combobox3 :text").val($("#ui-id-3").find('a:first').text());//显示第一个城市在TEXT里面
    var cbox2 = $(".ik-combobox2 :text").val($("#ui-id-2").find('a:first').text());//$ ("#ui-id-2") 里面的值显示到.ik-combobox
    $.ajax({
        url : 'http://cars.fxauto.com.cn/proxy/getxml.php?url=fxauto/All_DealerList.xml',
        //url: 'xml/getxml.xml',
        type: 'get',
        dataType: 'xml',
        success: function (result, status) {
            $result = $(result);
            proInfo = '';

            var Province_len = $result.find('list').find('Province').length;//获取省份长度
            for (var i = 0; i < Province_len; i++) {

                proInfo += "<li class='ui-menu-item'><a class='ui-corner-all'>" + $result.find('list').find('Province').eq(i).attr('name') + "</a></li>"
                province[i] = $result.find('list').find('Province').eq(i).attr('name');

                //匹配省份ID
                if (province_ == $result.find('list').find('Province').eq(i).attr('name')) {
                    province_id = i;
                }
                city[i] = new Array();
                shop[i] = new Array();//声明经销商创建数组
                shop_Code[i] = new Array();
                shop_Address[i] = new Array();//声明经销商创建数组
                shop_Tel[i] = new Array();//声明经销商创建数组
                //创建二维数组 存储城市
                for (var aa = 0; aa < $result.find('list').find('Province').eq(i).find('City').length; aa++) {
                    if (city_ == $result.find('list').find('Province').eq(i).find('City').eq(aa).attr('name')) {
                        city_id = aa
                    }
                    shop_Address[i][aa] = new Array();//声明经销商创建数组
                    shop_Tel[i][aa] = new Array();//声明经销商创建数组
                    shop[i][aa] = new Array();//声明经销商创建数组
                    shop_Code[i][aa] = new Array();
                    city[i][aa] = $result.find('list').find('Province').eq(i).find('City').eq(aa).attr('name')//存储城市内容
                    //--------------------------------------------------------------------------------------------------------------------
                    for (var ss = 0; ss < $result.find('list').find('Province').eq(i).find('City').eq(aa).find('Shop').length; ss++) {
                        shop_Code[i][aa][ss] = $result.find('list').find('Province').eq(i).find('City').eq(aa).find('Shop').eq(ss).find('Code').text();
                        shop[i][aa][ss] = $result.find('list').find('Province').eq(i).find('City').eq(aa).find('Shop').eq(ss).find('Name').text();
                        shop_Address[i][aa][ss] = $result.find('list').find('Province').eq(i).find('City').eq(aa).find('Shop').eq(ss).find('Address').text();
                        shop_Tel[i][aa][ss] = $result.find('list').find('Province').eq(i).find('City').eq(aa).find('Shop').eq(ss).find('Tel').text();
                    }
                    //alert($result.find('list').find('Province').eq(i).find('City').eq(aa).find('Shop').eq(ss).find('Name').text())
                    //--------------------------------------------------------------------------------------------------------------------
                }//城市
            }//省份


            init();

            $('#ui-id-1').append(proInfo);
            //省份点击事件#########################################################################################
            $(".ik-combobox-input").click(function () {

                $("#ui-id-1").show();
                $("#ui-id-3").hide();
                $("#ui-id-2").hide();

            });
            $("#ui-id-1 .ui-corner-all").click(function () {

                cbox.val($(this).text());//将点击的内容嵌入到上面SPAN里面
                $("#ui-id-1").hide();
                province_name = $(this).text();
                var id = $("#ui-id-1 .ui-corner-all").index(this);//点的对应城市

                dealerName_ = "就近4s店";

                cbox3.val("请选择城市");

                cbox2.val("就近4s店");

                chengshi(id)

            });

        }
    });


    function init() {

        //初始化 把PHP定位值放到网站上   更新默认值
        cbox.val(province[province_id]);//将点击的省份内容嵌入到上面SPAN里面
        province_name = province[province_id]
        chengshi(province_id);

        cbox3.val(city[province_id][city_id]);//将点击的经销商内容嵌入到上面SPAN里面

        cbox2.val(shop[province_id][city_id][0]);//将点击的经销商内容嵌入到上面SPAN里面

        dealerCode_ = shop_Code[province_id][city_id][0]//经销商的CODE

        city_name = city[province_id][city_id];//市名称

        dealerName_ = shop[province_id][city_id][0];//经销商名字

        //失去焦点时，隐藏省份
        $(".ik-combobox input").blur(function () {
            setTimeout(function () {
                $("#ui-id-1").hide();
            }, 200);

        });

        //失去焦点时，隐藏城市
        $(".ik-combobox3 input").blur(function () {
            setTimeout(function () {
                $("#ui-id-3").hide();
            }, 200);

        });

        //失去焦点时，隐藏城市
        $(".ik-combobox2 input").blur(function () {
            setTimeout(function () {
                $("#ui-id-2").hide();
            }, 200);

        });


    }


//城市 经销商 自动识别方法	
    function chengshi(id) {
        var ciytInfo = ""
        var shop_Info = ""

        //点击后嵌入相应城市+经销商
        for (var i = 0; i < city[id].length; i++) {
            ciytInfo += "<li class='ui-menu-item shop_bt'><a class='ui-corner-all'>" + city[id][i] + "</a></li>"

        }
        //点击相应省份显示城市
        $('#ui-id-3').html(ciytInfo);
        //4S店
        $(".ik-combobox-input3").click(function () {
            $("#ui-id-3").show();
            $("#ui-id-2").hide();
        });


        $("#ui-id-3 .ui-corner-all").click(function () {
            cbox3.val($(this).text());
            var id = $("#ui-id-3 .ui-corner-all").index(this)

            city_name = $("#ui-id-3 a").eq(id).text();   //城市名称
            $("#ui-id-3").hide();

            cbox2.val("就近4s店");
            jingxiaoshang(id);

        });


        function jingxiaoshang(ai) {
            shop_Info = "";
            for (var a = 0; a < shop[id][ai].length; a++) {
                shop_Info += "<li class='ui-menu-item shop_bt'><a class='ui-corner-all' name='" + city[id][ai] + "'   code='" + shop_Code[id][ai][a] + "'>" + shop[id][ai][a] + "</a></li>"
            }

            //点击相应城市显示经销商
            $('#ui-id-2').html(shop_Info);
            //4S店
            $(".ik-combobox-input2").click(function () {
                $("#ui-id-2").show();
                $("#ui-id-1").hide();
                $("#ui-id-3").hide();
            });


            $("#ui-id-2 .ui-corner-all").click(function () {
                cbox2.val($(this).text());
                var ai = $("#ui-id-2 .ui-corner-all").index(this);

                //传各种值
                dealerCode_ = $("#ui-id-2 a").eq(ai).text();  //经销商代码
                console.log("dealerCode_=" + dealerCode_)
                dealerName_ = $(this).text();    //经销商名称

                $("#ui-id-2").hide();

            })
        }

    }


//提交内容
    $("#yysj_btn").click(function () {
        if (!checkForm()) {		//验证表单
            return false;
        }

        var d = {};
        d.name = $("#Name").val();
        d.mobile = $('#Phone').val();
        d.province = province_name;    //省名称
        d.city = city_name;			//城市名称
        d.dealerName = dealerName_;  //经销商名称
        d.campaignName = "全新景逸S50_2-3月上市期";  //活动站名称
        d.campaignCode = "jingyiS50_201702shangshi";  //活动站代码
        d.terminal = "PC";	//PC/移动
        d.advertiser_id = 3;	//广告主ID
        d.seriesName = "大迈X5";	//车型
        d.seriesCode = "dmx5";	//车型代码
        d.dealerCode = dealerCode_;	 //经销商代码

        $("#yysj_hide").show();

        //提交验证表单
        $.ajax({
            url: "http://event.mediav.cn/autodata/driver_api/add",
            type: 'post',
            data: d,
            dataType: 'jsonp',
            success: function (result) {
                if (result.success) {
                    //alert('提交成功，感谢您的预订，我们会尽快与您联系！');
                    $('.heise_1,.yycg').show();
                    document.getElementById('buycarInfo').reset();
                    init()
                    $("#yysj_hide").hide();

                } else {
                    alert(result.msg);
                    $("#yysj_hide").hide();

                }

            }
        })


    })


//预约试驾验证表单
    var checkForm = function () {
        var isMobile = /^1(3|4|5|8)\d{9}$/;

        if ($("#Name").val().length < 2) {
            alert("请输入2个字符以上的姓名...");
            $('#Name').focus();
            return false;
        }

        if (!isMobile.test($('#Phone').val())) {
            alert("请输入正确的电话号码...");
            $('#Phone').focus();
            return false;
        }

        if ($("#btn_city1").val() == "请选择城市") {
            alert("请选择城市...");
            $('#btn_city1').focus();
            return false;
        }

        if (dealerName_ == "就近4s店") {
            alert("请选择4s店...");
            $('#btn_shop').focus();
            return false;
        }

        return true;
    }


})
