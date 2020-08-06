import _ from 'lodash'

const localstorageHelper = {
  storeItem(storeKey, value, maxSize) {
    const readValue = this.readItem(storeKey)
    const updatedValue = readValue ? [...readValue, value] : [value]
    const trimmedValue = _.takeRight(updatedValue, maxSize)

    localStorage.setItem(storeKey, JSON.stringify(trimmedValue))
  },

  readItem(storeKey) {
    return JSON.parse(localStorage.getItem(storeKey))
  },

  isItemStored(storeKey) {
    return Boolean(localStorage.getItem(storeKey))
  },
}

export default localstorageHelper
