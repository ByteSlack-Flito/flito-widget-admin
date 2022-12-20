import { string } from 'prop-types'

export const StringHelper = {
  /**
   *
   * @param {*} str Can be a string or an `array` of string
   * @returns True if the string(or any string from the given array) is empty, undefined, or whitespaces-only.
   */
  isEmpty (str) {
    if (Array.isArray(str)) {
      return str.some(st => !st && !st.trim())
    }
    return !str && !str.trim()
  },
  /**
   *
   * @param {*} obj The object to run the query on
   * @param {string[]} ignoreProps Array of the properties/object keys to ignore
   * @returns True if any properties of the given object is `null`, `undefined`, `empty` (in case of strings), or `length == 0` (in case of arrays)
   */
  isPropsEmpty (obj = {}, ignoreProps = []) {
    return Object.keys(obj).some(prop => {
      if (!ignoreProps.includes(prop)) {
        return !obj[prop] && !obj[prop].trim()
      }
    })
  },
  isSame (strings = []) {
    return strings.every(str => str === strings[0])
  }
}

export const validateEmail = email => {
  return String(email)
    .toLowerCase()
    .match(
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    )
}

/**
 * Function to trim string and add ellipsis at the end of it. Similar to `text-overflow` behaviour from CSS.
 * @param {''} source The source string
 * @param {1} length The length, which the string should be trimmed to. Defaults to `1`
 * @param {''} ellipsis The character to use as the ellipsis. Defaults to `.` (dot)
 * @param {3} ellipsisCount The ellipsis count. Defined how many times to add the specified `ellipsis` at the end of the trimmed string.
 * @returns The trimmed string with added ellipsis suffix
 */
export function trimString (source, length, ellipsis = '.', ellipsisCount = 3) {
  if (length <= 0) {
    console.warn(
      `You wanted to trim the string "${source}" with length set to <= 0. The trimming will fail now.`
    )
    return
  }
  if (source.length <= length) return source
  
  return source.substring(0, length) + ellipsis.repeat(ellipsisCount)
}
