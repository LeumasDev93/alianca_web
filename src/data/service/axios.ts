
import axios from 'axios';

// const API_TOKEN = '19154d315a98ae9535ca6efa89c056736392192032abaaa5037214a53a6a021537ea156fcddfa8af9a6e64de42c070adad7d54c628636ebf071d34b0130d12864ec037a0186f4465c54e76e9cb2c09f38a864cce1701820b417edcb3a44bf6ea84751116f0ef03c245e5f1e3f7ea6014c017df94fb4cda133ff3ae50aaa9ca86';


export const API_TOKEN_PROD = 'eafcdf1b03a48f67705a5615fb030c198bd2ed9ba2f57095398dd4f520e15bfb3dd9857f7f28e83a1f2aac74a014d4deb5fbae5a715846690dcdf0cf4d771432e4ee8fadffcd3f75af1bcbda2c7ef88df1d63eac6e7f73a4f0c032bfa948c9c3cb2e27b5487e4f110da1835140e377da8701f86529fe2bb31e6ae9325c71ba5d';

const apiAlianca = axios.create({
  baseURL: 'https://gestao.aliancaseguros.cv/api',
  headers: {
    'Authorization': `Bearer ${API_TOKEN_PROD}`
  }  
});


export const BASE_IMAGE_URL = "https://gestao.aliancaseguros.cv";

export { apiAlianca };
