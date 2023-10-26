var CryptoJS = CryptoJS,
	url = $request.url,
	body = $response.body,
	obj = JSON.parse(body);
let data = obj.data;
const key = CryptoJS.enc.Utf8.parse('2acf7e91e9864673'),
	iv = CryptoJS.enc.Utf8.parse('1c29882d3ddfcfd6');
function encryptdata(data) {
	const decryptdata = CryptoJS.AES.encrypt(data, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });
  return encryptdata.toString();
}
function decryptdata(data) {
	const decryptdata = CryptoJS.AES.decrypt(data, key, {
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });
  return decryptdata.toString( CryptoJS.enc.Utf8 );
}
if (url.indexOf('/user/userInfo') != -0x1) {
  const dedata = decryptdata(data);
  replacedata = dedata.replace( /"uid":\d+/g, '"uid":8888888' )
    .replace(/"expired_at":".*?"/g, '"expired_at":"9999-09-09 13:49:02"')
    .replace(/"aff":\d+/g, '"aff":8888888')
    .replace(/"nickname":".*?"/g, '"nickname":"ios鸡神"')
    .replace( /"thumb":".*?"/g, '"thumb":"https://new.cnzuqiu.mobi/upload/upload/20231022/2023102211033164334.jpeg"' )
    .replace(/"coins":\d+/g, '"coins":999999999999')
    .replace(/"money":\d+/g, '"money":999999999999')
    .replace( /"followed_count":\d+/g, '"followed_count":999999999999' )
    .replace(/"vip_level":\d+/g, '"vip_level":10')
    .replace( /"video_download_value":\d+/g, '"video_download_value":999999' )
    .replace(/"isVip":\w+/g, '"isVip":true')
    .replace(/"reg_tip":".*?"/g, '"reg_tip":""')
    .replace(/"vip_str":".*?"/g, '"vip_str":"🐔鸡神-帝王通卡"');
  const endata = encryptdata(replacedata);
  (obj.data = endata),
    (body = JSON.stringify(obj));
}
if (url.indexOf('/home/config') != -0x1) {
	const dedata = decryptdata(data);
	var _0x5ef3d7 = JSON.parse(dedata);
	(_0x5ef3d7.data.versionMsg.mstatus = 0),
    (_0x5ef3d7.data.ads = {}),
    (_0x5ef3d7.data.notice = {}),
    (_0x5ef3d7.data.pop_ads = []);
	var _0x3437f7 = JSON.stringify(_0x5ef3d7);
	const endata = encryptdata(_0x3437f7);
	(obj.data = endata),
    (body = JSON.stringify(obj));
}
if (url.indexOf('/community/construct') != -0x1) {
  const dedata = decryptdata(data);
  var _0x5ef3d7 = JSON.parse(dedata);
  _0x5ef3d7.data.banner = [
    {
      id: 0x61,
      title: "tg",
      description: "",
      img_url: atob(_0x1eb3b0),
      url_config: 'https://t.me/iosapp520',
      position: 0x3ea,
      android_down_url: null,
      ios_down_url: null,
      type: 0x1,
      status: 0x1,
      oauth_type: 0x0,
      mv_m3u8: "",
      channel: "",
      created_at: _0x4270aa(0x2ad, "N*E*"),
      router: _0x4270aa(0x1a3, "N*E*"),
      start_at: _0x4270aa(0x344, "qVnA"),
      end_at: _0x4270aa(0x27f, "s739"),
      clicked: 0x7b50,
      sort: 0x58,
      url_str: 'https://t.me/iosapp520',
      link_url: 'https://t.me/iosapp520',
      url: 'https://t.me/iosapp520',
      resource_url: atob(_0x1eb3b0),
      redirect_type: 0x2,
      report_id: 0x61,
      report_type: 0x0,
    },
  ];
  var _0x3437f7 = JSON.stringify(_0x5ef3d7);
  const endata = encryptdata(_0x3437f7);
  (obj.data = endata),
    (body = JSON.stringify(obj));
}
if (url.indexOf('/mv/getDetail') != -0x1) {
  const dedata = decryptdata(data);
  var _0x5ef3d7 = JSON.parse(dedata),
    url = _0x5ef3d7.data.detail.preview_url,
    _0x26c0fa = url.replace( /(h5play|10play)/g, 'long' );
  (_0x5ef3d7.data.detail.preview_url = _0x26c0fa),
    (_0x5ef3d7.data.detail.source_240 = _0x26c0fa),
    (_0x5ef3d7.data.detail.is_pay = 1),
    (_0x5ef3d7.data.detail.isfree = 1),
    (_0x5ef3d7.isVip = true),
    (_0x5ef3d7.data.banner = [
      {
        id: 0x61,
        title: "tg",
        description: "",
        img_url: atob(_0x1eb3b0),
        url_config: 'https://t.me/iosapp520',
        position: 0x3ea,
        android_down_url: null,
        ios_down_url: null,
        type: 0x1,
        status: 0x1,
        oauth_type: 0x0,
        mv_m3u8: "",
        channel: "",
        created_at: _0x4270aa(0x1a6, "A4m)"),
        router: _0x4270aa(0x23d, "W1Ns"),
        start_at: _0x4270aa(0x1e0, "0O*C"),
        end_at: _0x4270aa(0x265, "8Lnf"),
        clicked: 0x7b50,
        sort: 0x58,
        url_str: 'https://t.me/iosapp520',
        link_url: 'https://t.me/iosapp520',
        url: 'https://t.me/iosapp520',
        resource_url: atob(_0x1eb3b0),
        redirect_type: 0x2,
        report_id: 0x61,
        report_type: 0x0,
      },
    ]);
  var _0x3437f7 = JSON.stringify(_0x5ef3d7);
  const endata = encryptdata(_0x3437f7);
  (obj.data = endata),
    (body = JSON.stringify(obj));
}
if (url.indexOf('/mv/list_construct') != -0x1) {
  const dedata = decryptdata(data);
  replacedata = dedata.replace( /(同城约炮|9博体育|杏吧直播)/g, '点击此处跳转TG不迷路')
    .replace( /"img_url":".*?"/g, '"img_url":"https://new.cnzuqiu.mobi/upload/upload/20231022/2023102211033164334.jpeg"' )
    .replace( /"resource_url":".*?"/g, '"resource_url":"https://new.cnzuqiu.mobi/upload/upload/20231022/2023102211033164334.jpeg"' )
    .replace( /"url_config":".*?"/g, '"url_config":"https://t.me/iosapp520"' )
    .replace( /"url":".*?"/g, '"url":"https://t.me/iosapp520"' )
    .replace( /"url_str":".*?"/g, '"url_str":"https://t.me/iosapp520"' )
    .replace( /"link_url":".*?"/g, '"link_url":"https://t.me/iosapp520"' );
  var _0x5ef3d7 = JSON.parse(replacedata);
  _0x5ef3d7.data.banner = [
    {
      id: 0x17b8,
      link_url: 'https://t.me/iosapp520',
      resource_url: atob(_0x1eb3b0),
      redirect_type: 0x2,
      name: "",
      desc: "",
      router: _0x4270aa(0x202, "SIp9"),
      open_type: 0x0,
      report_id: 0x36,
      report_type: 0x2,
      url_str: _0x4270aa(0x242, "z)J3") + 'https://t.me/iosapp520',
    },
  ];
  var _0x3437f7 = JSON.stringify(_0x5ef3d7);
  const endata = encryptdata(_0x3437f7);
  (obj.data = endata),
    (body = JSON.stringify(obj));
}
$done({ body: body });