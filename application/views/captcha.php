<?php
session_start();
require 'ValidateCode.class.php';  //先把类包含进来，实际路径根据实际情况进行修改。
$_vc = new ValidateCode();  //实例化一个对象
$_vc->doimg();
$_SESSION['authnum_session'] = $_vc->getCode();//验证码保存到SESSION中

//include 'application/controllers/auth_num.php';
//include 'auth_num.php';//不用也可以因为在运行页面前已经运行了c_home类

$this->session->set_userdata(array('auth_num' =>$_SESSION['authnum_session'])); //只能用这个不能用$_SESSION因为在类中这个已经不能用了
//$_POST['cp'] = $_SESSION['authnum_session']; 在控制中不能获取$_POST["cp"]的值，ajax会报错
//$cp =  $_SESSION['authnum_session']; //同上
//$this->input->set_cookie("cp",$_SESSION['authnum_session'],3600);//不用帮助类, 保存到cookie也可以