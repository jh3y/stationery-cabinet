import { GUI } from 'https://cdn.skypack.dev/dat.gui'
import gsap from 'https://cdn.skypack.dev/gsap'
// import html2canvas from 'https://cdn.skypack.dev/html2canvas'
// Handle file drops
// Set up drag and drop handling

const blockIt = src => {
  document
    .querySelectorAll('.block-head__img')
    .forEach(img => img.setAttribute('src', src))
    gsap.timeline({
      onStart: () => {
        gsap.set('.instructions', {
          display: 'none'
        })
        POP.play()
      }
    })
      .set(['.block-head', '.dg'], { display: 'block' })
      .fromTo('.screenshot', {
        yPercent: 100,
        scale: 0,
      }, {
        ease: 'bounce.out',
        scale: 1,
        yPercent: 0,
      })
}

const selectImage = () => {
  // Clear out the old ones
  document.querySelectorAll('[type="file"]').forEach(el => el.remove())
  const FILE_SELECT = document.createElement('input')
  FILE_SELECT.setAttribute('type', 'file')
  document.body.appendChild(FILE_SELECT)
  FILE_SELECT.click()
  FILE_SELECT.addEventListener('change', onFileDrop)
}

const IMAGE_SELECTOR = document.querySelector('.image-selector')
IMAGE_SELECTOR.addEventListener('click', selectImage)


const POP = new Audio('https://assets.codepen.io/605876/pop.mp3')

const onFileDrop = e => {
  e.preventDefault()
  const file = e.type === 'change' ? e.target.files[0] : e.dataTransfer.files[0]
  if (file.type.includes('image')) {
    // process the file.
    const reader = new FileReader()
    reader.onloadend = response => {
      try {
        // file.target.result is the SVG markup we want to use.
        blockIt(response.target.result)
      } catch (e) {
        throw Error('Something went wrong', e)
      }
    }
    reader.readAsDataURL(file)
  }
}
// Don't do anything on drag over
document.body.addEventListener('dragover', e => e.preventDefault())
// On drop, process file and take first path
document.body.addEventListener('drop', onFileDrop)

const UPDATE = ({x, y}) => {
  const bounds = 100
  const proximity = Math.min(window.innerWidth * 0.25, window.innerHeight * 0.25)
  const centerX = window.innerWidth * 0.5
  const centerY = window.innerHeight * 0.5
  const boundX = gsap.utils.mapRange(centerX - proximity, centerX + proximity, -bounds, bounds, x)
  const boundY = gsap.utils.mapRange(centerY - proximity, centerY + proximity, -bounds, bounds, y)
  document.documentElement.style.setProperty('--parallax-x', boundX / 100)
  document.documentElement.style.setProperty('--parallax-y', boundY / 100)
}


window.addEventListener('pointermove', UPDATE)
document.body.addEventListener('pointerleave', () => {
  UPDATE({x: window.innerWidth * 0.5, y: window.innerHeight * 0.5})
})

const CTRL = new GUI()

const CONFIG = {
  'translate-x': 0,
  'translate-y': 0,
  'head-size': 2.5,
  'size': 28,
  'gradient-stop': 16,
  'gradient-x': 50,
  'gradient-y': 46,
  'gradient-one': '#e0d700',
  'gradient-two': '#ef52d4',
  'allow-parallax': false,
  'height': 1,
  'select': selectImage,
  // Won't capture 3D rendering.
  // save: () => {
  //   // Try screenshot the body
  //   html2canvas(document.body).then((canvas) => {
  //     const base64image = canvas.toDataURL("image/png");
  //     // window.location.href = base64image;
  //     // const res = sharp(base64image)
  //     const DOWNLOAD = document.createElement('a')
  //     DOWNLOAD.setAttribute('href', base64image)
  //     DOWNLOAD.setAttribute('download', 'block.png')
  //     document.body.appendChild(DOWNLOAD)
  //     DOWNLOAD.click()
  //     DOWNLOAD.remove()
  //   });
  // }
}

const UPDATE_CSS = () => {
  for (const key of Object.keys(CONFIG)) document.documentElement.style.setProperty(`--${key}`, typeof CONFIG[key] === 'boolean' ? CONFIG[key] ? 1 : 0.1 : CONFIG[key])
}
const BK = CTRL.addFolder('Block')
BK.add(CONFIG, 'size', 10, 50, 1).onChange(UPDATE_CSS).name('Size')
BK.add(CONFIG, 'height', 0.5, 1.5, 0.01).onChange(UPDATE_CSS).name('Height')
const HD = CTRL.addFolder('Head')
HD.add(CONFIG, 'head-size', 1, 5, 0.1).onChange(UPDATE_CSS).name('Size')
const TR = HD.addFolder('Translate')
TR.add(CONFIG, 'translate-x', -100, 100, 1).onChange(UPDATE_CSS).name('X')
TR.add(CONFIG, 'translate-y', -100, 100, 1).onChange(UPDATE_CSS).name('Y')

const GRD = CTRL.addFolder('Gradient')
GRD.addColor(CONFIG, 'gradient-one').onChange(UPDATE_CSS).name('Color One')
GRD.addColor(CONFIG, 'gradient-two').onChange(UPDATE_CSS).name('Color Two')
GRD.add(CONFIG, 'gradient-x', -100, 100, 1).onChange(UPDATE_CSS).name('Position X')
GRD.add(CONFIG, 'gradient-y', -100, 100, 1).onChange(UPDATE_CSS).name('Position Y')
GRD.add(CONFIG, 'gradient-stop', 1, 100, 1).onChange(UPDATE_CSS).name('Color Stop')

CTRL.add(CONFIG, 'allow-parallax').onChange(UPDATE_CSS).name('Cursor Camera')
CTRL.add(CONFIG, 'select').name('Select Image')

UPDATE_CSS()

gsap.set('.dg', {
  display: 'none'
})

gsap.set('.screenshot', {
  yPercent: 100,
  scale: 0,
})