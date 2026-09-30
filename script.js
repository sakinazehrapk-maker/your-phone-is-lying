const appWindow = document.getElementById("appWindow");
const appTitle = document.getElementById("appTitle");
const appContent = document.getElementById("appContent");

function openApp(app) {
    appWindow.classList.remove("hidden");
    if (app === "messages") {
        openMessages();
        return;
    }
    appTitle.textContent = getAppName(app);
    appContent.innerHTML = `
        <h3>${getAppName(app)}</h3>
        <p>This app is currently empty.</p>
    `;
}
function closeApp() {
    appWindow.classList.add("hidden");
}
function getAppName(app) {
    const names = {
        messages: "Messages",
        camera: "Camera",
        calls: "Calls",
        browser: "Browser",
        notes: "Notes",
        maps: "Maps",
        gallery: "Gallery",
        settings: "Settings"
    };
    return names[app];
}
const conversations = [
    {
        id: "sarah",
        name: "Sarah",
        lastMessage: "Hey, are you coming?",
        time: "2:31 PM",
        messages: [
            {
                sender: "them",
                text: "Hey, are you coming?",
                time: "2:30 PM"
            },
            {
                sender: "me",
                text: "Yeah, probably.",
                time: "2:30 PM"
            },
            {
                sender: "them",
                text: "Okay, let me know.",
                time: "2:31 PM"
            }
        ]
    },
    {
        id: "ali",
        name: "Ali",
        lastMessage: "Did you finish it?",
        time: "1:12 PM",
        messages: [
            {
                sender: "them",
                text: "Did you finish it?",
                time: "1:10 PM"
            },
            {
                sender: "me",
                text: "Not yet.",
                time: "1:12 PM"
            }
        ]
    }
];
function openMessages() {
    appTitle.textContent = "Messages";
    let html = "";
    conversations.forEach(function(conversation) {
        html += `
            <div class="conversation"
                 onclick="openConversation('${conversation.id}')">
                <div class="conversation-avatar">
                    ${conversation.name.charAt(0)}
                </div>
                <div class="conversation-info">
                    <div class="conversation-top">
                        <strong>${conversation.name}</strong>
                        <span>${conversation.time}</span>
                    </div>
                    <p>${conversation.lastMessage}</p>
                </div>
            </div>
        `;
    });
    appContent.innerHTML = html;
}
function openConversation(id) {
    const conversation = conversations.find(function(item) {
        return item.id === id;
    });
    appTitle.textContent = conversation.name;
    let html = `
        <div class="chat">
    `;
    conversation.messages.forEach(function(message) {
        html += `
            <div class="message-row ${message.sender}">
                <div class="message-bubble">
                    ${message.text}
                    <span class="message-time">
                        ${message.time}
                    </span>
                </div>
            </div>
        `;
    });
    html += `
        </div>
        <div class="message-input">
            <input
                id="messageInput"
                type="text"
                placeholder="Type a message..."
            >
            <button onclick="sendMessage('${conversation.id}')">
                Send
            </button>
        </div>
    `;
    appContent.innerHTML = html;
}
function sendMessage(id) {
    const input = document.getElementById("messageInput");
    const text = input.value.trim();
    if (text === "") {
        return;
    }
    const conversation = conversations.find(function(item) {
        return item.id === id;
    });
    conversation.messages.push({
        sender: "me",
        text: text,
        time: "now"
    });
    conversation.lastMessage = text;
    openConversation(id);
}