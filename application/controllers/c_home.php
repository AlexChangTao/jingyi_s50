<?php if ( ! defined('BASEPATH')) exit('No direct script access allowed');
class C_home extends CI_Controller {
	public static $isTest = false;
	public static $user_id;
	private $start_time = '2017-03-15 00:00:00';
	private $end_time = '2017-05-15 23:59:59';
	public function __construct() {
		parent :: __construct();
		$this->load->library('session');
		$this->load->helper('url');
		
		header('Content-Type: text/html; charset=utf-8');
		$this->user_id = @$this->session->userdata['userID'];
		//$this->user_id = 1;
		$this->load->model('m_user');
		date_default_timezone_set('Asia/Shanghai');
//		$this->is_weixin();
		error_reporting(0);
		
	if (! $this->isGo($this->start_time, $this->end_time)) {
			echo "<script>alert('活动已结束，感谢您的关注和参与，获奖者请留意手机短信，');</script>";
			exit('活动已结束，感谢您的关注和参与，获奖者请留意手机短信！');
		}
	}
	
	//进入首页
	public function index(){
		//$this->output->cache(5);
		if (! $this->isGo($this->start_time, $this->end_time)) {
			echo "<script>alert('活动已结束，感谢支持。');</script>";
			exit('活动已结束，感谢支持。');
		}
		//$media = $this->input->get('media');
		//$this->m_user->stat($this->user_id,$media);
		//$id = $this->input->get('id');
		//$this->user_id="user_id"; 
		$data['user'] = $this->m_user->getUserInfo($this->user_id);
		//$rank = $this->m_user->rank(); //游戏时间排行
		//$data['rank'] = $rank;
		//$data['friend_ranking'] = $this->m_user->getFriendInfo($this->user_id);
		$this->load->view("/index",@$data);	
	}
	

	/**
	 * 点我要参与进入到规则页面
	 */
	
	public function rule(){
		$this->load->view('/rule',@$data);
	}
	
	
	/*
	 * 验证码产生器
	 */
	public function yzm(){
		header ( "Content-type: text/html; charset=UTF-8" ); 			//设置文件编码格式
		srand((double)microtime()*1000000);								//生成随机数
		$im=imagecreate(65,35);											//创建画布
		$black=imagecolorallocate($im,0,0,0);							//定义背景
		$white=imagecolorallocate($im,255,255,255);						//定义背景
		$gray=imagecolorallocate($im,200,200,200);						//定义背景
		imagefill($im,0,0,$gray);										//填充颜色
		for($i=0;$i<4;$i++){					//定义4位随机数
			$str=mt_rand(3,20);						//定义随机字符所在位置的的Y坐标
			$size=mt_rand(5,8);					//定义随机字符的字体
			$authnum=substr($_GET['num'],$i,1);		//获取超级链接中传递的验证码
			imagestring($im,$size,(2+$i*15),$str,$authnum,imagecolorallocate($im,rand(0,130),rand(0,130),rand(0,130)));
		} 							//水平输出字符串
		for($i=0;$i<200;$i++){		//执行for循环，为验证码添加模糊背景
			$randcolor=imagecolorallocate($im,rand(0,255),rand(0,255),rand(0,255));	//创建背景
			imagesetpixel($im,rand()%70,rand()%30,$randcolor); 	//绘制单一元素
		}
		imagepng($im);				//生成png图像
		imagedestroy($im);			//销毁图像
	}
	
	/**
	 * 已不使用 提示登录或登录就保存游戏开始时间
	 */
/* 	public function register(){ 
		if (! $this->isGo($this->start_time, $this->end_time)) {
			echo "<script>alert('活动已结束，感谢支持。');</script>";
			exit('活动已结束，感谢支持。');
		}
		if (!$this->user_id){
			echo "<script>alert('请登录后再进行游戏！');</script>";
			$data['media'] = $this->input->get('media');//exit('m'.$media);
			$this->load->view('/form',@$data);
		}else {
			$microtime = microtime(true);
			$start_time = $microtime;
			//echo (microtime()); //默认输出一个空格分隔的字符串 0.25139300 1138197510，如果参数为true则为一个带四位小数的float 
			/* 以下可以直接加参数true代替
			 * $temp_time = explode(' ', $microtime);
			$start_time = $temp_time[1] + $temp_time[0];
			
			//echo $start_time; exit;
			$query = $this->m_user->save_start_time($this->user_id, $start_time); //用float后面全会是0因为精度不够，只能用double表示。
			//$this->load->view('/index',@$data);
			
			if ($query){
				$this->returnJson(0, '成功');
			}else {
				$this->returnJson(1001, '数据库保存时间失败！');
			}
		}
				
	} */
	
	
	/**
	 * 运行captcha
	 */
	public function captcha(){
		$this->load->view('/captcha',@$data);
	}
	
	/**
	 * 保存游戏开始时间
	 */
	public function save_start_time(){
		if (! $this->isGo($this->start_time, $this->end_time)) {
			echo "<script>alert('活动已结束，感谢支持。');</script>";
			exit('活动已结束，感谢支持。');
		}
		if (!$this->user_id){
			$this->returnJson(1004, '请登录后再进行游戏！');
		}elseif (!(isset($_SERVER["HTTP_X_REQUESTED_WITH"]) && strtolower($_SERVER["HTTP_X_REQUESTED_WITH"]) == "xmlhttprequest")) { //判断是否是ajax访问还是浏览器直接提交
			$this->returnJson(1005, '非法请求！');
		}elseif ($_SERVER['REQUEST_METHOD'] != 'POST'){
			$this->returnJson(1006, '非法请求！');
		}else {
			$microtime = microtime(true);
			$start_time = $microtime;
			//echo (microtime()); //默认输出一个空格分隔的字符串 0.25139300 1138197510，如果参数为true则为一个带四位小数的float
			/* 以下可以直接加参数true代替
			 * $temp_time = explode(' ', $microtime);
			 $start_time = $temp_time[1] + $temp_time[0];
			 */
			//echo $start_time; exit;
			$query = $this->m_user->save_start_time($this->user_id, $start_time); //用float后面全会是0因为精度不够，只能用double表示。
			//$this->load->view('/index',@$data);
				
			if ($query){
				$this->returnJson(0, '成功');
			}else {
				$this->returnJson(1002, '数据库保存时间失败！');
			}
		}
	}
	
	/**
	 * 保存游戏结束时间并返回时间差
	 */
	public function save_end_time(){
		if (!$this->user_id){
			$this->returnJson(1004, '请登录后再进行游戏！');
		}elseif (!(isset($_SERVER["HTTP_X_REQUESTED_WITH"]) && strtolower($_SERVER["HTTP_X_REQUESTED_WITH"]) == "xmlhttprequest")) { //判断是否是ajax访问还是浏览器直接提交
			$this->returnJson(1005, '非法请求！');
		}elseif ($_SERVER['REQUEST_METHOD'] != 'POST'){
			$this->returnJson(1006, '非法请求！');
		}
		$microtime = microtime(true);
		$end_time = $microtime;
		$diff_time = $this->m_user->save_end_time($this->user_id, $end_time);
		//$diff_time = number_format($diff_time, 4, '.', '');//不加后两个参数也可以
		$diff_time = number_format($diff_time, 2);
		if ($diff_time < 2){
			$diff_time =2.01; //防止黑客非法调用接口产生一个明显不可能的成绩，限制最快为2.01秒
		}
		/* if ($diff_time){
			$this->returnJson(0, '数据库保存时间成功！',$diff_time);
		}else {
			$this->returnJson(1001, '数据库保存时间失败！');
		} */
		if ($diff_time <= 30){
			$this->returnJson(0, '成功',$diff_time);
		}elseif ($diff_time >30){
			$this->returnJson(1001, '游戏超时！',$diff_time);
		}elseif ($diff_time == false){
			$this->returnJson(1002, '数据库保存时间失败！');
		}
	}
	
	/**
	 * 返回游戏排行前100位，按时间差从小到大
	 */
	public function rank(){
		/* 没有登录也允许查看排名
		 * if (! $this->user_id){
			echo "<script>alert('请登录后再进行游戏！');</script>";
			redirect(base_url('index.php'));
		} */
		$rank = $this->m_user->rank();
		//$s='王经理：13999312365 李经理：13588958741';
		//$s=preg_replace('#(d{3})d{5}(d{3})#', '${1}*****${2}', $rank);
		/**
		 * 对姓名和手机号用星号进行处理以保护隐私
		 */
		foreach ($rank as $row){
			$mobile = $row->mobile;
			$name = $row->truename;
			//$s=preg_replace('#(d{3})d{5}(d{3})#', '${1}*****${2}', $mobile);
			$row->mobile = substr_replace($mobile, '****', 3, 4);
			if (mb_strlen($name) == 2){
				$row->truename = mb_substr($name,0, 1) . '*' . mb_substr($name, 2,2);
			}elseif (mb_strlen($name) == 3){
				$row->truename = mb_substr($name,0, 1) . '*' . mb_substr($name, 2,1);
			}elseif (mb_strlen($name) == 4){
				$row->truename = mb_substr($name,0, 1) . '**' . mb_substr($name, 3,2);
			}elseif (mb_strlen($name) > 4){
				$row->truename = mb_substr($name,0, 2) . '***' ;
			}
			//exit($row->truename);
		}
		//$data['rank'] = $rank;
		//$this->load->view('/quote', @$data);
		$this->returnJson(0, '成功', $rank);
	}
	
	/**
	 * 注销登录
	 */
	public function logout(){
		//$this->session->set_userdata(array('userID'=>$userID,'nickname'=>$nickname,'openid'=>$tel));
		//$this->session->unset_userdata(array('userID','nickname','openid'));//无效
		$this->session->sess_destroy();
		//echo "<script>alert('已退出登录！');location.href='index.php';</script>";
		$this->returnJson(0,'成功');
	}
	
	/**
	 * 登录
	 */
	public function is_login(){
		$data['user']= $this->m_user->getUserInfo($this->user_id);
		//$name = $user->truename;
		if (isset($this->user_id)){
			$this->returnJson(0, '成功', $data['user']->truename);
		}else {
			$this->returnJson(1001, '未登录状态！');
		}
	}
	
	
	/**
	 * 设置SESSION为了保存验证码
	 */
	public function save_sess($auth_num){
		$this->session->set_userdata(array('auth_num' =>$auth_num));
	}

	
	/**
	 * 存储用户手机和姓名并登录
	 */
	public function get_login(){		
		/* 停止使用，使用session应该会更好
		 * if ($this->input->cookie('cp') == $_POST["validate"]){
			$this->returnJson(1007,'正确cp！', $this->input->cookie('cp'));
		} */
		
		if ($this->session->userdata["auth_num"] != strtolower($_POST["validate"])){
			//echo "<script>alert('验证码不正确。');</script>";
			$this->returnJson(1006,'验证码不正确！');
		}
		/*
		if(!$this->user_id){
			$this->returnJson(1001,'未登录！');
		}
		*/
		//$this->user_id = 19;
		
		$truename = $this->input->post('name');
		$mobile = $this->input->post('tel');
	
		//$address = $this->input->post('address');
		if(!$truename || !$mobile){
			$this->returnJson(1002,'缺少参数！');
		}
		
		//$this->returnJson(0,'成功！');
		/*
		$cnt = $this->m_user->get_award_user($this->user_id);
		if ($cnt < 1){
			echo "<script>alert('没有您的中奖记录，不能填写中奖信息！');history.go(-1);</script>";
		}
		*/
		//$query = $this->m_user->info($this->user_id, $truename, $mobile);
		//if($this->m_user->info($this->user_id, $truename, $mobile, $city, $city2)){		
		if ($this->m_user->registerOrLogin($mobile, $truename)){
			$this->returnJson(0,'成功！',$truename);
		}else {
			$this->returnJson(1001,'您曾经登录过，请核对姓名是否正确！');
		}
		
	}
	
	
	/**
	 * 进入助力页
	 */
	public function help(){
		if (! $this->isGo($this->start_time, $this->end_time)) {
			echo "<script>alert('活动已结束，感谢支持。新年快乐!');</script>";
			exit('活动已结束，感谢支持。新年快乐!');
		}
		$id = $this->input->get('id');				
		$data['id'] = $id;
		$data['user'] = $this->m_user->getUserInfo($id);
		$data['laud'] = $this->m_user->getLaudNum($id);
		if ($this->user_id == $id){
			$data['draw_num'] = $this->m_user->get_draw_num($this->user_id);
			$this->load->view('/user',@$data);
		}else {
			$this->load->view('/help',@$data);
		}
	}
	
	/**
	 * 进入助力页
	 */
	public function laud(){
		$id = $this->input->get('id');
		$ip = $this->input->ip_address();
		$laud = $this->m_user->laud($id, $ip);
		if ($laud){
			$this->returnJson(0,'成功加油！');
			//echo "<script>alert('点赞成功！');history.go(-1);</script>";
			
		}else {
			$this->returnJson(1001,'你已经为好友加油，一个手机只可加油一次！');
			//echo "<script>alert('不能再点赞了！');history.go(-1);</script>";
		}
	}
	
	

	
	/**
	 * 个人中心
	 */
	public function center(){
		if(!$this->user_id){
			//exit("<font size='32'>未登录！</font>");
			redirect(base_url('index.php'));
		}
		//$award = $this->input->post('award');
		$data['user'] = $this->m_user->getUserInfo($this->user_id);
		//$data['rank'] = $this->m_user->getFriendInfo($this->user_id);
		$data['laud'] = $this->m_user->getLaudNum($this->user_id);
		$this->load->view("/center",@$data);
	
	}
	

	/**
     * 请求接口返回内容
     * @param  string $url [请求的URL地址]
     * @param  string $params [请求的参数]
     * @param  int $ipost [是否采用POST形式]
     * @return  string
     */
    function juhecurl($url,$params=false,$ispost=0){
        $httpInfo = array();
        $ch = curl_init();
 
        curl_setopt( $ch, CURLOPT_HTTP_VERSION , CURL_HTTP_VERSION_1_1 );
        curl_setopt( $ch, CURLOPT_USERAGENT , 'JuheData' );
        curl_setopt( $ch, CURLOPT_CONNECTTIMEOUT , 60 );
        curl_setopt( $ch, CURLOPT_TIMEOUT , 60);
        curl_setopt( $ch, CURLOPT_RETURNTRANSFER , true );
        if( $ispost )
        {
            curl_setopt( $ch , CURLOPT_POST , true );
            curl_setopt( $ch , CURLOPT_POSTFIELDS , $params );
            curl_setopt( $ch , CURLOPT_URL , $url );
        }
        else
        {
            if($params){
                curl_setopt( $ch , CURLOPT_URL , $url.'?'.$params );
            }else{
                curl_setopt( $ch , CURLOPT_URL , $url);
            }
        }
        $response = curl_exec( $ch );
        if ($response === FALSE) {
            //echo "cURL Error: " . curl_error($ch);
            return false;
        }
        $httpCode = curl_getinfo( $ch , CURLINFO_HTTP_CODE );
        $httpInfo = array_merge( $httpInfo , curl_getinfo( $ch ) );
        curl_close( $ch );
        return $response;
    }

	
	
	function is_weixin()
	{ 
	    if (strpos($_SERVER['HTTP_USER_AGENT'], 'MicroMessenger') !== false ) {
	        return true;
	    }else {
	    	exit("请使用微信客户端访问！");
	    }  
	}
	
	function returnJson($code,$msg,$data=array()){
		exit(json_encode(array('code'=>$code, 'msg'=>$msg, 'data'=>$data)));
	}
	
	
	
	function isGo($start,$end){
		
		$zero1=date("Y-m-d H:i:s");
		 $isFinish=false;
		 if(strtotime($zero1)>strtotime($start) && strtotime($zero1)<strtotime($end)){
		 	return true;
		 }
		return false;
	}
	
	
//https请求
	function https_get($url){
		$ch = curl_init();
		curl_setopt($ch, CURLOPT_URL, $url);  
		curl_setopt($ch, CURLOPT_HEADER, false);  
		curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);  
		curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);    
		
		$result = curl_exec($ch);
		$rescode = curl_getinfo($ch, CURLINFO_HTTP_CODE);  
		curl_close($ch) ;
		$ret = json_decode($result, true);
		return $ret;  
	}
}