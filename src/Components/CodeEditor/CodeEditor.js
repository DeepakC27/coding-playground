import React, { useEffect, useReducer, useState, useCallback } from 'react'
import { Editor, Button } from '../../Common'
import { EditorReducer, InitialState } from './EditorReducer'
import safeEval from 'safe-eval'
import './index.css'

const CodingEditor = () => {
  const [filesState, dispatch] = useReducer(EditorReducer, InitialState)
  const [code, setCode] = useState(filesState[0].code)
  const [activeFileIdx, setActiveFileIdx] = useState(0)
  const [errorContent, setErrorMsg] = useState({ name: '', message: '' })
  const [btnStatus, setBtnStatus] = useState(true)

  const addNewFile = () => {
    dispatch({ type: 'ADD_NEW_FILE'})
  }

  const removeFile = idx => {
    dispatch({ type: 'REMOVE_FILE', fileIdx: idx })
  }

  const evaluateCode = () => {
    try {
      safeEval(code)
      dispatch({
        type: 'UPDATE_FILE_CODE',
        fileIdx: activeFileIdx,
        code
      })
      if (document.getElementById('output-handler-script')) {
        document.body.removeChild(document.getElementById('output-handler-script'))
      }
      const dynamicScript = document.createElement('script')
      dynamicScript.id = 'output-handler-script'
      dynamicScript.innerHTML = code.trim()
      document.body.appendChild(dynamicScript)
    } catch (err) {
      console.log(err)
      setErrorMsg({
        name: err.name,
        message: err.message
      })
      setBtnStatus(false)
    }
  }

  useEffect(() => {
    evaluateCode()
  }, [])

  const updateCode = value => {
    try {
      setCode(value)
      errorContent && errorContent.name && setErrorMsg({ name: '', message: '' })
      if (btnStatus) {
        !value && setBtnStatus(false)
      } else {
        value && (!btnStatus) && setBtnStatus(true)
      }
    } catch (err) {
      setErrorMsg(err)
    }
  }

  const resetStatus = useCallback(() => {
    setErrorMsg({ name: '', message: '' })
    setBtnStatus(true)
  }, [])

  const updateFileIdx = useCallback((fileIdx) => {
    setActiveFileIdx(fileIdx)
    setCode(filesState[fileIdx].code)
    resetStatus()
  }, [filesState, resetStatus])

  useEffect(() => {
    resetStatus()
    filesState.length && updateFileIdx(filesState.length - 1)
  }, [filesState, resetStatus, updateFileIdx])

  return (
    <>
      <div className='editor-tabs'>
        <div className='files-list'>
          {filesState.map((file, idx) => 
            <div key={'file-' + idx}
              className={'code-file-btn ' + (idx === activeFileIdx ? 'active-file' : 'REMOVE_FILE')}>
              <Button onClick={() => updateFileIdx(idx)}>
                {file.fileName}
              </Button>
              {(idx !== 0) && <Button onClick={() => removeFile(idx)}
                className='remove-file-btn icon-btn'>x</Button>}
            </div>
          )}
          {filesState.length < 3 &&
            <Button onClick={addNewFile}
              className='add-file-btn icon-btn'>+</Button>
          }
        </div>
        <Button
          className='evaluate-btn'
          onClick={evaluateCode}
          disabled={!btnStatus}>
          Save
        </Button>
      </div>
      <hr />
      <Editor code={code || ''} setCode={updateCode} />
      {errorContent && errorContent.name &&
        <ErrorConsole error={errorContent} />
      }
    </>
  )
}

const ErrorConsole = ({ error }) => (
  <div className='error-content'>
    <div className='err-heading'>{error.name}</div>    
    <p className='err-msg'>{error.message}</p>
  </div>
)

export default CodingEditor
