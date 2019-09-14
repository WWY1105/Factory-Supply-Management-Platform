import {get}from '../../assets/js/fetch'
import {message} from 'antd'
// 点击底部切换
const commonObj =  {
// imgUrl:"http://www.shuimujiajia.net/storage/",
// baseUrl:"http://www.shuimujiajia.net/works/",

    checkPhone:(val)=>{
        var isMobilePhone = /^([0-9]{3,4}-)?[0-9]{7,8}$/;
        var isFixMob= /^0?1[3|4|5|8][0-9]\d{8}$/;
        if(isFixMob.test(val)||isMobilePhone.test(val)){
        return true;
        }
        else{
        return false;
        }
        
    },
     getBase64:(img, callback)=> {
        const reader = new FileReader();
        reader.addEventListener('load', () => callback(reader.result));
        reader.readAsDataURL(img);
      },
      beforeUpload:(file)=> {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
          message.error('You can only upload JPG/PNG file!');
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
          message.error('Image must smaller than 2MB!');
        }
        return isJpgOrPng && isLt2M;
      }
   


}

export  default commonObj 
