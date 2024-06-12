var obj = $response.body;
if(Object.keys(obj).length!==0){
  obj = obj.replace("s.NF$.length!==0","!1");
}
$done({body:obj});
