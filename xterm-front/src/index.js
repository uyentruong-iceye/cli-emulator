import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'xterm/css/xterm.css';
import App from './App';
import {Terminal} from 'xterm';
import io from 'socket.io-client';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

var term = new Terminal({cursorBlink: true});
term.open(document.getElementById("root"));
term.write(" $ ");

const serverAddress = "http://localhost:8080";
const socket = io(serverAddress);
var curr_line = "";
var entries = [];

term.prompt = () => {
  if (curr_line) {
    let data = { method: "command", command: curr_line };
    socket.emit("input", JSON.stringify(data));
  }
};
term.prompt();

// // Receive data from socket
socket.on("input-response", function(data) {
  term.write(data)
  curr_line = ""
  term.write("\r\n $ ")
})

term.onKey(function(key, ev) {
  //console.log(key, ev);
  if (key.domEvent.key === "Enter") {
    console.log("Got Enter");
    if (curr_line) {
      entries.push(curr_line);
      term.write("\r\n");
      term.prompt();
    }
  } else if (key.domEvent.key === "Backspace") {
    console.log("Got Backspace");
    if (curr_line) {
      curr_line = curr_line.slice(0, curr_line.length - 1);
      term.write("\b \b");
    }
  } else {
    curr_line += key.key;
    term.write(key.key);
  }
});

// // paste value
// term.onPaste(function(data) {
//   curr_line += data;
//   term.write(data);
// });