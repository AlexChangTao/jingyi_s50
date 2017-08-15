var type; //定义变量用于判定为用户还是好友,值为0显示好友页面，值为1显示个人页面
//type = id;
$(function(){
	//type = Math.round(Math.random()); //随机生成用于测试
	//为了便于逻辑控制，用户页和助力页分开，这里是用户页的Js
	type = 0; //设置type=0保证只显示用户页
	if(type){
		$("section").hide();
		$(".friend").show();
	}else{
		$("section").hide();
		$(".user").show();
	}
	//$("section").hide();
	//$(".user").show();
	
	//汽车动态效果
	var heart = parseInt($(".heart span").html());
	var total = parseInt($(".heart em").html());
	$(".line").css("width",heart/total*430);
	$(".iocn_car").css("left",heart/total*425);
	
	//分享浮窗
	$(".user_btn2").click(function(){
		$(".share").show();
	});
	$(".share_btn").click(function(){
		$(".share").hide();
	});
	
	//抽奖跳转动画
	$(".user_btn1").click(function(){
		$(".sweep").show();
		$(".sweep").animate({top:"0px"});
	});
	
	//抽奖
	//var str = '“自驾返乡”'; //中奖内容
	var str = new Array("护送返乡","返乡车票报销");
	var word = ''; //弹窗内容
	$(".lantern a").click(function(){
		//var code = Math.round(Math.random()); //模拟中奖结果
		 $.ajax({
             url: "index.php?/draw",
             type: "post",
            // data:$('#form_list').serialize(), 
             dataType: "json",
           
             success: function(result) {
                 if (result.code == 0) {
                		word = '<h2>恭喜您</h2><h4>获得<span>'+str[result.data[0] - 1]+'</span>机会</h4><p>将有工作人员在2个工作日内与您进行联系</p><a href="###" class="sweep_btn">好的</a>';
            			$(".sweep_word").html(word);
            			$(".sweep_mask").show();
                 } else if (result.code == 1001) {
                	 alert('您还不能抽奖，请先参与活动！');
                	 //alert('您还不能抽奖，快去请朋友加油集赞吧！');
                	 location.href = "index.php"
                 } else if (result.code == 1002) {
                	 alert(result.msg);
                	 //alert('您还不能抽奖，快去请朋友加油集赞吧！');
                	 location.href = "index.php?/make_ticket"
                 }
                   else {
                	word = '<h3>没有发现什么</h3><p>安全回家比什么都重要啦！</p><a href="###" class="sweep_btn">继续加油</a>';
         			$(".sweep_word").html(word);
         			$(".sweep_mask").show();
                 }
             },
             error: function(xhr) {
                 console.log('请求失败...');
             }
         });
		 
	/*	if(code){
			word = '<h2>恭喜您</h2><h4>获得<span>'+str+'</span>机会</h4><p>将有工作人员在2个工作日内与您进行联系</p><a href="###" class="sweep_btn">好的</a>';
			$(".sweep_word").html(word);
			$(".sweep_mask").show();
		}else{
			word = '<h3>没有发现什么</h3><p>安全回家比什么都重要啦！</p><a href="###" class="sweep_btn">继续加油</a>';
			$(".sweep_word").html(word);
			$(".sweep_mask").show();
		}*/
	});
	
	$('.sweep_word').on('click', '.sweep_btn', function(e) {
        $(".sweep_mask").hide();
		$(".sweep").animate({top:"100%"},function(){
			$(".sweep").hide();
		});
		//必须刷新才能正确显示剩余的抽奖次数
		location.href='index.php?/make_ticket';
   });
});