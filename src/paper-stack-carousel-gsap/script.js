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
const {
  utils: { random },
} = gsap

gsap.registerPlugin(Draggable)
const ROOT_NODE = document.querySelector('#app')
const THRESHOLD = 200
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

const getDistance = () =>
  Math.random() > 0.5 ? random(-100, -50) : random(50, 100)

const PaperStack = ({ stack: propsStack, duration = 0.5 }) => {
  const stackRef = useRef(null)
  const dragRef = useRef(null)
  const [stack, setStack] = useState(propsStack)
  const setNext = () => {
    let newStack = [...stack]
    newStack.push(newStack.shift())
    setStack(newStack)
  }
  const next = () => {
    gsap
      .timeline({
        onComplete: () => {
          setNext()
        },
      })
      .to(
        stackRef.current.children[0],
        {
          duration,
          xPercent: getDistance(),
          yPercent: getDistance(),
        },
        0
      )
      .to(
        stackRef.current.children[0],
        {
          opacity: 0,
          duration: duration * 0.5,
        },
        duration * 0.5
      )
      .to(
        stackRef.current.children[1],
        {
          xPercent: 0,
          yPercent: 0,
          duration,
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
          xPercent: getDistance(),
          yPercent: getDistance(),
        },
        {
          xPercent: 0,
          yPercent: 0,
          duration,
        },
        0
      )
      .fromTo(
        stackRef.current.children[stackRef.current.children.length - 1],
        {
          opacity: 0,
        },
        {
          opacity: 1,
          duration: duration * 0.5,
        },
        0
      )
      .to(
        stackRef.current.children[0],
        {
          xPercent: 5,
          yPercent: 5,
          duration,
        },
        0
      )
  }

  // Resets all the items to the stacked position
  useEffect(() => {
    gsap.set(stackRef.current.children, {
      opacity: 1,
      x: 0,
      y: 0,
      xPercent: index => (index === 0 ? 0 : 5),
      yPercent: index => (index === 0 ? 0 : 5),
      zIndex: index => stackRef.current.children.length - index,
    })
  }, [stack])

  // Make the panels draggable
  useEffect(() => {
    if (stackRef.current) {
      Draggable.create(stackRef.current.children, {
        bounds: document.body,
        onDragStart: e => {
          dragRef.current = e.target.getBoundingClientRect()
        },
        onDragEnd: e => {
          // Calculate distance from origin.
          const stackBounds = stackRef.current.getBoundingClientRect()
          const itemBounds = e.target.getBoundingClientRect()
          const distance = Math.sqrt(
            Math.pow(itemBounds.x - stackBounds.x, 2) +
              Math.pow(itemBounds.y - stackBounds.y, 2)
          )
          if (distance > THRESHOLD) {
            gsap
              .timeline({
                onComplete: () => {
                  setNext()
                },
              })
              .to(e.target, {
                duration,
                yPercent: 50,
              })
              .to(
                e.target,
                {
                  opacity: 0,
                  duration: duration * 0.5,
                },
                duration * 0.5
              )
              .to(
                e.target.nextElementSibling,
                {
                  xPercent: 0,
                  yPercent: 0,
                  duration,
                },
                0
              )
          } else {
            gsap.to(e.target, {
              duration,
              x: 0,
              y: 0,
            })
          }
        },
      })
    }
  })

  return (
    <div className="stack__container">
      <button className="stack__control stack__control--next" onClick={next}>
        <span className="sr-only">Next</span>
      </button>
      <button className="stack__control stack__control--prev" onClick={prev}>
        <span className="sr-only">Previous</span>
      </button>
      <ul ref={stackRef} className="stack">
        {stack.map(item => {
          return (
            <li className="stack__item" key={item.title}>
              {item.title}
            </li>
          )
        })}
      </ul>
    </div>
  )
}
PaperStack.propTypes = {
  duration: T.number,
  stack: T.arrayOf(
    T.shape({
      title: T.string,
    })
  ),
}

const App = () => <PaperStack stack={CASES} />

render(<App />, ROOT_NODE)
