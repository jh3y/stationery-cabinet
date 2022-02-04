import QRCode from 'https://cdn.skypack.dev/qrcode'
import React from 'https://cdn.skypack.dev/react'
import { render } from 'https://cdn.skypack.dev/react-dom'
import { GUI } from 'https://cdn.skypack.dev/dat.gui'
import {
	Canvas,
	useFrame,
	useThree,
} from 'https://cdn.skypack.dev/@react-three/fiber'
import * as THREE from 'https://cdn.skypack.dev/three'

import gsap from 'https://cdn.skypack.dev/gsap'

const ROOT_NODE = document.querySelector('#app')

const CONFIG = {
	url: 'https://jhey.dev',
	speed: 0.2,
}

// Take this and create a React component. CSS doesn't make sense here because it would be a nightmare.

const Block = ({ x, y, z, height, width, depth, dark }) => {
	return (
		<mesh castShadow={true} position={[x, y, z]}>
			<boxGeometry args={[height, width, depth]} />
			<meshStandardMaterial color={dark ? 'white' : 'black'} />
		</mesh>
	)
}

const Blocks = ({ children, hovered }) => {
	const blocksRef = React.useRef(null)
	const spinningRef = React.useRef(gsap.timeline({ repeat: -1 }))
	const {
		camera,
		size: { width, height },
		...otherThings
	} = useThree()

	React.useEffect(() => {
		if (hovered) {
			spinningRef.current.clear()
			spinningRef.currrent = gsap
				.timeline()
				.to(blocksRef.current.rotation, {
					y: blocksRef.current.rotation.y < Math.PI ? 0 : (Math.PI / 180) * 360,
					duration: CONFIG.speed,
				})
				.to(
					blocksRef.current.scale,
					{
						z: 0.1,
						duration: CONFIG.speed,
					},
					'<'
				)
				.to(camera.position, {
					z: 18,
					duration: CONFIG.speed,
				})
		} else {
			spinningRef.current = gsap
				.timeline()
				.set(blocksRef.current.rotation, {
					y: 0,
				})
				.to(camera.position, {
					z: 30,
					duration: CONFIG.speed,
				})
				.to(
					blocksRef.current.scale,
					{
						z: 1,
						duration: CONFIG.speed,
					},
					'<'
				)
				.to(blocksRef.current.rotation, {
					y: 360 * (Math.PI / 180),
					ease: 'none',
					duration: 5,
					repeat: -1,
				})
		}
	}, [hovered])

	return (
		<group ref={blocksRef} position={[0, 0, 0]}>
			{children}
		</group>
	)
}

const QRWidget = ({ url = CONFIG.url, dark }) => {
	const [code, setCode] = React.useState(null)
	const [locked, setLocked] = React.useState(false)
	const [hover, setHover] = React.useState(false)
	const containerRef = React.useRef(null)

	React.useEffect(() => {
		setCode(QRCode.create(url))
	}, [url])


	React.useEffect(() => {
		//Implement off-click
		if (locked) {
			const OFF_CLICK = e => {
				console.info(e.target, containerRef.current, containerRef.current.contains(e.target))
				if (!containerRef.current.contains(e.target)) {
					setHover(false)
					setLocked(false)
					window.removeEventListener('click', OFF_CLICK)
				}
			}
			window.addEventListener('click', OFF_CLICK)
			return () => {
				window.removeEventListener('click', OFF_CLICK)
			}
		}
	}, [locked])

	return (
		<div
			class="qr-code"
			ref={containerRef}
			onClick={() => setLocked(!locked)}
			onPointerEnter={() => setHover(true)}
			onPointerLeave={() => setHover(!locked ? false : true)}>
			<Canvas
				camera={{
					near: 1,
					far: 1000,
					fov: 75,
					zoom: 1,
					position: [0, 0, 30],
				}}
				shadows={true}>
				<ambientLight />
				<pointLight castShadow={true} position={[10, 10, 30]} />
				{code && (
					<Blocks hovered={hover}>
						{[...code.modules.data].map((value, index) => {
							if (value === 0) return
							const x = (index % code.modules.size) - 12
							const y = Math.floor(index / code.modules.size) - 12
							return (
								<Block x={x} y={y} z={-0.5} height={1} width={1} depth={1} dark={dark} />
							)
						})}
					</Blocks>
				)}
			</Canvas>
		</div>
	)
}

const App = () => {
	const darkMode = window.matchMedia('(prefers-color-scheme: dark)')
	const [url, setUrl] = React.useState(CONFIG.url)
	const [dark, setDark] = React.useState(darkMode.matches)
	React.useEffect(() => {
		const CTRL = new GUI()
		CTRL.add(CONFIG, 'url')
			.onChange(setUrl)
			.name('URL')

		// Set up light dark mode switch.
		darkMode.addListener(mq => setDark(mq.matches))
	}, [])
	if (url.trim() === '') return <h1>Need URL</h1>
	return <QRWidget url={url} dark={dark} />
}

render(<App />, ROOT_NODE)
