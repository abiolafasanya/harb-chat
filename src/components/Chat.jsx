import React, { useState, useEffect } from "react";
import { BiSend } from "react-icons/bi";

const Chat = ({ socket, username, room }) => {
  const [currentMessage, setCurrentMessage] = useState("");
  const [msgList, setMsgList] = useState([]);

  const sendMessage = () => {
    console.log("message sent");
    if (currentMessage !== "") {
      const messageData = {
        room: room,
        sender: username,
        currentMessage,
        time:
          new Date(Date.now()).getHours() +
          ":" +
          new Date(Date.now()).getMinutes(),
      };
      setMsgList((list) => [...list, messageData]);
      socket.emit("send_message", messageData);
      setCurrentMessage("");
    }
  };

  useEffect(() => {
    function getServerMsg(data) {
      setMsgList((list) => [...list, data]);
      console.log(data);
    }
    socket.on("message", getServerMsg);
    return () => socket.off("message", getServerMsg);
  }, [socket]);

  return (
    <div className={chatStyle}>
      <div className="bg-indigo-700 text-white px-2 w-full">Live Chat</div>
      <div className="w-full px-2">
        {msgList.map((msg, i) => (
          <p key={i}>{msg.currentMessage}</p>
        ))}
      </div>
      <hr />
      <div className="w-full flex justify-between items-center">
        <input
          type="text"
          className="lg:w-[95%] sm:w-full h-[2.5rem] outline-none border px-2 border-indigo-200"
          placeholder="type message"
          value={currentMessage}
          onChange={(e) => setCurrentMessage(e.target.value)}
          onKeyDown={(e) => {
            e.key === "Enter" && sendMessage();
          }}
        />
        <button
          onClick={sendMessage}
          className="border border-indigo-200 h-[2.5rem] sm:w-[10%] w-[5%]"
        >
          <BiSend className="text-3xl sm:text-[24px] md:ml-0 text-indigo-700" />
        </button>
      </div>
    </div>
  );
};

const chatStyle = `shadow-md container mx-auto sm:w-full lg:w-1/2 my-10 bg-white space-y-5 flex flex-col items-center justify-center`;
export default Chat;
