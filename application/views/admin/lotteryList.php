<script>
	function exportExcel(){
		document.location.href="<?=base_url("index.php?/admin/exportLotteryUser")?>?currTime="+Date.parse(new Date());
	}
	function delLottery(id){
		if(confirm('确认删除该中奖信息？')){
			document.location.href="<?=base_url("index.php?/admin/delLottery")?>?id="+id;
		}
	}
</script>
<div class="container">
<h3>网站后台管理系统</h3>
</div>
<hr />
<div class="container-fluid">
	<div class="row-fluid">
		<div class="span2"><?php $page="lotteryList";?> <?php include('application/views/admin/menu.php');?>
		</div>
	
		<div class="span10">
		<input type="button"
	onclick="exportExcel()" value="导出Excel" />
		<table class="tablelistsecond" border="1">
			<tr>
				<th align="center">序号</th>
				<th align="center">用户ID</th>
				<th align="center">真实姓名</th>
				<th align="center">手机号</th>
				<th align="center">拼图游戏完成时长</th>
				<th align="center">IP</th>
				<th align="center">奖品名</th>
				<th align="center">注册时间</th>
				<th align="center">操作</th>
			</tr>
			<?php foreach ($results->result() as $index=>$row): ?>
			<tr>
				<td align="center"><?=intval(@$_GET['per_page'])+intval(($index+1)) ?></td>
				<td align="center"><?=$row->id ?></td>
				<td align="center"><?=$row->truename ?></td>
				<td align="center"><?=$row->mobile ?></td>
				<td align="center" width="150"><?=$row->account ?></td>
				<td align="center"><?=$row->ip ?></td>
				<td align="center">待定</td>
				<td align="center"><?=$row->reg_time ?></td>
				<td align="center"><a href="javascript:delLottery(<?=$row->id?>)">删除</a></td>
			</tr>
			<?php endforeach; ?>
		</table><?=$this->pagination->create_links(); ?></div>
	</div>
</div>
