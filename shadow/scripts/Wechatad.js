var obj = JSON.parse($response.body);
if(Object.keys(obj).length!==0){
  obj.advertisement_num = 0;
  obj.advertisement_info = [];
  obj.can_see_complaint = 0;
  delete obj.appid;
}
$done({body:JSON.stringify(obj)});
