<!DOCTYPE html>

<html>

<head>

<meta charset="utf-8"/>

<meta name="viewport" content="width=750,user-scalable=0"/>

<title>景逸s50</title>

<script type="text/javascript" src="js/login.js"></script>
</head>

<body>

<section class="form" style="overflow: auto; position:absolute; top:10%;left:10%; font-size:2em;">


<form class="form_list" id="form_list" name="form_list">
<!-- <form id="sub" name="sub" method="post" action="index.php?/login">  用于在控制器中测试验证码是否正确-->

	<label>

	<span>您的姓名</span>&nbsp;<input id="name" name="name" type="text" placeholder="请输入真实姓名">

	</label>

	<label>

	<span>手机号码</span>&nbsp;<input id="tel" type="tel" name="mobile"placeholder="请输入您的电话">

	</label>
	
	  <tr>
    <td height="25" align="right">验证码：</td>
    <td colspan="2"><input name="check" type="text" id="check"  onmouseover="this.style.backgroundColor='#ffffff'" onmouseout="this.style.backgroundColor='#e8f4ff'" size="10" /></td>
  </tr>
  <tr>
    <td height="30"><input name="check2" type="hidden" value="" /></td>
    <td width="84"><script>yzm(form_list);</script></td>
    <td width="80"><a onclick="javascript:code(form_list)" style=" cursor:hand">换一张</a></td>
  </tr>
 <!--  <tr>
    <td height="25" colspan="3" align="center"><input id="enter" name="enter" type="submit" value=""></td>
  </tr> -->

	<p>

		请填写真实姓名及电话，该信息会作为中奖后核对身份的唯一凭证。

	</p>

	<a href="###" class="form_btn"><span>登录</span></a>
	
<p>
<span>验证码：</span>
<input type="text" name="validate" value="" size=10> 
<img  title="点击刷新" src="index.php?/captcha" align="absbottom" onclick="this.src='index.php?/captcha?'+Math.random();"></img>
</p>
<p>
<!-- <input type="submit" name="submit" value="提交"> 只要有submit按钮哪怕点击其它位置的登录也会跳转到action向指的地址没有action就到首页 -->
</p>
<!-- 	<a href="index.php?/have_join" class="form_btn21">已生成车，直接登录</a>
 -->
</form>

</section>

<script type="text/javascript" src="js/jquery-3.1.0.min.js"></script>

<script type="text/javascript" src="js/jquery.cityselect.js"></script>

<script>
			//获取链接中的参数media的值以便于统计各个渠道的pv
			


			function GetQueryString(name) {

				   var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");

				   var r = window.location.search.substr(1).match(reg);

				   if (r!=null) return (r[2]); return null;

				}

			//提交判定

			$(".form_btn").click(function(){

				//alert(GetQueryString("media")+'a');alert(GetQueryString("media")+'a');

				//确认已经选择城市

				if($("select option:selected").text().indexOf("请选择") === -1){

					//确认已输入姓名

					var names = document.getElementById('name').value;

					var reg2 = /^[a-z\d\u4E00-\u9FA5]+$/i; //验证特殊符号

					var flag2 = reg2.test(names);

					if(flag2){

						//确认输入正确的手机号

						var tel = document.getElementById('tel').value;

						var reg = /^1[3|4|5|7|8][0-9]{9}$/; //验证规则

						var flag = reg.test(tel);

						var media = GetQueryString("media");

						if(flag){
							if(form_list.check.value == ""){
								alert('请输入验证码');
								form_list.check.focus();
								return false;
							}
							if(form_list.check.value != form_list.check2.value){
								form_list.check.select();
								alert('输入的验证码不正确!');
								code(form_list);
								return false;
							}

							

							//window.location.href="index.php?/get_ticket";

							 $.ajax({

				                    url: "index.php?/get_ticket",

				                    type: "post",

				                    data:$('#form_list').serialize(), 

				                    dataType: "json",

				                    success: function(result) {
				                    	
				                        if (result.code == 0) {
										   alert('登录成功赶快到玩游戏，中大奖吧！');
				                           location.href="index.php?/make_ticket?media=" + media;

				                        } else if (result.code == 1006) {
				                        	alert('验证码错误，请重新输入');
				                        	//location.href="index.php?/register";
				                        	history.go(-1);
				                        }else if (result.code == 1007) {
				                        	alert('cp'); alert(result.data);
				                        	//location.href="index.php?/register";
				                        	history.go(-1);
				                        }
				                        else {

				                            alert(result.msg);

				                            location.href="index.php";

				                        }

				                    },

				                    error: function(xhr) {

				                        console.log('请求失败...');

				                    }

				                });

						}else{

							alert("请输入正确的手机号！");

						}

					}else{

						alert("请输入正确的姓名，不能包含特殊字符！");

					}

				}else{

					alert("请选择正确的城市！");

				}

			});

		</script>

</body>

</html>