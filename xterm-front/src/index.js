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

var term = new Terminal();
term.open(document.getElementById('root'));
term.write('Hello from \x1B[1;3;31mxterm.js\x1B[0m $ ');

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
  const output = `${data}\n`
  term.write(output)
})

term.onKey(function(key, ev) {
  console.log("on key", key, ev)
  //Enter
  if (key.domEvent.keyCode === 13) {
    if (curr_line) {
      entries.push(curr_line);
      term.write("\r\n");
      term.prompt();
    }
  } else if (key.domEvent.keyCode === 8) {
    // Backspace
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