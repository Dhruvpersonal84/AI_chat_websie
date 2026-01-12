import { createContext, useState } from "react";

export const MyContext = createContext();

export function MyProvider({ children }) {
  const [prevChats, setPrevChats] = useState([]);
  const [reply, setReply] = useState(null);
  const [newChat, setNewChat] = useState(false);

  const sendMessage = async (message, threadId) => {
    // show user message + generating immediately
    setPrevChats(prev => [
      ...prev,
      { role: "user", content: message },
      { role: "assistant", content: "Generating..." }
    ]);

    const res = await fetch("https://ai-chat-websie.onrender.com/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message, threadId })
    });

    const data = await res.json();

    // replace "Generating..." with real reply
    setPrevChats(prev => {
      const updated = [...prev];
      updated[updated.length - 1] = {
        role: "assistant",
        content: data.reply
      };
      return updated;
    });

    setReply(data.reply);
  };

  return (
    <MyContext.Provider
      value={{
        newChat,
        prevChats,
        reply,
        sendMessage
      }}
    >
      {children}
    </MyContext.Provider>
  );
}
