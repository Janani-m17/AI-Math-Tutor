import React, { useState, useEffect } from "react";
import "../styles/chatBot.css";

const ChatBot = () => {
  const [chats, setChats] = useState([]);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [chatName, setChatName] = useState("");
  const [currentChat, setCurrentChat] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!currentChat && chats.length === 0) {
      startNewChatWithDefaultName();
    }
  }, [currentChat, chats]);

  const startNewChatWithDefaultName = () => {
    const defaultChatName = `Chat ${chats.length + 1}`;
    const newChat = { id: Date.now(), title: defaultChatName, messages: [] };
    setChats([...chats, newChat]);
    setCurrentChat(newChat);
    setMessages([]);
  };

  const fetchChat = () => {
    if (chatName.trim() === "") {
      setError("Please enter a chat name.");
      return;
    }

    const foundChat = chats.find((chat) => chat.title === chatName);
    if (foundChat) {
      setCurrentChat(foundChat);
      setMessages(foundChat.messages);
      setError("");
    } else {
      setError("Chat does not exist.");
    }
  };

  // const startNewChat = () => {
  //   if (chatName.trim() === "") {
  //     setError("Chat name cannot be empty.");
  //     return;
  //   }

  //   const newChat = { id: Date.now(), title: chatName, messages: [] };
  //   setChats([...chats, newChat]);
  //   setCurrentChat(newChat);
  //   setMessages([]);
  //   setChatName("");
  //   setError("");
  // };

  const selectChat = (chat) => {
    setCurrentChat(chat);
    setMessages(chat.messages);
    setError("");
  };

  const sendMessage = () => {
    if (inputText.trim()) {
      const newMessages = [...messages, { text: inputText, type: "user" }];
      setMessages(newMessages);
      setInputText("");

      setTimeout(() => {
        const botReply = { text: "Bot Reply", type: "bot" };
        setMessages([...newMessages, botReply]);

        // Update chat history
        const updatedChats = chats.map((chat) =>
          chat.id === currentChat.id ? { ...chat, messages: [...newMessages, botReply] } : chat
        );
        setChats(updatedChats);
      }, 1000);
    }
  };

  // const handleChatNameChange = (newName) => {
  //   if (currentChat) {
  //     const updatedChat = { ...currentChat, title: newName };
  //     const updatedChats = chats.map((chat) =>
  //       chat.id === currentChat.id ? updatedChat : chat
  //     );
  //     setChats(updatedChats);
  //     setCurrentChat(updatedChat);
  //   }
  // };

  const startNewChat = () => {
    if (chatName.trim() === "") {
      setError("Chat name cannot be empty.");
      return;
    }
  
    // Check if the chat name already exists
    if (chats.some((chat) => chat.title === chatName)) {
      setError("Chat name already exists.");
      return;
    }
  
    const newChat = { id: Date.now(), title: chatName, messages: [] };
    setChats([...chats, newChat]);
    setCurrentChat(newChat);
    setMessages([]);
    setChatName("");
    setError("");
  };
  
  const handleChatNameChange = (newName) => {
    if (newName.trim() === "") {
      setError("Chat name cannot be empty.");
      return;
    }
  
    // Check if the new name already exists (excluding the current chat)
    if (chats.some((chat) => chat.title === newName && chat.id !== currentChat.id)) {
      setError("Chat name already exists.");
      return;
    }
  
    if (currentChat) {
      const updatedChat = { ...currentChat, title: newName };
      const updatedChats = chats.map((chat) =>
        chat.id === currentChat.id ? updatedChat : chat
      );
      setChats(updatedChats);
      setCurrentChat(updatedChat);
      setError("");
    }
  };
  

  return (
    <div className="chat-bot">
      <div className="chat-container">
        {/* Sidebar for Previous Chats */}
        <div className={`side-menu ${showMenu ? "open" : ""}`}>
          <button className="close-menu" onClick={() => setShowMenu(false)}>✖</button>

          <input
            type="text"
            className="chat-name-input"
            placeholder="Enter chat name..."
            value={chatName}
            onChange={(e) => setChatName(e.target.value)}
          />
          <button className="fetch-chat" onClick={fetchChat}>Fetch Chat</button>
          <button className="new-chat" onClick={startNewChat}>+ New Chat</button>

          {error && <div className="error-message">{error}</div>}

          <div className="chat-list">
            {chats.map((chat) => (
              <div key={chat.id} className="chat-item" onClick={() => selectChat(chat)}>
                {chat.title}
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="chat-main">
          <button className="menu-button" onClick={() => setShowMenu(true)}>☰</button>

          {/* Chat Messages (Scrollable) */}
          <div className="chat-window">
            <div className="chat-messages">
              {messages.map((msg, index) => (
                <div key={index} className={`chat-bubble ${msg.type}`}>
                  {msg.text}
                </div>
              ))}
            </div>
          </div>
          {/* Edit Chat Name */}
            {currentChat && (
              <div className="edit-chat-name">
                <input
                  type="text"
                  value={currentChat.title}
                  onChange={(e) => handleChatNameChange(e.target.value)}
                />
              </div>
            )}

          {/* Input Field with Send Button */}
          <div className="chat-input">
            <input
              type="text"
              placeholder="Type a message..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && sendMessage()}
            />
            <button onClick={sendMessage}>➜</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;
