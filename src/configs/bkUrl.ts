const baseUrl = process.env.NODE_ENV === "production"
  ? 'https://node193354-shop-manager.in1.cloudjiffy.net/api'
  : 'http://127.0.0.1:4000/api';

export default baseUrl;