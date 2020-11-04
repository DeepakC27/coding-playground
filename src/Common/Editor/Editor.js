import React, { useEffect, useState, useRef } from 'react'
import { ControlledEditor } from "@monaco-editor/react";
import { debounce } from 'lodash'
import './index.css'

const Editor = ({ code, setCode }) => {
  const editorRef = useRef()
  const [editorDimensions, setDimensions] = useState({
    height: (window.innerWidth <= 700 ? '30vh' : '60vh'),
    width: '100%'
  })

  const onChange = (_, value) => {
    setCode(value)
  }

  const editorDidMount = (_, ref) => {
    editorRef.current = ref
    window.editorRef = ref
  }

  useEffect(() => {
    window.addEventListener('resize', debounce(() => {
      setDimensions({
        height: (window.innerWidth <= 700
          ? '30vh'
          : '60vh'
        ),
        width: (window.innerWidth <= 700
          ? window.innerWidth + 'px'
          : (window.innerWidth - 50) / 2 + 'px'
        )
      })
    }), 250)
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
          minimap: {
            enabled: false
          },
          scrollbar: {
            horizontal: 'hidden'
          },
          fontSize: 14
        }}
        onChange={onChange}
        editorDidMount={editorDidMount}
      />
    </>
  )
}

export default Editor