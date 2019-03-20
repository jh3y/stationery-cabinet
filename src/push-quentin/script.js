const {
  React,
  ReactDOM,
  TweenMax,
  TimelineMax,
  Power1,
  Linear,
  Elastic,
} = window
const { useEffect, useRef, Fragment } = React
const { render } = ReactDOM
const rootNode = document.getElementById('app')

const App = () => {
  const timeout = useRef(null)
  const ripple = useRef(null)
  const quentin = useRef(null)
  const streams = useRef(null)

  const burst = bursting => () => {
    ripple.current.stop()
    ripple.current = new TimelineMax({
      onStart: () => {
        streams.current.classList[bursting ? 'add' : 'remove'](
          'streams--bursting'
        )
        quentin.current.classList[bursting ? 'add' : 'remove'](
          'quentin--bursting'
        )
      },
    })
      .set('#ripple__turbulence', {
        attr: { baseFrequency: '0.02 0.02', numOctaves: bursting ? 10 : 1 },
      })
      .set('#ripple__displacement', { attr: { scale: bursting ? 25 : 8 } })
      .to(streams.current, 0.4, {
        justifyContent: bursting ? 'center' : 'space-around',
      })
      .to('#ripple__turbulence', bursting ? 0.5 : 2, {
        attr: { baseFrequency: bursting ? '0.1 0.1' : '0.04 0.04' },
        repeat: -1,
        yoyo: true,
        ease: Linear.easeNone,
      })
      .add(
        TweenMax.to(quentin.current, bursting ? 0.15 : 1, {
          scaleX: bursting ? 0.5 : 1,
          scaleY: bursting ? 1.25 : 1,
          ease: bursting ? Power1.easeOut : Elastic.easeOut.config(1, 0.3),
        }),
        0
      )
  }

  const setBurst = burst(true)
  const unsetBurst = burst(false)

  const randomInRange = (min, max) =>
    Math.floor(Math.random() * (max - min)) + min

  const switchFace = () => {
    timeout.current = setTimeout(() => {
      let op = 'add'
      if (quentin.current.classList.contains('quentin--cheer')) op = 'remove'
      quentin.current.classList[op]('quentin--cheer')
      switchFace()
    }, Math.floor(Math.random() * 3000) + 1000)
  }

  useEffect(() => {
    ripple.current = new TimelineMax().to('#ripple__turbulence', 2, {
      attr: { baseFrequency: '0.04 0.04' },
      repeat: -1,
      yoyo: true,
      ease: Linear.easeNone,
    })
    switchFace()
    document.addEventListener('mousedown', setBurst)
    document.addEventListener('touchstart', setBurst)
    document.addEventListener('mouseup', unsetBurst)
    document.addEventListener('touchend', unsetBurst)
    return () => {
      document.removeEventListener('mousedown', setBurst)
      document.removeEventListener('touchstart', setBurst)
      document.removeEventListener('mouseup', unsetBurst)
      document.removeEventListener('touchend', unsetBurst)
      clearTimeout(timeout.current)
    }
  }, [])
  return (
    <Fragment>
      <div ref={streams} className="streams">
        {new Array(6).fill().map((s, i) => (
          <div
            className="stream"
            key={`stream--${i}`}
            style={{
              '--radius': randomInRange(5, 25),
              '--top': randomInRange(0, 100),
              '--delay': randomInRange(0, 40) / 100,
              '--duration': randomInRange(40, 80) / 100,
              '--travel': randomInRange(5, 20),
            }}
          />
        ))}
      </div>
      <div className="quentin__wrapper">
        <svg ref={quentin} viewBox="0 0 300 350" className="quentin">
          <filter
            id="ripple"
            filterUnits="objectBoundingBox"
            x="0"
            y="0"
            width="100%"
            height="100%">
            <feTurbulence
              baseFrequency="0.02 0.02"
              result="turbulence"
              id="ripple__turbulence"
              type="fractalNoise"
              numOctaves="1"
              seed="1"
            />
            <feDisplacementMap
              id="ripple__displacement"
              xChannelSelector="R"
              yChannelSelector="G"
              in="SourceGraphic"
              in2="turbulence"
              scale="8"
            />
          </filter>
          <g transform="translate(-21.49352,-703.36035)" filter="url(#ripple)">
            <g transform="translate(0,-46.473248)">
              <g>
                <path
                  d="m 204.06328,917.46424 c 8.8977,-11.57103 26.13057,-10.99443 35.70801,3.51036 9.57743,14.50478 13.33282,50.85241 49.25806,67.96218 35.92524,17.10972 29.70569,28.23812 20.03344,37.72872 -9.6723,9.4906 -26.11767,5.8717 -44.00964,-3.7962 -17.892,-9.6681 -34.05576,-25.84122 -42.15876,-46.21692 -8.10297,-20.37566 -27.72882,-47.61712 -18.83111,-59.18814 z"
                  className="quentin__body"
                />
                <path
                  className="quentin__body"
                  d="m 122.95,928.45883 -7.29332,-5.38406 c -7.97029,-5.88382 -21.991961,-3.23541 -28.963606,7.46167 0,0 -9.619712,37.70437 -22.291282,45.19448 -13.713068,8.1057 -20.7156,14.7145 -18.508073,26.82288 1.097229,6.018 4.685211,9.9713 9.602515,12.8324 8.95675,5.2114 15.791434,2.6526 29.708901,-6.7815 17.320315,-11.74088 37.554915,-51.44298 37.554915,-51.44298 8.07553,-10.01759 8.16026,-22.81907 0.18995,-28.70289 z"
                />
                <path
                  d="m 184.78642,940.40156 c 13.17777,-3.43347 26.88586,16.42753 31.46114,36.11816 8.46517,36.43158 7.3519,49.11208 5.50331,75.16498 -1.61349,22.7397 -13.40701,46.1209 -26.07509,46.6096 -12.66807,0.4888 -18.98292,-21.0588 -16.2409,-38.9719 6.55921,-42.8502 1.2973,-51.287 -2.64951,-70.40872 -4.0732,-19.734 -5.17671,-45.07866 8.00105,-48.51212 z"
                  className="quentin__body"
                />
                <path
                  d="m 145.08243,942.79649 9.01657,0.93921 c 9.8535,1.02639 18.42558,12.4343 16.36468,25.03525 0,0 -18.30974,34.33515 -13.9986,48.40925 4.66555,15.2311 5.38322,24.833 -4.40932,32.289 -4.86709,3.7057 -10.18221,4.2073 -15.74304,3.006 -10.12886,-2.188 -13.45258,-8.6852 -17.37364,-25.0352 -4.87973,-20.3476 6.93582,-63.31365 6.93582,-63.31365 0.78747,-12.84314 9.35402,-22.35626 19.20753,-21.32986 z"
                  className="quentin__body"
                />
                <path
                  d="m 276.72446,889.55541 c 0,62.69576 -47.8241,88.8508 -105.37697,88.8508 -57.55288,0 -105.084901,-26.15504 -105.084915,-88.8508 0,-62.69579 47.532025,-138.19066 105.084915,-138.19066 57.55288,0 105.37697,75.49487 105.37697,138.19066 z"
                  className="quentin__body"
                />
                <path
                  d="m 171.49276,888.29944 a 68.726516,49.284775 0 0 0 -68.72618,49.28329 68.726516,49.284775 0 0 0 16.64218,32.06583 c 15.3667,5.95849 33.11558,8.758 51.93814,8.758 19.06631,0 37.06229,-2.87481 52.6081,-8.99336 a 68.726516,49.284775 0 0 0 16.26565,-31.83047 68.726516,49.284775 0 0 0 -68.72789,-49.28329 z"
                  className="quentin__belly"
                />
                <ellipse
                  className="quentin__eye"
                  ry="10.031121"
                  rx="9.9756308"
                  cy="839.43433"
                  cx="132.90981"
                />
                <ellipse
                  className="quentin__eye"
                  ry="10.031121"
                  rx="9.9756308"
                  cx="210.01491"
                  cy="839.43433"
                />
                <path
                  className="quentin__mouth"
                  d="m 181.00784,848.9583 0,0 a 9.5182139,5.9477262 0 0 1 -9.51822,5.94773 9.5182139,5.9477262 0 0 1 -9.51822,-5.94773"
                />
                <path
                  className="quentin__squint"
                  d="m 123.35392,840.37271 a 9.6013394,9.6547484 0 0 1 -0.0455,-0.9384 9.6013394,9.6547484 0 0 1 9.60134,-9.65474 9.6013394,9.6547484 0 0 1 9.60133,9.65474 l 0,0 a 9.6013394,9.6547484 0 0 1 -0.0454,0.93834"
                />
                <path
                  className="quentin__squint"
                  d="m 200.45898,840.37252 a 9.6013394,9.6547484 0 0 1 -0.0454,-0.9384 9.6013394,9.6547484 0 0 1 9.60134,-9.65475 9.6013394,9.6547484 0 0 1 9.60134,9.65475 l 0,0 a 9.6013394,9.6547484 0 0 1 -0.0454,0.93833"
                />
                <ellipse
                  className="quentin__open-mouth"
                  cx="171.49352"
                  cy="852.46808"
                  rx="11.603139"
                  ry="3.558296"
                />
              </g>
            </g>
            <path
              className="quentin__burst"
              transform="translate(21.493505,703.36035)"
              d="M 103.08172 77.782929 L 120.73691 90.812595 L 103.08331 97.658753 "
            />
            <path
              className="quentin__burst"
              d="m 218.20522,781.14328 -17.65519,13.02967 17.6536,6.84615"
            />
          </g>
        </svg>
      </div>
    </Fragment>
  )
}
render(<App />, rootNode)

/**
 * NON REACT VERSION
 */
// const quentin = document.querySelector('.quentin')
// const streams = document.querySelector('.streams')
// let ripple = new TimelineMax().to('#ripple__turbulence', 2, {
//   attr: { baseFrequency: '0.04 0.04' },
//   repeat: -1,
//   yoyo: true,
//   ease: Linear.easeNone,
// })
// let timeout
// const switchFace = () => {
//   timeout = setTimeout(() => {
//     let op = 'add'
//     if (quentin.classList.contains('quentin--cheer')) op = 'remove'
//     quentin.classList[op]('quentin--cheer')
//     switchFace()
//   }, Math.floor(Math.random() * (3000)) + 1000)
// }

// const burst = bursting => () => {
//   ripple.stop()
//   ripple = new TimelineMax({
//     onStart: () => {
//       streams.classList[bursting ? 'add' : 'remove']('streams--bursting')
//       quentin.classList[bursting ? 'add' : 'remove']('quentin--bursting')
//     }
//   })
//     .set('#ripple__turbulence', {
//       attr: { baseFrequency: '0.02 0.02', numOctaves: bursting ? 10 : 1 },
//     })
//     .set('#ripple__displacement', { attr: { scale: bursting ? 25 : 8 } })
//     .to(streams, 0.4, {justifyContent: bursting ? 'center' : 'space-around'})
//     .to('#ripple__turbulence', bursting ? 0.5 : 2, {
//       attr: { baseFrequency: bursting ? '0.1 0.1' : '0.04 0.04' },
//       repeat: -1,
//       yoyo: true,
//       ease: Linear.easeNone,
//     })
//   TweenMax.to(quentin, bursting ? 0.15 : 1, {
//     scaleX: bursting ? 0.5 : 1,
//     scaleY: bursting ? 1.25 : 1,
//     ease: bursting ? Power1.easeOut : Elastic.easeOut.config(1, 0.3)
//   })
// }
// switchFace()
// document.addEventListener('mousedown', burst(true))
// document.addEventListener('touchstart', burst(true))
// document.addEventListener('mouseup', burst(false))
// document.addEventListener('touchend', burst(false))
