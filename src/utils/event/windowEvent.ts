import { KeyCode } from '@/constants/event'
import { paintBoard } from '../paintBoard'
import { ImageElement } from '../element/image'
import { fabric } from 'fabric'
import useFileStore from '@/store/files'

export class WindowEvent {
  constructor() {
    this.initWindowEvent()
  }

  initWindowEvent() {
    window.addEventListener('keydown', this.keydownFn)
    window.addEventListener('keyup', this.keyupFn)
    window.addEventListener('paste', this.pasteFn)
    window.addEventListener('resize', this.resizeFn)
    window.addEventListener('orientationchange', this.resizeFn)
  }

  removeWindowEvent() {
    window.removeEventListener('keydown', this.keydownFn)
    window.removeEventListener('keyup', this.keyupFn)
    window.removeEventListener('paste', this.pasteFn)
    window.removeEventListener('resize', this.resizeFn)
    window.removeEventListener('orientationchange', this.resizeFn)
  }

  keydownFn(e: KeyboardEvent) {
    const canvas = paintBoard?.canvas
    switch (e.code) {
      case KeyCode.SPACE:
        paintBoard?.evnet?.clickEvent.setSpaceKeyDownState(true)
        if (canvas) {
          canvas.defaultCursor = 'pointer'
          canvas.isDrawingMode = false
          canvas.selection = false
          fabric.Object.prototype.set({
            selectable: false,
            hoverCursor: 'default'
          })
        }
        break
      case KeyCode.BACKSPACE:
        paintBoard.deleteObject()
        break
      default:
        break
    }
  }

  keyupFn(e: KeyboardEvent) {
    if (e.code === KeyCode.SPACE) {
      paintBoard.evnet?.clickEvent.setSpaceKeyDownState(false)
      if (paintBoard.canvas) {
        paintBoard.canvas.defaultCursor = 'default'
      }
      const transform = paintBoard.canvas?.viewportTransform
      if (transform) {
        useFileStore.getState().updateTransform(transform)
      }
      paintBoard.handleMode()
    }
  }

  pasteFn(e: ClipboardEvent) {
    if (e.clipboardData && e.clipboardData.items) {
      const items = e.clipboardData.items
      const item = Array.from(items).find(
        (item) => item.kind === 'file' && item.type.indexOf('image') !== -1
      )
      if (item) {
        const blob = item.getAsFile()
        if (blob) {
          const reader = new FileReader()
          reader.onload = (event) => {
            console.log('event.target.result', event.target?.result)
            const data = event.target?.result
            if (data && typeof data === 'string') {
              const image = new ImageElement()
              image.addImage(data)
            }
          }

          reader.readAsDataURL(blob)
        }
      }
    }
  }

  resizeFn() {
    const canvas = paintBoard.canvas
    if (canvas) {
      canvas.setWidth(window.innerWidth)
      canvas.setHeight(window.innerHeight)
    }
  }
}
