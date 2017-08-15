<?php
if (!defined('BASEPATH'))
exit('No direct script access allowed');

class C_admin extends CI_Controller {

	public function __construct() {
		parent::__construct();
		$this->load->helper('url');
		$this->load->model('m_admin');
		$this->load->library('session');
		header("Content-type: text/html; charset=utf-8");
		date_default_timezone_set('Asia/Shanghai');
	}
	public function index() {
		$this->myRedirect('admin/login');
	}
	
	function returnJson($code,$msg,$data=array()){
		exit(json_encode(array('code'=>$code, 'msg'=>$msg, 'data'=>$data)));
	}

    
    /**
     * pv和uv记录
     */
	public function stat(){
    	if($this->session->userdata('username')){
    		$data['title'] = '后台管理';
    		$qrcode = $this->input->get('qrcode');
	        $stat = $this->m_admin->getStat($qrcode);
	        
	        $total_pv = 0;
	        $total_uv = 0;
	        foreach ($stat[0] as $row){
	        	$row->UV=0;
	        	foreach ($stat[1] as $uvrow){
	        		if($row->period == $uvrow->period){
	        			$row->UV = $uvrow->num;
	        			$total_uv += $uvrow->num;
	        			break;
	        		}
	        	}
	        	$total_pv += $row->PV;
	        }
	        
	        $data['stat'] = $stat[0];
	        $data['total_pv'] = $total_pv;
	        $data['total_uv'] = $total_uv;
	        $this->load->view("/admin/header.php",$data);
			$this->load->view("/admin/stat.php",$data);
        	$this->load->view("/admin/footer.php");
    	}else {
    		$this->myRedirect('admin/login');
    	}
	}
	
	
	
	/**
     * 导出用户记录
     */
    public function exportUser(){
    	if($this->session->userdata('username')){
    		$filename = '用户列表.csv'; //设置文件名   
    		$isok = $this->input->get('isok');
    		$keyword = $this->input->get('keyword');
    		$results = $this->m_admin->getUserListALL($keyword, $isok);
		    //$str = "用户id,真实姓名,手机号,出发城市,目的城市,ip,注册时间,最后一次登录时间\n";   //要加逗号分隔否则全部在一个单元格中
		    $str = "用户ID,真实姓名,手机号,最短的游戏时间,IP,注册时间,最后一次登录时间\n";
		    foreach ($results->result() as $row){
		    	//$id = $row->id;
		    	$user_id = $row->id;
		    	//$nick_name = str_replace(",","，",$row->truename);
		    	$name =  str_replace(",","，",$row->truename);
		    	$mobile = $row->mobile;
		    	$time = $row->account;
		    	//$new_time = $row->img1_url;
		    	$ip = $row->ip;
		    	$reg_time = $row->reg_time;
		    	$last_log = $row->lastLoginTime;
		    	//$code = $row->code;
		    	//$add_time = $row->add_time;
		    	//$reg_time = $row->reg_time;
		    
		    	$str .= $user_id.",\t".$name.",".$mobile.",".$time.",".$ip.",".$reg_time.",".$last_log."\n"; //用引文逗号分开
		    }
		    $str = mb_convert_encoding($str, "GBK", "UTF-8");
		    // $str = iconv('UTF-8','GBK//IGNORE',$str);
		    $this->export_csv($filename,$str); //导出
    	}else {
    		$this->myRedirect('admin/login');
    	}
    }
    function export_csv($filename,$data)   
	{   
//		header("Content-type: text/html; charset=utf-8");
	    header("Content-type:text/csv;charset=GBK");   
	    header("Content-Disposition:attachment;filename=".$filename);   
	    header('Cache-Control:must-revalidate,post-check=0,pre-check=0');   
	    header('Expires:0');   
	    header('Pragma:public');   
	    echo $data;   
	} 
	
	public function login() {
		$user = $this->session->userdata('username');
		if($user)
		{
			redirect(base_url("index.php?/admin/userList"));
		}
		else
		{
			$data['title'] = '后台管理';
			$this->load->view("/admin/login.php", $data);
		}
	}
	
	public function toAlterImg2(){
    	if($this->session->userdata('username')){
    		$data['title'] = '后台管理';
    		$this->load->view("/admin/header.php",$data);
    		$id = $this->input->get('id');
    		$data['obj'] = $this->m_admin->getOpusByID($id);
    		$data['id'] = $id;
			$this->load->view("admin/alterAlterImg2.php",$data);
        	$this->load->view("/admin/footer.php");
    	}else {
    		 $this->myRedirect('admin/login');
    	}
    }
    
    public function lotteryList(){
    	if($this->session->userdata('username')){
    		$data['title'] = '后台管理';
    
    		$this->load->library('pagination');
    		$config['base_url'] = base_url('index.php?/admin/lotteryList?v='.time());
    		$config['total_rows'] = $this->m_admin->getLotteryListCount();
    		$config['page_query_string'] = TRUE;
    		$config['per_page'] = 20;
    		$config['num_links'] = 5;
    		$config['first_link'] = '首页';
    		$config['last_link'] = '尾页';
    		$config['prev_link'] = '上一页';
    		$config['next_link'] = '下一页';
    		$config['full_tag_open'] = '<p>';
    		$config['full_tag_close'] = '</p>';
    		$this->pagination->initialize($config);
    
    		$data['results'] = $this->m_admin->getLotteryList($config['per_page'], $this->input->get('per_page'));
    		$data['per_page'] = $this->input->get('per_page');
    		 
    		$this->load->view("/admin/header.php",$data);
    		$this->load->view("/admin/lotteryList.php",$data);
    		$this->load->view("/admin/footer.php");
    	}else {
    		$this->myRedirect('admin/login');
    	}
    }
    
    public function awardList(){
    	if($this->session->userdata('username')){
    		$data['title'] = '后台管理';
    		$data['results'] = $this->m_admin->getAwardList();
    		$this->load->view("/admin/header.php",$data);
    		$this->load->view("/admin/awardList.php",$data);
    		$this->load->view("/admin/footer.php");
    	}else {
    		$this->myRedirect('admin/login');
    	}
    }
    /**
     * 导出中奖用户
     */
    public function exportLotteryUser(){
    	if($this->session->userdata('username')){
    		$filename = '中奖用户列表.csv'; //设置文件名
    		$results = $this->m_admin->getLotteryListALL();
    		$str = "用户ID,真实姓名,手机号,拼图游戏完成时长,IP,奖品名,注册时间\n";
    		foreach ($results->result() as $row){
    			//$id = $row->id;
    			$user_id = $row->id;
    			//$nick_name = str_replace(",","，",$row->truename);
    			$name =  str_replace(",","，",$row->truename);
    			$mobile = $row->mobile;
    			$time = $row->account;
    			$ip = $row->ip;
    			$award_name = '待定';
    			//$code = $row->code;
    			//$add_time = $row->add_time;
    			$reg_time = $row->reg_time;
    		  
    			$str .= $user_id.",\t".$name.",".$mobile.",".$time.",".$ip.",".$award_name.",".$reg_time."\n"; //用引文逗号分开
    		}
    		$str = mb_convert_encoding($str, "GBK", "UTF-8");
    		//		    $str = iconv('UTF-8','GBK//IGNORE',$str);
    		$this->export_csv($filename,$str); //导出
    	}else {
    		$this->myRedirect('admin/login');
    	}
    }
	
	
	public function toAlterPwd(){
    	if($this->session->userdata('username')){
    		$data['title'] = '后台管理';
    		$this->load->view("/admin/header.php",$data);
			$this->load->view("admin/alterPwd.php");
        	$this->load->view("/admin/footer.php");
    	}else {
    		 $this->myRedirect('admin/login');
    	}
    }
    
    public function toAlterAward(){
    	if($this->session->userdata('username')){
    		$data['title'] = '后台管理';
    		$this->load->view("/admin/header.php",$data);
    		$id = $this->input->get('id');
    		$data['award'] = $this->m_admin->getAwardByID($id);
    		$data['id'] = $id;
    		$this->load->view("admin/alterAward.php",$data);
    		$this->load->view("/admin/footer.php");
    	}else {
    		$this->myRedirect('admin/login');
    	}
    }
    
	
	/**
     * 修改密码
     */
    public function alterPwd(){
    	$user = $this->session->userdata('username');
    	if($user){
	        if ($this->m_admin->checkUser($user, $this->input->post('old'))) {
	        	$r = $this->m_admin->alterUser($user, $this->input->post('new1'));
	        	$this->ok("修改成功!","toAlterPwd");
	        } else {
	        	$this->ok("旧密码不正确!","toAlterPwd");
	        }
    	}else {
    		 $this->myRedirect('admin/login');
    	}
    }
    

    /**
     * 用户抢金记录
     */
	
	public function userList(){
    	if($this->session->userdata('username')){
    		$data['title'] = '后台管理';
	    	$keyword = $this->input->get('keyword');
	    	$isok = $this->input->get('isok');
	    	
	        $this->load->library('pagination');
	        $config['base_url'] = base_url('index.php?/admin/userList?keyword='.$keyword.'&isok='.$isok);
	        $config['total_rows'] = $this->m_admin->getUserListCount($keyword, $isok);
	        $config['page_query_string'] = TRUE;
	        $config['per_page'] = 20;
	        $config['num_links'] = 5;
	        $config['first_link'] = '首页';
	        $config['last_link'] = '尾页';
	        $config['prev_link'] = '上一页';
	        $config['next_link'] = '下一页';
	        $config['full_tag_open'] = '<p>';
	        $config['full_tag_close'] = '</p>';
	        $this->pagination->initialize($config);
	        
	        $data['results'] = $this->m_admin->getUserList($config['per_page'], $this->input->get('per_page'), $keyword, $isok);
	        $data['keyword'] = $keyword;
	        $data['per_page'] = $this->input->get('per_page');
	        $data['total_rows'] = $config['total_rows'];
	        $this->load->view("/admin/header.php",$data);
			$this->load->view("/admin/userList.php",$data);
        	$this->load->view("/admin/footer.php");
    	}else {
    		$this->myRedirect('admin/login');
    	}
    }
    
    public function alterAward(){
    	$user = $this->session->userdata('username');
    	if($user){
    		$id = $this->input->post('id');
    		//$award_num = $this->input->post('award_num');//一般不让客户修改剩余奖品数，后面也相应作了修改
    		$probability = $this->input->post('probability');
    		$today_upperlimit = $this->input->post('today_upperlimit');
    		//    		exit;
    		if ($this->m_admin->alterAward($id, $probability, $today_upperlimit)) {
    			$this->ok("修改成功!","awardList");
    		} else {
    			$this->ok("修改失败!","awardList");
    		}
    	}else {
    		$this->myRedirect('admin/login');
    	}
    }
    
    public function delLottery(){
    	$user = $this->session->userdata('username');
    	if($user){
    		$id = $this->input->get('id');
    		if ($this->m_admin->delLottery($id)) {
    			$this->ok("删除成功!","lotteryList");
    		} else {
    			$this->ok("删除失败!","lotteryList");
    		}
    	}else {
    		$this->myRedirect('admin/login');
    	}
    }
    


	public function checklogin()
	{
		$user = $this->input->post('username');
		$pass = $this->input->post('password');
		
		if ($this->m_admin->checkUser($user, $pass))
		{
			$this->session->set_userdata('username', $user);
			redirect(base_url("index.php?/admin/userList"));
		}
		else
		{
			$data['title'] = '后台管理';
			$data['msg'] = '用户名或密码错误，请检查后重新登录！';
			echo "<script>alert('用户名或密码错误，请检查后重新登录！');history.go(-1);</script>";
			//$this->load->view("/admin/msg.php", $data);
		}
	}

	public function logout() {
		if ($this->session->userdata('username')) {
			$this->session->unset_userdata('username');
			echo '<script>parent.window.location.href="'.base_url().'"</script>';
		}
	}

	function ok($msg,$url){
		echo '<script>alert("'.$msg.'");document.location.href="'.base_url("index.php?/admin/".$url).'";</script>';
	}

	function myRedirect($url){
		redirect(base_url("index.php?/".$url));
	}
}

?>
