const appScreen = document.getElementById("appScreen");
const appTitle = document.getElementById("appTitle");
const appContent = document.getElementById("appContent");
let currentApp = "home";
const STATE_VERSION = 2;
let backAction = null;
let currentMapQuery = "";
let draftNote = null;
let phoneState = {
    version: STATE_VERSION,
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
    calls: [
        {
            name: "Sarah",
            phone: "0300-1234567",
            type: "incoming",
            time: "Yesterday, 6:42 PM"
        },
        {
            name: "Ali",
            phone: "0312-7654321",
            type: "outgoing",
            time: "Yesterday, 3:18 PM"
        },
        {
            name: "Unknown",
            phone: "0301-9876543",
            type: "missed",
            time: "September 29, 11:47 PM"
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
    browserHistory: [
        {
            query: "weather Karachi",
            time: "9:14 AM"
        },
        {
            query: "easy pasta recipe",
            time: "11:42 AM"
        },
        {
            query: "javascript arrays",
            time: "3:08 PM"
        }
    ],
    notes: [
        {
            id: 1,
            title: "Things to do",
            content: "Buy groceries\nFinish my assignment\nCall Sarah",
            date: "September 29, 2026"
        },
        {
            id: 2,
            title: "Project ideas",
            content: "Build something with Arduino\nMaybe make a game",
            date: "September 30, 2026"
        }
    ],
    locations: [
        {
            id: 1,
            name: "Home",
            address: "Karachi",
            time: "Today, 8:15 AM"
        },
        {
            id: 2,
            name: "University",
            address: "Karachi",
            time: "Today, 9:30 AM"
        },
        {
            id: 3,
            name: "Coffee Shop",
            address: "Clifton, Karachi",
            time: "Yesterday, 5:42 PM"
        }
    ],
    story: {
        chapter: 1,
        flags: {
            openedMessages: false,
            openedGallery: false,
            openedBrowser: false,
            openedCalls: false,
            openedCamera: false,
            openedMaps: false,
            openedSettings: false,
            firstMessageReceived: false,
            strangePhotoFound: false,
            strangeSearchFound: false,
            strangeLocationFound: false,
            unknownCallerFound: false
        },
        events: []
    },
    settings: {
        wifi: true,
        wifiName: "Home Wi-Fi",
        bluetooth: false,
        notifications: true,
        darkMode: true,
        battery: 87
    }
};
function esc(value) {
    return String(value)
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#39;");
}
function savePhone() {
    try {
        localStorage.setItem(
            "phoneState",
            JSON.stringify(phoneState)
        );
    } catch (error) {
        console.warn("Could not save phone state:", error);
    }
}
function loadPhone() {
    try {
        const savedPhone = localStorage.getItem("phoneState");
        if (!savedPhone) {
            return;
        }
        const parsed = JSON.parse(savedPhone);
        // Old or incompatible save: throw it away and start fresh
        if (!parsed || parsed.version !== STATE_VERSION) {
            localStorage.removeItem("phoneState");
            return;
        }
        phoneState = parsed;
    } catch (error) {
        console.warn("Bad save data, starting fresh:", error);
        localStorage.removeItem("phoneState");
    }
}
function resetPhone() {
    localStorage.removeItem("phoneState");
    location.reload();
}
function updateStatusBar() {
    const statusIcons = document.querySelector(".status-bar div");
    if (!statusIcons) {
        return;
    }
    statusIcons.textContent =
        (phoneState.settings.wifi ? "📶 " : "") +
        "🔋 " + phoneState.settings.battery + "%";
}
function openApp(app) {
    currentApp = app;
    backAction = null;
    appScreen.classList.remove("hidden");
    if (app === "messages") {
        openMessages();
        return;
    }
    if (app === "gallery") {
        openGallery();
        return;
    }
    if (app === "browser") {
        openBrowser();
        return;
    }
    if (app === "notes") {
        openNotes();
        return;
    }
    if (app === "calls") {
        openCalls();
        return;
    }
    if (app === "camera") {
        openCamera();
        return;
    }
    if (app === "maps") {
        openMaps();
        return;
    }
    if (app === "settings") {
        openSettings();
        return;
    }
    appTitle.textContent = getAppName(app);
    appContent.innerHTML = `
        <h3>${getAppName(app)}</h3>
        <p>This app is currently empty.</p>
    `;
}
function closeApp() {
    if (backAction) {
        const action = backAction;
        backAction = null;
        action();
        return;
    }
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
    backAction = null;
    phoneState.story.flags.openedMessages = true;
    savePhone();
    appTitle.textContent = "Messages";
    let html = "";
    let contactsToShow = [...phoneState.contacts];
    if (
        phoneState.messages.you &&
        phoneState.story.flags.firstMessageReceived
    ) {
        contactsToShow.push({
            id: "you",
            name: "You",
            phone: ""
        });
    }
    contactsToShow.forEach(function(contact) {
        const messages = phoneState.messages[contact.id] || [];
        if (messages.length === 0) {
            return;
        }
        const lastMessage = messages[messages.length - 1];
        html += `
            <div class="conversation"
                 onclick="openConversation('${contact.id}')">
                <div class="conversation-avatar">
                    ${esc(contact.name.charAt(0))}
                </div>
                <div class="conversation-info">
                    <div class="conversation-top">
                        <strong>${esc(contact.name)}</strong>
                        <span>${esc(lastMessage.time)}</span>
                    </div>
                    <p>${esc(lastMessage.text)}</p>
                </div>
            </div>
        `;
    });
    appContent.innerHTML = html;
    checkStoryProgress();
}
function openConversation(id) {
    backAction = openMessages;
    let contact = phoneState.contacts.find(function(contact) {
        return contact.id === id;
    });
    if (id === "you") {
        contact = {
            id: "you",
            name: "You",
            phone: ""
        };
    }
    const messages = phoneState.messages[id] || [];
    appTitle.textContent = contact.name;
    let html = `
        <div class="chat">
    `;
    messages.forEach(function(message) {
        html += `
            <div class="message-row ${message.sender}">
                <div class="message-bubble">
                    ${esc(message.text)}
                    <span class="message-time">
                        ${esc(message.time)}
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
                onkeydown="handleMessageKey(event, '${id}')"
            >
            <button onclick="sendMessage('${id}')">
                Send
            </button>
        </div>
    `;
    appContent.innerHTML = html;
    appContent.scrollTop = appContent.scrollHeight;
}
function handleMessageKey(event, id) {
    if (event.key === "Enter") {
        sendMessage(id);
    }
}
function sendMessage(id) {
    const input = document.getElementById("messageInput");
    const text = input.value.trim();
    if (text === "") {
        return;
    }
    if (!phoneState.messages[id]) {
        phoneState.messages[id] = [];
    }
    phoneState.messages[id].push({
        sender: "me",
        text: text,
        time: getCurrentTime()
    });
    savePhone();
    openConversation(id);
    const newInput = document.getElementById("messageInput");
    if (newInput) {
        newInput.focus();
    }
}
function updateClock() {
    const timeElement = document.getElementById("time");
    if (!timeElement) {
        return;
    }
    const now = new Date();
    let hours = now.getHours();
    const minutes = String(now.getMinutes()).padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours || 12;
    timeElement.textContent =
        `${hours}:${minutes} ${ampm}`;
}
function goHome() {
    backAction = null;
    currentApp = "home";
    appScreen.classList.add("hidden");
}
function goBack() {
    if (appScreen.classList.contains("hidden")) {
        return;
    }
    closeApp();
}
function openGallery() {
    backAction = null;
    phoneState.story.flags.openedGallery = true;
    savePhone();
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
                    src="${esc(photo.image)}"
                    alt="${esc(photo.name)}"
                >
            </div>
        `;
    });
    html += `
        </div>
    `;
    appContent.innerHTML = html;
    checkStoryProgress();
}
function openPhoto(id) {
    backAction = openGallery;
    const photo = phoneState.photos.find(function(photo) {
        return photo.id === id;
    });
    if (!photo) {
        openGallery();
        return;
    }
    if (photo.strange && !phoneState.story.flags.strangePhotoFound) {
        phoneState.story.flags.strangePhotoFound = true;
        savePhone();
    }
    appTitle.textContent = photo.name;
    appContent.innerHTML = `
        <div class="photo-viewer">
            <img
                src="${esc(photo.image)}"
                alt="${esc(photo.name)}"
            >
            <div class="photo-details">
                <strong>${esc(photo.name)}</strong>
                <p>${esc(photo.date)}</p>
                <p>${esc(photo.time)}</p>
                <p>📍 ${esc(photo.location)}</p>
            </div>
        </div>
    `;
}
function openBrowser() {
    backAction = null;
    phoneState.story.flags.openedBrowser = true;
    savePhone();
    appTitle.textContent = "Browser";
    appContent.innerHTML = `
        <div class="browser">
            <div class="search-box">
                <input
                    id="searchInput"
                    type="text"
                    placeholder="Search the web..."
                    onkeydown="handleSearch(event)"
                >
                <button onclick="searchWeb()">
                    🔍
                </button>
            </div>
            <div class="browser-home">
                <div class="browser-logo">
                    🌐
                </div>
                <h2>Search</h2>
                <p>
                    Search the internet
                </p>
            </div>
            <button
                class="history-button"
                onclick="openBrowserHistory()"
            >
                View History
            </button>
        </div>
    `;
    checkStoryProgress();
}
function searchWeb() {
    const input = document.getElementById("searchInput");
    const query = input.value.trim();
    if (query === "") {
        return;
    }
    phoneState.browserHistory.push({
        query: query,
        time: getCurrentTime()
    });
    savePhone();
    showSearchResults(query);
}
function showSearchResults(query) {
    backAction = openBrowser;
    const safeQuery = esc(query);
    appTitle.textContent = "Search";
    appContent.innerHTML = `
        <div class="search-results">
            <div class="search-box">
                <input
                    id="searchInput"
                    type="text"
                    value="${safeQuery}"
                    onkeydown="handleSearch(event)"
                >
                <button onclick="searchWeb()">
                    🔍
                </button>
            </div>
            <div class="result">
                <small>example.com</small>
                <h3>
                    Search results for "${safeQuery}"
                </h3>
                <p>
                    These are simulated search results
                    inside the game.
                </p>
            </div>
            <div class="result">
                <small>information.net</small>
                <h3>
                    More information about ${safeQuery}
                </h3>
                <p>
                    This is another fake result.
                </p>
            </div>
            <div class="result">
                <small>web.example</small>
                <h3>
                    Everything you need to know
                </h3>
                <p>
                    Your search results appear here.
                </p>
            </div>
        </div>
    `;
}
function handleSearch(event) {
    if (event.key === "Enter") {
        searchWeb();
    }
}
function openBrowserHistory() {
    backAction = openBrowser;
    appTitle.textContent = "History";
    let html = `
        <div class="history">
            <h3>Today</h3>
    `;
    phoneState.browserHistory
        .slice()
        .reverse()
        .forEach(function(item) {
            if (item.strange && !phoneState.story.flags.strangeSearchFound) {
                phoneState.story.flags.strangeSearchFound = true;
                savePhone();
            }
            html += `
                <div class="history-item">
                    <div class="history-icon">
                        🌐
                    </div>
                    <div>
                        <strong>
                            ${esc(item.query)}
                        </strong>
                        <p>
                            ${esc(item.time)}
                        </p>
                    </div>
                </div>
            `;
        });
    html += `
        </div>
    `;
    appContent.innerHTML = html;
}
function getCurrentTime() {
    const now = new Date();
    let hours = now.getHours();
    const minutes = String(
        now.getMinutes()
    ).padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12;
    hours = hours || 12;
    return `${hours}:${minutes} ${ampm}`;
}
function openNotes() {
    backAction = null;
    draftNote = null;
    appTitle.textContent = "Notes";
    let html = `
        <div class="notes-header">
            <button onclick="createNote()">
                ＋ New Note
            </button>
        </div>
        <div class="notes-list">
    `;
    phoneState.notes.slice().reverse().forEach(function(note) {
        html += `
            <div
                class="note-item"
                onclick="openNote(${note.id})"
            >
                <div class="note-title">
                    ${esc(note.title)}
                </div>
                <div class="note-preview">
                    ${esc(note.content.substring(0, 60))}
                </div>
                <div class="note-date">
                    ${esc(note.date)}
                </div>
            </div>
        `;
    });
    html += `
        </div>
    `;
    appContent.innerHTML = html;
}
function openNote(id) {
    backAction = openNotes;
    let note = phoneState.notes.find(function(note) {
        return note.id === id;
    });
    if (!note && draftNote && draftNote.id === id) {
        note = draftNote;
    }
    if (!note) {
        openNotes();
        return;
    }
    appTitle.textContent = "Edit Note";
    appContent.innerHTML = `
        <div class="note-editor">
            <input
                id="noteTitle"
                type="text"
                value="${esc(note.title)}"
                placeholder="Title"
            >
            <textarea
                id="noteContent"
                placeholder="Write something..."
            >${esc(note.content)}</textarea>
            <div class="note-buttons">
                <button onclick="saveNote(${note.id})">
                    Save
                </button>
                <button
                    class="delete-button"
                    onclick="deleteNote(${note.id})"
                >
                    Delete
                </button>
            </div>
        </div>
    `;
}
function saveNote(id) {
    let note = phoneState.notes.find(function(note) {
        return note.id === id;
    });
    const isNew = !note;
    if (isNew && draftNote && draftNote.id === id) {
        note = draftNote;
    }
    if (!note) {
        openNotes();
        return;
    }
    const title =
        document.getElementById("noteTitle").value.trim();
    const content =
        document.getElementById("noteContent").value.trim();
    if (title === "") {
        alert("Please enter a title.");
        return;
    }
    note.title = title;
    note.content = content;
    note.date = getCurrentDate();
    if (isNew) {
        phoneState.notes.push(note);
        draftNote = null;
    }
    savePhone();
    openNotes();
}
function createNote() {
    draftNote = {
        id: Date.now(),
        title: "New Note",
        content: "",
        date: getCurrentDate()
    };
    openNote(draftNote.id);
}
function deleteNote(id) {
    phoneState.notes =
        phoneState.notes.filter(function(note) {
            return note.id !== id;
        });
    draftNote = null;
    savePhone();
    openNotes();
}
function getCurrentDate() {
    const now = new Date();
    const months = [
        "January",
        "February",
        "March",
        "April",
        "May",
        "June",
        "July",
        "August",
        "September",
        "October",
        "November",
        "December"
    ];
    return `${months[now.getMonth()]} ${now.getDate()}, ${now.getFullYear()}`;
}
function openCalls() {
    backAction = null;
    phoneState.story.flags.openedCalls = true;
    appTitle.textContent = "Calls";
    let html = `
        <div class="calls-header">
            <button onclick="showContactsForCall()">＋ New Call</button>
        </div>
      <div class="call-list">
    `;
    phoneState.calls.forEach(function(call) {
        let icon = "↙";
        let className = "incoming";
        if (call.type === "outgoing") {
            icon = "↗";
            className = "outgoing";
        }
        if (call.type === "missed") {
            icon = "↙";
            className = "missed";
        }
        if (call.strange) {
            phoneState.story.flags.unknownCallerFound = true;
        }
        html += `
            <div class="call-item"
                 onclick="openCallContact('${call.phone}')">
                <div class="call-avatar">
                    ${esc(call.name.charAt(0))}
                </div>
                <div class="call-info">
                    <strong>${esc(call.name)}</strong>
                    <p class="${className}">
                        ${icon} ${call.type}
                    </p>
                </div>
                <div class="call-time">
                    ${esc(call.time)}
                </div>
            </div>
        `;
    });
    html += `
        </div>
    `;
    appContent.innerHTML = html;
    savePhone();
}
function openCallContact(phone) {
    const contact = phoneState.contacts.find(function(contact) {
        return contact.phone === phone;
    });
    if (!contact) {
        startCall("Unknown", phone);
        return;
    }
    backAction = openCalls;
    appTitle.textContent = contact.name;
    appContent.innerHTML = `
        <div class="call-contact">
            <div class="big-call-avatar">
                ${esc(contact.name.charAt(0))}
            </div>
            <h2>${esc(contact.name)}</h2>
            <p>${esc(contact.phone)}</p>
            <button class="call-button"
                    onclick="startCall('${contact.name}', '${contact.phone}')">
                📞 Call
            </button>
        </div>
    `;
}
function showContactsForCall() {
    backAction = openCalls;
    appTitle.textContent = "New Call";
    let html = `
        <div class="contacts-call-list">
            <h3>Contacts</h3>
    `;
    phoneState.contacts.forEach(function(contact) {
        html += `
            <div class="call-contact-item"
                 onclick="startCall('${contact.name}', '${contact.phone}')">
                <div class="call-avatar">
                    ${esc(contact.name.charAt(0))}
                </div>
                <div>
                    <strong>${esc(contact.name)}</strong>
                    <p>${esc(contact.phone)}</p>
                </div>
            </div>
        `;
    });
    html += `</div>`;
    appContent.innerHTML = html;
}
function startCall(name, phone) {
    backAction = openCalls;
    appTitle.textContent = "Calling";
    appContent.innerHTML = `
        <div class="active-call">
            <div class="big-call-avatar">
                ${esc(name.charAt(0))}
            </div>
            <h2>${esc(name)}</h2>
            <p>${esc(phone)}</p>
            <div class="calling-text">
                Calling...
            </div>
            <button class="end-call-button"
                    onclick="endCall('${name}', '${phone}')">
                ☎
            </button>
        </div>
    `;
}
function endCall(name, phone) {
    phoneState.calls.unshift({
        name: name,
        phone: phone,
        type: "outgoing",
        time: getCurrentTime()
    });
    savePhone();
    openCalls();
}
function openCamera() {
    backAction = null;
    phoneState.story.flags.openedCamera = true;
    savePhone();
    appTitle.textContent = "Camera";
    appContent.innerHTML = `
        <div class="camera">
            <div class="camera-preview">
                <div class="camera-preview-text">
                    CAMERA
                </div>
            </div>
            <div class="camera-controls">
                <button class="camera-gallery-button"
                        onclick="openGallery()">
                    🖼️
                </button>
                <button class="shutter-button"
                        onclick="takePhoto()">
                    <span></span>
                </button>
                <button class="camera-switch-button"
                        onclick="switchCamera()">
                    🔄
                </button>
            </div>
        </div>
    `;
}
function takePhoto() {
    const photoNumber = phoneState.photos.length + 1;
    const newPhoto = {
        id: Date.now(),
        name: `IMG_${1000 + photoNumber}.jpg`,
        date: getCurrentDate(),
        time: getCurrentTime(),
        location: "Karachi",
        image: `https://picsum.photos/seed/${Date.now()}/600/600`
    };
    phoneState.photos.push(newPhoto);
    savePhone();
    showPhotoTaken(newPhoto);
}
function showPhotoTaken(photo) {
    backAction = openCamera;
    appTitle.textContent = "Photo Taken";
    appContent.innerHTML = `
        <div class="photo-taken">
            <img src="${esc(photo.image)}" alt="${esc(photo.name)}">
            <h3>${esc(photo.name)}</h3>
            <p>${esc(photo.date)}</p>
            <p>${esc(photo.time)}</p>
            <div class="photo-actions">
                <button onclick="openGallery()">
                    🖼️ Gallery
                </button>
                <button onclick="openCamera()">
                    📷 Camera
                </button>
            </div>
        </div>
    `;
}
function switchCamera() {
    const preview = document.querySelector(".camera-preview-text");
    if (!preview) {
        return;
    }
    if (preview.textContent.trim() === "CAMERA") {
        preview.textContent = "FRONT CAMERA";
    } else {
        preview.textContent = "CAMERA";
    }
}
function openMaps() {
    backAction = null;
    phoneState.story.flags.openedMaps = true;
    savePhone();
    appTitle.textContent = "Maps";
    const strangeLocation = phoneState.locations.find(function(location) {
        return location.strange;
    });
    let strangeLocationHTML = "";
    if (strangeLocation) {
        strangeLocationHTML = `
            <div class="map-warning"
                 onclick="openLocationHistory()">
                <div class="map-warning-icon">
                    📍
                </div>
                <div>
                    <strong>${esc(strangeLocation.name)}</strong>
                    <p>${esc(strangeLocation.address)}</p>
                    <small>${esc(strangeLocation.time)}</small>
                </div>
                <span>›</span>
            </div>
        `;
    }
    appContent.innerHTML = `
        <div class="maps">
            <div class="map-search">
                <input
                    id="mapSearch"
                    type="text"
                    placeholder="Search Maps..."
                    onkeydown="handleMapSearch(event)"
                >
                <button onclick="searchMap()">
                    🔍
                </button>
            </div>
            <div class="fake-map">
                <div class="road road-one"></div>
                <div class="road road-two"></div>
                <div class="road road-three"></div>
                <div class="map-water"></div>
                <div class="map-label label-one">
                    Karachi
                </div>
                <div class="map-label label-two">
                    Clifton
                </div>
                <div class="map-pin pin-one">
                    📍
                </div>
                <div class="map-pin pin-two">
                    📍
                </div>
            </div>
            ${strangeLocationHTML}
            <button
                class="location-history-button"
                onclick="openLocationHistory()"
            >
                🕘 Location History
            </button>
        </div>
    `;
}
function searchMap() {
    const input = document.getElementById("mapSearch");
    if (!input) return;
    const query = input.value.trim();
    if (query === "") return;
    showMapSearchResult(query);
}
function handleMapSearch(event) {
    if (event.key === "Enter") {
        searchMap();
    }
}
function showMapSearchResult(query) {
    backAction = openMaps;
    currentMapQuery = query;
    appTitle.textContent = "Maps";
    appContent.innerHTML = `
        <div class="map-result">
            <div class="fake-map small-map">
                <div class="road road-one"></div>
                <div class="road road-two"></div>
                <div class="map-pin search-pin">
                    📍
                </div>
            </div>
            <div class="location-result">
                <div class="location-result-icon">
                    📍
                </div>
                <div>
                    <h3>${esc(query)}</h3>
                    <p>Karachi, Pakistan</p>
                </div>
            </div>
            <button
                class="save-location-button"
                onclick="saveLocation()">
                ＋ Save Location
            </button>
        </div>
    `;
}
function openLocationHistory() {
    backAction = openMaps;
    appTitle.textContent = "Location History";
    let html = `
        <div class="location-history">
            <h3>Recent locations</h3>
    `;
    if (phoneState.locations.length === 0) {
        html += `
            <p class="empty-history">
                No location history.
            </p>
        `;
    } else {
        // The list is stored newest-first, so no reverse() needed
        phoneState.locations.forEach(function(location) {
            if (location.strange) {
                phoneState.story.flags.strangeLocationFound = true;
                savePhone();
                if (!phoneState.story.flags.strangePhotoFound) {
                    createStrangePhoto();
                }
            }
            html += `
                <div class="location-item">
                    <div class="location-icon">
                        📍
                    </div>
                    <div class="location-info">
                        <strong>${esc(location.name)}</strong>
                        <p>${esc(location.address)}</p>
                        <small>${esc(location.time)}</small>
                    </div>
                </div>
            `;
        });
    }
    html += `
        </div>
    `;
    appContent.innerHTML = html;
}
function openSettings() {
    backAction = null;
    phoneState.story.flags.openedSettings = true;
    savePhone();
    appTitle.textContent = "Settings";
    const settings = phoneState.settings;
    appContent.innerHTML = `
        <div class="settings">
            <div class="settings-profile">
                <div class="settings-avatar">
                    Y
                </div>
                <div>
                    <strong>My Phone</strong>
                    <p>Personal device</p>
                </div>
            </div>
            <div class="settings-section">
                <h3>Connections</h3>
                <div class="setting-item"
                     onclick="toggleWifi()">
                    <div class="setting-icon">
                        📶
                    </div>
                    <div class="setting-info">
                        <strong>Wi-Fi</strong>
                        <p id="wifiStatus">
                            ${settings.wifi
                                ? esc(settings.wifiName)
                                : "Off"}
                        </p>
                    </div>
                    <span class="setting-arrow">
                        ›
                    </span>
                </div>
                <div class="setting-item"
                     onclick="toggleBluetooth()">
                    <div class="setting-icon">
                        🔵
                    </div>
                    <div class="setting-info">
                        <strong>Bluetooth</strong>
                        <p id="bluetoothStatus">
                            ${settings.bluetooth
                                ? "On"
                                : "Off"}
                        </p>
                    </div>
                    <span class="setting-arrow">
                        ›
                    </span>
                </div>
            </div>
            <div class="settings-section">
                <h3>Device</h3>
                <div class="setting-item"
                     onclick="showBattery()">
                    <div class="setting-icon">
                        🔋
                    </div>
                    <div class="setting-info">
                        <strong>Battery</strong>
                        <p>
                            ${settings.battery}% remaining
                        </p>
                    </div>
                    <span class="setting-arrow">
                        ›
                    </span>
                </div>
                <div class="setting-item"
                     onclick="showStorage()">
                    <div class="setting-icon">
                        💾
                    </div>
                    <div class="setting-info">
                        <strong>Storage</strong>
                        <p>
                            42.7 GB of 128 GB used
                        </p>
                    </div>
                    <span class="setting-arrow">
                        ›
                    </span>
                </div>
                <div class="setting-item"
                     onclick="showDeviceInfo()">
                    <div class="setting-icon">
                        📱
                    </div>
                    <div class="setting-info">
                        <strong>About Phone</strong>
                        <p>
                            Phone information
                        </p>
                    </div>
                    <span class="setting-arrow">
                        ›
                    </span>
                </div>
            </div>
            <div class="settings-section">
                <h3>Preferences</h3>
                <div class="setting-item"
                     onclick="toggleNotifications()">
                    <div class="setting-icon">
                        🔔
                    </div>
                    <div class="setting-info">
                        <strong>Notifications</strong>
                        <p id="notificationStatus">
                            ${settings.notifications
                                ? "On"
                                : "Off"}
                        </p>
                    </div>
                    <span class="setting-arrow">
                        ›
                    </span>
                </div>
                <div class="setting-item"
                     onclick="toggleDarkMode()">
                    <div class="setting-icon">
                        🌙
                    </div>
                    <div class="setting-info">
                        <strong>Dark Mode</strong>
                        <p id="darkModeStatus">
                            ${settings.darkMode
                                ? "On"
                                : "Off"}
                        </p>
                    </div>
                    <span class="setting-arrow">
                        ›
                    </span>
                </div>
            </div>
        </div>
    `;
}
function toggleWifi() {
    phoneState.settings.wifi =
        !phoneState.settings.wifi;
    savePhone();
    updateStatusBar();
    openSettings();
}
function toggleBluetooth() {
    phoneState.settings.bluetooth =
        !phoneState.settings.bluetooth;
    savePhone();
    openSettings();
}
function toggleNotifications() {
    phoneState.settings.notifications =
        !phoneState.settings.notifications;
    savePhone();
    openSettings();
}
function toggleDarkMode() {
    phoneState.settings.darkMode =
        !phoneState.settings.darkMode;
    savePhone();
    openSettings();
}
function showBattery() {
    backAction = openSettings;
    appTitle.textContent = "Battery";
    const battery =
        phoneState.settings.battery;
    appContent.innerHTML = `
        <div class="battery-screen">
            <div class="battery-circle">
                ${battery}%
            </div>
            <h2>Battery</h2>
            <p>
                ${battery}% remaining
            </p>
            <div class="battery-bar">
                <div
                    class="battery-fill"
                    style="width: ${battery}%">
                </div>
            </div>
            <p class="battery-note">
                Battery usage is simulated.
            </p>
        </div>
    `;
}
function showStorage() {
    backAction = openSettings;
    appTitle.textContent = "Storage";
    appContent.innerHTML = `
        <div class="storage-screen">
            <div class="storage-circle">
                <strong>42.7 GB</strong>
                <span>used</span>
            </div>
            <h2>Phone Storage</h2>
            <p>42.7 GB of 128 GB used</p>
            <div class="storage-bar">
                <div class="storage-fill"></div>
            </div>
            <div class="storage-list">
                <div>
                    <span>📸 Photos</span>
                    <strong>18.2 GB</strong>
                </div>
                <div>
                    <span>💬 Messages</span>
                    <strong>2.4 GB</strong>
                </div>
                <div>
                    <span>📱 Apps</span>
                    <strong>15.8 GB</strong>
                </div>
                <div>
                    <span>📁 Other</span>
                    <strong>6.3 GB</strong>
                </div>
            </div>
        </div>
    `;
}
function showDeviceInfo() {
    backAction = openSettings;
    appTitle.textContent = "About Phone";
    appContent.innerHTML = `
        <div class="device-info">
            <div class="device-image">
                📱
            </div>
            <h2>My Phone</h2>
            <div class="info-row">
                <span>Model</span>
                <strong>PX-14</strong>
            </div>
            <div class="info-row">
                <span>Software</span>
                <strong>PhoneOS 4.2</strong>
            </div>
            <div class="info-row">
                <span>Storage</span>
                <strong>128 GB</strong>
            </div>
            <div class="info-row">
                <span>Serial Number</span>
                <strong>PX14-48291</strong>
            </div>
            <div class="info-row">
                <span>Version</span>
                <strong>4.2.1</strong>
            </div>
        </div>
    `;
}
function triggerStoryEvent(eventName) {
    if (phoneState.story.events.includes(eventName)) {
        return;
    }
    phoneState.story.events.push(eventName);
    savePhone();
    handleStoryEvent(eventName);
}
function handleStoryEvent(eventName) {
    if (eventName === "first_message") {
        firstStoryMessage();
    }
    if (eventName === "strange_photo") {
        createStrangePhoto();
    }
    if (eventName === "strange_search") {
        createStrangeSearch();
    }
    if (eventName === "strange_location") {
        createStrangeLocation();
    }
    if (eventName === "unknown_caller") {
        createUnknownCaller();
    }
    if (eventName === "strange_notification") {
        strangeNotification();
    }
}
function firstStoryMessage() {
    if (!phoneState.messages.you) {
        phoneState.messages.you = [];
    }
    phoneState.messages.you.push({
        sender: "them",
        text: "Why did you leave me there?",
        time: getCurrentTime()
    });
    savePhone();
    phoneEvent("message", {
        message: "New message from You",
        action: function() {
            openApp("messages");
        }
    });
    schedulePhoneEvent(
        "notification",
        {
            title: "System",
            message: "Location access was used recently.",
            icon: "📍",
            action: function() {
                createStrangeLocation();
                openApp("maps");
            }
        },
        8000
    );
    if (
        !appScreen.classList.contains("hidden") &&
        appTitle.textContent === "Messages"
    ) {
        openMessages();
    }
}
function createStrangePhoto() {
    const alreadyExists = phoneState.photos.some(function(photo) {
        return photo.strange;
    });
    if (alreadyExists) {
        phoneState.story.flags.strangePhotoFound = true;
        savePhone();
        return;
    }
    const strangePhoto = {
        id: Date.now(),
        name: "IMG_1007.jpg",
        date: getCurrentDate(),
        time: "3:04 AM",
        location: "Clifton, Karachi",
        image: "https://picsum.photos/seed/strange-photo/600/600",
        strange: true
    };
    phoneState.photos.push(strangePhoto);
    phoneState.story.flags.strangePhotoFound = true;
    savePhone();
    phoneEvent("photo", {
        message: "New photo added",
        action: function() {
            openApp("gallery");
        }
    });
}
function createStrangeSearch() {
    phoneState.browserHistory.push({
        query: "how to disappear completely",
        time: "3:12 AM",
        strange: true
    });
    savePhone();
}
function createStrangeLocation() {
    const alreadyExists = phoneState.locations.some(function(location) {
        return location.strange;
    });
    if (alreadyExists) {
        phoneState.story.flags.strangeLocationFound = true;
        savePhone();
        return;
    }
    phoneState.locations.unshift({
        id: Date.now(),
        name: "Unknown Location",
        address: "Clifton, Karachi",
        time: "Today, 3:03 AM",
        strange: true
    });
    phoneState.story.flags.strangeLocationFound = true;
    savePhone();
}
function createUnknownCaller() {
    phoneState.calls.unshift({
        name: "Unknown",
        phone: "0301-9876543",
        type: "missed",
        time: "Today, " + getCurrentTime(),
        strange: true
    });
    savePhone();
    phoneEvent("call", { name: "Unknown" });
}
function checkStoryProgress() {
    const flags = phoneState.story.flags;
    if (
        flags.openedMessages &&
        flags.openedGallery &&
        flags.openedBrowser &&
        !flags.firstMessageReceived
    ) {
        flags.firstMessageReceived = true;
        savePhone();
        triggerStoryEvent("first_message");
    }
}
function showNotification(title, message, icon = "🔔", action = null) {
    if (!phoneState.settings.notifications) {
        return;
    }
    const container =
        document.getElementById("notificationContainer");
    if (!container) {
        return;
    }
    const notification =
        document.createElement("div");
    notification.className = "notification";
    notification.innerHTML = `
        <div class="notification-icon">
            ${esc(icon)}
        </div>
        <div class="notification-content">
            <strong>${esc(title)}</strong>
            <p>${esc(message)}</p>
        </div>
    `;
    if (action) {
        notification.style.pointerEvents = "auto";
        notification.style.cursor = "pointer";
        notification.onclick = function() {
            action();
            notification.remove();
        };
    }
    container.appendChild(notification);
    setTimeout(function() {
        notification.classList.add("notification-hide");
    }, 5000);
    setTimeout(function() {
        notification.remove();
    }, 5500);
}
function phoneEvent(type, data = {}) {
    if (type === "notification") {
        showNotification(
            data.title || "Phone",
            data.message || "",
            data.icon || "🔔",
            data.action || null
        );
    }
    if (type === "message") {
        showNotification(
            "Messages",
            data.message || "New message",
            "💬",
            data.action || null
        );
    }
    if (type === "call") {
        showNotification(
            "Incoming Call",
            `${data.name || "Unknown"} is calling`,
            "📞",
            data.action || null
        );
    }
    if (type === "location") {
        showNotification(
            "Maps",
            "Location history updated",
            "📍",
            data.action || null
        );
    }
    if (type === "photo") {
        showNotification(
            "Photos",
            "New photo added",
            "📸",
            data.action || null
        );
    }
}
function schedulePhoneEvent(type, data, delay) {
    setTimeout(function() {
        phoneEvent(type, data);
    }, delay);
}
function strangeNotification() {
    phoneEvent("notification", {
        title: "System",
        message: "Location access was used recently.",
        icon: "📍"
    });
}
function saveLocation(name) {
    name = name || currentMapQuery;
    if (!name) {
        return;
    }
    phoneState.locations.unshift({
        id: Date.now(),
        name: name,
        address: "Karachi, Pakistan",
        time: getCurrentDate() + ", " + getCurrentTime()
    });
    savePhone();
    openLocationHistory();
}
loadPhone();
updateClock();
setInterval(updateClock, 1000);
updateStatusBar();