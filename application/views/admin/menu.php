<ul class="nav nav-list">
<li class="nav-header">
 网站后台管理
</li>
<li <?=$page=='userList'?' class="active"':''?>>
  <a href="<?=base_url('index.php?/admin/userList')?>">用户访问记录</a>
</li>

<li <?=$page=='lotteryList'?' class="active"':''?>>
  <a href="<?=base_url('index.php?/admin/lotteryList')?>">前100名获得奖品的用户</a>
</li>
<li class="divider">
</li>
<li class="nav-header">
  个人设置
</li>
<li <?=$page=='alterPwd'?' class="active"':''?>>
  <a href="<?=base_url('index.php?/admin/toAlterPwd')?>">修改密码</a>
</li>
<li>
  <a href="<?=base_url('index.php?/admin/logout')?>">注销登录</a>
</li>
</ul>