<div class="container">
<h3>网站后台管理系统</h3>
</div>
<hr />
<div class="container-fluid">
<div class="row-fluid">
<div class="span2"><?php $page="awardList";?> <?php include('application/views/admin/menu.php');?>
</div>
<div class="span10">
<input type="hidden" id="state" name="state" value="0"/>
<table class="tablelistsecond" border="1">
	<tr>
		<th align="center">ID</th>
		<th align="center">奖品名称</th>
		<th align="center">数量</th>
		<th align="center">中奖概率(百分比)</th>
		<th align="center">每日中奖上限</th>
		<th align="center">操作</th>
	</tr>
	<?php foreach ($results->result() as $row): ?>
	<tr>
		<td align="center"><?php echo $row->id ?></td>
		<td align="center"><?php echo $row->name ?></td>
		<td align="center"><?php echo $row->num ?></td>
		<td align="center"><?php echo $row->probability ?></td>
		<td align="center"><?php echo $row->today_upperlimit ?></td>
		<td align="center"><a href="<?=base_url('index.php?/admin/toAlterAward?id=').$row->id?>">修改</a></td>
	</tr>
	<?php endforeach; ?>
</table>
</div>
</div>
</div>