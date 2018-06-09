const { Component, Fragment } = React
const { render } = ReactDOM
const styled = styled.default
const root = document.querySelector('#app')

const CardTrack = styled.div`
  height: 300px;
  position: relative;
  width: 200px;
`
const getTranslation = ({ pos }) =>
  `${Math.max(Math.min(pos, 4), -4) * 100}%, 0`
const getOpacity = ({ pos }) =>
  Math.abs(pos) > 4 ? 0 : 1 - Math.abs(pos * 30) / 100
const getGray = ({ pos }) => (Math.abs(pos) > 4 ? 1 : Math.abs(pos) * 1)
const getScale = ({ pos }) =>
  Math.abs(pos) > 4 ? 0 : 1 - Math.abs(pos * 20) / 100
const getZ = ({ pos }) => (Math.abs(pos) > 4 ? -1 : 4 - Math.abs(pos))
const Container = styled.div`
  border-radius: 6px;
  height: 100%;
  filter: grayscale(${p => getGray(p)}) drop-shadow(2px 2px 10px black);
  left: 0;
  overflow: hidden;
  position: absolute;
  top: 0;
  transform: scale(${p => getScale(p)}) translate(${p => getTranslation(p)});
  transition: transform 0.5s, filter 0.5s;
  width: 100%;
  z-index: ${p => getZ(p)};
`
const AuthorAvatar = styled.img`
  border-radius: 100%;
  height: 60px;
  left: 50%;
  position: absolute;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 60px;
`
const Hero = styled.img`
  height: 60%;
  object-fit: cover;
  width: 100%;
`
const getClipPath = ({ pos }) => {
  let path = '100% 50%, 0% 50%'
  if (pos > 0) path = '100% 40%, 0% 60%'
  if (pos < 0) path = '100% 60%, 0% 40%'
  return path
}
const ContentMark = styled.div`
  background-color: ${p => (p.pos === 0 ? '#fafafa' : '#999')};
  bottom: 0;
  clip-path: polygon(${p => getClipPath(p)}, 0% 100%, 100% 100%);
  height: 100%;
  left: -1px;
  position: absolute;
  right: -1px;
  transition: clip-path 0.5s, background 0.5s;
`
const Content = styled.div`
  bottom: 0;
  height: 50%;
  left: 0;
  padding: 30px 10px 10px 10px;
  position: absolute;
  right: 0;
`
const Title = styled.h1`
  align-items: center;
  color: #111;
  display: flex;
  font-family: 'HelveticaNeue-Light', 'Helvetica Neue Light', 'Helvetica Neue',
    Helvetica, Arial, 'Lucida Grande', sans-serif;
  font-size: 1.25rem;
  height: 5rem;
  justify-content: center;
  margin: 10px 0 0 0;
  padding: 0;
  text-align: center;
`
const AuthorName = styled.h2`
  bottom: 10px;
  color: ${p =>
    p.pos === 0
      ? ['#f89406', '#22a7f0', '#db0a5b', '#2eec71'][
          Math.floor(Math.random() * 4)
        ]
      : '#777'};
  font-family: 'HelveticaNeue-Light', 'Helvetica Neue Light', 'Helvetica Neue',
    Helvetica, Arial, 'Lucida Grande', sans-serif;
  font-size: 0.75rem;
  font-weight: 300;
  left: 0;
  margin: 0;
  padding: 0;
  position: absolute;
  text-align: center;
  text-transform: uppercase;
  transition: color 0.5s;
  width: 100%;
`
const SVG = styled.svg`
  height: 30px;
  width: 30px;
`
const Button = styled.button`
  align-items: center;
  background: 0;
  border: 4px solid #fff;
  border-radius: 100%;
  cursor: pointer;
  display: flex;
  justify-content: center;
  height: 44px;
  position: absolute;
  left: 50%
  top: 50%;
  transition: background 0.5s;
  width: 44px;

  &:hover {
    background: rgba(255, 255, 255, 0.25);
  }

  &:nth-of-type(1) {
    transform: translate(-150%, 400%);
  }

  &:nth-of-type(2) {
    transform: translate(50%, 400%);
  }
`
class Card extends Component {
  static propTypes = {
    pos: PropTypes.number,
  }
  render = () => {
    const { hero, title, author } = this.props.data
    return (
      <Container {...this.props}>
        <Hero src={hero} />
        <ContentMark {...this.props}>
          <Content>
            <Title>{title.charAt(0).toUpperCase() + title.slice(1)}</Title>
            <AuthorName {...this.props}>{`${author.firstName} ${
              author.lastName
            }`}</AuthorName>
          </Content>
        </ContentMark>
        <AuthorAvatar src={author.avatar} />
      </Container>
    )
  }
}
/**
 * Main app entry point
 */
class App extends Component {
  state = {
    active: 0,
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
          <CardTrack>
            {cards.map((data, idx) => {
              let pos = idx - active
              // Prep for continuous rolling
              if (active >= amount - 4 && idx <= 4) {
                pos = idx + (amount - active)
              } else if (active <= 4 && idx >= amount - 4) {
                pos = 0 - (amount - idx + active)
              }
              return <Card {...{ pos }} data={data} key={`card--${idx}`} />
            })}
          </CardTrack>
        )}
        <Button onClick={() => this.setState({active: active - 1 >= 0 ? active - 1 : amount - 1})}>
          <SVG viewBox="0 0 24 24">
            <path fill="#fff" d="M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z" />
          </SVG>
        </Button>
        <Button onClick={() => this.setState({active: active + 1 > amount - 1 ? 0 : active + 1 })}>
          <SVG viewBox="0 0 24 24">
            <path fill="#fff" d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z" />
          </SVG>
        </Button>
      </Fragment>
    )
  }
}

ReactDOM.render(<App />, root)
