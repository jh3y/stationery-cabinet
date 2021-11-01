const INPUT = document.querySelector('input')
const FILTER_KEY = 'storyfilter'

const UPDATE = () => {
  if (window.history.replaceState) {
    const searchParams = new URLSearchParams(window.location.search)
    if (INPUT.value !== '') searchParams.set(FILTER_KEY, INPUT.value)
    else searchParams.delete(FILTER_KEY)
    window.history.replaceState({}, '', `${window.location.origin}?${searchParams.toString()}`)
  }
}

const searchParams = new URLSearchParams(window.location.search)
if (searchParams.has(FILTER_KEY)) INPUT.value = searchParams.get(FILTER_KEY)

INPUT.addEventListener('keyup', UPDATE)