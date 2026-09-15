import React from 'react'
import MessageList from './MessageList.jsx'
import chatInput from './chatInput.jsx'
import Nav from './Nav.jsx'
import { useEffect } from 'react'
import { useSelector } from 'react-redux'
import getMessages from '../features/getMessages.js'

function ChatArea() {
  const {selectedConversation}=useSelector(state=>state.conversation)
  useEffect(()=>{
    const getMsg = async()=>{
      if(selectedConversation){
      await getMessages(selectedConversation?._id)
      }
    }
  },[])
  return (
    <div className='flex-1 flex flex-col
    '>
      <Nav/>
    <MessageList/>
    <chatInput/>
    </div>
  )
}

export default ChatArea