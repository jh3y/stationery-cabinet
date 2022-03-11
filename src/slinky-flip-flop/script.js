// import React from 'https://cdn.skypack.dev/react'
// import { render } from 'https://cdn.skypack.dev/react-dom'
// import { GUI } from 'https://cdn.skypack.dev/dat.gui'

// const ROOT_NODE = document.querySelector('#app')

// const DEFAULT_RING_COUNT = 39
// const DEFAULT_ANIMATION_WINDOW = 50

// const Slinky = () => {
// 	const styleRef = React.useRef(null)
// 	const [animationWindow, setAnimationWindow] = React.useState(
// 		DEFAULT_ANIMATION_WINDOW
// 	)
// 	const [flip, setFlip] = React.useState(true)
// 	const [count, setCount] = React.useState(DEFAULT_RING_COUNT)

// 	React.useEffect(() => {
// 		const CONFIG = {
// 			animationWindow,
// 			count,
// 			'hue-one': 210,
// 			'hue-two': 320,
// 			'border-width': 1.2,
// 			depth: 30,
// 			'stack-height': 6,
// 			'scene-size': 30,
// 			'spin-speed': 50,
// 			speed: 1,
// 			'flip-flop': true,
// 		}
// 		const CTRL = new GUI({
// 			width: 300,
// 		})

// 		const UPDATE = () => {
// 			Object.keys(CONFIG)
// 				.filter(key => key !== 'animationWindow' && key !== 'count')
// 				.forEach(key => {
// 					document.documentElement.style.setProperty(
// 						`--${key}`,
// 						`${CONFIG[key]}${
// 							key.indexOf('hue') === -1 && key.indexOf('spin-speed') === -1
// 								? 'vmin'
// 								: ''
// 						}`
// 					)
// 				})
// 			document.documentElement.style.setProperty(
// 				'--flip-flop',
// 				CONFIG['flip-flop'] ? 1 : 0
// 			)
// 			document.documentElement.style.setProperty(
// 				'--speed',
// 				`${CONFIG['speed']}s`
// 			)
// 		}

// 		const RINGS = CTRL.addFolder('Rings')
// 		RINGS.add(CONFIG, 'animationWindow', 5, 50, 1)
// 			.name('Animation Window')
// 			.onFinishChange(setAnimationWindow)
// 		RINGS.add(CONFIG, 'count', 5, 50, 1)
// 			.name('Ring Count')
// 			.onFinishChange(setCount)
// 		RINGS.add(CONFIG, 'border-width', 0.1, 4, 0.1)
// 			.name('Width (vmin)')
// 			.onFinishChange(UPDATE)
// 		RINGS.add(CONFIG, 'scene-size', 5, 30, 1)
// 			.name('Size (vmin)')
// 			.onFinishChange(UPDATE)
// 		const STACK = CTRL.addFolder('Stack')
// 		STACK.add(CONFIG, 'stack-height', 1, 20, 1)
// 			.name('Height (vmin)')
// 			.onFinishChange(UPDATE)
// 		STACK.add(CONFIG, 'depth', 0, 40, 1)
// 			.name('Drop (vmin)')
// 			.onFinishChange(UPDATE)
// 		STACK.add(CONFIG, 'spin-speed', 0, 60, 1)
// 			.name('Spin Speed (s)')
// 			.onFinishChange(UPDATE)
// 		STACK.add(CONFIG, 'speed', 0.2, 60, 0.1)
// 			.name('Slink Speed (s)')
// 			.onFinishChange(UPDATE)
// 		const COLORS = CTRL.addFolder('Colors')
// 		COLORS.add(CONFIG, 'hue-one', 0, 360, 1)
// 			.name('Hue One')
// 			.onFinishChange(UPDATE)
// 		COLORS.add(CONFIG, 'hue-two', 0, 360, 1)
// 			.name('Hue Two')
// 			.onFinishChange(UPDATE)
// 		CTRL.add(CONFIG, 'flip-flop')
// 			.name('Flip Flop?')
// 			.onChange(flip => {
// 				UPDATE()
// 				setFlip(flip)
// 			})
// 		UPDATE()
// 	}, [])

// 	React.useEffect(() => {
// 		if (styleRef.current) styleRef.current.remove()
// 		const STYLE = document.createElement('style')
// 		document.head.appendChild(STYLE)

// 		const ANIMATION_STEP = animationWindow / count

// 		// Loop over the count and generate the keyframes and insert them at each index.
// 		for (let i = 0; i < count; i++) {
// 			const START = ANIMATION_STEP * (i + 1)
// 			const SLINKS = `
// 				0%, ${START}%   { 
// 						--z: 0;
// 						--x: 0%;
// 						--r: 0deg;
// 						transform: translate3d(-50%, -50%, var(--origin-z)) translate3d(var(--x), 0, var(--z)) rotateY(var(--r));
// 					}
// 					${START + animationWindow * 0.75}% {
// 						--r: 180deg;
// 						--x: 0%;
// 						--z: 0;
// 						transform: translate3d(-50%, -50%, var(--origin-z)) translate3d(var(--x), 0, var(--z)) rotateY(var(--r));
// 					}
// 					${START + animationWindow}%, 100% {
// 						--z: calc((var(--depth) + var(--origin-z) - (var(--stack-height) - ((var(--stack-height) - (var(--stack-height) / var(--ring-count)) * (var(--index) + 1))))) * -1);
// 						--x: 0%;
// 						--r: 180deg;
// 						transform: translate3d(-50%, -50%, var(--origin-z)) translate3d(var(--x), 0, var(--z)) rotateY(var(--r));
// 					}
// 			`
// 			STYLE.sheet.insertRule(`
// 				@-webkit-keyframes spring-${i} {
// 					${SLINKS}
// 				}
// 			`)
// 			STYLE.sheet.insertRule(
// 				`
// 				@keyframes spring-${i} {
// 					${SLINKS}
// 				}
// 			`
// 			)
// 		}
// 		const FADE_IN = `
// 			0%, ${animationWindow}% {
// 		    --opacity: 0;
// 		  }
// 		  ${ANIMATION_STEP + animationWindow}%, 100% {
// 		    --opacity: 1;
// 		  }
// 		`
// 		STYLE.sheet.insertRule(
// 			`
// 			@-webkit-keyframes fade-in {
// 				${FADE_IN}
// 			}
// 		`
// 		)
// 		STYLE.sheet.insertRule(
// 			`
// 			@keyframes fade-in {
// 				${FADE_IN}
// 			}
// 		`
// 		)
// 		const FADE_OUT = `
// 			0%, ${ANIMATION_STEP * (count + 1)}% {
// 		    --opacity: 1;
// 		  }
// 		  ${ANIMATION_STEP * (count + 1) + animationWindow * 0.375}%, 100% {
// 		    --opacity: 0;
// 		  }
// 		`
// 		STYLE.sheet.insertRule(
// 			`
// 			@-webkit-keyframes fade-out {
// 				${FADE_OUT}
// 			}
// 		`
// 		)
// 		STYLE.sheet.insertRule(
// 			`
// 			@keyframes fade-out {
// 				${FADE_OUT}
// 			}
// 		`
// 		)
// 		STYLE.sheet.insertRule(`
// 			@-webkit-keyframes step-down {
// 				to {
// 					transform: translate(${flip ? -50 : 0}%, 0) translate3d(${flip ? 0 : -100}%, 0, var(--depth));
// 				}
// 			}
// 		`)
// 		STYLE.sheet.insertRule(`
// 			@keyframes step-down {
// 				to {
// 					transform: translate(${flip ? -50 : 0}%, 0) translate3d(${flip ? 0 : -100}%, 0, var(--depth));
// 				}
// 			}
// 		`)
// 		STYLE.sheet.insertRule(`
// 			@-webkit-keyframes rotate-scene {
// 				to {
// 					--rs: 360deg;
// 				}
// 			}
// 		`)
// 		STYLE.sheet.insertRule(`
// 			@keyframes rotate-scene {
// 				to {
// 					--rs: 360deg;
// 				}
// 			}
// 		`)
// 		if (flip) {
// 			STYLE.sheet.insertRule(`
// 				@-webkit-keyframes flip-flop {
// 				  0% {
// 				    --flip: 0deg;
// 				  }
// 				  50% {
// 				    --flip: 180deg;
// 				  }
// 				  100% {
// 				    --flip: 360deg;
// 				  }
// 				}
// 			`)
// 			STYLE.sheet.insertRule(`
// 				@keyframes flip-flop {
// 				  0% {
// 				    --flip: 0deg;
// 				  }
// 				  50% {
// 				    --flip: 180deg;
// 				  }
// 				  100% {
// 				    --flip: 360deg;
// 				  }
// 				}
// 			`)
// 		}
// 		styleRef.current = STYLE
// 	}, [count, animationWindow, flip])

// 	return (
// 		<div className="container" key={new Date().getTime()}>
// 			<div className="flipper">
// 				<div className="scene">
// 					<div className="scene__shadow"></div>
// 					<div className="plane" style={{ '--ring-count': count }}>
// 						<div className="plane__shadow"></div>
// 						{new Array(count).fill().map((_, index) => (
// 							<div
// 								className="ring"
// 								key={`ring--${index}`}
// 								style={{ '--index': index, '--name': `spring-${index}` }}></div>
// 						))}
// 					</div>
// 				</div>
// 			</div>
// 		</div>
// 	)
// }

// render(<Slinky />, ROOT_NODE)
