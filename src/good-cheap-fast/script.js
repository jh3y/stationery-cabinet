const { React, ReactDOM, PropTypes } = window
const { Component, Fragment } = React
const { render } = ReactDOM
const rootNode = document.getElementById('app')

class MultiRadio extends Component {
  static defaultProps = {
    limit: 2,
    options: [
      {
        label: 'Cheap',
        checked: false,
      },
      {
        label: 'Good',
        checked: false,
      },
      {
        label: 'Fast',
        checked: true,
      },
    ],
  }
  static propTypes = {
    options: PropTypes.array,
    limit: PropTypes.number,
  }
  state = {
    options: this.props.options,
  }
  onChange = e => {
    const invert =
      this.state.options.filter(o => o.checked && o.label !== e.target.id)
        .length === this.props.limit

    this.setState({
      options: this.state.options.reduce(
        (arr, opt) => [
          ...arr,
          {
            ...opt,
            checked:
              e.target.id === opt.label
                ? e.target.checked
                : invert
                  ? !opt.checked
                  : opt.checked,
          },
        ],
        []
      ),
    })
  }
  render = () => {
    return (
      <form>
        <h1>Services on Offer</h1>
        {this.state.options.map(o => (
          <Fragment key={`option--${o.label}`}>
            <label htmlFor={o.label}>{o.label}</label>
            <div className="check">
              <input
                onChange={this.onChange}
                type="checkbox"
                className="check__check"
                checked={o.checked}
                value={o.label}
                id={o.label}
              />
              <div className="check__indicator" />
            </div>
          </Fragment>
        ))}
      </form>
    )
  }
}

render(<MultiRadio />, rootNode)
