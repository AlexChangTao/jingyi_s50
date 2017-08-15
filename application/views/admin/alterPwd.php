<script language="javascript" type="text/javascript">
	function checkForm(){
		var myForm = document.getElementById("myForm");
		
		if(myForm.old.value == "" || myForm.new1.value == "" || myForm.new2.value == ""){
			alert("所有信息均必须填写");
			return false;
		}else if(myForm.old.value == myForm.new1.value){
			alert("新旧密码不能一致");
			return false;
		}else if(myForm.new1.value != myForm.new2.value){
			alert("两次输入的新密码不一致");
			return false;
		}
	}
</script>
<div class="container"><h3>网站后台管理系统</h3></div>
<hr/>
<div class="container-fluid">
  <div class="row-fluid">
    <div class="span2">
    <?php $page="alterPwd";?>
      <?php include('application/views/admin/menu.php');?>
    </div>
    <div class="span10">
    	<form id="myForm" action="<?=base_url("index.php?/admin/alterPwd")?>" method="post" onsubmit="return checkForm();">
    		<table width='100%' cellspacing='0' cellpadding='0'>
			<tr>
				<td style='width:21%;height:28px;' align='right'>&nbsp;<span style='color:red'>*</span> 旧密码：</td>
				<td align='left'><input type='password' name='old' style='width:150px'> [修改密码需要您输入旧密码以进行验证]</td>
			</tr>
			</table>
			<table width='100%' cellspacing='0' cellpadding='0'>
			<tr>
				<td style='width:21%;height:28px;' align='right'>&nbsp;<span style='color:red'>*</span> 新密码：</td>
				<td align='left'><input type='password' name='new1' style='width:150px'> [请输入一个新的密码，建议使用字母 + 数字]</td>
			</tr>
			</table>
			<table width='100%' cellspacing='0' cellpadding='0'>
			<tr>
				<td style='width:21%;height:28px;' align='right'>&nbsp;<span style='color:red'>*</span> 确认密码：</td>
				<td align='left'><input type='password' name='new2' style='width:150px'> [请再输入一次密码]</td>
			</tr>
			<tr>
				<td style='width:21%;height:28px;' align='right'>&nbsp;</td>
				<td align='left'> <input type='submit' value='保 存'></td>
			</tr>
			</table>
		</form>
    </div>
  </div>
</div>