import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4, validate } from "uuid";
import Axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimesCircle } from "@fortawesome/free-solid-svg-icons";

const CreateRoom = () => {
  const [signup, setSignup] = useState(false);
  const navigate = useNavigate();
  const [roomId, setRoomId] = useState("");
  const [username, setUsername] = useState("");

  const toggleSignup = () => {
    setSignup(!signup);
    try {
      setRoomId(uuidv4());
      toast.success("RoomId created");
    } catch (exp) {
      console.error(exp);
    }
  };

  const handleRoomSubmit = (e) => {
    console.log(roomId, username);
    e.preventDefault();
    if (!validate(roomId)) {
      toast.error("Incorrect room ID");
      return;
    }
    username && navigate(`/room/${roomId}`, { state: { username } });
  };

  return (
    <div className="h-screen bg-slate-200 flex items-center justify-center flex-col">
      <div className="items-center justify-center flex flex-col gap-6 bg-slate-300 shadow-lg p-5 rounded">
        <h3 className="text-2xl text-black font-bold ">
          {signup ? "Create Room 😎" : "Join Room 👋"}
        </h3>

        <form
          action=""
          className="gap-5 flex flex-col"
          onSubmit={handleRoomSubmit}
        >
          <div className="relative mb-3 inputfield">
            <input
              type="text"
              name="name"
              value={username}
              required
              onChange={(e) => {
                setUsername(e.target.value);
              }}
              className="input"
            />
            <span>
              UserName<sup>*</sup>
            </span>
          </div>

          <div className="relative mb-3 inputfield">
            <input
              type="text"
              name="roomid"
              value={roomId}
              required
              onChange={(e) => {
                setRoomId(e.target.value);
              }}
              className="input"
            />
            <span>
              Room Id<sup>*</sup>
            </span>
          </div>

          <button
            className="px-6 py-2 text-sm rounded shadow bg-red-600 hover:bg-rose-200 hover:text-red-600 text-white"
            type="submit"
            role="button"
          >
            Join Room
          </button>
        </form>

        <p>
          {signup ? "Already have an roomid? " : "Don't have an roomid? "}
          <label
            className="text-red-600 hover:text-rose-400"
            onClick={toggleSignup}
          >
            {signup ? "Join room" : "Create room"}
          </label>
        </p>
      </div>
    </div>
  );
};

export default CreateRoom;
