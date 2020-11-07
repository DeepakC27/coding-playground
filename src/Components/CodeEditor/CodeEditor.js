import React, { useEffect, useReducer, useState, useCallback } from 'react'
import { Editor, Button } from '../../Common'
import { EditorReducer, InitialState } from './EditorReducer'
import { addCustomFunctionScript } from '../../Utils/Functions'
import safeEval from 'safe-eval'
import './index.css'

const CodingEditor = () => {
  const [filesState, dispatch] = useReducer(EditorReducer, InitialState)
  const [code, setCode] = useState(filesState[0].code)
  const [activeFileIdx, setActiveFileIdx] = useState(0)
  const [errorContent, setErrorMsg] = useState({ name: '', message: '' })
  const [btnStatus, setBtnStatus] = useState(false)

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
      dynamicScript.innerHTML = `${code.trim()}`
      document.body.appendChild(dynamicScript)
      setBtnStatus(false)
    } catch (err) {
      console.log(err)
      setErrorMsg({
        name: err.name,
        message: err.message
      })
      setBtnStatus(false)
    }
  }

  const addCustomFunction = () => {
    setCode(`${code}\nBotResponse(msg)`)
    addCustomFunctionScript()
    setBtnStatus(true)
    
  }

  useEffect(() => {
    evaluateCode()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const updateCode = value => {
    try {
      setCode(value)
      errorContent && errorContent.name && setErrorMsg({ name: '', message: '' })
      if (btnStatus) {
        // !value && setBtnStatus(false)
      } else {
        value && !btnStatus && setBtnStatus(true)
      }
    } catch (err) {
      setErrorMsg(err)
    }
  }

  const resetStatus = useCallback(() => {
    setErrorMsg({ name: '', message: '' })
    setBtnStatus(false)
  }, [])

  const updateFileIdx = useCallback((fileIdx) => {
    setActiveFileIdx(fileIdx)
    setCode(filesState[fileIdx].code)
    resetStatus()
  }, [filesState, resetStatus])


  useEffect(() => {
    if (filesState.length) {
      updateFileIdx(filesState.length - 1)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filesState.length])

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
      <hr className='editor-seperator' />
      <Editor code={code || ''} setCode={updateCode} />
      {errorContent && errorContent.name &&
        <ErrorConsole error={errorContent} />
      }
      <hr />
      <div className='custom-functions'>
        <div className='function-tag' onClick={addCustomFunction}>
          <h4>BuiltInResponse</h4>
          <div>Built in function to add random response</div>
        </div>
      </div>
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
