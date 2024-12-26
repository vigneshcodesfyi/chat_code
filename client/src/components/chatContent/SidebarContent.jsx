import axios from "axios";
import React, { useEffect, useState, useContext } from "react";
import { UserContext } from "../../UserContext";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";

const SidebarContentWithNav = () => {
  const [userData, setUserData] = useState([]);
  const [error, setError] = useState(null);
  const [clickedIndex, setClickedIndex] = useState(null);
  const { selectedUser, setSelectedUser } = useContext(UserContext);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [loggedprofile, setloggedprofile] = useState("");
  const [loggedprofileid, setloggedprofileid] = useState("");
  const [loading, setLoading] = useState(true);
  const socket = io("http://localhost:5000", { withCredentials: true });
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/auth/user/logout",
        {},
        { withCredentials: true }
      );
      if (res.status === 200) {
        navigate("/login");
      }
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/auth/user/getAllUser",
          { withCredentials: true }
        );
        if (Array.isArray(res.data.users)) {
          setUserData(res.data.users);
          setloggedprofile(res.data.name);
          setloggedprofileid(res.data.userid);
        } else {
          throw new Error("Invalid data structure");
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleClick = (user, index, loggedprofileid) => {
    setSelectedUser({ name: user.name, id: user._id });
    setClickedIndex(index);
    fetchMessages(user._id, loggedprofileid);
  };

  const fetchMessages = async (userID, loggedprofileid) => {
    console.log("CAme");
    console.log(userID);
    console.log(loggedprofileid);

    setLoading(true);
    try {
      const res = await axios.get(
        `http://localhost:5000/auth/user/messages/${userID}${loggedprofileid}`,
        { withCredentials: true }
      );
      setMessages(res.data.messages);
      console.log(res.data.messages);
    } catch (error) {
      setError("Error fetching messages.");
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    // Event listener for receiving messages
    socket.on("receive_message", (message) => {
      if (
        (message.senderID === selectedUser.id &&
          message.receiverID === loggedprofileid) ||
        (message.senderID === loggedprofileid &&
          message.receiverID === selectedUser.id)
      ) {
        setMessages((prevMessages) => [...prevMessages, message]);
      }
    });

    // Cleanup on component unmount
    return () => {
      socket.disconnect();
    };
  }, [selectedUser, loggedprofileid]);
  const handleSendMessage = async () => {
    if (newMessage.trim()) {
      const newMessageData = {
        senderID: loggedprofileid,
        receiverID: selectedUser.id,
        messageContent: newMessage,
        timestamp: new Date().toISOString(),
      };

      setMessages((prevMessages) => [...prevMessages, newMessageData]);
      socket.emit("send_message", newMessageData);

      try {
        await axios.post(
          "http://localhost:5000/auth/messages/send",
          newMessageData,
          { withCredentials: true }
        );
      } catch (error) {
        console.error("Error sending message:", error);
      }

      setNewMessage("");
    }
  };

  const filteredUsers = userData.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-[#f0f2f5]">
      <div className="w-72 bg-white shadow-lg flex flex-col">
        <div className="p-4 border-b border-gray-300">
          <div className="flex items-center mb-4">
            <div className="rounded-full w-12 h-12 bg-[#128C7E] text-white flex items-center justify-center font-semibold"></div>
            <div className="ml-4">
              <p className="text-lg font-bold">{loggedprofile}</p>
              <p className="text-sm text-gray-500">Online</p>
            </div>
          </div>

          <div className="flex mb-4">
            <button className="flex-1 text-center py-2 font-medium border-b-2 border-[#128C7E]">
              All
            </button>
            <button className="flex-1 text-center py-2 font-medium">
              Personal
            </button>
            <button className="flex-1 text-center py-2 font-medium">
              Groups
            </button>
          </div>

          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#25D366]"
          />
        </div>

        <div className="flex-1 overflow-y-auto mt-4">
          {loading ? (
            <p className="text-center text-gray-400">Loading...</p>
          ) : error ? (
            <p className="text-center text-red-300">{`Error: ${error}`}</p>
          ) : (
            filteredUsers.map((user, index) => (
              <button
                key={index}
                onClick={() => handleClick(user, index)}
                className={`flex items-center space-x-4 p-4 w-full hover:bg-[#d6d9d7] ${
                  clickedIndex === index ? "bg-[#315551]" : "bg-[#ffffff]"
                } transition duration-200 ease-in-out`}
              >
                <div className="rounded-full w-12 h-12 bg-[#a6b5b4] text-white flex items-center justify-center font-semibold">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <span className="text-[#128C7E] font-medium">
                    {user.name}
                  </span>
                </div>
              </button>
            ))
          )}
        </div>

        <button
          className="w-full p-3 text-white bg-red-500 hover:bg-red-600 mt-auto"
          onClick={handleLogout}
        >
          Logout
        </button>
      </div>

      <div className="flex-1 bg-white flex flex-col">
        <div className="bg-[#075E54] text-white p-4">
          {selectedUser ? (
            <h2 className="text-2xl font-semibold">{selectedUser.name}</h2>
          ) : (
            <h2 className="text-lg text-gray-300">Select a user to chat</h2>
          )}
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {loading ? (
            <div className="text-center">Loading...</div>
          ) : selectedUser ? (
            messages.length > 0 ? (
              messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${
                    msg.senderID === loggedprofileid
                      ? "justify-end"
                      : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[70%] p-3 rounded-lg shadow-sm ${
                      msg.senderID === loggedprofileid
                        ? "bg-[#25D366] text-white"
                        : "bg-[#ECE5DD] text-black"
                    }`}
                  >
                    <span>{msg.messageContent}</span>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-400">
                No messages to display. Start a conversation.
              </p>
            )
          ) : (
            <p className="text-center text-gray-400">
              No messages to display. Select a user to start chatting.
            </p>
          )}
        </div>

        {selectedUser && (
          <div className="flex items-center p-4 border-t border-gray-200">
            <input
              type="text"
              placeholder="Type a message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="flex-1 px-4 py-2 rounded-lg border border-gray-300 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#25D366]"
            />
            <button
              onClick={handleSendMessage}
              className="p-3 ml-3 bg-[#25D366] text-white rounded-full hover:bg-[#128C7E] transition duration-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                width="24"
                height="24"
              >
                <path fill="currentColor" d="M3 12l18-9v6l-14 7 14 7v6z" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SidebarContentWithNav;
