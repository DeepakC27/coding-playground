import React, { useEffect, useState } from 'react'
import { ControlledEditor } from '@monaco-editor/react'
import { debounce } from 'lodash'
import './index.css'

const Editor = ({ code, setCode }) => {
  const [editorDimensions, setDimensions] = useState({
    height: (window.innerWidth <= 700 ? '30vh' : '50vh'),
    width: '100%'
  })

  const onChange = (_, value) => {
    setCode(value)
  }

  useEffect(() => {
    window.addEventListener('resize', debounce(() => {
      setDimensions({
        height: (window.innerWidth <= 700
          ? '30vh'
          : '50vh'
        ),
        width: (window.innerWidth <= 700
          ? window.innerWidth + 'px'
          : (window.innerWidth - 50) / 2 + 'px'
        )
      })
    }), 500)
  }, [editorDimensions])

  return (
    <>
      <ControlledEditor
        width={editorDimensions.width}
        height={editorDimensions.height}
        theme='vs-dark'
        value={code?.trim() || ''}
        language='javascript'
        options={{
          wordWrap: 'on',
          autoClosingBrackets: 'always',
          cursorBlinking: 'blink',
          matchBrackets: 'always',
          scrollBeyondLastLine: false,
          selectionHighlight: true,
          minimap: {
            enabled: false
          },
          scrollbar: {
            horizontal: 'hidden'
          },
          fontSize: 14
        }}
        onChange={onChange}
      />
    </>
  )
}

export default Editor