import T from 'https://cdn.skypack.dev/proptypes'
import React, {
  Fragment,
  useEffect,
  useRef,
  useState,
} from 'https://cdn.skypack.dev/react'
import { render } from 'https://cdn.skypack.dev/react-dom'
import gsap from 'https://cdn.skypack.dev/gsap'
import Draggable from 'https://cdn.skypack.dev/gsap/Draggable'

const ROOT_NODE = document.querySelector('#app')

const CASES = [
  {
    title: 'Microservices Orchestration',
  },
  {
    title: 'Financial Transactions',
  },
  {
    title: 'Resource Provisioning',
  },
  {
    title: 'Monitoring',
  },
]

const PaperStack = ({ stack: propsStack }) => {
  const stackRef = useRef(null)
  const [stack, setStack] = useState(propsStack)
  const next = () => {
    gsap
      .timeline({
        onComplete: () => {
          let newStack = [...stack]
          newStack.push(newStack.shift())
          setStack(newStack)
        },
      })
      .to(stackRef.current.children[0], {
        xPercent: -50,
        yPercent: -50,
        opacity: 0,
      })
      .to(
        stackRef.current.children[1],
        {
          xPercent: 0,
          yPercent: 0,
        },
        0
      )
  }
  const prev = () => {
    gsap
      .timeline({
        onComplete: () => {
          let newStack = [...stack]
          newStack.unshift(newStack.pop())
          setStack(newStack)
        },
      })
      .set(stackRef.current.children[stackRef.current.children.length - 1], {
        zIndex: stackRef.current.children.length + 1,
      })
      .fromTo(
        stackRef.current.children[stackRef.current.children.length - 1],
        {
          xPercent: -50,
          yPercent: -50,
          opacity: 0,
        },
        {
          xPercent: 0,
          yPercent: 0,
          opacity: 1,
        }
      )
      .to(
        stackRef.current.children[0],
        {
          xPercent: 5,
          yPercent: 5,
        },
        0
      )
  }

  useEffect(() => {
    gsap.set(stackRef.current.children, {
      opacity: 1,
      xPercent: index => (index === 0 ? 0 : 5),
      yPercent: index => (index === 0 ? 0 : 5),
      zIndex: index => stackRef.current.children.length - index,
    })
  }, [stack])

  return (
    <Fragment>
      <button onClick={next}>Next</button>
      <button onClick={prev}>Prev</button>
      <ul ref={stackRef} className="stack">
        {stack.map(item => {
          return (
            <li className="stack__item" key={item.title}>
              {item.title}
            </li>
          )
        })}
      </ul>
    </Fragment>
  )
}
PaperStack.propTypes = {
  stack: T.arrayOf(
    T.shape({
      title: T.string,
    })
  ),
}

const App = () => <PaperStack stack={CASES} />

render(<App />, ROOT_NODE)
