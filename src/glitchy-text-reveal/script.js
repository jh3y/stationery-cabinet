const { Splitting } = window
const results = Splitting()
const glitches = '`¡™£¢∞§¶•ªº–≠åß∂ƒ©˙∆˚¬…æ≈ç√∫˜µ≤≥÷/?░▒▓<>/'.split('')
for (let r = 0; r < results.length; r++) {
  const chars = results[r].chars
  for (let c = 0; c < chars.length; c++) {
    chars[c].style.setProperty('--count', Math.random() * 5 + 1)
    for (let g = 0; g < 10; g++) {
      chars[c].style.setProperty(
        `--char-${g}`,
        `"${glitches[Math.floor(Math.random() * glitches.length)]}"`
      )
    }
  }
}
window.ScrollOut({
  scrollingElement: '.container',
  targets: 'p',
})
