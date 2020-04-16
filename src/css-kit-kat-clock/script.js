const CLOCK = document.querySelector('.clock')
const DATE = new Date()
const MINUTES = DATE.getMinutes()
const HOURS = DATE.getHours() % 12

CLOCK.style.setProperty('--hue', Math.random() * 360)
CLOCK.style.setProperty('--minutes-delay', (3600 / 60) * MINUTES)
CLOCK.style.setProperty(
  '--hours-delay',
  (43200 / 12) * HOURS + (43200 / 12 / 60) * MINUTES
)
