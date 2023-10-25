var obj = JSON.parse($response.body);
if(Object.keys(obj).length!==0){
    for (let i = 0;i < obj.data.length;i++){
        if (obj.data[i].lianJie!=''){
            obj.data[i].leiXing = 'lj';
        }
    }
};
$done({body:JSON.stringify(obj)});
