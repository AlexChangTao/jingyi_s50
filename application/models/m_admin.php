<?php

class M_admin extends CI_Model {
    public function __construct() {
        parent::__construct();
        $this->load->database();
    }
   
    public function getStat($qrcode){
    	if($qrcode || $qrcode==='0'){
    		$pvs = $this->db->query('SELECT add_time period,num PV FROM pv where qrcode=?',$qrcode)->result(); //add_time查询出来的数据用period代替，其它类似
    		$uvs = $this->db->query('select add_time period,count(*) num from uv where qrcode=? GROUP BY add_time',$qrcode)->result();
    	}else {
    		$pvs = $this->db->query('SELECT add_time period,sum(num) PV FROM pv GROUP BY add_time')->result();
    		$uvs = $this->db->query('select add_time period,count(*) num from uv GROUP BY add_time')->result();
    	}
    	return array($pvs, $uvs);
    }
	
    public function checkUser($u, $p) {
        $query = $this->db->query("select count(*) as cnt from s50_001_admin where name=? and password=? limit 1",array($u,md5($p)));
        return $query->row()->cnt > 0;
    }
    
    public function getAwardByID($id){
    	$sql = "SELECT * FROM award where id=?";
    	return $this->db->query($sql,$id)->row();
    }
    
	public function getUserListCount($keyword, $isok) {
        $sql = "SELECT count(*) as cnt FROM s50_001_user where 1=1";
        $parames = array();
        if($isok){
        	if($isok==1){
        		$sql.=" and mobile is not null";
        	}else {
        		$sql.=" and mobile is null";
        	}
        }
        if($keyword){
        	 $sql.=" and truename like ?";
        	 array_push($parames, "%".$keyword."%");
        }
        $query = $this->db->query($sql, $parames);
        return $query->row()->cnt;
    }
    
	public function getUserListALL($keyword, $isok){
    	$sql = "SELECT * FROM s50_001_user where 1=1";
     	$parames = array();
		if($isok){
        	if($isok==1){
        		$sql.=" and mobile is not null";
        	}else {
        		$sql.=" and mobile is null";
        	}
        }
        if($keyword){
        	 $sql.=" and truename like ?";
        	 array_push($parames, "%".$keyword."%");
        }
		$sql .= " order by id asc";
        $query = $this->db->query($sql, $parames); 
        return $query;
    }
    
	public function getUserList($num, $offset, $keyword, $isok){
        $sql = "SELECT * FROM s50_001_user where 1=1";
     	$parames = array();
		if($isok){
        	if($isok==1){
        		$sql.=" and mobile is not null";
        	}else {
        		$sql.=" and mobile is null";
        	}
        }
        if($keyword){
        	 $sql.=" and truename like ?";
        	 array_push($parames, "%".$keyword."%");
        }
        
		if($offset == ""){
			$offset = 0;
		}
		$offset = $offset+0;
		$sql .= " order by id desc";
		
		$sql .= " LIMIT ?,?";
		array_push($parames, $offset);
		array_push($parames, $num);
        $query = $this->db->query($sql, $parames); 
        return $query;
    }
	
    
    public function alterUser($u, $p) {
        $query = $this->db->query("update s50_001_admin set password=? where name=?", array(md5($p), $u));
        return $query;
    }
    	
    
	public function getUserByID($id){
		$query = $this->db->query("select * from s50_001_user where id=? limit 1", $id);
		return $query->row();
	}
	
	public function getAwardList(){
		$sql = "SELECT * FROM award";
		$query = $this->db->query($sql);
		return $query;
	}
	
	public function getLotteryListCount() {
		$sql = "SELECT count(*) as cnt FROM s50_001_user where account > 0 and account <=30";
		$query = $this->db->query($sql);
		return $query->row()->cnt;
	}
	
	public function getLotteryList($num, $offset){
		//$query = $this->db->query("SELECT a.*,b.nickname,b.truename,b.mobile,b.area,b.address,b.ip,b.media,c.code FROM award_record a left join user b on a.user_id=b.id left join code c on c.user_id=b.id where a.is_del=0 order by a.id asc LIMIT ?,?", array($offset+0, $num));
		$query = $this->db->query("SELECT * FROM s50_001_user where account > 0 and other=0 order by account asc LIMIT ?,?", array($offset+0, $num));
		return $query;
	}
	
	public function getLotteryListALL(){
		//$query = $this->db->query("SELECT a.*,b.truename,b.mobile,b.nickname,b.reg_time,b.area,b.address,b.ip,b.media,c.code FROM award_record a left join user b on a.user_id=b.id left join code c on c.user_id=b.id where a.is_del=0 order by a.id desc");
		$query = $this->db->query("SELECT * FROM s50_001_user where account > 0 and other=0 order by account asc LIMIT ?,?", array(0, 100));
		return $query;
	}
	
	public function delLottery($id){
		$this->db->query("update s50_001_user set other=1 where id=? limit 1", $id);
		$del_ok = $this->db->affected_rows()>0;
		if($del_ok){
			//$award_id = $this->db->query("select award_id from award_record where id=? limit 1",$id)->row()->award_id;
			//$this->db->query("update award set num=num+1 where id=?", $award_id);
		}
		return $del_ok;
	}
	
	
	public function alterAward($id, $probability, $today_upperlimit) {
		$this->db->query("update award set probability=?,today_upperlimit=? where id=?", array($probability, $today_upperlimit, $id));
		return $this->db->affected_rows()>0;
	}
	
    
}