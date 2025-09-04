export default class LocalStorageHelper {
  static clearAll() {
    localStorage.clear()
  }

  static setItem(key, value) {
    localStorage.setItem(key, value)
  }

  static getItem(key) {
    return localStorage.getItem(key)
  }

  static removeItem(key) {
    localStorage.removeItem(key)
  }

  static itemExist(key) {
    return localStorage.getItem(key) !== null
  }
}
