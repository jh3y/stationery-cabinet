const GENERATE_HR = () => {
  // Clear the body
  document.body.innerHTML = ''
  for (let i = 0; i < 100; i++) {
    const MEMBER = document.createElement('hr')
    MEMBER.style.setProperty('--skin', `hsl(${Math.random() * 360}, 50%, 50%)`)
    document.body.appendChild(MEMBER)
  }
}

GENERATE_HR()
