const { Component } = React
const { render } = ReactDOM

const scrape = async query => {
  const prefixUrl =
    'https://crossorigin.me/https://twitter.com/i/search/timeline?'
  const tweets = await (await fetch(
    `${prefixUrl}f=realtime&q=${query}&src=typd`
  )).json()
  return tweets
}

const processData = tweetHTML => {
  const container = document.createElement('div')
  container.innerHTML = tweetHTML
  const tweets = []
  const markupTweets = container.querySelectorAll(
    'div.original-tweet[data-tweet-id]'
  )
  for (let t = 0; t < markupTweets.length; t++) {
    const tweetMarkup = markupTweets[t]
    const mediaPhoto = tweetMarkup.querySelector(
      '.AdaptiveMedia-container .AdaptiveMedia-photoContainer img'
    )
    const tweet = {
      link: tweetMarkup.getAttribute('data-permalink-path'),
      tweeter: tweetMarkup.getAttribute('data-name'),
      tweeterHandle: tweetMarkup.querySelector('.username').innerText,
      tweeterAvatar: tweetMarkup
        .querySelector('img.avatar')
        .getAttribute('src'),
      tweeterId: tweetMarkup.getAttribute('data-user-id'),
      timestamp: tweetMarkup
        .querySelector('span._timestamp')
        .getAttribute('data-time-ms'),
      html: tweetMarkup.querySelector('p.tweet-text').innerHTML,
      photo: mediaPhoto ? mediaPhoto.getAttribute('src') : undefined,
    }
    tweets.push(tweet)
  }
  return tweets
}

const Msg = ({
  action,
  actionMsg,
  msg,
  hideInput,
  searchTerm,
  onInputChange,
}) => {
  return (
    <div className={'container'}>
      <h1 className={'msg'}>{msg}</h1>
      {!hideInput && (
        <input
          type="text"
          value={searchTerm}
          placeholder="Search term"
          onChange={onInputChange}
          onKeyPress={(e) => e.key === 'Enter' ? action() : () => {}}
        />
      )}
      <button disabled={searchTerm.trim() === ''} className={'btn'} onClick={action}>
        {actionMsg}
      </button>
    </div>
  )
}

class Tweet extends Component {
  /**
   * On mount create a timeline animation that can be sent to the master
   */
  componentDidMount = () => {
    const { master } = this.props
    const tl = this.generateTweetTimeline()
    master.add(tl, 0)
  }

  generateTweetTimeline = () => {
    const opacityDuration = 0.5
    const zDuration = 15
    const top = Math.floor(
      Math.random() * (window.innerHeight - this.el.offsetHeight)
    )
    const left = Math.floor(
      Math.random() * (window.innerWidth - this.el.offsetWidth)
    )
    const tl = new TimelineMax({
      delay: this.props.delay,
      // Hide the element on animation end so it doesn't interfere with clicking
      onComplete: () => (this.el.style.display = 'none'),
    })
    tl
      .from(this.el, opacityDuration, { opacity: 0 }, 0)
      .from(
        this.el,
        zDuration,
        {
          z: 500,
          y: top - window.innerHeight / 2,
          x: left - window.innerWidth / 2,
          ease: Linear.easeNone,
        },
        0
      )
      .to(this.el, opacityDuration, { opacity: 0 }, zDuration - opacityDuration)
    return tl
  }

  render = () => {
    const {
      html,
      photo,
      link,
      tweeterAvatar,
      tweeterHandle,
      tweeter,
      timestamp,
    } = this.props.data

    const renderTweetBody = () => {
      let tweetBody = html
      const container = document.createElement('div')
      container.innerHTML = tweetBody
      const links = container.querySelectorAll('a')
      for (const link of links) {
        if (link.innerText.indexOf('pic.twitter') === 0) link.replaceWith('')
        const newElement = document.createElement('a')
        newElement.innerText = link.innerText
        link.replaceWith(newElement)
      }
      /**
       * NOTE: Would be better to work way through content instead of using
       * dangerouslySetInnerHTML
       * */
      return { __html: container.innerHTML }
    }
    return (
      <a
        target="_blank "
        href={`https://twitter.com${link}`}
        className={'tweet'}
        ref={t => (this.el = t)}>
        <header className={'header'}>
          <img className={'avatar'} src={tweeterAvatar} />
          <div className={'tweeter'}>
            <span>{tweeter}</span>
            <span className={'handle'}>{tweeterHandle}</span>
          </div>
        </header>
        <article
          className={'body'}
          dangerouslySetInnerHTML={renderTweetBody()}
        />
        {photo && <img className={'media'} src={photo} />}
        <footer className={'footer'}>
          <span>{moment(parseInt(timestamp, 10)).format('MMMM Do YYYY')}</span>
        </footer>
      </a>
    )
  }
}

class App extends Component {
  state = {
    appState: 'default',
    tweets: [],
    searchTerm: '',
  }
  getTweets = async () => {
    const { searchTerm } = this.state
    const onComplete = () => {
      this.setState({
        appState: 'complete',
      })
    }
    this.setState(
      {
        appState: 'loading',
        tweets: [],
        timeline: false,
      },
      async () => {
        try {
          const dirtyTweets = await scrape(searchTerm)
          const tweets = processData(dirtyTweets.items_html)
          this.setState({
            appState: 'happy',
            timeline: new TimelineMax({
              onComplete,
            }),
            tweets,
          })
        } catch (e) {
          this.setState({
            appState: 'error',
            tweets: [],
            timeline: false,
          })
        }
      }
    )
  }
  render = () => {
    const { getTweets, state } = this
    const { appState, tweets, timeline, searchTerm } = state
    return (
      <div className={'tweets'}>
        {appState === 'default' && (
          <Msg
            action={getTweets}
            actionMsg={'Get Tweets!'}
            onInputChange={e => this.setState({ searchTerm: e.target.value })}
            msg="Enter a search term to start! 🤓"
            searchTerm={searchTerm}
          />
        )}
        {appState === 'loading' && (
          <h2 className={'loading-msg'}>Grabbing tweets... 🐦</h2>
        )}
        {appState === 'error' && (
          <Msg
            action={getTweets}
            actionMsg={'Try Again!'}
            msg="Owww! Looks like something went wrong 😭"
            hideInput={true}
            onInputChange={e => this.setState({ searchTerm: e.target.value })}
            searchTerm={searchTerm}
          />
        )}
        {tweets.length > 0 &&
          tweets.map((tweet, idx) => (
            <Tweet
              data={tweet}
              delay={idx * 1.5}
              master={timeline}
              key={`tweet--${idx}`}
            />
          ))}
        {appState === 'complete' && (
          <Msg
            action={getTweets}
            msg={'Wanna go again? 😄'}
            actionMsg="Get Tweets!"
            onInputChange={e => this.setState({ searchTerm: e.target.value })}
            searchTerm={searchTerm}
          />
        )}
      </div>
    )
  }
}
render(<App />, root)
