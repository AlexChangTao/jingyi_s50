<style>

    .graph {
      width: 800px;
      height: 400px;
      margin: 0 0 0 0;
    }
.corol_ds{
		  margin: 20px auto 0 auto;
		 width: 800px;
         height: 20px;
		  background:#FFF;
	}
		.corol_ds .s1{ float:left; min-width:100px; font-family:"微软雅黑"; }
		.corol_ds .s1 span{ width:20px; height:20px; background:#0b62a4; float:left;}
		.corol_ds .s2{ float:left;  min-width:150px; font-family:"微软雅黑"; padding-left:50px; }
		.corol_ds .s2 span{ width:20px; height:20px; background:#7a92a3; float:left;}
  </style>
  <script src="<?= base_url('assets/js/jquery-1.4.4.min.js');?>"></script>
  <script src="<?= base_url('assets/js/raphael-min.js');?>"></script>
  <script src="<?= base_url('assets/js/morris.js');?>"></script>
<script>
	function mySub(){
		document.location.href="<?=base_url("index.php?/admin/stat?qrcode=")?>"+document.getElementById("qrcode").value;
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
<div class="span2"><?php $page="stat";?> <?php include('application/views/admin/menu.php');?>
</div>

	<div class="span10"><span style="float: left;">选择二维码：
		<select name="qrcode" id="qrcode">
			<option value="">所有</option>
			<option value="0"<?=@$_GET['qrcode']==='0'?' selected':''?>>二维码0</option>
			<option value="1"<?=@$_GET['qrcode']==1?' selected':''?>>二维码1</option>
			<option value="2"<?=@$_GET['qrcode']==2?' selected':''?>>二维码2</option>
			<option value="3"<?=@$_GET['qrcode']==3?' selected':''?>>二维码3</option>
			<option value="4"<?=@$_GET['qrcode']==4?' selected':''?>>二维码4</option>
			<option value="5"<?=@$_GET['qrcode']==5?' selected':''?>>二维码5</option>
			<option value="5"<?=@$_GET['qrcode']==6?' selected':''?>>二维码6</option>
			<option value="5"<?=@$_GET['qrcode']==7?' selected':''?>>二维码7</option>
			<option value="5"<?=@$_GET['qrcode']==8?' selected':''?>>二维码8</option>
			<option value="5"<?=@$_GET['qrcode']==9?' selected':''?>>二维码9</option>
			<option value="5"<?=@$_GET['qrcode']==10?' selected':''?>>二维码10</option>
		</select>
	</span><span
		style="float: left;"><input type="button" onclick="mySub()" value="查询" />[可以输入会员名称关键字进行搜索]</span>
	
	<br/><br/>
	<!-- 
	开始
	 -->
	
	
	<div class="corol">
      <div class="s1">&nbsp;PV:<?=$total_pv?><span></span></div>
      <div class="s2">&nbsp;UV:<?=$total_uv?><span></span></div>
  </div>
  <div id="graph-yyyy-mm" class="graph"></div>
  <script>
  

  
   $(function () {
		//直接添加数据就可以了period  放日历
//      var month_data = [
//        {"period": "2016-05-20", "PV": 5000, "UV": 500},
//        {"period": "2016-05-21", "PV": 3351, "UV": 0},
//        {"period": "2016-05-22", "PV": 3269, "UV": 2000},
//        {"period": "2016-05-23", "PV": 0, "UV": 0},
//        {"period": "2016-05-24", "PV": 0, "UV": 667},
//        {"period": "2016-05-25", "PV": 3248, "UV": 0},
//        {"period": "2016-05-26", "PV": 0, "UV": 0},
//        {"period": "2016-05-27", "PV": 3171, "UV": 0},
//        {"period": "2016-05-28", "PV": 0, "UV": 0},
//        {"period": "2016-05-29", "PV": 0, "UV": 0},
//		{"period": "2016-05-31", "PV": 0, "UV": 0},
//		{"period": "2016-06-01", "PV": 0, "UV": 0},
//		{"period": "2016-06-02", "PV": 0, "UV": 0},
//      ];
	  var month_data = <?=json_encode($stat)?>;

	  
      Morris.Line({
        element: 'graph-yyyy-mm',
        data: month_data,
        xkey: 'period',
        ykeys: ['PV', 'UV'],
		xLabels:"day",
        labels: ['PV', 'UV'],
        smooth: false,
		gridTextSize:15
      });
    });
  </script>
	
	<!-- 结束 -->
	</div>
</div>
</div>