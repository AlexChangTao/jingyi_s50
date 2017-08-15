<script>
	function mySub(){
		var keyword = document.getElementById("keyword").value;
		var isok = document.getElementById("isok").value;
		
		document.location.href="<?=base_url("index.php?/admin/userList?keyword=")?>"+keyword
				+"&isok="+isok;
	}
	function exportExcel(){
		var keyword = document.getElementById("keyword").value;
		var isok = document.getElementById("isok").value;
		
		document.location.href="<?=base_url("index.php?/admin/exportUser?keyword=")?>"+keyword
				+"&isok="+isok;
	}
</script>
<script
	type="text/javascript"
	src="<?php echo base_url('My97DatePicker/WdatePicker.js'); ?>"></script>
<div class="container">
<h3>网站后台管理系统</h3>
</div>
<hr />
<div class="container-fluid">
<div class="row-fluid">
<div class="span2"><?php $page="userList";?> <?php include('application/views/admin/menu.php');?>
</div>
<div class="span10">
	<span style="float: left;">
		用户名称关键字：
		<input style="width: 100px;" type="text" id="keyword" value="<?=$keyword?>" />
		是否完善资料：
		<select name="isok" id="isok" style="width: 80px;" >
			<option value="0">所有</option>
			<option value="1"<?=@$_GET['isok']==1?' selected':''?>>已完善</option>
			<option value="2"<?=@$_GET['isok']==2?' selected':''?>>未完善</option>
		</select>
		
		&nbsp;<input type="button" onclick="mySub()" value="查询" />&nbsp;
		<input type="button" onclick="exportExcel()" value="导出Excel" />
	</span> 

<table class="tablelistsecond" border="1">
	<tr>
		<th align="center">用户ID</th>
	
		<th align="center">真实姓名</th>
		<th align="center">手机号</th>
		
		<th align="center">最短的游戏时间</th>
		<th align="center">IP</th>
		<th align="center">注册时间</th>
		<th align="center">最后一次登录时间</th>
	</tr>
	<?php foreach ($results->result() as $row): ?>
	<tr>
		<td align="center"><?=$row->id ?></td>
		
		<td align="center"><?=$row->truename ?></td>
		<td align="center"><?=$row->mobile ?></td>
				<td align="center"><?=$row->account ?></td>
		
		<td align="center"><?=$row->ip ?></td>
		<td align="center"><?php echo $row->reg_time ?></td>
		<td align="center"><?php echo $row->lastLoginTime ?></td>
	</tr>
	<?php endforeach; ?>
</table>
总用户数：<?=$total_rows?>
	<?php echo $this->pagination->create_links(); ?></div>
</div>
</div>