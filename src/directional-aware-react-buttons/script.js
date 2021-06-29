import React, { Fragment } from 'https://cdn.skypack.dev/react'
import { render } from 'https://cdn.skypack.dev/react-dom'

const ROOT_NODE = document.querySelector('#app')

const Button = ({ as, children, filled, secondary, ...rest }) => {
  const that = {
    as
  }
  return (
    <that.as className={`dir-control ${secondary ? 'dir-control--secondary' : ''} ${filled ? 'dir-control--filled' : ''}`} {...rest} >
      {children}
      <span/>
      <span/>
      <span/>
      <span/>
      <b aria-hidden="true">{children}</b>
      <b aria-hidden="true">{children}</b>
      <b aria-hidden="true">{children}</b>
      <b aria-hidden="true">{children}</b>
    </that.as>
  )
}
Button.defaultProps = {
  as: 'button'
}

const App = () => (
  <Fragment>
    <Button role="button" >Click Me!</Button>
    <Button as="a" href="#" >Link Me!</Button>
    <Button role="button" secondary >Click Me!</Button>
    <Button as="a" href="#" secondary >Link Me!</Button>
    <Button role="button" filled >Click Me!</Button>
    <Button as="a" href="#" filled >Link Me!</Button>
  </Fragment>
)

render(<App />, ROOT_NODE)
