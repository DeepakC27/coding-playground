import React from 'react'
import './index.css'
import BotImg from '../../Assets/bot@3x.png'

const MessageUI = ({ msg, isLoading, userType = 'bot' }) => {
  const isBot = userType === 'bot'
  return (
    <>
      <div className={`msg-wraper ${isBot ? 'bot-chat-UI' : 'user-chat-UI'} ${isLoading ? 'msg-loading' : ''}`}>
        <img src={BotImg} alt={isBot ? 'bot' : 'user' } />
        {isLoading
          ? <div className='chat-loader'>
            <span></span>
            <span></span>
            <span></span>
          </div>
          : <div className='msg-info'>{msg}</div>
        }
      </div>
    </>
  )
}

export default MessageUI
