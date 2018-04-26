const addBadge = () => {
  const badge = document.createElement('a')
  const style = `cursor: pointer; position: fixed; bottom: 10px; left: 10px`
  badge.innerHTML = `<img src="https://avatars3.githubusercontent.com/u/842246" style="${style}" height="35" width="35"/>`
  badge.setAttribute('target', '_blank')
  badge.setAttribute('href', 'https://codepen.io/jh3y')
  document.body.appendChild(badge)
}
document.addEventListener('DOMContentLoaded', addBadge)
