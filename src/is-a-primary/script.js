const { React, ReactDOM, tracking } = window
const { useState, useRef, useEffect, Fragment } = React
const { render } = ReactDOM
const rootNode = document.getElementById('app')

const canvas = document.createElement('canvas')

const getScreenshot = video => {
  canvas.width = video.videoWidth
  canvas.height = video.videoHeight
  canvas.getContext('2d').drawImage(video, 0, 0)
  return canvas.toDataURL('image/webp')
}

const getColorDistance = (target, actual) =>
  Math.sqrt(
    (target.r - actual.r) * (target.r - actual.r) +
      (target.g - actual.g) * (target.g - actual.g) +
      (target.b - actual.b) * (target.b - actual.b)
  )

const useCamera = () => {
  const [stream, setStream] = useState(null)
  const [active, setActive] = useState(true)
  const [rearAvailable, setRearAvailable] = useState(undefined)
  const [useRear, setUseRear] = useState(undefined)

  const hasMultipleCameras = async () => {
    const devices = await navigator.mediaDevices.enumerateDevices()
    const multiple =
      devices.filter(d => d.kind === 'videoinput').length > 1 ? true : false
    setRearAvailable(multiple)
    setUseRear(multiple)
  }

  const stopCamera = () => {
    stream.getTracks()[0].stop()
    setStream(null)
  }

  useEffect(
    () => {
      hasMultipleCameras()
    },
    [rearAvailable]
  )

  const toggleCamera = () => {
    setUseRear(!useRear)
    if (stream) stopCamera()
  }

  const toggleStream = () => {
    setActive(!active)
    if (active) stopCamera()
  }

  useEffect(
    () => {
      if (!navigator.mediaDevices.getUserMedia) {
        return alert('getUserMedia() not supported')
      }
      if (
        active &&
        rearAvailable !== undefined &&
        navigator.mediaDevices.getUserMedia &&
        !stream
      ) {
        const facingMode =
          (useRear === undefined && rearAvailable) || useRear
            ? { exact: 'environment' }
            : 'user'
        navigator.getUserMedia(
          {
            video: { facingMode },
          },
          s => setStream(s),
          e => alert(e)
        )
      }
    },
    [stream, rearAvailable, useRear, active]
  )
  return {
    stream,
    toggleCamera: rearAvailable ? toggleCamera : undefined,
    toggleStream,
    usingRear: useRear,
  }
}

const usePrimary = (evaluate, img) => {
  const [primary, setPrimary] = useState(undefined)
  const reset = () => setPrimary(undefined)
  useEffect(
    () => {
      if (evaluate && img) {
        const diff = 75
        tracking.ColorTracker.registerColor(
          'red',
          (r, g, b) =>
            getColorDistance({ r: 244, g: 67, b: 54 }, { r, g, b }) < diff
        ) // 50 - 255
        tracking.ColorTracker.registerColor(
          'yellow',
          (r, g, b) =>
            getColorDistance({ r: 253, g: 216, b: 53 }, { r, g, b }) < diff
        )
        tracking.ColorTracker.registerColor(
          'blue',
          (r, g, b) =>
            getColorDistance({ r: 30, g: 136, b: 229 }, { r, g, b }) < diff
        )
        const tracker = new tracking.ColorTracker(['red', 'yellow', 'blue'])
        tracker.on('track', e => {
          let isAPrimary = e.data.length > 0
          setTimeout(
            () => setPrimary(isAPrimary),
            Math.floor(Math.random() * 1000) + 1000
          )
        })
        tracking.track(img.current, tracker)
      }
    },
    [evaluate, img]
  )
  return {
    primary,
    reset,
  }
}

const App = () => {
  const [evaluating, setEvaluating] = useState(false)
  const evaluationImage = useRef(null)
  const [image, setImage] = useState(null)
  // Grab instance of video element
  const webcam = useRef(null)
  // Use input stream hook to decide whether can toggle cam direction
  const { stream, toggleCamera, usingRear } = useCamera()
  // If there's a stream and a webcam element, stream the input
  useEffect(
    () => {
      if (stream && webcam.current) webcam.current.srcObject = stream
    },
    [stream, webcam]
  )
  const { primary: isAPrimary, reset: resetPrimary } = usePrimary(
    evaluating,
    evaluationImage
  )

  const capture = () => {
    setImage(getScreenshot(webcam.current))
    setEvaluating(true)
  }

  const reset = () => {
    setImage(null)
    setEvaluating(false)
    resetPrimary()
  }

  return (
    <Fragment>
      {isAPrimary && (
        <div className="banner banner--success">
          <h1>Primary</h1>
          <div className="banner__icon">
            <svg viewBox="0 0 24 24">
              <path d="M21,7L9,19L3.5,13.5L4.91,12.09L9,16.17L19.59,5.59L21,7Z" />
            </svg>
          </div>
        </div>
      )}
      {isAPrimary !== undefined &&
        isAPrimary === false && (
          <div className="banner banner--fail">
            <h1>Not Primary</h1>
            <div className="banner__icon">
              <svg viewBox="0 0 24 24">
                <path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />
              </svg>
            </div>
          </div>
        )}
      {image && (
        <img
          ref={evaluationImage}
          src={image}
          style={
            evaluating && isAPrimary === undefined
              ? { filter: 'blur(5px)' }
              : {}
          }
        />
      )}
      {evaluating && isAPrimary === undefined && <h1>Evaluating...</h1>}
      {stream && <video ref={webcam} autoPlay />}
      {!image && <button className="shutter" onClick={capture} />}
      {isAPrimary !== undefined &&
        image && (
          <button
            className={`restart ${isAPrimary ? 'restart--bottom' : ''} ${
              isAPrimary !== undefined && isAPrimary === false
                ? 'restart--top'
                : ''
            }`}
            onClick={reset}>
            <svg viewBox="0 0 24 24">
              <path d="M12,4C14.1,4 16.1,4.8 17.6,6.3C20.7,9.4 20.7,14.5 17.6,17.6C15.8,19.5 13.3,20.2 10.9,19.9L11.4,17.9C13.1,18.1 14.9,17.5 16.2,16.2C18.5,13.9 18.5,10.1 16.2,7.7C15.1,6.6 13.5,6 12,6V10.6L7,5.6L12,0.6V4M6.3,17.6C3.7,15 3.3,11 5.1,7.9L6.6,9.4C5.5,11.6 5.9,14.4 7.8,16.2C8.3,16.7 8.9,17.1 9.6,17.4L9,19.4C8,19 7.1,18.4 6.3,17.6Z" />
            </svg>
          </button>
        )}
      {toggleCamera &&
        !image && (
          <button className="toggle" onClick={toggleCamera}>
            {usingRear && (
              <svg viewBox="0 0 24 24">
                <path d="M6,0H18A2,2 0 0,1 20,2V22A2,2 0 0,1 18,24H6A2,2 0 0,1 4,22V2A2,2 0 0,1 6,0M12,6A3,3 0 0,1 15,9A3,3 0 0,1 12,12A3,3 0 0,1 9,9A3,3 0 0,1 12,6M11,1V3H13V1H11M6,4V16.5C6,15.12 8.69,14 12,14C15.31,14 18,15.12 18,16.5V4H6M13,18H9V20H13V22L16,19L13,16V18Z" />
              </svg>
            )}
            {!usingRear && (
              <svg viewBox="0 0 24 24">
                <path d="M6,0H18A2,2 0 0,1 20,2V22A2,2 0 0,1 18,24H6A2,2 0 0,1 4,22V2A2,2 0 0,1 6,0M12,2A2,2 0 0,0 10,4A2,2 0 0,0 12,6A2,2 0 0,0 14,4A2,2 0 0,0 12,2M13,18H9V20H13V22L16,19L13,16V18Z" />
              </svg>
            )}
          </button>
        )}
    </Fragment>
  )
}

render(<App />, rootNode)
