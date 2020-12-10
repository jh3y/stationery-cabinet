const RANGE = document.querySelector('input')
const PROGRESS = document.querySelector('progress')
const CODE = document.querySelector('code')

RANGE.addEventListener('input', () => {
  PROGRESS.setAttribute('value', RANGE.value)
  CODE.innerHTML = `&lt;progress value="${RANGE.value}" max="100"&gt;
&lt;/progress&gt;`
})
