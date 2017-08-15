<?php

class M_user extends CI_Model {
    public function __construct() {
        parent::__construct();
        $this->load->database();
    }
    
    
	public function getUserInfo($id){
		return $this->db->query("select * from s50_001_user where id=? limit 1", $id)->row();
	}
    
	
	/**
	 * 用户注册或登录 
	 */
	public function registerOrLogin($tel, $name) {
		$query = $this->db->query("select id, truename, openid from s50_001_user where openid=? limit 1", array($tel));
		$data = $query->result();
		if (count($data) == 0) {
			$sql = "INSERT INTO s50_001_user (openid,truename,mobile,ip,reg_time)
        	VALUES (?,?,?,?,?)";
			$query1 = $this->db->query($sql, array($tel,@$name,$tel,$this->input->ip_address(),date("Y-m-d H:i:s")));
			$userID=$this->db->insert_id();						
			$this->session->set_userdata(array('userID'=>$userID,'nickname'=>$name,'openid'=>$tel));						
			return $userID;
		}else {
			$userID=$data[0]->id;
			$nickname = $data[0]->truename;
			if ($nickname != $name){
				return false;
			}
			$this->session->set_userdata(array('userID'=>$userID,'nickname'=>$nickname,'openid'=>$tel));
			return $userID;
	
		}		
	}
	
	
	
	/**
	 * 暂时不用！ 保存游戏进行的时间包括最新时间和最短时间
	 */
	public function save_time($user_id, $time){
		$query = $this->db->query("update s50_001_user set account=? where (id=? and account > ? ) or (id=? and account = 0.00 ) limit 1", array($time, $user_id, $time, $user_id));
		//$query = $this->db->query("update user set account=? where id=? limit 1", array($time, $user_id));
		$query1 = $this->db->query("update s50_001_user set img1_url=? where id=? limit 1", array($time, $user_id));
		if ($query && $query1){
			return true;
		}else {
			return false;
		}
	}
	
	/**
	 * 保存游戏开始时间
	 */
	public function save_start_time($user_id, $start_time){
		$query = $this->db->query("update s50_001_user set img1_url=? where id=? limit 1", array($start_time, $user_id));
		if ($query){
			return true;
		}else {
			return false;
		}
	}
	
	/**
	 * 保存游戏结束时间
	 */
	public function save_end_time($user_id, $end_time){
		$query = $this->db->query("update s50_001_user set img2_url=? where id=? limit 1", array($end_time, $user_id));
		$start_time = $this->db->query("select img1_url from s50_001_user where id=? limit 1", array($user_id))->row()->img1_url;
		$diff_time = $end_time - $start_time;
		//$save_diff_time = $query = $this->db->query("update user set account=? where id=? limit 1", array($diff_time, $user_id)); //这是开始的保存方式没考虑保存最短时间
		//保存游戏进行的时间包括最新时间和最短时间
		$save_diff_time = $this->db->query("update s50_001_user set account=? where (id=? and account > ? ) or (id=? and account = 0.00 ) limit 1", array($diff_time, $user_id, $diff_time, $user_id));
		//$query1 = $this->db->query("update user set new_account=? where id=? limit 1", array($diff_time, $user_id)); //最新一次游戏的时间
		if ($save_diff_time){
			return $diff_time;
		}else {
			return false;
		}
	}
	
	/**
	 * 返回游戏排行前100位，按时间差从小到大
	 */
	public function rank(){
		$rank = $this->db->query("select truename,mobile,account from s50_001_user where account >0 and account <=30 order by account asc limit 100");
		return $rank->result();
	}
	
	
	/**
	 * 登录
	 */
	public function login($tel, $name) {
		$query = $this->db->query("select id, truename, openid from s50_001_user where openid=? and truename=? limit 1", array($tel,$name));
		$data = $query->result();
		if (count($data) == 0) {
			return 0;
		}else {
			$userID=$data[0]->id;
			$nickname = $data[0]->truename;
			$this->session->set_userdata(array('userID'=>$userID,'nickname'=>$nickname,'openid'=>$tel));
			return $userID;
		}
	}

	
	
	/**
	 * 修改资料
	 */
	public function info($user_id, $truename, $mobile, $city, $city2){
		$sql = "update s50_001_user set truename=?, mobile=?, area=?, address=? where id=?";
		$this->db->query($sql,array($truename, $mobile, $city, $city2, $user_id));
		return $this->db->affected_rows()>0;
	}
	
	

    
	public function getOpusByUserID($user_id){
		$query = $this->db->query("select * from opus where user_id=?", $user_id);
		return $query->result();
	}
   
	
	/**
	 * 添加作品
	 */
	public function add_opus($user_id,$content,$city_name,$store_name,$is_dx7,$name,$mobile,$img_url){
		if($this->db->query("SELECT count(*) as cnt FROM s50_001_user WHERE mobile=?", '123')->row()->cnt>0){//为了测试用了123,生产中要改过来
			return false;
		}
			
		$this->db->query("update s50_001_user set address=?,area=?,truename=?,other=?,name=?,mobile=?,portrait_url=?,account=account+3 where id=?",
				array($content,$city_name,$store_name,$is_dx7,$name,$mobile,$img_url,$user_id));
		return $this->db->affected_rows()>0;
	}
	
    
	/**
	 * 返回两个日期相差多少天
	 */
	function getChaBetweenTwoDate($date1, $date2) {
		$Date_List_a1 = explode("-", $date1);
		$Date_List_a2 = explode("-", $date2);
		$d1 = mktime(0, 0, 0, $Date_List_a1[1], $Date_List_a1[2], $Date_List_a1[0]);
		$d2 = mktime(0, 0, 0, $Date_List_a2[1], $Date_List_a2[2], $Date_List_a2[0]);
		$Days = round(($d1 - $d2) / 3600 / 24);
		return $Days;
	}
	
}