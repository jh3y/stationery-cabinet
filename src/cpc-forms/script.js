class AniForm {
  constructor(el, opts) {
    if (!opts || (opts && !opts.fieldClass) || !el || el.tagName !== 'FORM')
      throw Error(
        'AniForm: Must pass form element and fieldClass into constructor ⚠️'
      )
    this.EL = el
    this.FIELDS = el.querySelectorAll(`.${opts.fieldClass}`)
    this.init()
  }
  CLASSES = {
    ACTIVE: 'signup__field--active',
    NEXT: 'signup__field--next',
  }
  NEXT = undefined
  PREV = undefined
  proceed = () => {
    const { ACTIVE, NEXT } = this
    this.ACTIVE = NEXT
    this.PREV = ACTIVE
    // this.NEXT =
  }
  init = () => {
    const { CLASSES } = this
    this.EL.classList.remove('form--loading')
    this.NEXT = this.FIELDS[0]
    this.NEXT.classList.add(CLASSES.ACTIVE)
    this.PREV = this.FIELDS[1]
    this.PREV.classList.add(CLASSES.NEXT)
    for (let field of this.FIELDS) {
      field.addEventListener('keypress', e => {
        // let { NEXT } = this
        // debugger
        // console.info(this.NEXT, this.NEXT.checkValidity())
        if (e.keycode === 13) {
          // console.info(this.NEXT.checkValidity())
        }
      })
    }
  }
}

const FORM = document.querySelector('form')
new AniForm(FORM, {
  fieldClass: 'signup__field',
})
