import React, { useState, useEffect, useRef } from "react";
import { FaArrowUp } from "react-icons/fa6";
import axios from "axios";
import "../styles/chatBot.css";

const ChatBot = () => {
  const [chats, setChats] = useState([]);
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [chatName, setChatName] = useState("");
  const [currentChat, setCurrentChat] = useState(null);
  const [showMenu, setShowMenu] = useState(false);
  const [error, setError] = useState("");

  const API_BASE = "https://w4gw8kvg-5000.inc1.devtunnels.ms";

  const chatEndRef = useRef(null); // Ref to track the latest message

  useEffect(() => {
    if (!currentChat && chats.length === 0) {
      startNewChatWithDefaultName();
    }
  }, [currentChat, chats]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]); // Scrolls to the latest message when messages update

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

  const sendMessage = async () => {
    if (inputText.trim() === "") return;

    const userMessage = inputText;

    setInputText("");

    try {
      let chat = currentChat;

      if (!chat) {
        const defaultChatName = `Chat ${chats.length + 1}`;
        const response = await axios.post(
          `${API_BASE}/chat_create`,
          { chat_name: defaultChatName },
          { headers: { "Content-Type": "application/json" } }
        );

        chat = { id: response.data.response, title: defaultChatName, messages: [] };
        setChats([...chats, chat]);
        setCurrentChat(chat);
      }

      const updatedMessages = [...(chat.messages || []), { text: userMessage, type: "user" }];
      setMessages(updatedMessages);

      const chatResponse = await axios.post(
        `${API_BASE}/chat`,
        { chat_name: chat.title, message: userMessage },
        { headers: { "Content-Type": "application/json" } }
      );

      const botReply = { text: chatResponse.data.response, type: "bot" };
      const finalMessages = [...updatedMessages, botReply];

      setMessages(finalMessages);
      setChats(chats.map((c) => (c.id === chat.id ? { ...c, messages: finalMessages } : c)));
      setCurrentChat({ ...chat, messages: finalMessages });

    } catch (err) {
      console.error("Error in sending message:", err.response ? err.response.data : err.message);
      setError(err.response?.data?.message || "Failed to send message.");
    }
  };

  const selectChat = (chat) => {
    setCurrentChat(chat);
    setMessages(chat.messages || []);
    setError("");
  };

  const startNewChat = async () => {
    if (chatName.trim() === "") {
      setError("Chat name cannot be empty.");
      return;
    }

    if (chats.some((chat) => chat.title === chatName)) {
      setError("Chat name already exists.");
      return;
    }

    try {
      const response = await axios.post(
        `${API_BASE}/chat_create`,
        { chat_name: chatName },
        { headers: { "Content-Type": "application/json" } }
      );

      console.log("Chat Created:", response.data);

      const newChat = { id: response.data.response, title: chatName, messages: [] };
      setChats([...chats, newChat]);
      setCurrentChat(newChat);
      setMessages([]);
      setChatName("");
      setError("");
    } catch (err) {
      console.error("Error creating chat:", err.response ? err.response.data : err.message);
      setError(err.response?.data?.message || "Failed to create chat.");
    }
  };

  const handleChatNameChange = (newName) => {
    setError("");
    if (newName.trim() === "") {
      setError("Chat name cannot be empty.");
      return;
    }

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

        <div className="chat-main">
          <button className="menu-button" onClick={() => setShowMenu(true)}>☰</button>

          <div className="chat-window">
            <div className="chat-messages">
              {messages.map((msg, index) => (
                <div key={index} className={`chat-bubble ${msg.type}`}>
                  {msg.text}
                </div>
              ))}
              {/* Auto-scroll target */}
              <div ref={chatEndRef} />
            </div>
          </div>

          {currentChat && (
            <div className="edit-chat-name">
              <input
                type="text"
                value={currentChat.title}
                onChange={(e) => handleChatNameChange(e.target.value)}
              />
            </div>
          )}

          <div className="chat-input">
            <input
              type="text"
              placeholder="Type a message..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && sendMessage()}
            />
            <button onClick={sendMessage}><FaArrowUp /></button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatBot;
