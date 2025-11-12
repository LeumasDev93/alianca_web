
import axios from 'axios';

// Nova API Local
export const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || 'http://10.86.13.15:1337';
export const STRAPI_TOKEN = process.env.NEXT_PUBLIC_STRAPI_TOKEN || '5c88210b7fc4dc5ba0001ecb448b7f39bb41ccb80e5b6d7d9817629ab3fc2d34277e73a58449291484e92336e8ca61e9bf730feef83328e55188c89661c53681ce54c0dc550d02bbda7cabab05667935e851d372d3f1a0c4fab6595db7d288c154448937a86dcf95353b2783302abf1b8b21237cf2012a236927fd93386a365a';

// API antiga (mantido para compatibilidade)
export const API_TOKEN_PROD = 'eafcdf1b03a48f67705a5615fb030c198bd2ed9ba2f57095398dd4f520e15bfb3dd9857f7f28e83a1f2aac74a014d4deb5fbae5a715846690dcdf0cf4d771432e4ee8fadffcd3f75af1bcbda2c7ef88df1d63eac6e7f73a4f0c032bfa948c9c3cb2e27b5487e4f110da1835140e377da8701f86529fe2bb31e6ae9325c71ba5d';

const apiAlianca = axios.create({
  baseURL: 'https://gestao.aliancaseguros.cv/api',
  headers: {
    'Authorization': `Bearer ${API_TOKEN_PROD}`
  }  
});


export const BASE_IMAGE_URL = "https://gestao.aliancaseguros.cv";

export { apiAlianca };
