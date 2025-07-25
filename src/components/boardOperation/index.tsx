import { ChangeEvent, useState, useCallback, useEffect } from 'react'
import useBoardStore from '@/store/board'
import { useTranslation } from 'react-i18next'
import { ActionMode } from '@/constants'
import { paintBoard } from '@/core/paintBoard'
import { isMobile as isMobileFn } from '@/utils'

import UndoIcon from '@/components/icons/boardOperation/undo.svg?react'
import RedoIcon from '@/components/icons/boardOperation/redo.svg?react'
import SaveIcon from '@/components/icons/boardOperation/save.svg?react'
import CleanIcon from '@/components/icons/boardOperation/clean.svg?react'
import UploadIcon from '@/components/icons/boardOperation/upload.svg?react'
import CopyIcon from '@/components/icons/boardOperation/copy.svg?react'
import TextIcon from '@/components/icons/boardOperation/text.svg?react'
import DeleteIcon from '@/components/icons/boardOperation/delete.svg?react'
import FileListIcon from '@/components/icons/boardOperation/fileList.svg?react'
import FullscreenIcon from '@/components/icons/boardOperation/fullscreen.svg?react'
import FullscreenExitIcon from '@/components/icons/boardOperation/fullscreen-exit.svg?react'
import CloseIcon from '@/components/icons/close.svg?react'
import MenuIcon from '@/components/icons/menu.svg?react'
import FileList from './fileList'
import DownloadImage from './downloadImage'
import UploadImage from './uploadImage'

const isMobile = isMobileFn()

const BoardOperation = () => {
  const { t } = useTranslation()
  const { mode } = useBoardStore()
  const [showFile, updateShowFile] = useState(false) // show file list draw
  const [showOperation, setShowOperation] = useState(true) // mobile: show all operation
  const [isFullscreen, setIsFullscreen] = useState(false)

  const [downloadImageURL, setDownloadImageURL] = useState('')
  const [showDownloadModal, setShowDownloadModal] = useState(false)

  const [uploadImageURL, setUploadImageURL] = useState('')
  const [showUploadModal, setShowUploadModal] = useState(false)

  // toggle fullscreen mode
  const toggleFullscreen = useCallback(async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen()
      } else {
        await document.exitFullscreen()
      }
    } catch (err) {
      console.error('fullscreen error:', err)
    }
  }, [])

  /**
   * listen fullscreen event
   * 1. browser behavior
   * 2. toggleFullscreen trigger
   */
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange)
    }
  }, [])

  // copy activity object
  const copyObject = () => {
    paintBoard.copyObject()
  }

  // delete activity object
  const deleteObject = () => {
    paintBoard.deleteObject()
  }

  // click undo
  const undo = () => {
    paintBoard.history?.undo()
  }

  // click redo
  const redo = () => {
    paintBoard.history?.redo()
  }

  // load IText object
  const inputText = () => {
    paintBoard.textElement?.loadText()
  }

  // upload image file
  const uploadImage = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) {
      return
    }

    const reader = new FileReader()
    reader.onload = (fEvent) => {
      const data = fEvent.target?.result
      if (data) {
        if (data && typeof data === 'string') {
          setUploadImageURL(data)
          setShowUploadModal(true)
        }
      }
      e.target.value = ''
    }
    reader.readAsDataURL(file)
  }

  // save as image
  const saveImage = () => {
    if (paintBoard.canvas) {
      const url = paintBoard.canvas.toDataURL()
      setDownloadImageURL(url)
      setShowDownloadModal(true)
    }
  }

  return (
    <>
      <div className="fixed bottom-5 left-2/4 -translate-x-2/4 flex items-center bg-[#eef1ff] rounded-full xs:flex-col xs:right-5 xs:left-auto xs:translate-x-0 xs:justify-normal xs:max-h-[70vh] xs:overflow-y-auto xs:noScrollbar">
        {showOperation && (
          <>
            <div
              onClick={undo}
              className="min-xs:tooltip cursor-pointer py-1.5 pl-3 pr-2 rounded-l-full hover:bg-slate-200 xs:pl-2 xs:rounded-l-none xs:rounded-t-full"
              data-tip={t('operate.undo')}
            >
              <UndoIcon className="transform scale-x-[-1] scale-y-[1]" />
            </div>
            <div
              onClick={redo}
              className="min-xs:tooltip cursor-pointer py-1.5 px-2 hover:bg-slate-200"
              data-tip={t('operate.redo')}
            >
              <RedoIcon />
            </div>
            {[ActionMode.SELECT, ActionMode.Board].includes(mode) && (
              <>
                <div
                  onClick={copyObject}
                  className="min-xs:tooltip cursor-pointer py-1.5 px-2 hover:bg-slate-200"
                  data-tip={t('operate.copy')}
                >
                  <CopyIcon />
                </div>
                <div
                  onClick={deleteObject}
                  className="min-xs:tooltip cursor-pointer py-1.5 px-2 hover:bg-slate-200"
                  data-tip={t('operate.delete')}
                >
                  <DeleteIcon />
                </div>
              </>
            )}
            <div
              data-tip={t('operate.text')}
              className="min-xs:tooltip cursor-pointer py-1.5 px-2 hover:bg-slate-200"
              onClick={inputText}
            >
              <TextIcon />
            </div>
            <div
              className="min-xs:tooltip cursor-pointer py-1.5 px-2 hover:bg-slate-200"
              data-tip={t('operate.image')}
            >
              <label htmlFor="image-upload" className="cursor-pointer">
                <UploadIcon />
              </label>
              <input
                type="file"
                id="image-upload"
                accept=".jpeg, .jpg, .png"
                className="hidden"
                onChange={uploadImage}
              />
            </div>
            <label
              htmlFor="clean-modal"
              className="min-xs:tooltip cursor-pointer py-1.5 px-2 hover:bg-slate-200"
              data-tip={t('operate.clean')}
            >
              <CleanIcon />
            </label>
            <div
              onClick={saveImage}
              className="min-xs:tooltip cursor-pointer py-1.5 px-2 hover:bg-slate-200"
              data-tip={t('operate.save')}
            >
              <SaveIcon />
            </div>
            {!isMobile && (
              <div
                onClick={toggleFullscreen}
                className="min-xs:tooltip cursor-pointer py-1.5 px-2 hover:bg-slate-200"
                data-tip={t(
                  isFullscreen ? 'operate.exitFullscreen' : 'operate.fullscreen'
                )}
              >
                {isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
              </div>
            )}
            <label
              htmlFor="my-drawer-4"
              className="min-xs:tooltip cursor-pointer py-1.5 pl-2 pr-3 rounded-r-full hover:bg-slate-200 xs:pr-2 xs:rounded-r-none xs:rounded-b-full"
              data-tip={t('operate.fileList')}
              onClick={() => updateShowFile(true)}
            >
              <FileListIcon />
            </label>
          </>
        )}
        <label className="btn btn-circle swap swap-rotate w-7 h-7 min-h-0 my-1.5 mx-2 min-xs:hidden">
          <input type="checkbox" onChange={() => setShowOperation((v) => !v)} />
          <CloseIcon className="swap-on fill-current" />
          <MenuIcon className="swap-off fill-current" />
        </label>
      </div>
      {showFile && <FileList updateShow={updateShowFile} />}
      {showDownloadModal && downloadImageURL && (
        <DownloadImage
          url={downloadImageURL}
          showModal={showDownloadModal}
          setShowModal={setShowDownloadModal}
        />
      )}
      <UploadImage
        url={uploadImageURL}
        showModal={showUploadModal}
        setShowModal={setShowUploadModal}
      />
    </>
  )
}

export default BoardOperation
