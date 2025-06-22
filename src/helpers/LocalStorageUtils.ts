/**
 * Set an item by (key, value) to local storage
 * @param {string} key
 * @param {string} value
 */
const setAsString = (key: string, value: string) => {
  localStorage.setItem(key, value)
}

/**
 * Get an item by key from local storage
 * @param {string} key
 * @param {string} defValue Default value
 * @returns string | undefined
 */
const getAsString = (key: string, defValue = '') => {
  return localStorage.getItem(key) || defValue
}

/**
 * Set an item by (key, value) in JSON format to local storage
 * @param {string} key
 * @param {*} value
 * @returns
 */
const setAsJSON = (key: string, value: any) => {
  let result = false
  if (value !== undefined) {
    try {
      localStorage.setItem(key, JSON.stringify(value))
      result = true
    } catch (err) {
      /* empty */
    }
  }
  return result
}

/**
 * Get an item by key from local storage and convert it to JSON format
 * @param {string} key
 * @returns JSON | null
 */
const getAsJSON = (key: string) => {
  const item = localStorage.getItem(key)
  if (item != null) {
    try {
      return JSON.parse(item)
    } catch (err) {
      /* empty */
    }
  }
  return null
}

/**
 * Delete an item by key from local storage
 * @param {string} key
 */
const removeAs = (key: string) => {
  localStorage.removeItem(key)
}

/**
 * Delete all items in local storage
 */
const clearAll = () => {
  localStorage.clear()
}

export { setAsString, getAsString, setAsJSON, getAsJSON, removeAs, clearAll }
