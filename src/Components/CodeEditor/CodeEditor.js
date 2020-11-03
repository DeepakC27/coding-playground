import React, { useEffect, useReducer, useState } from 'react'
import { Editor, Button } from '../../Common'
import safeEval from 'safe-eval'
import './index.css'

const CodingEditor = () => {
  const [filesState, dispatch] = useReducer(EditorReducer, InitialState)
  const [code, setCode] = useState(filesState[0].code)

  const [activeFileIdx, setActiveFileIdx] = useState(0)
  const [errorContent, setErrorMsg] = useState({ name: '', message: '' })
  const [btnStatus, setBtnStatus] = useState(true)

  const updateFileIdx = (fileIdx) => {
    setActiveFileIdx(fileIdx)
    setCode(filesState[fileIdx].code)
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
      setErrorMsg(err)
      setBtnStatus(false)
    }
  }

  const updateCode = (value) => {
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

  useEffect(() => {
    setErrorMsg({ name: '', message: '' })
    setBtnStatus(true)
  }, [filesState])

  return (
    <div className='coding-editor'>
      <div className='editor-tabs'>
        <div className='files-list'>
          {filesState.map((file, idx) => 
            <div key={'file-' + idx}
              className={'code-file-btn ' + (idx === activeFileIdx ? 'active-file' : 'REMOVE_FILE')}>
              <Button onClick={() => updateFileIdx(idx)}>
                {file.fileName}
              </Button>
              {(idx !== 0) && <Button onClick={() => dispatch({ type: 'REMOVE_FILE', fileIdx: idx })}
                className='remove-file-btn icon-btn'>x</Button>}
            </div>
          )}
          {filesState.length < 3 &&
            <Button onClick={() => dispatch({ type: 'ADD_NEW_FILE'})}
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
      <Editor code={code} setCode={updateCode} />
      {errorContent && errorContent.name &&
        <div className='error-content'>
          <div className='err-heading'>{errorContent.name}</div>    
          <p className='err-msg'>{errorContent.message}</p>
        </div>
      }
    </div>
  )
}

const InitialState = [{
  fileName: 'main.js',
  code: 'function handleResponse (msg) {\n\t // YOUR CODE HERE\n return msg \n}'
}]

const EditorReducer = (state = InitialState, action) => {
  switch (action.type) {
    case 'ADD_NEW_FILE':
      return [
        ...state,
        {
          fileName: Math.random().toString(36).substring(9) + '.js',
          code: 'function handleResponse (msg) {\n\t // YOUR CODE HERE\n return msg \n}'
        }
      ]
    case 'REMOVE_FILE':
      return state.filter((file, idx) => idx !== action.fileIdx)

    case 'UPDATE_FILE_CODE':
      let updatedState = state.map((file, idx) => {
        if (idx === action.fileIdx) {
          file.code = action.code
        }
        return file
      })
      return updatedState
    default:
      return state
  }
}

export default CodingEditor
