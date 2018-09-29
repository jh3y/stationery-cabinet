const { TimelineMax, TweenMax } = window
const FourOhEight = new TimelineMax({ repeatDelay: 3 })
const typing = document.querySelector('.message--typing')
const left = document.querySelector('.message--left')
const avatar = document.querySelector('.header__member--server')
const messages = document.querySelectorAll(
  '.message:not(.message--typing):not(.message--left)'
)
const msgDuration = 0.25
const random = (max, min) => Math.floor(Math.random() * (max - min + 1)) + min
const generateChatTL = messages => {
  const chatTL = new TimelineMax()
  let stagger = 0
  for (let m = 0; m < messages.length; m++) {
    const message = messages[m]
    const differentRecipient =
      message.classList.contains('message--server') &&
      messages[m - 1] &&
      !messages[m - 1].classList.contains('message--server')
    if (
      m !== 0 &&
      m !== messages.length - 2 &&
      (m === 5 || m === 6 || m === 7 || Math.random() > 0.5)
    ) {
      const deliberation =
        m === 5 || m === 6 || m === 7 ? Math.random() * 3 : Math.random()
      chatTL.set(typing, { display: 'flex' })
      chatTL.add(
        TweenMax.to(typing, deliberation, { display: 'none' }),
        stagger
      )
      stagger += deliberation
    }
    chatTL.set(message, { scale: 0 })
    chatTL.add(
      TweenMax.to(message, msgDuration, {
        scale: 1,
        onStart: () => (message.style.display = 'flex'),
      }),
      stagger
    )
    let step = differentRecipient ? random(3, 1) : Math.random()
    if (m === messages.length - 4 || m === messages.length - 2)
      step = random(4, 2)
    stagger += m === 0 ? 2 : step
  }
  return chatTL
}

FourOhEight.set([...messages, left], { display: 'none', scale: 0 })
  .add(generateChatTL(messages))
  .set(left, { scale: 0 })
  .add(
    TweenMax.to(left, msgDuration, {
      delay: 2,
      scale: 1,
      onStart: () => (left.style.display = 'flex'),
    })
  )
  .add(
    TweenMax.to(avatar, msgDuration, {
      scale: 0,
    })
  )
  .repeat(-1)
