import React, {
  Fragment,
  useEffect,
  useRef,
  useState,
} from 'https://cdn.skypack.dev/react'
import { render } from 'https://cdn.skypack.dev/react-dom'
import gsap from 'https://cdn.skypack.dev/gsap'

const ROOT_NODE = document.querySelector('#app')

const OPTIONS = [
  {
    value: 'nope',
    label: 'Has no Cheezburger',
  },
  {
    value: 'distant',
    label: 'Has Cheezburger (Distant)',
  },
  {
    value: 'outside',
    label: 'Has Cheezburger (Sibling)',
  },
  {
    value: 'inside',
    label: 'Has Cheezburger (Child)',
  },
]

const getCode = (has, language) => {
  let code
  if (language === 'css') {
    switch (has) {
      case 'nope':
        code = `.🐱:before {
  content: "😿";
}`
        break
      case 'distant':
        code = `.🐱:has(~ .🍔):before {
  content: "😾";
}`
        break
      case 'inside':
        code = `.🐱:has(.🍔):before {
  content: "😻";
  animation:
    satisfied steps(1, end) 2s both,
    gobble 0.2s 10 linear both;
}
.🐱 .🍔:before {
  animation: eat 1s steps(4) forwards;
}`
        break
      case 'outside':
        code = `.🐱:has(+ .🍔):before {
  content: "🙀";
  animation: anticipate 0.1s infinite;
}`
        break
    }
  } else {
    switch (has) {
      case 'nope':
        code = `<div class="🐱"></div>`
        break
      case 'distant':
        code = `<div class="🐱"></div>
<div/>
<div class="🍔"></div>`
        break
      case 'inside':
        code = `<div class="🐱">
  <div class="🍔"></div>
</div>`
        break
      case 'outside':
        code = `<div class="🐱"></div>
<div class="🍔"></div>`
        break
    }
  }
  return Prism.highlight(code, Prism.languages[language], language)
}

const App = () => {
  const [showCSS, setShowCSS] = useState(true)
  const [has, setHas] = useState(OPTIONS[0].value)

  const code = getCode(has, showCSS ? 'css' : 'markup')

  return (
    <div className="scene">
      <div className="result">
        <div className="result__code">
          <button
            className="toggle-button"
            onClick={() => setShowCSS(!showCSS)}>{`Show ${
            showCSS ? 'HTML' : 'CSS'
          }`}</button>
          <div className="code-blocks">
            <pre className={`language-${showCSS ? 'css' : 'markup'}`}>
              <code
                dangerouslySetInnerHTML={{
                  __html: code,
                }}
              />
            </pre>
          </div>
        </div>
        <div className={`result__result result__result--${has}`}>
          {has === 'inside' && (
            <img
              style={{
                '--x': Math.random() * 60 + 20,
                '--y': Math.random() * 60 + 20,
                '--r': -15 + Math.random() * 30,
              }}
              className="cheez"
              src="http://1.bp.blogspot.com/-CzqzzBV2tMk/TxBM3ar18MI/AAAAAAAAPm0/6faLPO9BM8w/s1600/i-can-has-cheezburger.jpg"
            />
          )}
          <div class="🐱">{has === 'inside' && <div class="🍔"></div>}</div>
          {has === 'distant' && <span />}
          {(has === 'outside' || has === 'distant') && <div class="🍔"></div>}
        </div>
      </div>
      <div className="controls">
        <select onChange={e => setHas(e.target.value)} value={has}>
          {OPTIONS.map(({ label, value }) => (
            <option value={value}>{label}</option>
          ))}
        </select>
      </div>
    </div>
  )
}

render(<App />, ROOT_NODE)
