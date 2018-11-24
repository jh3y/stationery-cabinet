const { React, ReactDOM, styled } = window
const { Component } = React
const { render } = ReactDOM
const rootNode = document.getElementById('app')

const Container = styled.div`
  background: black;
  cursor: pointer;
  border-radius: 25% 50% 25% 50% / 25% 50% 25% 50%;
  border: 20px solid black;
  height: 300px;
  position: absolute;
  top: 50%;
  left: 50%;
  overflow: hidden;
  transform: translate(-50%, -50%);
  width: 300px;
`
const Eye = styled.div`
  height: 110%;
  width: 110%;
  background-color: green;
  background-image: url(${p => p.image});
  background-size: cover;
  border-radius: 100%;
  top: 50%;
  left: 50%;
  z-index: -1;
  position: absolute;
  transform: translate(-50%, -50%);

  &:after {
    bottom: 0;
    content: '';
    left: 0;
    position: absolute;
    right: 0;
    top: 0;
    mix-blend-mode: lighten;
    background: #87d37c;
    border-radius: 100%;
  }
`
const Wrap = styled.div`
  cursor: pointer;
  height: 300px;
  width: 300px;
  position: relative;
  border-radius: 25% 50%;
  overflow: hidden;
`

const EyeLids = styled.div`
  height: 150%;
  width: 150%;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%) rotate(25deg);
  z-index: 2;

  &:before,
  &:after {
    content: '';
    position: absolute;
    height: 100%;
    width: 100%;
    background: black;
    transition: transform 0.25s ease;
    z-index: 2;
  }

  &:before {
    transform: translate(0, ${p => (p.closed ? '-49%' : '-100%')});
  }

  &:after {
    transform: translate(0, ${p => (p.closed ? '49%' : '100%')});
  }
`

const Pupil = styled.div`
  height: 50%;
  width: 50%;
  background-image: url(${p => p.image});
  background-size: cover;
  position: absolute;
  top: 50%;
  left: 50%;
  border-radius: 100%;
  transform: translate(-50%, -50%);
`

class EyeOfTheTiger extends Component {
  state = {
    fetching: true,
    image: undefined,
  }
  getImage = async () => {
    const newImage = await fetch('https://source.unsplash.com/300x300/?tiger')
    if (newImage.url !== this.state.image) return newImage.url
    return this.getImage()
  }
  blink = () => {
    this.setState({ fetching: true }, async () => {
      const image = await this.getImage()
      this.setState({
        fetching: false,
        image,
      })
    })
  }
  componentDidMount = () => this.blink()
  render = () => {
    return (
      <Wrap onClick={this.blink}>
        <Container open={!this.state.fetching}>
          <Eye image={this.state.image} />
          <Pupil image={this.state.image} />
        </Container>
        <EyeLids closed={this.state.fetching} />
      </Wrap>
    )
  }
}

render(<EyeOfTheTiger />, rootNode)
