let USER_ID;
let USER_USERNAME;

let socket = null; // We'll keep the socket instance here.
let currentChatId = null;

class chat extends HTMLElement {
  connectedCallback() {
    this.innerHTML = `
      <link rel="stylesheet" href="/static/css/chat.css" />
      <input type="hidden" id="logged-in-user"/>

      
      <div class="app-container">
        <!-- friend list -->
        <div class="friend-list"></div>
        
        <!-- Users List -->
        <div class="friends">
          <input class="user_search" type="text" id="id-friends" placeholder="Search" />
          <div class="header-users-list">
            <div class="users-list"></div>
          </div>
        </div>
        
        <!-- Chat Area -->
        <div class="chat-container">
          <div class="chat-header">
            <div class="user-chat">
              <span id="chat-header-username"></span>
            </div>
            <div class="dropdown">
              <button class="dropdown-button"></button>
              <div class="dropdown-content">
                <a href="#" id="block-user">block</a>
                <a href="#">invitation game</a>
              </div>
            </div>
          </div>
          <div class="content-messages"></div>
          <div class="chat-messages"></div>
          <form id="send-message-form">
            <div class="chat-input">
              <input type="text" id="input-message" placeholder="Type your message here" />
              <button id="chat-message-submit" type="submit">Send</button>
            </div>
          </form>
        </div>
      </div>
    `;
    this.initializeChat();
  }

  initializeChat() {
    const loc = window.location;
    const dominePort = loc.host;
  
    // Cookie helper
    function getCookie(name) {
      let cookieValue = null;
      if (document.cookie && document.cookie !== "") {
        const cookies = document.cookie.split(";");
        for (let i = 0; i < cookies.length; i++) {
          const cookie = cookies[i].trim();
          if (cookie.substring(0, name.length + 1) === name + "=") {
            cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
            break;
          }
        }
      }
      return cookieValue;
    }
    const accessToken = getCookie("access_token");
    console.log(accessToken);
  
    // Timestamp formatting
    function formatTimestamp(timestamp) {
      const date = new Date(timestamp);
      let hours = date.getHours();
      const minutes = date.getMinutes().toString().padStart(2, "0");
      const ampm = hours >= 12 ? "pm" : "am";
      hours = hours % 12 || 12;
      const now = new Date();
      const isToday = date.toDateString() === now.toDateString();
      const isYesterday =
        date.toDateString() === new Date(now.setDate(now.getDate() - 1)).toDateString();
      const dayText = isToday ? "Today" : isYesterday ? "Yesterday" : date.toLocaleDateString();
      return `${dayText}, ${hours}:${minutes} ${ampm}`;
    }
  
    // Define fetchMessagesForChat in a scope accessible to the WebSocket handler.
    function fetchMessagesForChat(chatId) {
      fetch("http://localhost:8000/api", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => {
          const body_message = document.querySelector(".chat-messages");
          let messagesHtml = "";
          if (data.messages && data.messages.length > 0) {
            data.messages.forEach((message) => {
              if (message.sent_by_id == data.id && message.send_to_id == chatId) {
                messagesHtml += `
                  <div class="message sent">
                    <div class="message-content">${message.content}</div>
                    <p><small>${formatTimestamp(message.timestamp)}</small></p>
                  </div>
                `;
              } else if (message.sent_by_id == chatId) {
                messagesHtml += `
                  <div class="message received">
                    <div class="message-content">${message.content}</div>
                    <p><small>${formatTimestamp(message.timestamp)}</small></p>
                  </div>
                `;
              }
            });
          } else {
            messagesHtml = "<p>No messages found.</p>";
          }
          body_message.innerHTML = messagesHtml;
          scrollToBottom();
        })
        .catch((error) => {
          console.error("Error fetching messages:", error);
        });
    }
  
    // A helper to scroll to the bottom of the chat messages.
    function scrollToBottom() {
      const chatMessages = document.querySelector(".chat-messages");
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }
  
    // Helper to create or return an open socket connection.
    const getSocket = () => {
      if (socket && socket.readyState === WebSocket.OPEN) {
        return socket;
      }
      let wsStart = "ws://";
      if (loc.protocol === "https:") {
        wsStart = "wss://";
      }
      const endpoint = wsStart + loc.host + "/chat/?token=" + accessToken;
      socket = new WebSocket(endpoint);
  
      socket.addEventListener("open", (e) => {
        console.log("Socket opened:", e);
      });
      socket.addEventListener("error", (e) => {
        console.error("Socket error:", e);
      });
      socket.addEventListener("close", (e) => {
        console.log("Socket closed:", e);
      });
      socket.addEventListener("message", (e) => {
        console.log("Incoming message:", e);
        const data = JSON.parse(e.data);
        console.log("wa hamza : ", data);
        if (data.action === "invitation") {
          console.log("Invitation received:", data);
          showNotification(
            "You have a new friend invitation from " +
              data.fromUsername +
              " (Pending)",
            10000
          );
          showInvitationPrompt(data);
        }
        if (data.action === "invitation_response_ack") {
          if (data.response === "accepted") {
            showNotification("Your invitation has been accepted!", 10000);
          } else if (data.response === "declined") {
            showNotification("Your invitation has been declined.", 10000);
          }
        }
        if (data.action === "search_results") {
          const usersListDiv = document.querySelector(".users-list");
          let usersHtml = "";
          data.users.forEach((user) => {
            usersHtml += `
              <div class="user_info">
                <div class="user-item" data-chat-id="${user.id}">
                  <img src="/static/image/defaultprofilepic.png" class="user-avatar" alt="${user.username}">
                  <strong>${user.username}</strong>
                  <button class="send-invitation" data-user-id="${user.id}" data-username="${user.username}">
                    Send Invitation
                  </button>
                </div>
              </div>
            `;
          });
          usersListDiv.innerHTML = usersHtml;
          // Attach invitation send event listeners to new buttons
          document.querySelectorAll('.send-invitation').forEach(button => {
            button.addEventListener("click", function (e) {
              e.stopPropagation();
              const targetUserId = this.getAttribute("data-user-id");
              const targetUsername = this.getAttribute("data-username");
              // Use sendMessage helper instead of direct socket.send
              sendMessage({
                action: "send_invitation",
                target_user_id: targetUserId,
                target_username: targetUsername,

              });
              // Immediately show a notification that your invitation was sent and is pending
              showNotification("Invitation sent to " + targetUsername + " (Pending)", 5000);
              console.log("si hamza : ", accessToken);
            });
          });
        }
        if (data.message) {
          fetchMessagesForChat(currentChatId);
        }
      });
      return socket;
    };
  
    // Helper function that wraps sending a message to ensure the socket is open.
    function sendMessage(data) {
      const ws = getSocket();
      if (ws.readyState === WebSocket.OPEN) {
        ws.send(JSON.stringify(data));
      } else {
        // If the socket is not open yet, wait for it to open before sending.
        ws.addEventListener("open", () => {
          ws.send(JSON.stringify(data));
        }, { once: true });
      }
    }
  
    // Fetch initial chat data.
    fetch("http://localhost:8000/api/", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {

  
        USER_ID = data.id;
        USER_USERNAME = data.username;
		console.log(USER_USERNAME)
        let friendsHtml = "";
        data.friends.forEach((friend, index) => {
          friendsHtml += `
            <div class="user_info1">
              <div class="user-item1 ${index === 0 ? "active" : ""}" data-chat-id="${friend.id}" data-blocked="${friend.blocked}">
                <img src="/static/image/Screen Shot 2024-10-02 at 2.04.41 AM.png" class="user-avatar">
                <strong>${friend.username}</strong>
              </div>
            </div>
          `;
        });
        let friendsData = [];
        data.friends.forEach((friend) => {
          let latestMessage = null;
          data.messages.forEach((message) => {
            if (message.sent_by_id == friend.id || message.send_to_id == friend.id) {
              if (!latestMessage || new Date(message.timestamp) > new Date(latestMessage.timestamp)) {
                latestMessage = message;
              }
            }
          });
          if (latestMessage) {
            friendsData.push({
              friend,
              latestMessageTimestamp: new Date(latestMessage.timestamp),
              message: latestMessage,
            });
          }
        });
        friendsData.sort((a, b) => b.latestMessageTimestamp - a.latestMessageTimestamp);
        let friendsHtml1 = "";
        friendsData.forEach((data, index) => {
          const contentMessage = data.message.content;
          const words = contentMessage.split(" ");
          const firstFourWords = words.slice(0, 4).join(" ");
          const truncatedMessage = firstFourWords + (words.length > 4 ? " ..." : "");
          friendsHtml1 += `
            <div class="user_info">
              <div class="user-item ${index === 0 ? "active" : ""}" data-chat-id="${data.friend.id}">
                <div class="header-users">
                  <img src="/static/image/Screen Shot 2024-10-02 at 3.53.12 AM.png" class="user-avatar">
                  <div class="items-user">
                    <strong>${data.friend.username}</strong>
                    <div class="content-message">
                      ${truncatedMessage}
                    </div>
                  </div>
                </div>
                <div class="last-seen">
                  ${formatTimestamp(data.message.timestamp)}
                </div>
              </div>
            </div>
          `;
        });
        document.querySelector(".users-list").innerHTML = friendsHtml1;
        document.querySelector(".friend-list").innerHTML = friendsHtml;
        initializeChatInteractions();
      })
      .catch((error) => {
        console.error("Error fetching chat data:", error);
      });
  
    const initializeChatInteractions = () => {
      const input_message = document.getElementById("input-message");
      const send_message_form = document.getElementById("send-message-form");
      const userItems = document.querySelectorAll(".user-item");
      const chatHeader = document.getElementById("chat-header-username");
      const button = document.querySelector(".dropdown-button");
      const menu = document.querySelector(".dropdown-content");
  
      button.addEventListener("click", function (event) {
        menu.classList.toggle("show");
        event.stopPropagation();
      });
  
      document.addEventListener("click", function (event) {
        if (!button.contains(event.target) && !menu.contains(event.target)) {
          menu.classList.remove("show");
        }
        let clickedItem = event.target.closest(".user-item1, .user-item");
        if (clickedItem) {
          activateUser(clickedItem);
        }
      });
  
      function activateUser(item) {
        userItems.forEach((user) => user.classList.remove("active"));
        item.classList.add("active");
        const userName = item.querySelector("strong").textContent;
        currentChatId = item.getAttribute("data-chat-id");
        window.currentUserBlocked = item.getAttribute("data-blocked") === "true";
        chatHeader.innerHTML = `<img src="/static/image/Screen Shot 2024-10-02 at 2.05.14 AM.png" alt="${userName}" class="chat-header-img"> ${userName}`;
        document.querySelector(".chat-messages").innerHTML = "";
        fetchMessagesForChat(currentChatId);
        getSocket();
      }
  
      if (userItems.length > 0) {
        activateUser(userItems[0]);
      }
  
      send_message_form.addEventListener("submit", function (e) {
        e.preventDefault();
        if (window.currentUserBlocked) {
          showNotification("Cannot send message: User is blocked.", 10000);
          return;
        }
        console.log("hello : ", USER_ID);
        const message = input_message.value;
        const newData = {
          message: message,
          sent_by: USER_ID,
          send_to: currentChatId,
        };
        // Use sendMessage helper
        sendMessage(newData);
        send_message_form.reset();
        fetchMessagesForChat(currentChatId);
      });
  
      const blockButton = document.getElementById("block-user");
      if (blockButton) {
        blockButton.addEventListener("click", function (e) {
          e.preventDefault();
          console.log("Block button clicked. Current chat ID:", currentChatId);
          sendMessage({
            action: "block_user",
            target_user_id: currentChatId,
          });
          window.currentUserBlocked = true;
          showNotification("User is blocked. You cannot send messages to this user.", 10000);
        });
      } else {
        console.error("Block button element with id 'block-user' not found.");
      }
  
      function debounce(func, delay) {
        let timeoutId;
        return function (...args) {
          clearTimeout(timeoutId);
          timeoutId = setTimeout(() => func.apply(this, args), delay);
        };
      }
      const searchInput = document.getElementById("id-friends");
      searchInput.addEventListener(
        "input",
        debounce(function () {
          const query = searchInput.value.trim();
          if (query) {
            sendMessage({
              action: "search_user",
              query: query,
            });
          }
        }, 300)
      );
    };
  
    function showNotification(message, duration) {
      const notification = document.createElement("div");
      notification.className = "notification";
      notification.innerText = message;
      notification.style.position = "fixed";
      notification.style.bottom = "20px";
      notification.style.right = "20px";
      notification.style.background = "#f44336";
      notification.style.color = "#fff";
      notification.style.padding = "10px 20px";
      notification.style.borderRadius = "5px";
      notification.style.boxShadow = "0 2px 6px rgba(0,0,0,0.3)";
      document.body.appendChild(notification);
      setTimeout(() => {
        notification.remove();
      }, duration);
    }
  
    function showInvitationPrompt(invitationData) {
      const prompt = document.createElement("div");
      prompt.className = "invitation-prompt";
      prompt.style.position = "fixed";
      prompt.style.top = "20px";
      prompt.style.right = "20px";
      prompt.style.background = "#f44336";
      prompt.style.border = "1px solid #ccc";
      prompt.style.padding = "20px";
      prompt.style.boxShadow = "0 2px 6px rgba(0,0,0,0.3)";
      prompt.style.zIndex = "1000";
      const message = document.createElement("p");
      message.textContent = `Friend invitation from ${invitationData.fromUsername}`;
      prompt.appendChild(message);
      const acceptButton = document.createElement("button");
      acceptButton.textContent = "Accept";
      acceptButton.style.marginRight = "10px";
      acceptButton.addEventListener("click", function () {
        sendMessage({
          action: "invitation_response",
          response: "accepted",
          friendshipId: invitationData.friendshipId,
        });
        document.body.removeChild(prompt);
      });
      prompt.appendChild(acceptButton);
      const declineButton = document.createElement("button");
      declineButton.textContent = "Decline";
      declineButton.addEventListener("click", function () {
        sendMessage({
          action: "invitation_response",
          response: "declined",
          friendshipId: invitationData.friendshipId,
        });
        document.body.removeChild(prompt);
      });
      prompt.appendChild(declineButton);
      document.body.appendChild(prompt);
    }
  }
}

customElements.define("chat-component", chat);










// function formatTimestamp(timestamp) {
// 	const date = new Date(timestamp);
  
// 	// Format hours and minutes
// 	let hours = date.getHours();
// 	const minutes = date.getMinutes().toString().padStart(2, '0');
// 	const ampm = hours >= 12 ? 'pm' : 'am';
	
// 	// Convert to 12-hour format
// 	hours = hours % 12 || 12;
  
// 	// Format "Today" or "Yesterday"
// 	const now = new Date();
// 	const isToday = date.toDateString() === now.toDateString();
// 	const isYesterday = date.toDateString() === new Date(now.setDate(now.getDate() - 1)).toDateString();
// 	const dayText = isToday ? "Today" : isYesterday ? "Yesterday" : date.toLocaleDateString();
  
// 	return `${dayText}, ${hours}:${minutes} ${ampm}`;
//   }
  
//   let currentChatId = null;
//   const loc = window.location;
//   const dominePort = loc.host;
  
//   document.addEventListener("DOMContentLoaded", function () {
// 	let USER_ID;
// 	// 1. Fetch chat API data to populate friends list and messages.
// 	fetch("http://localhost:8000/api/")
// 	  .then((response) => response.json())
// 	  .then((data) => {
// 		// Update logged in user's name
// 		document.getElementById("user-name").textContent = data.username;
// 		USER_ID = data.id;
	  
// 		// Build the friends list using API data.
// 		let friendsHtml = "";
// 		data.friends.forEach((friend, index) => {
// 		  // Add a data attribute for blocked status (assume friend.blocked is true/false)
// 		  friendsHtml += `
// 			<div class="user_info1">
// 			  <div class="user-item1 ${index === 0 ? "active" : ""}" data-chat-id="${friend.id}" data-blocked="${friend.blocked}">
// 				<img src="../../static/imgs/Screen Shot 2024-10-02 at 2.04.41 AM.png" class="user-avatar">
// 				<strong>${friend.username}</strong>
// 			  </div>
// 			</div>
// 		  `;
// 		});
		
// 		// Check if there are friends, and then build the second friends list
// 		let friendsData = [];
// 		// Collecting friends with their latest message timestamp
// 		data.friends.forEach((friend, index) => {
// 		  let latestMessage = null;
// 		  // Find the latest message for each friend
// 		  data.messages.forEach((message) => {
// 			if (message.sent_by_id == friend.id || message.send_to_id == friend.id) {
// 			  if (!latestMessage || new Date(message.timestamp) > new Date(latestMessage.timestamp)) {
// 				latestMessage = message;
// 			  }
// 			}
// 		  });
// 		  if (latestMessage) {
// 			friendsData.push({
// 			  friend,
// 			  latestMessageTimestamp: new Date(latestMessage.timestamp),
// 			  message: latestMessage
// 			});
// 		  }
// 		});
		
// 		// Sorting friends by the latest message timestamp in descending order
// 		friendsData.sort((a, b) => b.latestMessageTimestamp - a.latestMessageTimestamp);
		
// 		// Building the HTML based on sorted friends
// 		let friendsHtml1 = "";
// 		friendsData.forEach((data, index) => {
// 		  const contentMessage = data.message.content;
// 		  const words = contentMessage.split(' '); // Split the content by space to get the words
// 		  const firstFourWords = words.slice(0, 4).join(' '); // Get the first 4 words
// 		  const truncatedMessage = firstFourWords + (words.length > 4 ? ' ...' : ''); // Add '...' if there are more than 4 words
		
// 		  friendsHtml1 += `
// 			<div class="user_info">
// 			  <div class="user-item ${index === 0 ? "active" : ""}" data-chat-id="${data.friend.id}">
// 				<div class="header-users">
// 				  <img src="../../static/imgs/Screen Shot 2024-10-02 at 2.04.41 AM.png" class="user-avatar">
// 				  <div class="items-user">
// 					<strong>${data.friend.username}</strong>
// 					<div class="content-message">
// 					  ${truncatedMessage}
// 					</div>
// 				  </div>
// 				</div>
// 				<div class="last-seen">
// 				  ${formatTimestamp(data.message.timestamp)}
// 				</div>
// 			  </div>
// 			</div>
// 		  `;
// 		});
		
// 		document.querySelector(".users-list").innerHTML = friendsHtml1;
// 		document.querySelector(".friend-list").innerHTML = friendsHtml;
// 		// Initialize chat functionality.
// 		initializeChat();
// 	  })
// 	  .catch((error) => {
// 		console.error("Error fetching chat data:", error);
// 	  });
  
// 	// 2. Initialize chat functionalities.
// 	function initializeChat() {
// 	  const input_message = document.getElementById("input-message");
// 	  const body_message = document.querySelector(".chat-messages");
// 	  const send_message_form = document.getElementById("send-message-form");
// 	  const userItems = document.querySelectorAll(".user-item");
// 	  const chatHeader = document.getElementById("chat-header-username");
// 	  const button = document.querySelector(".dropdown-button");
// 	  const icon = document.querySelector(".dropdown-icon");
// 	  const menu = document.querySelector(".dropdown-content");
  
// 	  if (!button || !icon || !menu) {
// 		console.error("Dropdown elements not found.");
// 		return; // Stop script execution if elements are missing
// 	  }
  
// 	  button.addEventListener("click", function (event) {
// 		const isOpen = menu.classList.toggle("show");
// 		icon.src = isOpen ? "../../static/imgs/close.png" : "../../static/imgs/dots.png"; // Change icon
// 		event.stopPropagation();
// 	  });
  
// 	  // Close dropdown if user clicks outside
// 	  document.addEventListener("click", function (event) {
// 		if (!button.contains(event.target) && !menu.contains(event.target)) {
// 		  menu.classList.remove("show");
// 		  icon.src = "../../static/imgs/dots.png"; // Reset to original icon
// 		}
		
// 		let clickedItem = event.target.closest(".user-item1, .user-item");
// 		if (clickedItem) {
// 		  activateUser(clickedItem);
// 		}
// 	  });
	  
// 	  // Activate a user and fetch messages.
// 	  function activateUser(item) {
// 		userItems.forEach((user) => user.classList.remove("active"));
// 		item.classList.add("active");
		
// 		const userName = item.querySelector("strong").textContent;
// 		const chatId = item.getAttribute("data-chat-id");
// 		const userImageSrc = item.querySelector("img")?.src || "default-avatar.png"; // Fallback if no image found
// 		// Read the blocked status and convert to boolean
// 		window.currentUserBlocked = item.getAttribute("data-blocked") === "true";
// 		currentChatId = chatId;
		
// 		chatHeader.innerHTML = `<img src="../../static/imgs/Screen Shot 2024-10-02 at 2.05.14 AM.png" alt="${userName}" class="chat-header-img"> ${userName}`;
// 		body_message.innerHTML = "";
// 		fetchMessagesForChat(chatId);
// 	  }
  
// 	  // Automatically select the first user if available.
// 	  if (userItems.length > 0) {
// 		activateUser(userItems[0]);
// 	  }
	  
// 	  // Function to fetch messages for the selected chatId.
// 	  function fetchMessagesForChat(chatId) {
// 		fetch("http://" + dominePort + "/api")
// 		  .then((response) => response.json())
// 		  .then((data) => {
// 			let messagesHtml = "";
// 			if (data.messages && data.messages.length > 0) {
// 			  data.messages.forEach((message) => {
// 				if (message.sent_by_id == data.id && message.send_to_id == chatId) {
// 				  messagesHtml += `
// 					<div class="message sent">
// 					  <div class="message-content">${message.content}</div>
// 					  <p><small>${formatTimestamp(message.timestamp)}</small></p>
// 					</div>
// 				  `;
// 				} else if (message.sent_by_id == chatId) {
// 				  messagesHtml += `
// 					<div class="message received">
// 					  <div class="message-content">${message.content}</div>
// 					  <p><small>${formatTimestamp(message.timestamp)}</small></p>
// 					</div>
// 				  `;
// 				}
// 			  });
// 			} else {
// 			  messagesHtml = "<p>No messages found.</p>";
// 			}
// 			body_message.innerHTML = messagesHtml;
// 			// Scroll to the last message after updating chat
// 			scrollToBottom();
// 		  })
// 		  .catch((error) => {
// 			console.error("Error fetching messages:", error);
// 		  });
// 	  }
  
// 	  function scrollToBottom() {
// 		const chatMessages = document.querySelector(".chat-messages");
// 		chatMessages.scrollTop = chatMessages.scrollHeight;
// 	  }


  
// 	  // 3. Set up the WebSocket connection.
// 	  let wsStart = "ws://";
// 	  if (loc.protocol === "https:") {
// 		wsStart = "wss://";
// 	  }
// 	  const endpoint = wsStart + loc.host + loc.pathname;
	  
// 	  console.log("hamza:", dominePort);
// 	  const socket = new WebSocket(endpoint);
  
// 	  socket.addEventListener("open", (e) => {
// 		console.log("Socket opened:", e);
// 		send_message_form.addEventListener("submit", function (e) {
// 		  e.preventDefault();
  
// 		  // Check if the current chat partner is blocked.
// 		  if (window.currentUserBlocked) {
// 			showNotification("Cannot send message: User is blocked.", 10000);
// 			return;
// 		  }
  
// 		  const message = input_message.value;
// 		  const newData = {
// 			message: message,
// 			sent_by: USER_ID,
// 			send_to: currentChatId,
// 		  };
  
// 		  // Send the message
// 		  socket.send(JSON.stringify(newData));
// 		  send_message_form.reset();
  
// 		  // Fetch the chat API data again to update the friends list and messages
// 		  fetchChatData();
// 		});
// 	  });

// 	  function showInvitationPrompt(invitationData) {
// 		// Create a container element for the invitation prompt.
// 		const prompt = document.createElement("div");
// 		prompt.className = "invitation-prompt";
// 		// Style the prompt (adjust styling as needed)
// 		prompt.style.position = "fixed";
// 		prompt.style.top = "20px";
// 		prompt.style.right = "20px";
// 		prompt.style.background = "#fff";
// 		prompt.style.border = "1px solid #ccc";
// 		prompt.style.padding = "20px";
// 		prompt.style.boxShadow = "0 2px 6px rgba(0,0,0,0.3)";
// 		prompt.style.zIndex = "1000";
	  
// 		// Display the invitation message.
// 		const message = document.createElement("p");
// 		message.textContent = `Friend invitation from ${invitationData.fromUsername}`;
// 		prompt.appendChild(message);
	  
// 		// Create an "Accept" button.
// 		const acceptButton = document.createElement("button");
// 		acceptButton.textContent = "Accept";
// 		acceptButton.style.marginRight = "10px";
// 		acceptButton.addEventListener("click", function () {
// 			socket.send(JSON.stringify({
// 				action: "invitation_response",
// 				response: "accepted", // or "declined"
// 				friendshipId: invitationData.friendshipId
// 			}));
			
// 		  document.body.removeChild(prompt);
// 		});
// 		prompt.appendChild(acceptButton);
	  
// 		// Create a "Decline" button.
// 		const declineButton = document.createElement("button");
// 		declineButton.textContent = "Decline";
// 		declineButton.addEventListener("click", function () {
// 		  socket.send(JSON.stringify({
// 			action: "invitation_response",
// 			response: "declined",
// 			friendshipId: invitationData.friendshipId
// 		  }));
// 		  document.body.removeChild(prompt);
// 		});
// 		prompt.appendChild(declineButton);
	  
// 		// Append the prompt to the body.
// 		document.body.appendChild(prompt);
// 	  }


// 	  const blockButton = document.getElementById("block-user");
// 		if (blockButton) {
// 		blockButton.addEventListener("click", function(e) {
// 			e.preventDefault();
// 			console.log("Block button clicked. Current chat ID:", currentChatId);
// 			// Send a WebSocket message to block the user
// 			socket.send(JSON.stringify({
// 				action: "block_user",
// 				target_user_id: currentChatId
// 			}));
// 			// Set a flag to prevent further message sending
// 			window.currentUserBlocked = true;
// 			showNotification("User is blocked. You cannot send messages to this user.", 10000);
// 		});
// 		} else {
// 			console.error("Block button element with id 'block-user' not found.");
// 		}

  
// 	  function showNotification(message, duration) {
// 		const notification = document.createElement("div");
// 		notification.className = "notification";
// 		notification.innerText = message;
// 		// Optionally add some styling directly or via CSS:
// 		notification.style.position = "fixed";
// 		notification.style.bottom = "20px";
// 		notification.style.right = "20px";
// 		notification.style.background = "#f44336";
// 		notification.style.color = "#fff";
// 		notification.style.padding = "10px 20px";
// 		notification.style.borderRadius = "5px";
// 		notification.style.boxShadow = "0 2px 6px rgba(0,0,0,0.3)";
// 		document.body.appendChild(notification);
	  
// 		setTimeout(() => {
// 		  notification.remove();
// 		}, duration);
// 	  }
  
// 	  // Debounce function to limit how often search is executed
// 	  function debounce(func, delay) {
// 		let timeoutId;
// 		return function (...args) {
// 		  clearTimeout(timeoutId);
// 		  timeoutId = setTimeout(() => func.apply(this, args), delay);
// 		};
// 	  }
	  
// 	  const searchInput = document.getElementById("id-friends");
	  
// 	  // Listen for input changes with debounce
// 	  searchInput.addEventListener(
// 		"input",
// 		debounce(function () {
// 		  const query = searchInput.value.trim();
// 		  // Only send query if there is a value
// 		  if (query && socket.readyState === WebSocket.OPEN) {
// 			socket.send(
// 			  JSON.stringify({
// 				action: "search_user",
// 				query: query,
// 			  })
// 			);
// 		  }
// 		}, 300) // 300ms debounce delay
// 	  );
	
	//   socket.addEventListener("message", (e) => {
	// 	console.log("Incoming message:", e);
	// 	// Re-fetch messages for the current chat when a new message arrives.
	// 	// fetchMessagesForChat(currentChatId);
		
	// 	const data = JSON.parse(e.data);

	// 	// When a new invitation is received in pending state
	// 	if (data.action === "invitation") {
	// 		// Show a notification that an invitation is pending
	// 		showNotification("You have a new friend invitation from " + data.fromUsername + " (Pending)", 10000);
	// 		showInvitationPrompt(data);
	// 		// Optionally, you can update your UI (like adding a badge or highlighting the friend list)
	// 		// updateInvitationUI(data.friendshipId, "pending");
	// 	}

	// 	// When the response to an invitation is received (from the receiver)
	// 	if (data.action === "invitation_response_ack") {
	// 		if (data.response === "accepted") {
	// 			showNotification("Your invitation has been accepted!", 10000);
	// 		// Optionally update UI to mark the invitation as accepted, e.g., updateInvitationUI(data.friendshipId, "accepted");
	// 		} else if (data.response === "declined") {
	// 			showNotification("Your invitation has been declined.", 10000);
	// 		// Optionally update UI to mark the invitation as declined or remove it
	// 			// updateInvitationUI(data.friendshipId, "declined");
	// 		}
	// 	}

	// 	// ... handle other actions like search_results or chat messages
	// 	if (data.action === "search_results") {
	// 		// (Your existing code for search results)
	// 		const usersListDiv = document.querySelector(".users-list");
	// 		let usersHtml = "";
	// 		data.users.forEach((user) => {
	// 		usersHtml += `
	// 			<div class="user_info">
	// 			<div class="user-item" data-chat-id="${user.id}">
	// 				<img src="../../static/imgs/default-avatar.png" class="user-avatar" alt="${user.username}">
	// 				<strong>${user.username}</strong>
	// 				<button class="send-invitation" data-user-id="${user.id}" data-username="${user.username}">
	// 				Send Invitation
	// 				</button>
	// 			</div>
	// 			</div>
	// 		`;
	// 		});
	// 		usersListDiv.innerHTML = usersHtml;

	// 		// Attach invitation send event listeners to new buttons
	// 		document.querySelectorAll('.send-invitation').forEach(button => {
	// 		button.addEventListener("click", function (e) {
	// 			e.stopPropagation();
	// 			const targetUserId = this.getAttribute("data-user-id");
	// 			const targetUsername = this.getAttribute("data-username");
	// 			// Send the invitation via WebSocket
	// 			socket.send(JSON.stringify({
	// 				action: "send_invitation",
	// 				target_user_id: targetUserId,
	// 				target_username: targetUsername
	// 			}));
	// 			// Immediately show a notification that your invitation was sent and is pending
	// 			showNotification("Invitation sent to " + targetUsername + " (Pending)", 5000);
	// 			});
	// 		});
					
	// 	}

	// 	// If it's a chat message, re-fetch messages, etc.
	// 	if (data.message) {
	// 		fetchMessagesForChat(currentChatId);
	// 	}
	//   });
  
// 	  // Function to fetch chat data (friends list and messages)
// 	  function fetchChatData() {
// 		fetch("http://" + dominePort + "/api")
// 		  .then((response) => response.json())
// 		  .then((data) => {
// 			// Update logged in user's name
// 			document.getElementById("user-name").textContent = data.username;
// 			USER_ID = data.id;
  
// 			// Build the friends list using API data.
// 			let friendsHtml = "";
// 			data.friends.forEach((friend, index) => {
// 			  friendsHtml += `
// 				<div class="user_info1">
// 				  <div class="user-item1 ${index === 0 ? "active" : ""}" data-chat-id="${friend.id}" data-blocked="${friend.blocked}">
// 					<img src="../../static/imgs/Screen Shot 2024-10-02 at 2.04.41 AM.png" class="user-avatar">
// 					<strong>${friend.username}</strong>
// 				  </div>
// 				</div>
// 			  `;
// 			});
  
// 			// Collecting friends with their latest message timestamp
// 			let friendsData = [];
// 			data.friends.forEach((friend, index) => {
// 			  let latestMessage = null;
// 			  // Find the latest message for each friend
// 			  data.messages.forEach((message) => {
// 				if (message.sent_by_id == friend.id || message.send_to_id == friend.id) {
// 				  if (!latestMessage || new Date(message.timestamp) > new Date(latestMessage.timestamp)) {
// 					latestMessage = message;
// 				  }
// 				}
// 			  });
// 			  if (latestMessage) {
// 				friendsData.push({
// 				  friend,
// 				  latestMessageTimestamp: new Date(latestMessage.timestamp),
// 				  message: latestMessage
// 				});
// 			  }
// 			});
  
// 			// Sorting friends by the latest message timestamp in descending order
// 			friendsData.sort((a, b) => b.latestMessageTimestamp - a.latestMessageTimestamp);
  
// 			// Building the HTML based on sorted friends
// 			let friendsHtml1 = "";
// 			friendsData.forEach((data, index) => {
// 			  friendsHtml1 += `
// 				<div class="user_info">
// 				  <div class="user-item ${index === 0 ? "active" : ""}" data-chat-id="${data.friend.id}">
// 					<div>
// 					  <strong>${data.friend.username}</strong>
// 					  <div class="message-content">${data.message.content}</div>
// 					  <div class="last-seen">
// 						${formatTimestamp(data.message.timestamp)}
// 					  </div>
// 					</div>
// 				  </div>
// 				</div>
// 			  `;
// 			});
  
// 			// Update the friends list in the DOM
// 			document.querySelector(".users-list").innerHTML = friendsHtml1;
// 			document.querySelector(".friend-list").innerHTML = friendsHtml;
// 		  })
// 		  .catch((error) => {
// 			console.error("Error fetching chat data:", error);
// 		  });
// 	  }
	
// 	  // Another duplicate fetchChatData (if needed)
// 	  function fetchChatData() {
// 		fetch("http://" + dominePort + "/api")
// 		  .then((response) => response.json())
// 		  .then((data) => {
// 			// Update logged in user's name
// 			document.getElementById("user-name").textContent = data.username;
// 			USER_ID = data.id;
  
// 			// Build the friends list using API data.
// 			let friendsHtml = "";
// 			data.friends.forEach((friend, index) => {
// 			  friendsHtml += `
// 				<div class="user_info1">
// 				  <div class="user-item1 ${index === 0 ? "active" : ""}" data-chat-id="${friend.id}" data-blocked="${friend.blocked}">
// 					<img src="../../static/imgs/Screen Shot 2024-10-02 at 2.04.41 AM.png" class="user-avatar">
// 					<strong>${friend.username}</strong>
// 				  </div>
// 				</div>
// 			  `;
// 			});
  
// 			// Collecting friends with their latest message timestamp
// 			let friendsData = [];
// 			data.friends.forEach((friend, index) => {
// 			  let latestMessage = null;
// 			  // Find the latest message for each friend
// 			  data.messages.forEach((message) => {
// 				if (message.sent_by_id == friend.id || message.send_to_id == friend.id) {
// 				  if (!latestMessage || new Date(message.timestamp) > new Date(latestMessage.timestamp)) {
// 					latestMessage = message;
// 				  }
// 				}
// 			  });
// 			  if (latestMessage) {
// 				friendsData.push({
// 				  friend,
// 				  latestMessageTimestamp: new Date(latestMessage.timestamp),
// 				  message: latestMessage
// 				});
// 			  }
// 			});
  
// 			// Sorting friends by the latest message timestamp in descending order
// 			friendsData.sort((a, b) => b.latestMessageTimestamp - a.latestMessageTimestamp);
  
// 			// Building the HTML based on sorted friends
// 			let friendsHtml1 = "";
// 			friendsData.forEach((data, index) => {
// 			  friendsHtml1 += `
// 				<div class="user_info">
// 				  <div class="user-item ${index === 0 ? "active" : ""}" data-chat-id="${data.friend.id}">
// 					<div>
// 					  <strong>${data.friend.username}</strong>
// 					  <div class="message-content">${data.message.content}</div>
// 					  <div class="last-seen">
// 							${formatTimestamp(data.message.timestamp)}
// 					  </div>
// 					</div>
// 				  </div>
// 				</div>
// 			  `;
// 			});
  
// 			// Update the friends list in the DOM
// 			document.querySelector(".users-list").innerHTML = friendsHtml1;
// 			document.querySelector(".friend-list").innerHTML = friendsHtml;
// 		  })
// 		  .catch((error) => {
// 			console.error("Error fetching chat data:", error);
// 		  });
// 	  }
	
// 	  socket.addEventListener("error", (e) => {
// 		console.error("Socket error:", e);
// 	  });
  
// 	  socket.addEventListener("close", (e) => {
// 		console.log("Socket closed:", e);
// 	  });
// 	}
//   });
  


















































//   function formatTimestamp(timestamp) {
// 	const date = new Date(timestamp);
  
// 	// Format hours and minutes
// 	let hours = date.getHours();
// 	const minutes = date.getMinutes().toString().padStart(2, '0');
// 	const ampm = hours >= 12 ? 'pm' : 'am';
	
// 	// Convert to 12-hour format
// 	hours = hours % 12 || 12;
  
// 	// Format "Today" or "Yesterday"
// 	const now = new Date();
// 	const isToday = date.toDateString() === now.toDateString();
// 	const isYesterday = date.toDateString() === new Date(now.setDate(now.getDate() - 1)).toDateString();
// 	const dayText = isToday ? "Today" : isYesterday ? "Yesterday" : date.toLocaleDateString();
  
// 	return `${dayText}, ${hours}:${minutes} ${ampm}`;
//   }
  
//   let currentChatId = null;
//   const loc = window.location;
//   const dominePort = loc.host;
  
//   document.addEventListener("DOMContentLoaded", function () {
// 	let USER_ID;
// 	// 1. Fetch chat API data to populate friends list and messages.
// 	fetch("http://" + dominePort + "/api")
// 	  .then((response) => response.json())
// 	  .then((data) => {
// 		// Update logged in user's name
// 		document.getElementById("user-name").textContent = data.username;
// 		USER_ID = data.id;
	  
// 		// Build the friends list using API data.
// 		let friendsHtml = "";
// 		data.friends.forEach((friend, index) => {
// 		  // Add a data attribute for blocked status (assume friend.blocked is true/false)
// 		  friendsHtml += `
// 			<div class="user_info1">
// 			  <div class="user-item1 ${index === 0 ? "active" : ""}" data-chat-id="${friend.id}" data-blocked="${friend.blocked}">
// 				<img src="../../static/imgs/Screen Shot 2024-10-02 at 2.04.41 AM.png" class="user-avatar">
// 				<strong>${friend.username}</strong>
// 			  </div>
// 			</div>
// 		  `;
// 		});
		
// 		// Check if there are friends, and then build the second friends list
// 		let friendsData = [];
// 		// Collecting friends with their latest message timestamp
// 		data.friends.forEach((friend, index) => {
// 		  let latestMessage = null;
// 		  // Find the latest message for each friend
// 		  data.messages.forEach((message) => {
// 			if (message.sent_by_id == friend.id || message.send_to_id == friend.id) {
// 			  if (!latestMessage || new Date(message.timestamp) > new Date(latestMessage.timestamp)) {
// 				latestMessage = message;
// 			  }
// 			}
// 		  });
// 		  if (latestMessage) {
// 			friendsData.push({
// 			  friend,
// 			  latestMessageTimestamp: new Date(latestMessage.timestamp),
// 			  message: latestMessage
// 			});
// 		  }
// 		});
		
// 		// Sorting friends by the latest message timestamp in descending order
// 		friendsData.sort((a, b) => b.latestMessageTimestamp - a.latestMessageTimestamp);
		
// 		// Building the HTML based on sorted friends
// 		let friendsHtml1 = "";
// 		friendsData.forEach((data, index) => {
// 		  const contentMessage = data.message.content;
// 		  const words = contentMessage.split(' '); // Split the content by space to get the words
// 		  const firstFourWords = words.slice(0, 4).join(' '); // Get the first 4 words
// 		  const truncatedMessage = firstFourWords + (words.length > 4 ? ' ...' : ''); // Add '...' if there are more than 4 words
		
// 		  friendsHtml1 += `
// 			<div class="user_info">
// 			  <div class="user-item ${index === 0 ? "active" : ""}" data-chat-id="${data.friend.id}">
// 				<div class="header-users">
// 				  <img src="../../static/imgs/Screen Shot 2024-10-02 at 2.04.41 AM.png" class="user-avatar">
// 				  <div class="items-user">
// 					<strong>${data.friend.username}</strong>
// 					<div class="content-message">
// 					  ${truncatedMessage}
// 					</div>
// 				  </div>
// 				</div>
// 				<div class="last-seen">
// 				  ${formatTimestamp(data.message.timestamp)}
// 				</div>
// 			  </div>
// 			</div>
// 		  `;
// 		});
		
// 		document.querySelector(".users-list").innerHTML = friendsHtml1;
// 		document.querySelector(".friend-list").innerHTML = friendsHtml;
// 		// Initialize chat functionality.
// 		initializeChat();
// 	  })
// 	  .catch((error) => {
// 		console.error("Error fetching chat data:", error);
// 	  });
  
// 	// 2. Initialize chat functionalities.
// 	function initializeChat() {
// 	  const input_message = document.getElementById("input-message");
// 	  const body_message = document.querySelector(".chat-messages");
// 	  const send_message_form = document.getElementById("send-message-form");
// 	  const userItems = document.querySelectorAll(".user-item");
// 	  const chatHeader = document.getElementById("chat-header-username");
// 	  const button = document.querySelector(".dropdown-button");
// 	  const icon = document.querySelector(".dropdown-icon");
// 	  const menu = document.querySelector(".dropdown-content");
  
// 	  if (!button || !icon || !menu) {
// 		console.error("Dropdown elements not found.");
// 		return; // Stop script execution if elements are missing
// 	  }
  
// 	  button.addEventListener("click", function (event) {
// 		const isOpen = menu.classList.toggle("show");
// 		icon.src = isOpen ? "../../static/imgs/close.png" : "../../static/imgs/dots.png"; // Change icon
// 		event.stopPropagation();
// 	  });
  
// 	  // Close dropdown if user clicks outside
// 	  document.addEventListener("click", function (event) {
// 		if (!button.contains(event.target) && !menu.contains(event.target)) {
// 		  menu.classList.remove("show");
// 		  icon.src = "../../static/imgs/dots.png"; // Reset to original icon
// 		}
		
// 		let clickedItem = event.target.closest(".user-item1, .user-item");
// 		if (clickedItem) {
// 		  activateUser(clickedItem);
// 		}
// 	  });
	  
// 	  // Activate a user and fetch messages.
// 	  function activateUser(item) {
// 		userItems.forEach((user) => user.classList.remove("active"));
// 		item.classList.add("active");
		
// 		const userName = item.querySelector("strong").textContent;
// 		const chatId = item.getAttribute("data-chat-id");
// 		const userImageSrc = item.querySelector("img")?.src || "default-avatar.png"; // Fallback if no image found
// 		// Read the blocked status and convert to boolean
// 		window.currentUserBlocked = item.getAttribute("data-blocked") === "true";
// 		currentChatId = chatId;
		
// 		chatHeader.innerHTML = `<img src="../../static/imgs/Screen Shot 2024-10-02 at 2.05.14 AM.png" alt="${userName}" class="chat-header-img"> ${userName}`;
// 		body_message.innerHTML = "";
// 		fetchMessagesForChat(chatId);
// 	  }
  
// 	  // Automatically select the first user if available.
// 	  if (userItems.length > 0) {
// 		activateUser(userItems[0]);
// 	  }
	  
// 	  // Function to fetch messages for the selected chatId.
// 	  function fetchMessagesForChat(chatId) {
// 		fetch("http://" + dominePort + "/api")
// 		  .then((response) => response.json())
// 		  .then((data) => {
// 			let messagesHtml = "";
// 			if (data.messages && data.messages.length > 0) {
// 			  data.messages.forEach((message) => {
// 				if (message.sent_by_id == data.id && message.send_to_id == chatId) {
// 				  messagesHtml += `
// 					<div class="message sent">
// 					  <div class="message-content">${message.content}</div>
// 					  <p><small>${formatTimestamp(message.timestamp)}</small></p>
// 					</div>
// 				  `;
// 				} else if (message.sent_by_id == chatId) {
// 				  messagesHtml += `
// 					<div class="message received">
// 					  <div class="message-content">${message.content}</div>
// 					  <p><small>${formatTimestamp(message.timestamp)}</small></p>
// 					</div>
// 				  `;
// 				}
// 			  });
// 			} else {
// 			  messagesHtml = "<p>No messages found.</p>";
// 			}
// 			body_message.innerHTML = messagesHtml;
// 			// Scroll to the last message after updating chat
// 			scrollToBottom();
// 		  })
// 		  .catch((error) => {
// 			console.error("Error fetching messages:", error);
// 		  });
// 	  }
  
// 	  function scrollToBottom() {
// 		const chatMessages = document.querySelector(".chat-messages");
// 		chatMessages.scrollTop = chatMessages.scrollHeight;
// 	  }
  
// 	  // 3. Set up the WebSocket connection.
// 	  let wsStart = "ws://";
// 	  if (loc.protocol === "https:") {
// 		wsStart = "wss://";
// 	  }
// 	  const endpoint = wsStart + loc.host + loc.pathname;
	  
// 	  console.log("hamza:", dominePort);
// 	  const socket = new WebSocket(endpoint);
  
// 	  socket.addEventListener("open", (e) => {
// 		console.log("Socket opened:", e);
// 		send_message_form.addEventListener("submit", function (e) {
// 		  e.preventDefault();
  
// 		  // Check if the current chat partner is blocked.
// 		  if (window.currentUserBlocked) {
// 			showNotification("Cannot send message: User is blocked.", 10000);
// 			return;
// 		  }
  
// 		  const message = input_message.value;
// 		  const newData = {
// 			message: message,
// 			sent_by: USER_ID,
// 			send_to: currentChatId,
// 		  };
  
// 		  // Send the message
// 		  socket.send(JSON.stringify(newData));
// 		  send_message_form.reset();
  
// 		  // Fetch the chat API data again to update the friends list and messages
// 		  fetchChatData();
// 		});
// 	  });
  
// 	  function showNotification(message, duration) {
// 		const notification = document.createElement("div");
// 		notification.className = "notification";
// 		notification.innerText = message;
// 		// Optionally add some styling directly or via CSS:
// 		notification.style.position = "fixed";
// 		notification.style.bottom = "20px";
// 		notification.style.right = "20px";
// 		notification.style.background = "#f44336";
// 		notification.style.color = "#fff";
// 		notification.style.padding = "10px 20px";
// 		notification.style.borderRadius = "5px";
// 		notification.style.boxShadow = "0 2px 6px rgba(0,0,0,0.3)";
// 		document.body.appendChild(notification);
	  
// 		setTimeout(() => {
// 		  notification.remove();
// 		}, duration);
// 	  }
  
// 	  // Debounce function to limit how often search is executed
// 	  function debounce(func, delay) {
// 		let timeoutId;
// 		return function (...args) {
// 		  clearTimeout(timeoutId);
// 		  timeoutId = setTimeout(() => func.apply(this, args), delay);
// 		};
// 	  }
	  
// 	  const searchInput = document.getElementById("id-friends");
	  
// 	  // Listen for input changes with debounce
// 	  searchInput.addEventListener(
// 		"input",
// 		debounce(function () {
// 		  const query = searchInput.value.trim();
// 		  // Only send query if there is a value
// 		  if (query && socket.readyState === WebSocket.OPEN) {
// 			socket.send(
// 			  JSON.stringify({
// 				action: "search_user",
// 				query: query,
// 			  })
// 			);
// 		  }
// 		}, 300) // 300ms debounce delay
// 	  );
	
// 	  // Listen for messages from the WebSocket
// 		socket.addEventListener("message", (e) => {
// 			console.log("Incoming message:", e);
// 			const data = JSON.parse(e.data);
			
// 			if (data.action === "invitation") {
// 			showInvitationNotification(data);
// 			} else if (data.action === "search_results") {
// 			// (Handle search results as shown above)
// 			} else {
// 			// Handle other actions (e.g., chat messages)
// 			fetchMessagesForChat(currentChatId);
// 			}
// 		});
		
// 		// Function to create and display the invitation notification
// 		function showInvitationNotification(invitationData) {
// 			const notification = document.createElement("div");
// 			notification.className = "invitation-notification";
// 			notification.innerHTML = `
// 			<div class="invitation-content">
// 				<p>${invitationData.fromUsername} has sent you an invitation.</p>
// 				<button class="accept-invitation" data-invitation-id="${invitationData.invitationId}">
// 				Accept
// 				</button>
// 				<button class="decline-invitation" data-invitation-id="${invitationData.invitationId}">
// 				Decline
// 				</button>
// 			</div>
// 			`;
// 			document.body.appendChild(notification);
		
// 			// Event listener for Accept
// 			notification.querySelector(".accept-invitation").addEventListener("click", function () {
// 			socket.send(JSON.stringify({
// 				action: "invitation_response",
// 				response: "accepted",
// 				invitationId: invitationData.invitationId
// 			}));
// 			notification.remove();
// 			});
// 			// Event listener for Decline
// 			notification.querySelector(".decline-invitation").addEventListener("click", function () {
// 			socket.send(JSON.stringify({
// 				action: "invitation_response",
// 				response: "declined",
// 				invitationId: invitationData.invitationId
// 			}));
// 			notification.remove();
// 			});
// 		}
		
  
// 	  // Function to fetch chat data (friends list and messages)
// 	  function fetchChatData() {
// 		fetch("http://" + dominePort + "/api")
// 		  .then((response) => response.json())
// 		  .then((data) => {
// 			// Update logged in user's name
// 			document.getElementById("user-name").textContent = data.username;
// 			USER_ID = data.id;
  
// 			// Build the friends list using API data.
// 			let friendsHtml = "";
// 			data.friends.forEach((friend, index) => {
// 			  friendsHtml += `
// 				<div class="user_info1">
// 				  <div class="user-item1 ${index === 0 ? "active" : ""}" data-chat-id="${friend.id}" data-blocked="${friend.blocked}">
// 					<img src="../../static/imgs/Screen Shot 2024-10-02 at 2.04.41 AM.png" class="user-avatar">
// 					<strong>${friend.username}</strong>
// 				  </div>
// 				</div>
// 			  `;
// 			});
  
// 			// Collecting friends with their latest message timestamp
// 			let friendsData = [];
// 			data.friends.forEach((friend, index) => {
// 			  let latestMessage = null;
// 			  // Find the latest message for each friend
// 			  data.messages.forEach((message) => {
// 				if (message.sent_by_id == friend.id || message.send_to_id == friend.id) {
// 				  if (!latestMessage || new Date(message.timestamp) > new Date(latestMessage.timestamp)) {
// 					latestMessage = message;
// 				  }
// 				}
// 			  });
// 			  if (latestMessage) {
// 				friendsData.push({
// 				  friend,
// 				  latestMessageTimestamp: new Date(latestMessage.timestamp),
// 				  message: latestMessage
// 				});
// 			  }
// 			});
  
// 			// Sorting friends by the latest message timestamp in descending order
// 			friendsData.sort((a, b) => b.latestMessageTimestamp - a.latestMessageTimestamp);
  
// 			// Building the HTML based on sorted friends
// 			let friendsHtml1 = "";
// 			friendsData.forEach((data, index) => {
// 			  friendsHtml1 += `
// 				<div class="user_info">
// 				  <div class="user-item ${index === 0 ? "active" : ""}" data-chat-id="${data.friend.id}">
// 					<div>
// 					  <strong>${data.friend.username}</strong>
// 					  <div class="message-content">${data.message.content}</div>
// 					  <div class="last-seen">
// 						${formatTimestamp(data.message.timestamp)}
// 					  </div>
// 					</div>
// 				  </div>
// 				</div>
// 			  `;
// 			});
  
// 			// Update the friends list in the DOM
// 			document.querySelector(".users-list").innerHTML = friendsHtml1;
// 			document.querySelector(".friend-list").innerHTML = friendsHtml;
// 		  })
// 		  .catch((error) => {
// 			console.error("Error fetching chat data:", error);
// 		  });
// 	  }
	
// 	  // Another duplicate fetchChatData (if needed)
// 	  function fetchChatData() {
// 		fetch("http://" + dominePort + "/api")
// 		  .then((response) => response.json())
// 		  .then((data) => {
// 			// Update logged in user's name
// 			document.getElementById("user-name").textContent = data.username;
// 			USER_ID = data.id;
  
// 			// Build the friends list using API data.
// 			let friendsHtml = "";
// 			data.friends.forEach((friend, index) => {
// 			  friendsHtml += `
// 				<div class="user_info1">
// 				  <div class="user-item1 ${index === 0 ? "active" : ""}" data-chat-id="${friend.id}" data-blocked="${friend.blocked}">
// 					<img src="../../static/imgs/Screen Shot 2024-10-02 at 2.04.41 AM.png" class="user-avatar">
// 					<strong>${friend.username}</strong>
// 				  </div>
// 				</div>
// 			  `;
// 			});
  
// 			// Collecting friends with their latest message timestamp
// 			let friendsData = [];
// 			data.friends.forEach((friend, index) => {
// 			  let latestMessage = null;
// 			  // Find the latest message for each friend
// 			  data.messages.forEach((message) => {
// 				if (message.sent_by_id == friend.id || message.send_to_id == friend.id) {
// 				  if (!latestMessage || new Date(message.timestamp) > new Date(latestMessage.timestamp)) {
// 					latestMessage = message;
// 				  }
// 				}
// 			  });
// 			  if (latestMessage) {
// 				friendsData.push({
// 				  friend,
// 				  latestMessageTimestamp: new Date(latestMessage.timestamp),
// 				  message: latestMessage
// 				});
// 			  }
// 			});
  
// 			// Sorting friends by the latest message timestamp in descending order
// 			friendsData.sort((a, b) => b.latestMessageTimestamp - a.latestMessageTimestamp);
  
// 			// Building the HTML based on sorted friends
// 			let friendsHtml1 = "";
// 			friendsData.forEach((data, index) => {
// 			  friendsHtml1 += `
// 				<div class="user_info">
// 				  <div class="user-item ${index === 0 ? "active" : ""}" data-chat-id="${data.friend.id}">
// 					<div>
// 					  <strong>${data.friend.username}</strong>
// 					  <div style="font-size: 14px; color: #444;">${data.message.content}</div>
// 					  <div style="font-size: 12px; color: #666;">Last seen ${formatTimestamp(data.message.timestamp)}</div>
// 					</div>
// 				  </div>
// 				</div>
// 			  `;
// 			});
  
// 			// Update the friends list in the DOM
// 			document.querySelector(".users-list").innerHTML = friendsHtml1;
// 			document.querySelector(".friend-list").innerHTML = friendsHtml;
// 		  })
// 		  .catch((error) => {
// 			console.error("Error fetching chat data:", error);
// 		  });
// 	  }
	
// 	  socket.addEventListener("error", (e) => {
// 		console.error("Socket error:", e);
// 	  });
  
// 	  socket.addEventListener("close", (e) => {
// 		console.log("Socket closed:", e);
// 	  });
// 	}
//   });
  