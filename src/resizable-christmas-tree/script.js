import { GUI } from 'https://cdn.skypack.dev/dat.gui'
const CONFIG = {
  showContainer: false,
  showMiddle: false,
}
const CONTROLLER = new GUI()
const UPDATE = () => {
  document.documentElement.style.setProperty(
    '--show-container',
    CONFIG.showContainer ? 0.5 : 0
  )
  document.documentElement.style.setProperty(
    '--show-middle',
    CONFIG.showMiddle ? 0.5 : 0
  )
}
CONTROLLER.add(CONFIG, 'showContainer')
  .name('Show Container')
  .onChange(UPDATE)
CONTROLLER.add(CONFIG, 'showMiddle')
  .name('Show Middle')
  .onChange(UPDATE)
