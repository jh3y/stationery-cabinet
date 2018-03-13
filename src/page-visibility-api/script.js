const title = document.querySelector('.title')
const handleChange = () => {
  if (!document.hidden) {
    setTimeout(() =>{
      document.body.classList.remove('hidden')
      title.innerText = 'But you\'re back now 😄'
    }, 2000)
  } else {
    document.body.classList.add('hidden')
    title.innerText = 'I missed you 😢'
  }
}

window.addEventListener('visibilitychange', handleChange)