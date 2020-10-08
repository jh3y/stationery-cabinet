const COLORS = {
  EYES: [
    'hsl(30, 50%, 30%)',
    'hsl(90, 50%, 50%)',
    'hsl(180, 50%, 50%)',
    'hsl(0, 0%, 0%)',
  ],
  SKIN: ['hsl(40, 80%, 90%)', 'hsl(30, 0%, 10%)', 'hsl(30, 40%, 40%)'],
}

const RANDOM_FROM_ARR = ARR => ARR[Math.floor(Math.random() * ARR.length)]

const GENERATE_HR = () => {
  // Clear the body
  document.body.innerHTML = ''
  for (let i = 0; i < 100; i++) {
    const MEMBER = document.createElement('hr')
    // Set a skin tone
    MEMBER.style.setProperty('--skin', RANDOM_FROM_ARR(COLORS.SKIN))
    // Set eye color
    MEMBER.style.setProperty('--eye', RANDOM_FROM_ARR(COLORS.EYES))
    /**
     * Choices...
     * Male, Female
     * Beard
     * Hat, hair
     * Hair color
     * Mouth
     * Short/Tall
     * Trousers/Shorts
     * Feet direction
     * Shirt color
     * Sleeve length
     * Hulk
     * Shirt, Tie, Blouse
     * Glasses
     * Shades
     */

    // const FEMALE = Math.random() > 0.5
    const SHORT = Math.random() > 0.75

    if (SHORT) {
      MEMBER.style.setProperty('--short', 0.5)
    }
    document.body.appendChild(MEMBER)
  }
}

GENERATE_HR()

window.addEventListener('click', GENERATE_HR)
