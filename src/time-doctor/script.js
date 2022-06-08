console.clear()

// This functions goes through elements and enhances
// their animations composing them into timelines
// without doing awkward "calc" things manually.
const TimeDoctor = (window.TimeDoctor = function() {
  // Get the animating elements and their animations
  const MOVERS = document.querySelectorAll('[data-time-doctor]')

  MOVERS.forEach(mover => {
    // Don't like this... But.
    const ANIMATIONS = mover.getAnimations()
    const { 'animation-duration': speed } = getComputedStyle(mover)
    // Do a proper check for "ms" or "s"
    // Then normalize them all for composition
    const normalizedSpeeds = speed
      .split(',')
      .map(speed => parseFloat(speed, 10))
    const enhancedAnimations = {}
    ANIMATIONS.forEach((animation, index) => {
      animation.speed = normalizedSpeeds[index]
      enhancedAnimations[animation.animationName] = animation
    })
    console.info({ speed, animations: enhancedAnimations })
    // Now it's time to architect the timeline...
    // Based on the attribute value, you get the order...
    let time = 0
    const desired = mover.getAttribute('data-time-doctor').split(',')
    console.info({ desired })
  })
})

TimeDoctor()
