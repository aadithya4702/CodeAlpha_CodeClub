import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import Typed from "typed.js";

const Landingpage = () => {
  useEffect(() => {
    const options = {
      strings: [
        "CodeClub: Unleashing Collective Genius, One Line at a Time!",
        "Collaborate, Create, Code: CodeClub, Where Innovation Thrives!",
        "Code Together, Dream Big: CodeClub, Your Gateway to Collaborative Excellence!",
      ],
      typeSpeed: 50, // typing speed in milliseconds
      backSpeed: 3,
    };

    const typed = new Typed(".typed-text", options);

    return () => {
      // Check if the destroy method exists before calling it
      if (typed && typeof typed.destroy === "function") {
        typed.destroy();
      }
    };
  }, []);

  return (
    <div className="bg-slate-200 h-screen">
      <div className="flex flex-col lg:flex-row h-full">
        <div className="w-full  bg-blue-950 p-6 lg:p-10 h-full text-white">
          <div className="logo">
            <h3 className="text-2xl lg:text-3xl tracking-wide custom_logo_font">
              CodeClub
            </h3>
          </div>
          <div className="flex items-center justify-center h-full flex-col gap-4">
            <h3 className="text-2xl lg:text-4xl text-red-600">
              Welcome to CodeClub.
            </h3>
            <div className="typed">
              <span className="typed-text text-base lg:text-xl"></span>
            </div>
            <div>
              <h3 className="text-2xl lg:text-3xl text-white mt-5 mb-3 lg:mb-5">
                Get Started
              </h3>
            </div>
            <div className="px-6 py-2 text-sm rounded shadow bg-red-600 hover:bg-slate-200 hover:text-red-600 text-white ">
              <Link to="/auth">
                <button className="button-50" role="button">
                  Log in / Sign up
                </button>
              </Link>
            </div>
            <div className=" mt-10    ">
              <div className="flex items-center justify-center">
                <h3 className="text-xl">CodeClub</h3>
              </div>
              <p className="ml-1 mt-1 text-xs">Copyrights &copy; reserved</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landingpage;
