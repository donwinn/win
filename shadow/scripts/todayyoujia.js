var obj = JSON.parse($response.body);
if(Object.keys(obj.result.ads).length!==0){
    obj.result.ads = {};
};
$done({body:JSON.stringify(obj)});
