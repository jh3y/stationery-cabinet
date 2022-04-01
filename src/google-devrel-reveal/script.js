import gsap from 'https://cdn.skypack.dev/gsap'

const BEAR = document.querySelector('.bear-wrapper')
const DINO = document.querySelector('.dino')

const POP = new Audio('https://assets.codepen.io/605876/pop.mp3')

gsap.set('.bear__ear--squished', { display: 'none' })

gsap.set(['.propellor', '.bear'], {
	height: '100%',
	position: 'absolute',
	xPercent: -50,
	yPercent: -50,
	top: '50%',
	left: '50%',
})

gsap.set('.cap', {
	height: '100%',
})

gsap.set('.dino', {
	position: 'absolute',
	right: '100%',
	rotate: 30,
	top: '50%',
	xPercent: 56,
	yPercent: -60,
})

gsap.to('.propellor', {
	rotateY: 360,
	repeat: -1,
	ease: 'none',
	duration: 0.1,
})

gsap.set('.bear-cap-wrapper', {
	yPercent: -300,
	transformOrigin: '50% 0',
	rotate: 0,
	xPercent: 0,
})

gsap.set(['.speech-bubble__dot', '.speech-bubble__bubble'], {
	transformOrigin: '50% 50%',
	scale: 0,
})

gsap.set('.bear__brows', {
	display: 'none'
})

gsap.set('.bear__eyes', {
	transformOrigin: '50% 50%',
})

let blinkTween
const BLINK = () => {
	const delay = gsap.utils.random(1, 5)
	blinkTween = gsap.to('.bear__eyes', {
		delay,
		scaleY: 0.05,
		duration: 0.05,
		repeat: 3,
		yoyo: true,
		onComplete: () => {
			BLINK()
		},
	})
}
BLINK()

const MAIN = gsap.timeline({
	delay: 1,
})

MAIN
	// Not sure about bear brows
	.set('.bear__brows--confused', {
		display: 'none',
	})
	// Then make the thought bubble pop out. Why have we named it "speech"?! Tired clearly.
	.to(['.speech-bubble__dot', '.speech-bubble__bubble'], {
		delay: 0.5,
		scale: 1,
		ease: 'bounce',
		stagger: {
			each: 0.2,
			onStart: () => {
				POP.pause()
				POP.currentTime = 0
				POP.play()
			},
		},
	})
	// Next, shocked, Rise of the Valkyries, and a chopper noise?
	// Then the hat lowers itself down onto bear
	// Propellors slow down
	// I'm joining Google text reveal w/ Mask
	// Dino Riff Rad!
	// Replay button reveal
