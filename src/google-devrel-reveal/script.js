import gsap from 'https://cdn.skypack.dev/gsap'

gsap.registerPlugin(MorphSVGPlugin)

const BEAR = document.querySelector('.bear-wrapper')
const DINO = document.querySelector('.dino')

const PLAY = document.querySelector('.button-hole--play button')
const RESTART = document.querySelector('.button-hole--restart button')

const JOINING_TEXT = document.querySelector('h1 > span:nth-of-type(1)')
const GOOGLE_TEXT = document.querySelector('h1 > span:nth-of-type(2)')

const SPLIT_TEXT = new SplitText(JOINING_TEXT, {
	type: 'chars, words',
	charsClass: 'char',
	wordsClass: 'word',
	tag: 'span',
})

const SWING_SPEED = 3
const SWING_DISTANCE = 150
const RIDE_OUT = 15
const RIDE_VOLUME = 0.5
const EAR_SHIFT = 6

gsap.set('.thought-bubble__hat', {
	scale: 0.75,
	transformOrigin: '50% 50%',
	rotate: -10,
	xPercent: -15
})

const AUDIO = {
	POP: new Audio('https://assets.codepen.io/605876/pop.mp3'),
	RIDE: new Audio(
		'https://assets.codepen.io/605876/ride-of-the-valkyries--shortened.mp3'
	),
	RIFF: new Audio(
		'https://assets.codepen.io/605876/guitar-riff--shortened.mp3'
	),
	HELI: new Audio(
		'https://assets.codepen.io/605876/toy-helicopter--shortened.mp3'
	),
	CLICK: new Audio('https://assets.codepen.io/605876/click.mp3'),
	SPARKLE: new Audio('https://assets.codepen.io/605876/sparkle.mp3'),
}

AUDIO.RIFF.volume = 0.25
AUDIO.SPARKLE.volume = 0.5

gsap.set(SPLIT_TEXT.chars, {
	yPercent: 110,
	display: 'inline-block',
})

gsap.set('.dino__bubble', {
	transformOrigin: '10% 100%',
	rotate: -30,
	display: 'none',
})

gsap.set(SPLIT_TEXT.words, {
	clipPath: 'inset(-50% -10% -10% -10%)',
})

gsap.set('.bear__ear--squished', {
	display: 'none',
})

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
	xPercent: -20,
	yPercent: -60,
})

const ROTOR = gsap.timeline().to('.propellor', {
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
	display: 'none',
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

let dinoBlinkTween
const DINO_BLINK = () => {
	const delay = gsap.utils.random(1, 5)
	blinkTween = gsap.to('.eye-lid', {
		delay,
		yPercent: (index, el) => index % 2 === 0 ? 50 : -50,
		duration: 0.05,
		repeat: 3,
		yoyo: true,
		onComplete: () => {
			DINO_BLINK()
		},
	})
}
DINO_BLINK()

const MOVE_MASK = ({ x, y }) => {
	const { width, height, left, top } = GOOGLE_TEXT.getBoundingClientRect()

	const CENTER = {
		X: left + width * 0.5,
		Y: top + height * 0.5,
	}

	const ANGLE = Math.floor(
		(Math.atan2(CENTER.Y - y, CENTER.X - x) * 180) / Math.PI + 180
	)

	document.documentElement.style.setProperty('--mask-rotate', ANGLE)
}

const MAIN = gsap.timeline({
	paused: true,
	delay: 1,
	onStart: () => {
		gsap.set('.button-hole--restart', { display: 'none' })
	},
	onComplete: () => {
		gsap.set('.button-hole--restart', { display: 'block' })
	},
})

MAIN
	// Not sure about bear brows
	.set(['.bear__brows--confused', '.button-hole--play'], {
		display: 'none',
	})
	.set('.scene', { display: 'block' })
	.set([AUDIO.HELI, AUDIO.RIDE], {
		volume: 0,
		currentTime: 0,
	})
	// Then make the thought bubble pop out. Why have we named it "speech"?! Tired clearly.
	.to(['.speech-bubble__dot', '.speech-bubble__bubble'], {
		delay: 0.5,
		scale: 1,
		ease: 'bounce',
		stagger: {
			each: 0.2,
			onStart: () => {
				AUDIO.POP.pause()
				AUDIO.POP.currentTime = 0
				AUDIO.POP.play()
			},
		},
	})
	// Next, shocked, Rise of the Valkyries, and a chopper noise?
	.to(['.speech-bubble__dot', '.speech-bubble__bubble'], {
		delay: 1,
		opacity: 0,
	})
	.to(AUDIO.RIDE, {
		delay: 1,
		onStart: () => {
			AUDIO.RIDE.pause()
			AUDIO.RIDE.currentTime = 0
			AUDIO.RIDE.play()
		},
		volume: RIDE_VOLUME,
	})
	.to('.bear__brows--shocked', {
		delay: 1,
		display: 'block',
	})
	.to(AUDIO.HELI, {
		delay: 2,
		onStart: () => {
			AUDIO.HELI.pause()
			AUDIO.HELI.currentTime = 0
			AUDIO.HELI.play()
		},
		volume: 1,
	})
	// Then the hat lowers itself down onto bear
	.to(
		'.bear-cap-wrapper',
		{
			yPercent: 0,
			onComplete: () => {
				gsap
					.timeline({
						onComplete: () =>
							gsap.set('.bear__brows--shocked', { display: 'none' }),
					})
					.to('.bear__ear--left', {
						xPercent: 0,
						morphSVG: '.bear__ear--left',
						duration: 0.25,
						ease: 'elastic.out',
					})
					.to(
						'.bear__ear--right',
						{
							xPercent: 0,
							morphSVG: '.bear__ear--right',
							duration: 0.25,
							ease: 'elastic.out',
						},
						'<'
					)
			},
			duration: SWING_SPEED * 6,
		},
		'<'
	)
	.fromTo(
		'.bear-cap-wrapper',
		{
			xPercent: -SWING_DISTANCE,
			rotate: -20,
		},
		{
			xPercent: SWING_DISTANCE,
			rotate: 20,
			yoyo: true,
			repeat: 2,
			duration: SWING_SPEED,
			ease: 'power1.inOut',
		},
		'<'
	)
	.to(
		'.bear-cap-wrapper',
		{
			xPercent: 0,
			rotate: 0,
			duration: SWING_SPEED * 0.5,
			ease: 'power1.inOut',
		},
		'>'
	)
	.to(
		'.bear__ear--left',
		{
			morphSVG: '.bear__ear--squished-left',
			xPercent: EAR_SHIFT,
			duration: 0.25,
		},
		'>-0.5'
	)
	.to(
		'.bear__ear--right',
		{
			xPercent: -EAR_SHIFT,
			morphSVG: '.bear__ear--squished-right',
			duration: 0.25,
		},
		'<'
	)
	.to(
		AUDIO.RIDE,
		{
			volume: 0,
			duration: RIDE_OUT,
			ease: 'none',
		},
		'<'
	)
	// Propellors slow down
	// I'm joining Google text reveal w/ Mask
	.to(
		['.word:nth-of-type(1) .char', '.word:nth-of-type(2) .char'],
		{
			yPercent: 0,
			stagger: {
				each: 0.1,
			},
			ease: 'bounce',
		},
		'>-5'
	)
	.to(
		GOOGLE_TEXT,
		{
			'--mask': 360,
			ease: 'power4.inOut',
			duration: 1,
			onComplete: () => {
				AUDIO.SPARKLE.pause()
				AUDIO.SPARKLE.currentTime = 0
				AUDIO.SPARKLE.play()
				window.addEventListener('pointermove', MOVE_MASK)
			},
		},
		'>+=0.25'
	)
	.to(
		ROTOR,
		{
			timeScale: 0.25,
		},
		'<'
	)
	// Dino Riff Rad!
	.to('.dino', {
		delay: 0.5,
		xPercent: 56,
		ease: 'elastic.out(1,1)',
		onComplete: () => {
			AUDIO.RIFF.pause()
			AUDIO.RIFF.currentTime = 0
			AUDIO.RIFF.play()
		},
	})
	.to('.dino__bubble', {
		delay: 0.5,
		display: 'block',
		repeat: 1,
		yoyo: true,
		repeatDelay: 1,
	})
// Replay button reveal
// window.addEventListener('pointermove', MOVE_MASK)

PLAY.addEventListener('click', () => {
	AUDIO.CLICK.play()
	MAIN.play()
})
RESTART.addEventListener('click', () => {
	AUDIO.CLICK.play()
	MAIN.restart()
})
