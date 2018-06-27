const UPPER_VELOCITY = 10
const LOWER_VELOCITY = 2
const MAX_SIZE = innerWidth * .05
const MIN_SIZE = innerWidth * .025
const MAX_PARTICLES = 1000
const AMOUNT = 0
const COLOR = 0xffffff
const GRAPHIC_SIZE = 500

const { Application, Graphics, Text } = PIXI

const msg = document.querySelector('h1')
const info = document.querySelector('.info')

PIXI.loader
  .add('https://jh3y-doodles.netlify.com/football.svg')
  .load(() => new Pitch())

class Pitch {
  constructor() {
    const floored = v => Math.floor(Math.random() * v)
    const update = p =>
      Math.random() > 0.5
        ? Math.max(LOWER_LIMIT_X, p - 1)
        : Math.min(p + 1, UPPER_LIMIT_X)

    const reset = p => {
      p.x = floored(app.renderer.width)
      p.y = -(p.height + floored(app.renderer.height))
      p.vy = floored(UPPER_LIMIT_Y)
    }
    const balls = new PIXI.particles.ParticleContainer(MAX_PARTICLES, {
      scale: true,
      position: true
    })
    const POS = {
      x: undefined,
      y: undefined,
    }
    const updatePos = (e) => {
      POS.x = e.touches ? e.changedTouches[0].pageX : e.pageX
      POS.y = e.touches ? e.changedTouches[0].pageY : e.pageY
    }
    const genBall = (t, x, y) => {
      const SIZE = floored(innerWidth * 0.05) + (innerWidth * 0.025)
      const p = new PIXI.Sprite(t)
      p.scale.x = p.scale.y = SIZE / 100
      p.vx =
        Math.random() > 0.5
          ? (floored(UPPER_VELOCITY) + LOWER_VELOCITY) * -1
          : floored(UPPER_VELOCITY) + LOWER_VELOCITY
      p.vy =
        Math.random() > 0.5
          ? (floored(UPPER_VELOCITY) + LOWER_VELOCITY) * -1
          : floored(UPPER_VELOCITY) + LOWER_VELOCITY
      p.x = x ? x - (SIZE / 2) : floored(app.renderer.width - SIZE)
      p.y = y ? y - (SIZE / 2): floored(app.renderer.height - SIZE)
      balls.addChild(p)
      return p
    }
    const genParticles = t => new Array(AMOUNT).fill().map(() => genBall(t))

    const app = new Application({
      antialias: true,
      transparent: true,
    })
    app._ADDING = false
    const baseTexture = new PIXI.Texture.fromImage(
      'https://jh3y-doodles.netlify.com/football.svg'
    )
    let particles = genParticles(baseTexture)

    const addBall = e => {
      particles.push(
        genBall(baseTexture, POS.x, POS.y)
      )
    }
    const toggleAdd = (e) => {
      updatePos(e)
      app._ADDING = !app._ADDING
    }

    app.stage.addChild(balls)
    app.ticker.add(i => {
      if (
        app.renderer.height !== innerHeight ||
        app.renderer.width !== innerWidth
      ) {
        app.renderer.resize(innerWidth, innerHeight)
        balls.removeChildren()
        particles = genParticles(baseTexture)
      }
      if (particles.length && msg.classList.contains('showing')) msg.classList.remove('showing')
      if (!particles.length && !msg.classList.contains('showing')) msg.classList.add('showing')
      if (particles.length && !info.classList.contains('showing')) info.classList.add('showing')
      if (!particles.length && info.classList.contains('showing')) info.classList.remove('showing')
      if (app._ADDING && !document.body.classList.contains('adding')) document.body.classList.add('adding')
      if (!app._ADDING && document.body.classList.contains('adding')) document.body.classList.remove('adding')
      if (app._ADDING) info.innerText = `⚽: ${Math.min(MAX_PARTICLES, particles.length)}`
      if (app._ADDING) addBall(baseTexture)
      for (let i = 0; i < particles.length; i++) {
        const particle = particles[i]
        // TODO: Collision detection is coming 🎉
        // const willColide = (p) => {
        //   const b = p.getBounds()
        //   p.cX = b.x + (b.width / 2)
        //   p.cY = b.y + (b.height / 2)
        //   // check if new position will be a colission
        //   let colliding = false
        //   for (let s = 0; s < particles.length; s++) {
        //     if (s === i) return
        //     const sibling = particles[s]
        //     const siblingBounds = sibling.getBounds()
        //     sibling.cX = 0
        //   }
        //   return colliding
        // }
        // willColide(particle)
        particle.y += particle.vy
        particle.x += particle.vx
        if (particle.y > app.renderer.height - particle.height || particle.y < 0)
          particle.vy = particle.vy * -1
        if (particle.x > app.renderer.width - particle.width || particle.x < 0)
          particle.vx *= -1
      }
    })
    document.addEventListener('mousemove', updatePos)
    document.addEventListener('touchmove', updatePos)
    document.addEventListener('mousedown', toggleAdd)
    document.addEventListener('touchstart', toggleAdd)
    document.addEventListener('touchend', toggleAdd)
    document.addEventListener('mouseup', toggleAdd)
    document.body.appendChild(app.view)
  }
}
