const socket = io();

const clientsNo = document.getElementById('number-of-clients');
const rightMsg = document.getElementById('message-right');
const leftMsg = document.getElementById('message-left');
const submitButton = document.getElementById('send-button');

const msgContainer = document.getElementById('message-container');
const nameInput = document.getElementById('name-input');
const msgform = document.getElementById('message-form');
const messageInput = document.getElementById('message-input');
const typingStatus = document.getElementById('message-feedback');


socket.on('changeNumberOfClients', (numberOfClients) => {
    clientsNo.innerHTML = numberOfClients;
});


msgform.addEventListener('submit', (e) => {
    e.preventDefault();
    if(messageInput.value)
        sendMessage();
});

function sendMessage() {
    const data = {
        message: messageInput.value,
        sender: nameInput.value,
        time: new Date() 
    };
    console.log('To me', data);
    socket.emit('message', data);
    addMessage(true, data);
    messageInput.value = '';

}

socket.on('send-msg', (data) => {
    console.log('To them', data);
    addMessage(false, data);
});

function addMessage(isMyOwnMsg, data) {
    const element = 
    `<li class="${isMyOwnMsg ? "message-left" : "message-right"}">
        <p class="message">
            ${data.message}
            <br>
            <span>${data.sender} • ${moment(data.time).fromNow()} </span>
        </p>
    </li>`;

    msgContainer.innerHTML += element;
    msgContainer.scrollTo(0, msgContainer.scrollHeight);
}

// Showing typing status
messageInput.addEventListener('keydown', () => {
    socket.emit('typing');
});

socket.on('show-typing-status', () => {
    typingStatus.style.color = '#000';
});

// Hide typing status
messageInput.addEventListener('keyup', () => {
    setTimeout(() => {
        socket.emit('stopped-typing');
    }, 2000); 
});

socket.on('hide-typing-status', () => {
    typingStatus.style.color = '#ebebee';
});