import { useEffect, useState } from "react";
import AceEditor from "react-ace";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, useParams } from "react-router-dom";
import { generateColor } from "../utils";

import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/mode-typescript";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/mode-java";
import "ace-builds/src-noconflict/mode-yaml";
import "ace-builds/src-noconflict/mode-golang";
import "ace-builds/src-noconflict/mode-c_cpp";
import "ace-builds/src-noconflict/mode-html";
import "ace-builds/src-noconflict/mode-css";

import "ace-builds/src-noconflict/keybinding-emacs";
import "ace-builds/src-noconflict/keybinding-vim";

import "ace-builds/src-noconflict/theme-monokai";
import "ace-builds/src-noconflict/ext-language_tools";
import "ace-builds/src-noconflict/ext-searchbox";

export default function Room({ socket }) {
  const navigate = useNavigate();
  const { roomId } = useParams();
  const [fetchedUsers, setFetchedUsers] = useState(() => []);
  const [fetchedCode, setFetchedCode] = useState(() => "");
  const [language, setLanguage] = useState(() => "javascript");
  const [codeKeybinding, setCodeKeybinding] = useState(() => undefined);

  function downloadTextFile(text, fileName) {
    // Create a Blob with the text content
    const blob = new Blob([text], { type: "text/plain" });

    // Create a link element
    const link = document.createElement("a");

    // Set the download attribute and create a URL for the Blob
    link.download = fileName;
    link.href = window.URL.createObjectURL(blob);

    // Append the link to the document
    document.body.appendChild(link);

    // Trigger a click event on the link to start the download after a short delay
    setTimeout(() => {
      link.click();

      // Remove the link from the document after the download
      document.body.removeChild(link);
    }, 100);
  }

  const handledownload = () => {
    const fileName = prompt("Enter the Filename:");
    downloadTextFile(fetchedCode, fileName);
  };

  const languagesAvailable = [
    "javascript",
    "java",
    "c_cpp",
    "python",
    "typescript",
    "golang",
    "yaml",
    "html",
  ];
  const codeKeybindingsAvailable = ["default", "emacs", "vim"];

  function onChange(newValue) {
    setFetchedCode(newValue);
    socket.emit("update code", { roomId, code: newValue });
    socket.emit("syncing the code", { roomId: roomId });
  }

  function handleLanguageChange(e) {
    setLanguage(e.target.value);
    socket.emit("update language", { roomId, languageUsed: e.target.value });
    socket.emit("syncing the language", { roomId: roomId });
  }

  function handleCodeKeybindingChange(e) {
    setCodeKeybinding(
      e.target.value === "default" ? undefined : e.target.value
    );
  }

  function handleLeave() {
    socket.disconnect();
    !socket.connected && navigate("/", { replace: true, state: {} });
  }

  function copyToClipboard(text) {
    try {
      navigator.clipboard.writeText(text);
      toast.success("Room ID copied");
    } catch (exp) {
      console.error(exp);
      toast.error("Failed to copy from clipboard");
    }
  }

  useEffect(() => {
    socket.on("updating client list", ({ userslist }) => {
      setFetchedUsers(userslist);
    });

    socket.on("on language change", ({ languageUsed }) => {
      setLanguage(languageUsed);
    });

    socket.on("on code change", ({ code }) => {
      setFetchedCode(code);
    });

    socket.on("new member joined", ({ username }) => {
      toast(`${username} joined`);
    });

    socket.on("member left", ({ username }) => {
      toast(`${username} left`);
    });

    const backButtonEventListner = window.addEventListener(
      "popstate",
      function (e) {
        const eventStateObj = e.state;
        if (!("usr" in eventStateObj) || !("username" in eventStateObj.usr)) {
          socket.disconnect();
        }
      }
    );

    return () => {
      window.removeEventListener("popstate", backButtonEventListner);
    };
  }, [socket]);

  return (
    <div className="bg-slate-200 ">
      <div className="room  w-4/5 mx-auto h-full">
        <h3 className="text-center text-xl text-red-800 p-2 ">
          Welcome to CodeClub
        </h3>
        <div className="roomSidebar">
          <div className="roomSidebarUsersWrapper">
            <div className="flex justify-evenly mt-3 mb-3">
              <div className="flex  flex-col md:flex-row ">
                <h3>Language : </h3>
                <select
                  className="languageField"
                  name="language"
                  id="language"
                  value={language}
                  onChange={handleLanguageChange}
                >
                  {languagesAvailable.map((eachLanguage) => (
                    <option key={eachLanguage} value={eachLanguage}>
                      {eachLanguage}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col md:flex-row">
                <h3>KeyBinding:</h3>
                <select
                  className="languageField"
                  name="codeKeybinding"
                  id="codeKeybinding"
                  value={codeKeybinding}
                  onChange={handleCodeKeybindingChange}
                >
                  {codeKeybindingsAvailable.map((eachKeybinding) => (
                    <option key={eachKeybinding} value={eachKeybinding}>
                      {eachKeybinding}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex items-center flex-col mb-5 mt-3">
              <p className="text-xl text-zinc-800">Connected Users:</p>
              <div className="roomSidebarUsers flex items-center">
                {fetchedUsers.map((each) => (
                  <div key={each} className="roomSidebarUsersEach">
                    <div
                      className="w-10 h-10 rounded-full m-2 flex items-center justify-center text-lg "
                      style={{ backgroundColor: `${generateColor(each)}` }}
                    >
                      {each.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="roomSidebarUsersEachName text-green-600">
                      {each.toUpperCase()}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-evenly flex-col md:flex-row">
            <button
              className="text-white bg-gradient-to-br from-purple-600 to-blue-500 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
              onClick={() => {
                copyToClipboard(roomId);
              }}
            >
              Copy Room id
            </button>
            <button
              className="text-white bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-pink-200 dark:focus:ring-pink-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
              onClick={() => {
                handleLeave();
              }}
            >
              Leave
            </button>
            <button
              className="text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:bg-gradient-to-l focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
              onClick={handledownload}
            >
              Download Code
            </button>
          </div>
        </div>

        <div className=" w-4/5 mx-auto  mt-5 pb-5">
          <AceEditor
            placeholder="Write your code here."
            className=""
            mode={language}
            keyboardHandler={codeKeybinding}
            theme="monokai"
            name="collabEditor"
            value={fetchedCode}
            width="700px"
            onChange={onChange}
            fontSize={15}
            showPrintMargin={true}
            showGutter={true}
            highlightActiveLine={true}
            enableLiveAutocompletion={true}
            enableBasicAutocompletion={false}
            enableSnippets={false}
            wrapEnabled={true}
            tabSize={2}
            editorProps={{
              $blockScrolling: true,
            }}
          />
        </div>
      </div>
    </div>
  );
}
