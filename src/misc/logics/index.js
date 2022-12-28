export function filterData (source = [], query = '', ingoreProps = []) {
  let filteredList = []

  if (query.length > 0) {
    source.forEach(data => {
      Object.keys(data).map(prop => {
        if (!ingoreProps.includes(prop) && !Array.isArray(prop)) {
          const hasInitialMatch = String(data[prop])
            .toLowerCase()
            .includes(String(query).toLowerCase())
          hasInitialMatch &&
            !filteredList.some(x => x === data) &&
            filteredList.push(data)

          const hasSubProps =
            typeof data[prop] === 'object' &&
            Array.isArray(Object.keys(data[prop]))
          hasSubProps &&
            Object.keys(data[prop]).map(key => {
              const hasMatch = String(data[prop][key])
                .toLowerCase()
                .includes(String(query).toLowerCase())
              hasMatch &&
                !filteredList.some(x => x === data) &&
                filteredList.push(data)
            })
        }
      })
    })
  }
  return query.length > 0 ? filteredList : []
}

export function getRandomItems (arr, n) {
  var result = new Array(n),
    len = arr.length,
    taken = new Array(len)
  if (n > len)
    throw new RangeError('getRandom: more elements taken than available')
  while (n--) {
    var x = Math.floor(Math.random() * len)
    result[n] = arr[x in taken ? taken[x] : x]
    taken[x] = --len in taken ? taken[len] : len
  }
  return result
}

export function getNumberKMBT (n) {
  if (n < 1e3) return n
  if (n >= 1e3 && n < 1e6) return +(n / 1e3).toFixed(1) + 'K'
  if (n >= 1e6 && n < 1e9) return +(n / 1e6).toFixed(1) + 'M'
  if (n >= 1e9 && n < 1e12) return +(n / 1e9).toFixed(1) + 'B'
  if (n >= 1e12) return +(n / 1e12).toFixed(1) + 'T'
  return 0
}

export function getUrlExt (url, getIfImageOrVideo) {
  // console.log('Url is:', url)
  const type = url.split(/[#?]/)[0].split('.').pop().trim()
  if (getIfImageOrVideo) {
    if (type.match(/gif|bmp|jpg|jpeg|png|svg|apng/g)) return 'image'
    else return 'other'
  }
  return type
}

export function getRandomInteger (min, max) {
  return Math.floor(Math.random() * (max - min)) + min
}
export const colorCodes = [
  { background: '#8911f2', color: '#fff' },
  { background: '#f2116b', color: '#fff' },
  { background: '#0bb546', color: '#fff' },
  { background: '#b5710b', color: '#fff' },
  { background: '#2b3b4d', color: '#fff' }
]
export function randomColorSelector () {
  return colorCodes[(Math.random() * colorCodes.length) | 0]
}

/**
 * Convert hours to weeks.
 * @param {*} hours Total hours to be converted to week(s)
 * @param {*} maxHrPerWeek Maximum hour(s) to be considered for a week. Defaults to `40` as full-time.
 * @returns An `int` value representing the weeks count
 */
export function getWeeksFromHours (hours, maxHrPerWeek = 40) {
  if (hours) return Math.ceil(hours / maxHrPerWeek)
  return 0
}

export function getProfileInitials (userProfile) {
  if (userProfile.firstName === 'Your' && userProfile.lastName === 'Name') {
    return userProfile.email.charAt(0).toUpperCase()
  } else {
    return userProfile.firstName.charAt(0).toUpperCase()
  }
}

export function GetCardType (number) {
  // visa
  var re = new RegExp('^4')
  if (number.match(re) != null) return 'Visa'

  // Mastercard
  // Updated for Mastercard 2017 BINs expansion
  if (
    /^(5[1-5][0-9]{14}|2(22[1-9][0-9]{12}|2[3-9][0-9]{13}|[3-6][0-9]{14}|7[0-1][0-9]{13}|720[0-9]{12}))$/.test(
      number
    )
  )
    return 'Mastercard'

  // AMEX
  re = new RegExp('^3[47]')
  if (number.match(re) != null) return 'AMEX'

  // Discover
  re = new RegExp(
    '^(6011|622(12[6-9]|1[3-9][0-9]|[2-8][0-9]{2}|9[0-1][0-9]|92[0-5]|64[4-9])|65)'
  )
  if (number.match(re) != null) return 'Discover'

  // Diners
  re = new RegExp('^36')
  if (number.match(re) != null) return 'Diners'

  // Diners - Carte Blanche
  re = new RegExp('^30[0-5]')
  if (number.match(re) != null) return 'Diners - Carte Blanche'

  // JCB
  re = new RegExp('^35(2[89]|[3-8][0-9])')
  if (number.match(re) != null) return 'JCB'

  // Visa Electron
  re = new RegExp('^(4026|417500|4508|4844|491(3|7))')
  if (number.match(re) != null) return 'Visa Electron'

  return ''
}

export function generateArray (length) {
  return Array.from(Array(length))
}
