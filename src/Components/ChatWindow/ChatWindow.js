import React, { useEffect, useState } from 'react'
import { Input, MessageUI } from '../../Common'
import './index.css'

const ChatWindow = () => {
  const [userMsg, setUserMsg] = useState('')
  const [msgList, updateMessages] = useState([])
  const [showBotLoader, toggleBotLoader] = useState(false)
  const [botResponse, setBotResponse] = useState('')

  const userIpOnChange = e => {
    setUserMsg(e.target.value)
  }

  const scrollToBottom = () => {
    const chatWrapper = document.querySelector('.chat-list')
    const bottomWidth = (chatWrapper.firstElementChild.clientHeight * chatWrapper.childElementCount)
    chatWrapper.scrollTo({ top: bottomWidth, behavior: 'smooth' })
  }

  useEffect(() => {
    msgList.length && scrollToBottom()
  }, [msgList])

  const validateMsg = e => {
    if ((e.which === 13 || e.key === 'Enter') && userMsg.trim()) {
      updateMessages([
        ...msgList,
        { text: userMsg, userType: 'user' }
      ])
      e.stopPropagation()
      fetchBotResponse(userMsg)
      setUserMsg('')
    }
  }

  const fetchBotResponse =  async (ipMsg) => {
    toggleBotLoader(true)
    try {
      const response = await window.handleResponse(ipMsg)
      toggleBotLoader(false)
      response && setBotResponse(response)
    } catch (err) {
      toggleBotLoader(false)
      console.log(err)
    }
  }

  useEffect(() => {
    if (botResponse) {
      updateMessages([
        ...msgList,
        { text: botResponse, userType: 'bot' }
      ])
      setBotResponse('')
    }
  }, [botResponse, msgList])
  
  return (
    <>
      <div className='chat-window'>
        <ul className='chat-list'>
          {msgList.map((msg, index) => (
            <MessageUI key={'msg-' + index} msg={msg.text} userType={msg.userType} />
          ))}
          {showBotLoader && <MessageUI isLoading userType='bot' />}
        </ul>
      </div>
      <Input className='chat-input'
        value={userMsg}
        placeholder='Type your message here....'
        onChange={userIpOnChange}
        onKeyPress={validateMsg}
      />
    </>
  )
}

export default ChatWindow
