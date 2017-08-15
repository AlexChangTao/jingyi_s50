<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title><?php echo $title ?></title>
<link href="<?= base_url('assets/css/bootstrap.css'); ?>" rel="stylesheet"/>
<link href="<?= base_url('assets/css/docs.css'); ?>" rel="stylesheet"/>

</head>
<body>
<div class="container-fluid">
  <div class="row-fluid">
    <div class="span12">
      <h3> 后台登录界面 </h3>
      <form id="Form1" action="<?=base_url("index.php?/admin/checklogin")?>" method="post">
      <fieldset>
        <legend>用户登录</legend>
        <label>用户名:</label>
        <input name="username" type="text" data-rule="用户名:required;username" placeholder="用户名">
        <label>密　码:</label>
        <input name="password" type="password" data-rule="密码:required;password" placeholder="密码">
        <label></label>
        <button type="submit" class="btn">提交</button>
      </fieldset>
      </form> </div>
  </div>
</div>
</body>
</html>