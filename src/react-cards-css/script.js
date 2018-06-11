const { Component, Fragment } = React
const { render } = ReactDOM
const styled = styled.default
const root = document.querySelector('#app')
const MAGIC_NUMBER = 3

class Card extends Component {
  static propTypes = {
    pos: PropTypes.number,
  }
  render = () => {
    const { hero, title, author } = this.props.data
    return (
      <div
        className="card"
        {...this.props}
        data-pos={this.props.pos}
        data-gone={this.props.pos < 0}
        data-coming={this.props.pos > 0}>
        <img className="card__hero" src={hero} />
        <div className="card__content-mark" {...this.props}>
          <article className="card__content">
            <h1 className="card__title">
              {title.charAt(0).toUpperCase() + title.slice(1)}
            </h1>
            <h2 className="card__author" {...this.props}>{`${
              author.firstName
            } ${author.lastName}`}</h2>
          </article>
        </div>
        <img className="card__avatar" src={author.avatar} />
      </div>
    )
  }
}
/**
 * Main app entry point
 */
class App extends Component {
  state = {
    active: 10,
    cards: [],
  }
  static propTypes = {
    amount: PropTypes.number,
  }
  static defaultProps = {
    amount: 20,
  }
  generateCards = () => {
    const cards = []
    for (let i = 0; i < this.props.amount; i++) {
      cards.push({
        hero: `https://picsum.photos/420/320?image=${i}`,
        author: {
          avatar: faker.internet.avatar(),
          firstName: faker.name.firstName(),
          lastName: faker.name.lastName(),
        },
        title: faker.company.bs(),
      })
    }
    this.setState({ cards })
  }
  componentDidMount = () => {
    this.generateCards()
  }
  render = () => {
    const { onNext, onPrev, props, state } = this
    const { amount } = props
    const { active, cards, next, prev } = state
    return (
      <Fragment>
        {cards.length === 0 && <h1>Grabbing cards...</h1>}
        {cards.length > 0 && (
          <div className='card__track'>
            {cards.map((data, idx) => {
              let pos = idx - active
              // Prep for continuous rolling
              if (active >= amount - MAGIC_NUMBER && idx <= MAGIC_NUMBER) {
                pos = idx + (amount - active)
              } else if (
                active <= MAGIC_NUMBER &&
                idx >= amount - MAGIC_NUMBER
              ) {
                pos = 0 - (amount - idx + active)
              }
              return <Card {...{ pos }} data={data} key={`card--${idx}`} />
            })}
          </div>
        )}
        <div className='card__actions'>
          <button
            onClick={() =>
              this.setState({
                active: active - 1 >= 0 ? active - 1 : amount - 1,
              })
            }>
            <svg viewBox="0 0 24 24">
              <path
                fill="#fff"
                d="M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z"
              />
            </svg>
          </button>
          <button
            onClick={() =>
              this.setState({
                active: active + 1 > amount - 1 ? 0 : active + 1,
              })
            }>
            <svg viewBox="0 0 24 24">
              <path
                fill="#fff"
                d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z"
              />
            </svg>
          </button>
        </div>
      </Fragment>
    )
  }
}

ReactDOM.render(<App />, root)
