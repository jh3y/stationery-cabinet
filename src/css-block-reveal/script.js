const button = document.querySelector('button')
const restart = () => {
  const blocks = document.querySelector('.block-reveal')
  const newBlocks = blocks.cloneNode(true)
  document.body.removeChild(blocks)
  document.body.appendChild(newBlocks)
}
button.addEventListener('click', restart)
