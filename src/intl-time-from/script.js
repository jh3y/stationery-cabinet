/**
 * A utility function for grabbing the time last visited
 * @param {Date} date - Date object that you want time since
 * @param {number} places - How many decimal places to show
 * @param {string} locale - The locale for a returned string
 */
const lastVisited = (date, places = 3, locale = navigator.language) => {
  // If it isn't supported, return the date supplied 👍
  if (!Intl.RelativeTimeFormat) return date
  const now = new Date()
  const formatter = new Intl.RelativeTimeFormat(locale)
  let ms = date.getTime() - now.getTime()
  return [
    ['second', 1000],
    ['minute', 60],
    ['hour', 60],
    ['day', 24],
    ['week', 7],
  ].reduce(
    (a, c) => ({
      ...a,
      ...{
        [c[0]]: formatter.format((ms /= c[1]).toFixed(places), c[0]),
      },
    }),
    {}
  )
}
/**
 * Appy stuff
 */
let unit = 'second'
let place = 0
let locale = navigator.language
const text = document.querySelector('h1')
const units = document.querySelector('select:nth-child(1)')
const places = document.querySelector('select:nth-child(2)')
const locales = document.querySelector('select:nth-child(3)')
const unitUpdate = e =>
  e.target.value !== 'Select unit' && (unit = e.target.value)
const placeUpdate = e =>
  e.target.value !== 'Select places' && (place = e.target.value)
const localeUpdate = e => {
  if (e.target.value !== 'Select locale') {
    if (e.target.value === 'current') {
      locale = navigator.language
    } else {
      locale = e.target.value
    }
  }
}
const start = new Date()
const report = () => {
  const last = lastVisited(start, place, locale)
  if (last === start) {
    // Hide the select and set the innerText as the start date
    text.innerText = `Last visited\n${start}`
    units.remove()
    places.remove()
    locales.remove()
  } else {
    text.innerText = `Last visited\n${last[unit]}`
    requestAnimationFrame(report)
  }
}
if (Intl.RelativeTimeFormat) {
  units.addEventListener('input', unitUpdate)
  places.addEventListener('input', placeUpdate)
  locales.addEventListener('input', localeUpdate)
}
requestAnimationFrame(report)
