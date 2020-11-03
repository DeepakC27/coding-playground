import React from 'react'
import Header from './Components/Header/Header'
import CodeEditor from './Components/CodeEditor/CodeEditor'
import ChatWindow from './Components/ChatWindow/ChatWindow'

const App = () => {
  return (
    <>
      <Header />
        <main>
          <section>
            <CodeEditor />
          </section>
          <section className='coding-output-window'>
            <ChatWindow />
          </section>
        </main>
    </>
  )
}

export default App
