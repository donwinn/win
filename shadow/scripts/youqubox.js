var body = $response.body;
if($request.url.includes('getBtns')){
    var obj = JSON.parse(body);
    obj.data.forEach(item=>{
        item.leiXing = 'lj';
    })
    body = JSON.stringify(obj);
}else if($request.url.includes('h5pwd')){
    var obj = JSON.parse(body);
    obj.status = 200;
    body = JSON.stringify(obj);
};
console.log("111111111111111111111111111111111111111111111111111111111",body);
$done({body});
