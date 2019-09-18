/* eslint-disable */
document.styleSheets[1].insertRule('* { box-sizing: border-box; }', 0)
const getAnswer = async () => {
  document.querySelector(
    '.eight-ball span:nth-of-type(2) span'
  ).innerText = await (await (await fetch(
    'https://8ball.delegator.com/magic/JSON/arandomquestion'
  )).json()).magic.answer
  document.querySelector(
    '.eight-ball span:nth-of-type(2) span'
  ).style.opacity = 1
}
