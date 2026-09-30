const appWindow = document.getElementById("appScreen");
const appTitle = document.getElementById("appTitle");
const appContent = document.getElementById("appContent");
let currentApp = "home";
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
    photos: [
    {
        id: 1,
        name: "IMG_1001.jpg",
        date: "September 28, 2026",
        time: "4:32 PM",
        location: "Karachi",
        image: "https://picsum.photos/id/1015/600/600"
    },
    {
        id: 2,
        name: "IMG_1002.jpg",
        date: "September 28, 2026",
        time: "5:18 PM",
        location: "Karachi",
        image: "https://picsum.photos/id/1011/600/600"
    },
    {
        id: 3,
        name: "IMG_1003.jpg",
        date: "September 29, 2026",
        time: "12:47 PM",
        location: "Karachi",
        image: "https://picsum.photos/id/1025/600/600"
    },
    {
        id: 4,
        name: "IMG_1004.jpg",
        date: "September 29, 2026",
        time: "7:03 PM",
        location: "Karachi",
        image: "https://picsum.photos/id/1035/600/600"
    },
    {
        id: 5,
        name: "IMG_1005.jpg",
        date: "September 30, 2026",
        time: "10:21 AM",
        location: "Karachi",
        image: "https://picsum.photos/id/1043/600/600"
    },
    {
        id: 6,
        name: "IMG_1006.jpg",
        date: "September 30, 2026",
        time: "3:45 PM",
        location: "Karachi",
        image: "https://picsum.photos/id/106/600/600"
    }
],
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
    currentApp = app;
    appScreen.classList.remove("hidden");
    if (app === "messages") {
        openMessages();
        return;
    }
    if (app === "gallery") {
        openGallery();
        return;
    }
    appTitle.textContent = getAppName(app);
    appContent.innerHTML = `
        <h3>${getAppName(app)}</h3>
        <p>This app is currently empty.</p>
    `;
}
function closeApp() {
    currentApp = "home";
    appScreen.classList.add("hidden");
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
function updateClock() {
    const now = new Date();
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours || 12;
    document.getElementById("time").textContent =
        `${hours}:${minutes} ${ampm}`;
}
function goHome() {
    appScreen.classList.add("hidden");
}
function goBack() {
    appScreen.classList.add("hidden");
}
function openGallery() {
    appTitle.textContent = "Gallery";
    let html = `
        <div class="gallery">
    `;
    phoneState.photos.forEach(function(photo) {
        html += `
            <div
                class="photo"
                onclick="openPhoto(${photo.id})"
            >
                <img
                    src="${photo.image}"
                    alt="${photo.name}"
                >
            </div>
        `;
    });
    html += `
        </div>
    `;
    appContent.innerHTML = html;
}
function openPhoto(id) {
    const photo = phoneState.photos.find(function(photo) {
        return photo.id === id;
    });
    appTitle.textContent = photo.name;
    appContent.innerHTML = `
        <div class="photo-viewer">
            <img
                src="${photo.image}"
                alt="${photo.name}"
            >
            <div class="photo-details">
                <strong>${photo.name}</strong>
                <p>${photo.date}</p>
                <p>${photo.time}</p>
                <p>📍 ${photo.location}</p>
            </div>
        </div>
    `;
}
updateClock();
setInterval(updateClock, 1000);
loadPhone();