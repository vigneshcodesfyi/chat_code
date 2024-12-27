import React, { useState } from "react";
import axios from "axios";

const GroupCreator = ({ users }) => {
  const [groupName, setGroupName] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [showUsers, setShowUsers] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Toggle User Selection
  const toggleUserSelection = (user) => {
    setSelectedUsers((prevSelected) =>
      prevSelected.includes(user)
        ? prevSelected.filter((u) => u !== user)
        : [...prevSelected, user]
    );
  };

  // Handle Create Group
  const handleCreateGroup = async () => {
    if (!groupName) {
      setError("Group name is required");
      return;
    }

    if (selectedUsers.length === 0) {
      setError("Select at least one user to create a group.");
      return;
    }

    setSuccess(null);

    try {
      const response = await axios.post(
        "http://localhost:5000/auth/group/create",
        {
          name: groupName,
          members: selectedUsers.map((user) => user._id),
        },
        { withCredentials: true }
      );

      setSuccess("Group created successfully!");
      setTimeout(() => {
        setGroupName("");
        setSelectedUsers([]);
        setShowUsers(false);
        setSuccess(null);
      }, 2000);
    } catch (err) {
      setError("Failed to create group. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setGroupName("");
    setSelectedUsers([]);
    setShowUsers(false);
    setError(null);
    setSuccess(null);
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-xl border border-gray-200 space-y-6">
      {success ? (
        <div className="text-center text-green-500 font-semibold mb-4">
          {success}
        </div>
      ) : (
        <>
          {!showUsers ? (
            <button
              onClick={() => setShowUsers(true)}
              className="w-full py-3 rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
            >
              Create Group
            </button>
          ) : (
            <>
              <div className="mb-4">
                <input
                  type="text"
                  placeholder="Enter group name"
                  value={groupName}
                  onChange={(e) => setGroupName(e.target.value)}
                  className="border border-gray-300 rounded-lg p-4 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                />
              </div>

              <div className="mb-4">
                <h3 className="font-semibold text-gray-700 mb-2 text-lg">
                  Select Users
                </h3>
                <ul className="max-h-48 overflow-y-auto space-y-3">
                  {users.map((user) => (
                    <li key={user._id} className="flex items-center">
                      <label className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          checked={selectedUsers.includes(user)}
                          onChange={() => toggleUserSelection(user)}
                          className="w-5 h-5 text-blue-500 border-gray-300 rounded focus:ring-2 focus:ring-blue-500 transition duration-300"
                        />
                        <span className="text-gray-800 text-sm">
                          {user.name}
                        </span>
                      </label>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="flex space-x-4">
                <button
                  onClick={handleClose}
                  className="w-full py-3 rounded-lg text-white bg-gray-500 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 transition duration-300"
                >
                  Close
                </button>

                <button
                  onClick={handleCreateGroup}
                  disabled={loading}
                  className="w-full py-3 rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-300"
                >
                  {loading ? "Creating Group..." : "Create Group"}
                </button>
              </div>
            </>
          )}
        </>
      )}

      {error && <p className="text-red-500 text-center text-sm">{error}</p>}
    </div>
  );
};

export default GroupCreator;
