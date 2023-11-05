
/**************************************
[rewrite_local]

^http[s]?:\/\/api\.domain\.*\.c*\/index\.php\/App\/(Account\/Login|User\/Info|Index\/Update|Host\/Info).*$ url script-response-body https://raw.githubusercontent.com/donwinn/win/main/shadow/scripts/shenhuB.js

^http[s]?:\/\/*\/.gitignore url reject-200

^http[s]?:\/\/api\.domain\.*\.c*\/index\.php\/App\/User\/Info.*$ url script-request-header https://raw.githubusercontent.com/donwinn/win/main/shadow/scripts/shenhuH.js


[mitm]
hostname = jihulab.com,api.domain*




***************************************/

var body = $response.body;
var url = $request.url;
var obj = JSON.parse(body);

if (url.indexOf('Account/Login') !== -1) {
    var a = {};
    a.code = '1';
    a.mobile = '13288808125';
    a.uid = '100673543';
    a.token = 'ebb19d35f4a8456e07255efe828abdc4';
    
    var b = {};
    b.status = true;
    b.result = a;
    b.code = 0;
    
    obj = b;
    body = JSON.stringify(obj);
}

if (url.indexOf('User/Info') !== -1) {
    var a = {};
    a.mobile = 'ios鸡神';
    a.no_agents = 1;
    a.sales_page = 'https://t.me/appios520';
    a.expired_time = 4092599349;
    a.expired_days = 999;
    a.sales_page_online = 'https://www.shenhu.live/';
    a.contact_info = '有问题联系客服微信:box1771';
    
    var b = {};
    b.status = true;
    b.result = a;
    obj = b;
    body = JSON.stringify(obj);
}

if (url.indexOf('Index/Update') !== -1) {
    delete obj.ad.info.t;
    delete obj.result;
    obj.ad.image = 'https://img.picgo.net/2023/09/19/9F4B1FDB-C2D1-41DF-B0E3-C6E1730400E24d9ca50bcc3f33b8.th.jpeg';
    obj.ad.url = 'https://t.me/appios520';
    body = JSON.stringify(obj);
}

var modifiedResponse = {
    body: body
};

$done(modifiedResponse);
