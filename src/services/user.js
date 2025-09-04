import axios from 'axios';
import Config from "../config";
// 'https://users.lakshanperera.dev'
//process.env.USER_API_ENDPOINT
// const baseUrlForUserApi =  "http://localhost:4000"  //"http://localhost:3000"

// const baseUrlForUserApi = "http://192.168.0.103:3000"
const baseUrlForUserApi = Config.USER_API
// const baseUrlForUserApi = "http://192.168.0.101:8080"
const userHttp = axios.create({ baseURL: baseUrlForUserApi })
// const userHttp = axios.create({ baseURL: process.env.USER_API_ENDPOINT || 'http://139.180.180.87' })

export const loginUser = async (username, password) => {
  return await userHttp.post('/auth/login', {
    username,
    password
  })
}

export const ResetPassword = async (email) => {
  return await userHttp.post('/user/forget-password', {
    email
  })
}
export const VerifyPassword = async (payload) => {
  const token = localStorage.getItem('state')
  return await userHttp.post('/user/verify-password', payload, {
    headers: { Authorization: `Bearer ${token}` },
  })
}

export const createAccount = async (payload) => {
  try {
    let res = await userHttp.post('/auth/initial-register', payload)
    if (res) {
      return res
    } else {
      return false
    }

  } catch (e) {
    return false
  }

}
export const resendEmail = async (payload) => {
  try {
    let res = await userHttp.post('/auth/resend-email', payload)
    if (res) {
      return res
    } else {
      return false
    }

  } catch (e) {
    return false
  }

}
export const sendOtp = async (payload) => {
  try {
    let res = await userHttp.post('/auth/send-otp-code-phone', payload)
    if (res) {
      return res
    } else {
      return false
    }

  } catch (e) {
    return false
  }

}
export const verifyMobileOtp = async (payload) => {
  try {
    let res = await userHttp.post('/auth/verify-otp-code-phone', payload)
    if (res) {
      return res
    } else {
      return false
    }

  } catch (e) {
    return false
  }

}

export const verifyToken = async (token) => {
  try {
    let res = await userHttp.get(`/auth/verify-token/${token}`)
    if (res) {
      return res
    } else {
      return false
    }

  } catch (e) {
    return false
  }

}

export const SendOneTimePassword = async (payload) => {
  const token = localStorage.getItem('state')
  return await userHttp.post('/user/send-otp', payload, {
    headers: { Authorization: `Bearer ${token}` },
  })
}
export const verifyOTP = async (payload) => {
  const token = localStorage.getItem('state')
  return await userHttp.post('/user/verify-otp', payload, {
    headers: { Authorization: `Bearer ${token}` },
  })
}

export const UpdatePassword = async (UpdatePassw) => {
  return await userHttp.post('/user/reset-password', UpdatePassw)
}

export const registerUser = async (firstName, lastName, email, password, subscription) => {
  return await userHttp.post('/auth/register', {
    firstName,
    lastName,
    email,
    password,
    subscription: subscription
  })
}

export const isLogged = async () => {
  const token = localStorage.getItem('state')
  try {
    const { data } = await userHttp.get('/auth/authCheck', {
      headers: { Authorization: `Bearer ${token}` },
    })
    // localStorage.setItem('stripeSession', data.status)
    if (!data) logout()
  } catch (e) {
    logout()
    return false
  }

  return true
}

export function logout() {
  localStorage.removeItem('state')
  localStorage.removeItem('stripeSession')
  localStorage.removeItem('symbol')
  // localStorage.clear()

  location.reload()
}

export function forgotLogout() {
  localStorage.removeItem('state')
  localStorage.removeItem('stripeSession')
  localStorage.removeItem('symbol')
  // localStorage.clear()

}

export const getUserData = async (token = null) => {
  if (!token)
    token = localStorage.getItem('state')
  try {
    const { data } = await userHttp.get('/auth/profile', {
      headers: { Authorization: `Bearer ${token}` },
    })
    return data
  } catch (e) {
    logout()
    return false
  }
}

export const updateUserSettings = async (settings, sec) => {
  const token = localStorage.getItem('state')
  try {
    const { data } = await userHttp.post('/user/update-settings', settings, {
      headers: { Authorization: `Bearer ${token}` },
    })
    return data
  } catch (e) {
    // logout()
    return false
  }
}
export const updateChartSettings = async (settings) => {
  const token = localStorage.getItem('state')
  try {
    const { data } = await userHttp.post('/user/update-charts', settings, {
      headers: { Authorization: `Bearer ${token}` },
    })
    return data
  } catch (e) {
    // logout()
    return false
  }
}
export const updateMultiChartSettings = async (settings) => {
  const token = localStorage.getItem('state')
  try {
    const { data } = await userHttp.post('/user/update-multi-charts', settings, {
      headers: { Authorization: `Bearer ${token}` },
    })
    return data
  } catch (e) {
    // logout()
    return false
  }
}

export const updateDrawingData = async (settings) => {
  const token = localStorage.getItem('state')
  try {
    const { data } = await userHttp.post('/user/update-drawing', settings, {
      headers: { Authorization: `Bearer ${token}` },
    })
    return data
  } catch (e) {
    // logout()
    return false
  }
}


export const updateUserProfile = async (payload) => {
  const token = localStorage.getItem('state')
  try {
    const { data } = await userHttp.post('/user/updateUser', payload, {
      headers: { Authorization: `Bearer ${token}` },
    })
    return data
  } catch (e) {
    return false
  }
}

export const getDrawingData = async (symbol) => {
  const token = localStorage.getItem('state')
  try {
    const { data } = await userHttp.get('/user/get-drawing?symbol=' + symbol, {
      headers: { Authorization: `Bearer ${token}` },
    })
    return data
  } catch (e) {
    // logout()
    return null
  }
}

export const isClientAccountActive = async () => {
  const token = localStorage.getItem('state')
  try {
    const { data } = await userHttp.get('/payment/subscription', {
      headers: { Authorization: `Bearer ${token}` },
    })
    localStorage.setItem('stripeSession', data.status)
    return data
  } catch (e) {
    localStorage.setItem('stripeSession', 'inactive')
    // logout()
    return false
  }
}

export const subscribeToPackage = async (subscription, currency="USD") => {
  const token = localStorage.getItem('state')
  try {
    const { data } = await userHttp.get('/payment/subscribe/' + subscription + '/' + currency, {
      headers: { Authorization: `Bearer ${token}` },
    })
    return {
      error: false,
      data
    }
  } catch (e) {
    return {
      error: true,
      message: e?.response?.data?.message || 'Server Side Error'
    }
  }
}

export const deleteSubscription = async (payload) => {
  const token = localStorage.getItem('state')
  try {
    const { data } = await userHttp.post('/payment/deleteSubscription', { payload }, {
      headers: { Authorization: `Bearer ${token}` },
    })
    return data
  } catch (e) {
    return false
  }
}
