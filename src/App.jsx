import { useState } from "react";
import io from "socket.io-client";
import Chat from "./components/Chat";

const socket = io.connect("https://harb-chat.herokuapp.com/", {
  withCredentials: true,
  extraHeaders: {
    "my-custom-header": "abcd",
  },
});

function App() {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [message, setMessage] = useState("");
  const [showChat, setShowChat] = useState(false);
  const setUsenameHandler = (e) => {
    setUsername(e.target.value);
  }

  const setRoomHandler = (e) => {
    setRoom(e.target.value);
  };
  const joinRoom = () => {
    console.log(username + " Just joined " + room);
    if (username === "" && room === "") {
      setMessage("No username or room found");
      return;
    }
    socket.emit("join_room", room);
    setMessage("You have joined " + room);
    setShowChat(!showChat);
  };
  return (
    <div className="container mx-auto">
      <h1 className="text-4xl text-center text-indigo-700 mb-2">
        Chat Application
      </h1>
      {!showChat ? (
        <div className="p-2 lg:w-1/2 sm:w-full mx-auto flex flex-col items-center justify-center space-y-8 bg-indigo-500">
          <h3 className="text-lg">Join Chat</h3>
          <div className="py-2 px-5 text-blue-800 bg-blue-200 border-blue-800">
            {message === "" ? `Hi, ${username} you are welcome` : message}
          </div>
          <input
            type="text"
            placeholder="Scott..."
            className="p-2 border rounded shadow-sm w-auto sm:w-full"
            onChange={setUsenameHandler}
          />
          <input
            type="text"
            placeholder="Jane..."
            value={room}
            className="p-2 border rounded shadow-sm w-auto sm:w-full"
            onChange={setRoomHandler}
          />
          <button
            className="p-2 rounded bg-yellow-500 hover:bg-yellow-600"
            onClick={joinRoom}
          >
            Join A Room
          </button>
        </div>
      ) : (
        <Chat socket={socket} username={username} room={room} />
      )}
    </div>
  );
}

export default App;
