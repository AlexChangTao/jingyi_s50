<?php
require_once "jssdk.php";
$jssdk = new JSSDK("wx31dc57da96f83f9d", "6c0cae194c12d3bedeeb03cad5af2025");
$signPackage = $jssdk->GetSignPackage();
?>
<script src="https://res.wx.qq.com/open/js/jweixin-1.0.0.js"></script>
<script type="text/javascript">
function share_tj(){
	resetShareTxt();
}
</script>
<script type="text/javascript">
wx.config({
    debug: false,
    appId: '<?php echo $signPackage["appId"];?>',
    timestamp: <?php echo $signPackage["timestamp"];?>,
    nonceStr: '<?php echo $signPackage["nonceStr"];?>',
    signature: '<?php echo $signPackage["signature"];?>',
    jsApiList: [
       'onMenuShareTimeline',
       'onMenuShareAppMessage'
      // 所有要调用的 API 都要加到这个列表中
    ]
  });
  wx.ready(function () {
	  wxset();
  });
  function wxset(){
    // 在这里调用 API
    // alert(wx_title1);
	//DS.ready(function () {
	  wx.onMenuShareTimeline({
          title: wx_title1,
         // link: DS.linkChange(share_url),
          link:share_url,
          imgUrl: share_img,
          trigger: function (res) {
            
          },
          success: function (res) {
        	  //alter(share_url);
			  //DS.sendRepost("timeline");
          },
          cancel: function (res) {
            
          },
          fail: function (res) {
            
          }
        });
	  wx.onMenuShareAppMessage({
		    title: wx_title1, // 分享标题
		    desc: wx_title2, // 分享描述
		    //link: DS.linkChange(share_url), // 分享链接
		    link: share_url, // 分享链接
		    imgUrl: share_img, // 分享图标
		    type: '', // 分享类型,music、video或link，不填默认为link
		    dataUrl: '', // 如果type是music或video，则要提供数据链接，默认为空
		    success: function () { 
		        // 用户确认分享后执行的回调函数
		    	
				//DS.sendRepost("appMessage");
		    },
		    cancel: function () { 
		        // 用户取消分享后执行的回调函数
		    }
		});
	//});
  }
</script>