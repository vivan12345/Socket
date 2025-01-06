let userEle = document.getElementsByClassName('total-users')[0];
let messageInput = document.getElementById('message-input');
let btn = document.getElementById('send-button');
let messageContainer = document.getElementById("message-container");
let nameInput = document.getElementById("name-input");

const messageTone = new Audio("./messagetone.mp3");
messageTone.playbackRate = 2;

let socketId = "";

messageInput.addEventListener("input", () => {
  if(messageInput.value.trim() === "") {
    btn.style.color = "gray";
  } else {
  btn.style.color = "black";
  }
})

let socket = io();

socket.on("total-users", (usersCount) => {
  userEle.innerText = `Total Client: ${usersCount}`;
});

let date = new Date();

socket.on("newMessage", (newMessage) => {
  messageContainer.innerHTML += `
  <li class="${newMessage.id === socketId ? "message-left" : "message-right"}">
        <p class="message">
          ${newMessage.message}
          <span>${newMessage.name} ° ${date.getHours()}:${date.getMinutes()}</span>
        </p>
      </li>
  `;
  if(socketId !== newMessage.id) messageTone.play();
})

btn.addEventListener('click', (e) => {
  e.preventDefault();
  let message = messageInput.value.trim();
  messageInput.value = "";
  
  if(messageInput.value === "") {
    btn.style.color = "gray";
  } else {
  btn.style.color = "black";
  }
  
  socket.emit("message", { name: nameInput.value , message, id: socketId});
})

socket.on("id", (socketI) => {
  socketId = socketI;
})

messageInput.addEventListener("focus", () => {
  let name = nameInput.value;
  console.log("focus");
  socket.emit("typing", {name, id: socketId});
});

messageInput.addEventListener("blur", () => {
  socket.emit("noTyping", socketId);
});

socket.on("typing", (obj) => {
  messageContainer.innerHTML += `
    <li class="message-feedback ${obj.id}">
        <p class="feedback">
          ${obj.name} is Typing a message
        </p>
    </li>
  `;
})


socket.on("noTyping", (id) => {
  document.querySelectorAll("li.message-feedback").forEach((ele) => {
    if(ele.className.includes(id)) {
      ele.parentNode.removeChild(ele);
    }
  })
})