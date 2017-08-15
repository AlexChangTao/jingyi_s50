<script language="javascript" type="text/javascript">
	function checkForm(){
		var myForm = document.getElementById("myForm");
	}
</script>
<div class="container"><h3>网站后台管理系统</h3></div>
<hr/>
<div class="container-fluid">
  <div class="row-fluid">
    <div class="span2">
    <?php $page="awardList";?>
      <?php include('application/views/admin/menu.php');?>
    </div>
    <div class="span10">
    	<form id="myForm" action="<?=base_url("index.php?/admin/alterAward")?>" method="post" onsubmit="return checkForm();">
    		<input type="hidden" name="id" value="<?=$id?>">
    		<table width='100%' cellspacing='0' cellpadding='0'>
			<tr>
				<td style='width:21%;height:28px;' align='right'>&nbsp;奖品：</td>
				<td align='left'><?=$award->name?></td>
			</tr>
			<tr>
				<td style='width:21%;height:28px;' align='right'>&nbsp;剩余数量：</td>
				<td align='left'><?=$award->num?></td>
			</tr>
			<tr>
				<td style='width:21%;height:28px;' align='right'>&nbsp;每日最高中奖数量：</td>
				<td align='left'><input name="today_upperlimit" value="<?=$award->today_upperlimit?>"/>（百分比）</td>
			</tr>
			<tr>
				<td style='width:21%;height:28px;' align='right'>&nbsp;中奖概率：</td>
				<td align='left'><input name="probability" value="<?=$award->probability?>"/>（百分比）</td>
			</tr>
<!--			<tr>-->
<!--				<td style='width:21%;height:28px;' align='right'>&nbsp;每日中奖上限：</td>-->
<!--				<td align='left'><input name="today_upperlimit" value="<?=$award->today_upperlimit?>"/></td>-->
<!--			</tr>-->
			<tr>
				<td style='width:21%;height:28px;' align='right'>&nbsp;</td>
				<td align='left'> <input type='submit' value='保 存'></td>
			</tr>
			</table>
		</form>
    </div>
  </div>
</div>