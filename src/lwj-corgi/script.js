import gsap from 'https://cdn.skypack.dev/gsap'

const HAT_TOP = document.querySelector('.corgi__hat-top')
const CRACKER = document.querySelector('.corgi__cracker')
const TONGUE = document.querySelector('.corgi__tongue')
gsap.set(CRACKER, { display: 'none' })
gsap.set(TONGUE, { transformOrigin: '50% 0', scaleY: 0.85 })
gsap.set(HAT_TOP, { transformOrigin: '70% 10%' })
gsap.to(HAT_TOP, { repeat: -1, duration: 0.5, rotate: 20, yoyo: true })
gsap.to(TONGUE, { repeat: -1, duration: 0.5, scaleY: 1.5, yoyo: true })
