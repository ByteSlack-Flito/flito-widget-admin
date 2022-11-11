export const StorageInitial = 'makeMyApp_'

export const StorageHelper = {
  /**
   * Saves/updates the given data to local-disk of the user. Existing data will be identified with the given unique key.
   * @param {*} data An object representing the data
   * @param {string} uKey A string representing the unique name as the suffix of the filename to be saved
   * @param {boolean} extendData If true, it will append the new object properties/data to the existing data.
   */
  SaveItem: (data, uKey = '', extendData = false) => {
    if (extendData) {
      const currentData = JSON.parse(
        localStorage.getItem(`${StorageInitial}${uKey}`)
      )
      currentData &&
        localStorage.setItem(
          `${StorageInitial}${uKey}`,
          JSON.stringify({ ...currentData, ...data })
        )
      return
    }
    localStorage.setItem(`${StorageInitial}${uKey}`, JSON.stringify(data))
  },

  GetItem: (uKey = '') =>
    JSON.parse(localStorage.getItem(`${StorageInitial}${uKey}`)),

  Remove: (uKey = '') => localStorage.removeItem(`${StorageInitial}${uKey}`)
}
