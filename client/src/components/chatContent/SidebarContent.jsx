import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import io from "socket.io-client";
import GroupCreator from "./GroupCreater";
const socket = io("http://localhost:5000", { withCredentials: true });

const SidebarContentWithNav = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [loggedProfile, setLoggedProfile] = useState({ name: "", id: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [profileid, setprofileid] = useState(null);
  const [group, setgroup] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchgroupData = async () => {
      try {
        const response = await axios.get(
          "http://localhost:5000/auth/user/getgroup",
          {
            withCredentials: true,
          }
        );
        console.log("api ahs been succesfgul");
        console.log(JSON.stringify(response.data.groups, null, 2)); // Show groups in a readable format
        setgroup(response.data.groups);
      } catch (err) {
        setError("Failed to fetch group.");
      } finally {
        setLoading(false);
      }
    };
    fetchgroupData();
  }, []);

  useEffect(() => {
    return () => {};
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:5000/auth/user/getAllUser",
          {
            withCredentials: true,
          }
        );
        socket.emit("register", data.userid);
        console.log("before socket status emit");
        socket.emit("status", data.userid);
        console.log("after socket status emit");

        setUsers(data.users);
        setLoggedProfile({ name: data.name, id: data.userid });
        setprofileid(data.userid);
      } catch (err) {
        setError("Failed to fetch users.");
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);

  const fetchMessages = async (userId, profileid) => {
    try {
      console.log("came into tje pmessage");
      console.log(userId, profileid);
      const { data } = await axios.get(
        `http://localhost:5000/auth/user/messages/${userId}/${profileid}`,
        { withCredentials: true }
      );
      setMessages(data.messages);
    } catch (err) {
      setError("Failed to fetch messages.");
    } finally {
      setLoading(false);
    }
  };

  // Handle User Selection
  const handleUserClick = (user) => {
    setSelectedUser(user);
    fetchMessages(user._id, profileid);
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;
    const messageData = {
      senderID: loggedProfile.id,
      receiverID: selectedUser._id,
      messageContent: newMessage,
      timestamp: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, messageData]);
    socket.emit("send_message", messageData);
    setNewMessage("");

    try {
      await axios.post(
        "http://localhost:5000/auth/messages/send",
        messageData,
        {
          withCredentials: true,
        }
      );
    } catch (err) {
      console.error("Message sending failed", err);
    }
  };

  useEffect(() => {
    const handleStatusUpdate = async (userID, isOnline) => {
      console.log(" the Other logged in user is " + userID);

      const response = await axios.get(
        "http://localhost:5000/auth/user/status",
        userID,
        { withCredentials: true }
      );
      console.log(
        "wojed for emitting status asslifhahflahfhsalfgaklsfhglsbvfsjo;haigvdukshlfopadhivbj"
      );
      console.log(response.status);
    };

    socket.on("statusUpdate", handleStatusUpdate);

    return () => {
      socket.off("statusUpdate", handleStatusUpdate);
    };
  }, []);

  useEffect(() => {
    const handleMessageReceive = (message) => {
      console.log("Socket is working", message);

      setMessages((prev) => [...prev, message]);
    };

    socket.on("receive_message", handleMessageReceive);

    return () => {
      // socket.off("receive_message", handleMessageReceive);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:5000/auth/user/logout",
        {},
        { withCredentials: true }
      );
      navigate("/login");
    } catch (err) {
      console.error("Logout failed", err);
      navigate("/login");
    }
  };

  // Filtered Users
  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <aside className="w-72 bg-white shadow-md flex flex-col">
        <header className="p-4 border-b">
          <div className="flex items-center space-x-3">
            <div className=" ">
              <div className="w-12 h-12 bg-green-500 text-white flex items-center justify-center rounded-full font-bold">
                {loggedProfile.name.charAt(0).toUpperCase()}
              </div>
            </div>

            <div>
              <h1 className="text-lg font-bold">{loggedProfile.name}</h1>
              <p className="text-sm text-gray-500">Online</p>
            </div>
          </div>
          <input
            type="text"
            placeholder="Search users"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="mt-4 w-full px-3 py-2 border rounded-lg focus:ring focus:ring-green-300"
          />

          <GroupCreator users={users} />
        </header>
        <h1 className="font-bold">Chats</h1>

        <ul className="flex-1 overflow-y-auto">
          {loading ? (
            <li className="text-center py-4 text-gray-500">Loading...</li>
          ) : error ? (
            <li className="text-center py-4 text-red-500">{error}</li>
          ) : (
            filteredUsers.map((user) => (
              <li
                key={user._id}
                onClick={() => handleUserClick(user)}
                className={`p-4 cursor-pointer flex items-center space-x-3 hover:bg-gray-100 ${
                  selectedUser?._id === user._id ? "bg-green-50" : ""
                }`}
              >
                <div>
                  {user.isOnline ? (
                    <div className="flex items-center justify-center gap-6">
                      <div className="w-10 h-10 bg-green-200 text-black flex items-center justify-center rounded-full border-4 shadow-xl   border-green-800">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <p>{user.name}</p>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-6">
                      <div className="w-10 h-10 bg-white text-black  border-2 border-black flex items-center justify-center rounded-full">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <span>{user.name}</span>
                    </div>
                  )}
                </div>
              </li>
            ))
          )}
          <h1 className="font-bold">Groups</h1>
          {loading ? (
            <li className="text-center py-4 text-gray-500">Loading...</li> // Display loading message
          ) : error ? (
            <li className="text-center py-4 text-red-500">{error}</li> // Display error message
          ) : (
            // Render groups when data is available
            group.map((group) => (
              <li
                key={group._id} // Unique key for each group
                className="p-4 cursor-pointer flex items-center space-x-3 hover:bg-gray-100"
              >
                <div className="w-10 h-10 bg-gray-300 text-white flex items-center justify-center rounded-full">
                  {group.name.charAt(0).toUpperCase()}{" "}
                  {/* Display first letter of the group name */}
                </div>
                <span>{group.name}</span> {/* Display group name */}
              </li>
            ))
          )}
        </ul>

        <button
          onClick={handleLogout}
          className="w-full py-3 bg-red-500 text-white hover:bg-red-600"
        >
          Logout
        </button>
      </aside>

      {/* Chat Section */}
      <main className="flex-1 flex flex-col">
        <header className="bg-green-600 text-white p-4">
          {selectedUser ? (
            <h2 className="text-xl font-semibold">{selectedUser.name}</h2>
          ) : (
            <h2 className="text-lg text-gray-200">
              Select a user to start chatting
            </h2>
          )}
        </header>

        <section className="flex-1 overflow-y-auto p-4 space-y-4">
          {selectedUser && messages.length > 0 ? (
            messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${
                  msg.senderID === loggedProfile.id
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`max-w-md p-3 rounded-lg shadow-sm ${
                    msg.senderID === loggedProfile.id
                      ? "bg-green-500 text-white"
                      : "bg-gray-200 text-black"
                  }`}
                >
                  {msg.messageContent}
                </div>
              </div>
            ))
          ) : (
            <p className="text-center text-gray-400">
              No messages yet. Start the conversation!
            </p>
          )}
        </section>

        {selectedUser && (
          <footer className="p-4 border-t">
            <div className="flex items-center">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder="Type a message"
                className="flex-1 px-4 py-2 border rounded-lg focus:ring focus:ring-green-300"
              />
              <button
                onClick={handleSendMessage}
                className="ml-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
              >
                Send
              </button>
            </div>
          </footer>
        )}
      </main>
    </div>
  );
};

export default SidebarContentWithNav;
