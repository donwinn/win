var body = $response.body;
if($request.url.includes('getBtns')){
    var obj = JSON.parse(body);
    obj.data[0].leiXing = 'lj';
    body = JSON.stringify(obj);
}else if($request.url.includes('h5pwd')){
    var obj = JSON.parse(body);
    obj.status = 200;
    body = JSON.stringify(obj);
};
console.log("测试测试测试测试测试测试测试111111111111111111111111111111111111111111111111111111111",body);
$done({body});
