"use client"

import React, { useEffect, useState } from "react"
import io, { Socket } from "socket.io-client"
import { Send, User } from "lucide-react"

interface Message {
  room: string
  author: string
  message: string
  time: string
}

interface ChatRoomProps {
  roomId: string
  username: string
}

// Initializing socket outside component to prevent multiple connections
let socket: Socket

export function ChatRoom({ roomId, username }: ChatRoomProps) {
  const [currentMessage, setCurrentMessage] = useState("")
  const [messageList, setMessageList] = useState<Message[]>([])

  useEffect(() => {
    // Connect only if not already connected
    if (!socket) {
        socket = io("http://localhost:5555")
    }

    socket.emit("join_room", roomId)

    const handleReceiveMessage = (data: Message) => {
      setMessageList((list) => [...list, data])
    }

    socket.on("receive_message", handleReceiveMessage)

    return () => {
        socket.off("receive_message", handleReceiveMessage)
    }
  }, [roomId])

  const sendMessage = async () => {
    if (currentMessage !== "") {
      const messageData: Message = {
        room: roomId,
        author: username,
        message: currentMessage,
        time:
          new Date(Date.now()).getHours() +
          ":" +
          String(new Date(Date.now()).getMinutes()).padStart(2, '0'),
      }

      await socket.emit("send_message", messageData)
      setMessageList((list) => [...list, messageData])
      setCurrentMessage("")
    }
  }

  return (
    <div className="flex flex-col h-[600px] w-full bg-card border border-border rounded-xl overflow-hidden shadow-sm">
      <div className="bg-primary/5 p-4 border-b border-border flex items-center justify-between">
        <div className="flex items-center gap-3">
            <div className="relative">
                <div className="w-3 h-3 rounded-full bg-emerald-500 animate-ping absolute opacity-75"></div>
                <div className="w-3 h-3 rounded-full bg-emerald-500 relative"></div>
            </div>
            <div>
                <h3 className="font-semibold text-sm">Live Discussion</h3>
                <p className="text-xs text-muted-foreground">{roomId} Room</p>
            </div>
        </div>
        <span className="text-xs px-2 py-1 bg-muted rounded text-muted-foreground">
            {username}
        </span>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messageList.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-muted-foreground opacity-50">
                <p>No messages yet.</p>
                <p className="text-sm">Start the conversation!</p>
            </div>
        )}
        {messageList.map((messageContent, index) => {
          const isMe = username === messageContent.author
          return (
            <div
              key={index}
              className={`flex ${isMe ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[75%] rounded-2xl px-4 py-2 ${
                  isMe
                    ? "bg-orange-500 text-white rounded-br-sm"
                    : "bg-orange-50 text-orange-950 rounded-bl-sm"
                }`}
              >
                {!isMe && (
                    <div className="flex items-center gap-1 mb-1 opacity-70">
                        <User className="w-3 h-3" />
                        <span className="text-[10px] font-bold">{messageContent.author}</span>
                    </div>
                )}
                <p className="text-sm">{messageContent.message}</p>
                <p className={`text-[10px] mt-1 ${isMe ? "text-white/80" : "text-orange-900/60"} text-right`}>
                    {messageContent.time}
                </p>
              </div>
            </div>
          )
        })}
      </div>

      <div className="p-4 bg-background border-t border-border">
        <div className="flex gap-2">
          <input
            type="text"
            value={currentMessage}
            placeholder="Type your message..."
            className="flex-1 bg-muted/50 border border-input hover:border-primary/50 focus:border-primary rounded-lg px-4 py-2 text-sm transition-colors outline-none"
            onChange={(event) => {
              setCurrentMessage(event.target.value)
            }}
            onKeyDown={(event) => {
              event.key === "Enter" && sendMessage()
            }}
          />
          <button 
            onClick={sendMessage}
            disabled={!currentMessage.trim()}
            className="bg-orange-500 text-white p-2 rounded-lg hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  )
}
