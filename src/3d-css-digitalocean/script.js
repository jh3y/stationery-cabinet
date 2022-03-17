import gsap from 'https://cdn.skypack.dev/gsap'

const UPDATE = ({ x, y }) => {
	const newX = gsap.utils.mapRange(0, window.innerWidth, -1, 1, x)
	const newY = gsap.utils.mapRange(0, window.innerHeight, -1, 1, y)
	gsap.set(document.documentElement, {
		'--coefficient-x': newX,
		'--coefficient-y': newY,
	})
}

window.addEventListener('pointermove', UPDATE)