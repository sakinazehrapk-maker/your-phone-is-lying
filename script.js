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
function openBrowser() {
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
    appTitle.textContent = "Search";
    appContent.innerHTML = `
        <div class="search-results">
            <div class="search-box">
                <input
                    id="searchInput"
                    type="text"
                    value="${query}"
                    onkeydown="handleSearch(event)"
                >
                <button onclick="searchWeb()">
                    🔍
                </button>
            </div>
            <div class="result">
                <small>example.com</small>
                <h3>
                    Search results for "${query}"
                </h3>
                <p>
                    These are simulated search results
                    inside the game.
                </p>
            </div>
            <div class="result">
                <small>information.net</small>
                <h3>
                    More information about ${query}
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
    appTitle.textContent = "History";
    let html = `
        <div class="history">
            <h3>Today</h3>
    `;
    phoneState.browserHistory
        .slice()
        .reverse()
        .forEach(function(item) {
            html += `
                <div class="history-item">
                    <div class="history-icon">
                        🌐
                    </div>
                    <div>
                        <strong>
                            ${item.query}
                        </strong>
                        <p>
                            ${item.time}
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
    appTitle.textContent = "Notes";
    let html = `
        <div class="notes-header">
            <button onclick="createNote()">
                ＋ New Note
            </button>
        </div>
        <div class="notes-list">
    `;
    phoneState.notes.forEach(function(note) {
        html += `
            <div
                class="note-item"
                onclick="openNote(${note.id})"
            >
                <div class="note-title">
                    ${note.title}
                </div>
                <div class="note-preview">
                    ${note.content.substring(0, 60)}
                </div>
                <div class="note-date">
                    ${note.date}
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
    const note = phoneState.notes.find(function(note) {
        return note.id === id;
    });
    appTitle.textContent = "Edit Note";
    appContent.innerHTML = `
        <div class="note-editor">
            <input
                id="noteTitle"
                type="text"
                value="${note.title}"
                placeholder="Title"
            >
            <textarea
                id="noteContent"
                placeholder="Write something..."
            >${note.content}</textarea>
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
    const note = phoneState.notes.find(function(note) {
        return note.id === id;
    });
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
    savePhone();
    openNotes();
}
function createNote() {
    const newNote = {
        id: Date.now(),
        title: "New Note",
        content: "",
        date: getCurrentDate()
    };
    phoneState.notes.push(newNote);
    savePhone();
    openNote(newNote.id);
}
function deleteNote(id) {
    phoneState.notes =
        phoneState.notes.filter(function(note) {
            return note.id !== id;
        });
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
        html += `
            <div class="call-item"
                 onclick="openCallContact('${call.phone}')">
                <div class="call-avatar">
                    ${call.name.charAt(0)}
                </div>
                <div class="call-info">
                    <strong>${call.name}</strong>
                    <p class="${className}">
                        ${icon} ${call.type}
                    </p>
                </div>
                <div class="call-time">
                    ${call.time}
                </div>
            </div>
        `;
    });
    html += `
        </div>
    `;
    appContent.innerHTML = html;
}
function openCallContact(phone) {
    const contact = phoneState.contacts.find(function(contact) {
        return contact.phone === phone;
    });
    if (!contact) {
        startCall("Unknown", phone);
        return;
    }
    appTitle.textContent = contact.name;
    appContent.innerHTML = `
        <div class="call-contact">
            <div class="big-call-avatar">
                ${contact.name.charAt(0)}
            </div>
            <h2>${contact.name}</h2>
            <p>${contact.phone}</p>
            <button class="call-button"
                    onclick="startCall('${contact.name}', '${contact.phone}')">
                📞 Call
            </button>
        </div>
    `;
}
function showContactsForCall() {
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
                    ${contact.name.charAt(0)}
                </div>
                <div>
                    <strong>${contact.name}</strong>
                    <p>${contact.phone}</p>
                </div>
            </div>
        `;
    });
    html += `</div>`;
    appContent.innerHTML = html;
}
function startCall(name, phone) {
    appTitle.textContent = "Calling";
    appContent.innerHTML = `
        <div class="active-call">
            <div class="big-call-avatar">
                ${name.charAt(0)}
            </div>
            <h2>${name}</h2>
            <p>${phone}</p>
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
    appTitle.textContent = "Photo Taken";
    appContent.innerHTML = `
        <div class="photo-taken">
            <img src="${photo.image}" alt="${photo.name}">
            <h3>${photo.name}</h3>
            <p>${photo.date}</p>
            <p>${photo.time}</p>
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
    if (preview.textContent === "CAMERA") {
        preview.textContent = "FRONT CAMERA";
    } else {
        preview.textContent = "CAMERA";
    }
}
function openMaps() {
    appTitle.textContent = "Maps";
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
            <button class="location-history-button"
                    onclick="openLocationHistory()">
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
                    <h3>${query}</h3>
                    <p>Karachi, Pakistan</p>
                </div>
            </div>
            <button
                class="save-location-button"
                onclick="saveLocation('${query}')">
                ＋ Save Location
            </button>
        </div>
    `;
}
function openLocationHistory() {
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
        phoneState.locations
            .slice()
            .reverse()
            .forEach(function(location) {
                html += `
                    <div class="location-item">
                        <div class="location-icon">
                            📍
                        </div>
                        <div class="location-info">
                            <strong>${location.name}</strong>
                            <p>${location.address}</p>
                            <small>${location.time}</small>
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
                                ? settings.wifiName
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
function showDeviceInfo() {
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
}
updateClock();
setInterval(updateClock, 1000);
loadPhone();