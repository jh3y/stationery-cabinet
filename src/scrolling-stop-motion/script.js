const {
  gsap: { registerPlugin, to, set },
  ScrollTrigger,
} = window

registerPlugin(ScrollTrigger)

// Utility function - h/t to https://www.trysmudford.com/blog/linear-interpolation-functions/
const LERP = (x, y, a) => x * (1 - a) + y * a
const CLAMP = (a, min = 0, max = 1) => Math.min(max, Math.max(min, a))
const INVLERP = (x, y, a) => CLAMP((a - x) / (y - x))
const RANGE = (x1, y1, x2, y2, a) => LERP(x2, y2, INVLERP(x1, y1, a))

const IMAGES = [...document.querySelectorAll('img')]

set(IMAGES[0], { display: 'block' })

to(
  {},
  {
    scrollTrigger: {
      scrub: 0.1,
      trigger: 'body',
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: self => {
        // console.info(self.progress)
        let index = Math.floor(RANGE(0, 1, 0, IMAGES.length - 1, self.progress))
        set(IMAGES, { display: 'none' })
        set(IMAGES[index], { display: 'block' })
      },
    },
  }
)
