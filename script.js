const appWindow = document.getElementById("appWindow");
const appTitle = document.getElementById("appTitle");
const appContent = document.getElementById("appContent");

let phoneState = {
    messages: {
        sarah: [
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
        ],
        ali: [
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
    },
    contacts: [
        {
            id: "sarah",
            name: "Sarah",
            phone: "0300-1234567"
        },
        {
            id: "ali",
            name: "Ali",
            phone: "0312-7654321"
        }
    ],
    photos: [],
    browserHistory: [],
    notes: [],
    locations: [],
    story: {
        chapter: 1,
        events: []
    }
};
function savePhone() {
    localStorage.setItem(
        "phoneState",
        JSON.stringify(phoneState)
    );
}
function loadPhone() {
    const savedPhone = localStorage.getItem("phoneState");
    if (savedPhone) {
        phoneState = JSON.parse(savedPhone);
    }
}
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
function openMessages() {
    appTitle.textContent = "Messages";
    let html = "";
    phoneState.contacts.forEach(function(contact) {
        const messages = phoneState.messages[contact.id];
        const lastMessage = messages[messages.length - 1];
        html += `
            <div class="conversation"
                 onclick="openConversation('${contact.id}')">
                <div class="conversation-avatar">
                    ${contact.name.charAt(0)}
                </div>
                <div class="conversation-info">
                    <div class="conversation-top">
                        <strong>${contact.name}</strong>
                        <span>${lastMessage.time}</span>
                    </div>
                    <p>${lastMessage.text}</p>
                </div>
            </div>
        `;
    });
    appContent.innerHTML = html;
}
function openConversation(id) {
    const contact = phoneState.contacts.find(function(contact) {
        return contact.id === id;
    });
    const messages = phoneState.messages[id];
    appTitle.textContent = contact.name;
    let html = `
        <div class="chat">
    `;
    messages.forEach(function(message) {
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
            <button onclick="sendMessage('${id}')">
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
    phoneState.messages[id].push({
        sender: "me",
        text: text,
        time: "now"
    });
    savePhone();
    openConversation(id);
}
loadPhone();