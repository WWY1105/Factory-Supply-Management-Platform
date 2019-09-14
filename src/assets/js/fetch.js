import 'whatwg-fetch'
import 'es6-promise'
import axios from 'axios'
import store from '../../store/index'
const baseUrl=store.getState().baseUrl;
const get=(url)=>{
    let token;
    if(url=='business/user/password/login'){
        token="Basic Y2xpZW50OnNlY3JldA=="
    }else{
        token="bearer "+localStorage.getItem('loginToken')
    }
    let result=fetch(baseUrl+url,{
        credentials:'include',
        method: "GET",
        headers:{
            'Access-Control-Allow-Origin': '*',
            'Accept': 'application/json, text/plain, */*',
            // access_token: "0ce502fb-8403-4050-9cc5-31d672c871d2"
            //refresh_token: "72b78839-5ddc-43f3-896f-687a38873ed6"
            "Authorization":"Basic Y2xpZW50OnNlY3JldA=="
        },
         // 设置允许cors跨域
         mode: 'cors'
    })
    return result
}
const post=(url,paramsObj)=>{
    let token;
    if(url=='business/user/password/login'){
        token="Basic Y2xpZW50OnNlY3JldA=="
    }else{
        token="bearer "+localStorage.getItem('loginToken')
    }
    let result=fetch(baseUrl+url,{
        method:'POST',
        credentials:"include",
        headers:{
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/x-www-form-urlencoded',
            // access_token: "0ce502fb-8403-4050-9cc5-31d672c871d2"
            //refresh_token: "72b78839-5ddc-43f3-896f-687a38873ed6"
            "Authorization":"Basic Y2xpZW50OnNlY3JldA=="
        },
        body: obj2params(paramsObj)
    })
    return result
}
// 将对象拼接成 key1=val1&key2=val2&key3=val3 的字符串形式
const obj2params=(obj)=>{
    let result='';
    let item;
    for (item in obj) {
        result += '&' + item + '=' + encodeURIComponent(obj[item]);
    }
    if (result) {
        result = result.slice(1);
    }
    return result;
}

// 封装axios方法
function http(method, url, param,json,imgToken) {
    let token;
    if(url=='business/user/password/login'){
        token="Basic Y2xpZW50OnNlY3JldA=="
    }else if(imgToken){
        token=imgToken;
    }else{
        token="bearer "+localStorage.getItem('loginToken')
    }
    param = param && typeof param === 'object' ? param : {};
    const config = {
        url: baseUrl+url,
        method: method,
        // transformRequest: [function (param) {
        //     let ret = ''
        //     for (let it in param) {
        //         ret += encodeURIComponent(it) + '=' + encodeURIComponent(param[it]) + '&'
        //     }
        //     return ret
        // }],
        headers: {
            'X-Requested-With': 'XMLHttpRequest',
            "Authorization":token
        }
    };

    // post请求时需要设定Content-Type
    if(!json){
        if (method === 'post'||method === 'put') {
            config.headers['Content-Type'] = 'application/json;charset=UTF-8';
            config.data = param;
        } else if (method === 'get') {
            config.params = param;
        }
        
    }else{
        if (method === 'post'||method === 'put') {
            config.headers['Content-Type'] = 'application/json;charset=UTF-8';
            config.data = param;
        }
    }

    return axios(config);
}




window.get=get;
window.post=post;
window.http=http;
export {
    get,
    post
}