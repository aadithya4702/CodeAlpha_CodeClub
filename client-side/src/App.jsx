import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Landingpage from "./Pages/Landingpage";
import "./App.css";
import CreateRoom from "./Pages/CreateRoom";
import Room from "./Pages/Room";
import SocketWrapper from "../src/Components/SocketWrapper";

function App() {
  return (
    <>
      <ToastContainer />
      <Router>
        <Routes>
          <Route path="/" element={<Landingpage />} />
          <Route path="/auth" element={<CreateRoom />} />
          <Route
            path="/room/:roomId"
            element={
              <SocketWrapper>
                <Room />
              </SocketWrapper>
            }
          />
        </Routes>
      </Router>
    </>
  );
}

export default App;
