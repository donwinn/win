var obj = JSON.parse($response.body);
if(Object.keys(obj.data).length!==0){
    Object.keys(obj.data).forEach(key =>{
      obj.data[key] = {};
    });
};
console.log('测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试测试');
console.log(JSON.stringify(obj));
$done({body:JSON.stringify(obj)});
