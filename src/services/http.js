import axios from 'axios'
import logger from './logging'
import alerts from './alerts'
import Config from "../config";
//VUE_APP_API_ENDPOINT"http://192.168.0.101:8080"
// const coreApiForSymbol = "http://192.168.0.101:5000/api/v1"
// const coreApiForSymbol = "http://localhost:5000/api/v1"
const coreApiForSymbol = Config.CHARTING_API

axios.defaults.baseURL = coreApiForSymbol

  // 'http://139.180.181.26:9090/api/v1'
  // 'https://lazy-bulldog-60.loca.lt/core/api/v1'
  // 'https://protrader.lakshanperera.dev/api/v1'

axios.interceptors.response.use(null, error => {
  const expectedError =
    error.response &&
    error.response.status >= 400 &&
    error.response.status < 500

  if(axios.isCancel(error)){
    return error.message
  }

  const message = error.response && error.response.data && error.response.data.message
  if(message){
    error.message = message
  }
  if (!expectedError) {
    logger.log(error)
    alerts.showError(error)
    //logout() //temp comment
  }

  return Promise.reject(error)
})

export function setJwt() {
  const jwt = localStorage.getItem('state')
  axios.defaults.headers.common['Authorization'] = 'Bearer ' + jwt
}
export default {
  axios,
  get: axios.get,
  post: axios.post,
  put: axios.put,
  patch: axios.patch,
  delete: axios.delete,
  CancelToken: axios.CancelToken,
  setJwt
}
