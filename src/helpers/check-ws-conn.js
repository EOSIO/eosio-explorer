import { from } from 'rxjs';

const checkWebSocketConnection = (host) =>{
    return new Promise((resolve, reject) =>{
        let url = `ws://${host}:8080`;
        let socket = new WebSocket(url); 
        socket.onopen = function(e) {
            resolve("success");
        };
        socket.onerror = function(error) {
            reject("error");
        };
    })    
  }

  export default (host) => from(checkWebSocketConnection(host)).pipe()
