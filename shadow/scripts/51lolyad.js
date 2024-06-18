var body = $response.body;
var data = body.replace("s.NF$.length!==0","!1");//加载广告
body = data.replace("b.r&&b.f","b.r=!1,b.f=!1,!1");//跳过提示
data = body.replace(/\"ads\"/g,'\"adspass\"');//页面广告
body = data.replace("bhW\(\)\)\),!0\)","bhW())),!0)\ns=JSON.parse(q)\nif(s.data.aw_mv_perm==0){s.data.aw_mv_perm=1}\nq=JSON.stringify(s)");//会员解锁暗网限制
//bady = data.replace("bhW\(\)\)\),!0\)","bhW())),!0)\ns=JSON.parse(q)\nif(s.data.aw_mv_perm==0){s.data.aw_mv_perm=1,s.data.vip_level=11,s.data.is_vip=!0,s.data.expired_at=2033977524}\nq=JSON.stringify(s)");//模拟会员解锁暗网限制
data = body.replace("r.fx=s==null\?\"\":s","r.fx=s==null?\"\":s.replace(s.split(\"\.\")[0],\"https://long\")");//播放地址
//body = data.replace("p.e7(0,\"oauth_id\")","null");//随机id
console.log('修改后数据：',data);
$done({body:data});
