import gsap from 'https://cdn.skypack.dev/gsap'

const BUTTON = document.querySelector('.like-button')
const ICON = BUTTON.querySelector('.like-button__icon')
const RING = BUTTON.querySelector('.like-button__ring')
const COUNT = BUTTON.querySelector('.like-button__count')
const TEXT = BUTTON.querySelector('.like-button__text')

const LIKE_COUNT = Math.floor(gsap.utils.random(10, 90))
TEXT.innerText = `${LIKE_COUNT} Likes`
COUNT.innerText = LIKE_COUNT

let liked = false

const LIKE = () => {
	liked = !liked
	TEXT.innerText = `${liked ? LIKE_COUNT + 1 : LIKE_COUNT} Likes`
	COUNT.innerText = liked ? LIKE_COUNT + 1 : LIKE_COUNT
	BUTTON.classList.toggle('like-button--active')
	gsap.set(RING, { display: liked ? 'block' : 'none' })
	gsap
		.timeline()
		.set(RING, {
			scale: 1,
			opacity: 1,
		})
		.set(COUNT, {
			yPercent: 0,
		})
		.to(
			ICON,
			{
				scale: 1.25,
				repeat: 1,
				yoyo: true,
				duration: 0.3,
				ease: 'power4.out',
			},
			'<'
		)
		.to(
			COUNT,
			{
				yPercent: -300,
				repeat: 1,
				yoyo: true,
				ease: 'power4.out',
				duration: 0.3,
			},
			'<'
		)
		.to(
			RING,
			{
				duration: 0.3,
				scale: 4,
				opacity: 0,
			},
			'<'
		)
}

BUTTON.addEventListener('click', LIKE)
