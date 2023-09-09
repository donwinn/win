var obj = JSON.parse($response.body);
if(obj){
  obj = obj.replace("s.NF$.length!==0","s.NF$.length==0");
  $done({body:JSON.stringify(obj)});
}
