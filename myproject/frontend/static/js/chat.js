// let currentChatId = null;

// document.addEventListener("DOMContentLoaded", function () {
//   let USER_ID;
//   // 1. Fetch chat API data to populate friends list and messages.
//   fetch("http://127.0.0.1:8000/chat/api")
//     .then((response) => response.json())
//     .then((data) => {
//       // Update logged in user's name (if provided by your API)
//       document.getElementById("user-name").textContent = data.username;
//       USER_ID = data.id;

//       // Build the friends list using API data.
//       let friendsHtml = "";
//       data.friends.forEach((friend, index) => {
//         friendsHtml += '<div class="user_info">';
//         friendsHtml +=
//           '<div class="user-item ' +
//           (index === 0 ? "active" : "") +
//           '" data-chat-id="' +
//           friend.id +
//           '">';
//         friendsHtml += "<div>";
//         friendsHtml += "<strong>" + friend.username + "</strong>";
//         friendsHtml +=
//           '<div style="font-size: 12px; color: #666;">Last seen 9h ago</div>';
//         friendsHtml += "</div>";
//         friendsHtml += '<span class="notification-badge">5</span>';
//         friendsHtml += "</div></div>";
//       });
//       document.querySelector(".users-list").innerHTML = friendsHtml;

//       // Build the chat messages list.
//       initializeChat();
//     })
//     .catch((error) => {
//       console.error("Error fetching chat data:", error);
//     });

//   // 2. Function to initialize chat functionality (user selection, WebSocket, etc.)
//   function initializeChat() {
//     // Cache common selectors.
//     const input_message = document.getElementById("input-message");
//     const body_message = document.querySelector(".chat-messages");
//     const send_message_form = document.getElementById("send-message-form");

//     const userItems = document.querySelectorAll(".user-item");
//     const chatHeader = document.querySelector(".chat-header span");

//     // Function to activate (select) a user from the list.
//     function activateUser(item) {
//       // Remove the active class from all user items.
//       userItems.forEach((user) => user.classList.remove("active"));

//       // Add the active class to the clicked item.
//       item.classList.add("active");

//       // Get user details from the selected element.
//       const userName = item.querySelector("strong").textContent;
//       const chatId = item.getAttribute("data-chat-id");
//       currentChatId = chatId;
//       console.log("Selected: " + userName + ", Chat ID: " + chatId);

//       // Update the chat header.
//       chatHeader.textContent = userName;
//       // Clear previous messages.
//       body_message.innerHTML = "";

//       // Fetch messages for the newly selected chatId.
//       fetchMessagesForChat(chatId);
//     }

//     // Bind click event to each user item.
//     userItems.forEach((item) => {
//       item.addEventListener("click", function () {
//         activateUser(this);
//       });
//     });

//     // Automatically select the first user if available.
//     if (userItems.length > 0) {
//       activateUser(userItems[0]);
//     }

//     // Function to fetch messages for the selected chatId.
//     function fetchMessagesForChat(chatId) {
//       fetch("http://127.0.0.1:8000/chat/api")
//         .then((response) => response.json())
//         .then((data) => {
//           let messagesHtml = "";
//           if (data.messages && data.messages.length > 0) {
//             data.messages.forEach((message) => {
//               if (
//                 message.sent_by_id == data.id &&
//                 message.send_to_id == chatId
//               ) {
//                 messagesHtml += '<div class="message sent">';
//                 messagesHtml +=
//                   '<div class="message-content">' + message.content + "</div>";
//                 messagesHtml +=
//                   "<p><small>Sent at: " + message.timestamp + "</small></p>";
//                 messagesHtml += "</div>";
//               } else if (message.sent_by_id == chatId) {
//                 messagesHtml += '<div class="message received">';
//                 messagesHtml +=
//                   '<div class="message-content">' + message.content + "</div>";
//                 messagesHtml +=
//                   "<p><small>Received at: " + message.timestamp + "</small></p>";
//                 messagesHtml += "</div>";
//               }
//             });
//           } else {
//             messagesHtml = "<p>No messages found.</p>";
//           }
//           body_message.innerHTML = messagesHtml;
//         })
//         .catch((error) => {
//           console.error("Error fetching messages:", error);
//         });
//     }

//     // 3. Set up the WebSocket connection.
//     const loc = window.location;
//     let wsStart = "ws://";
//     if (loc.protocol === "https:") {
//       wsStart = "wss://";
//     }
//     const endpoint = wsStart + loc.host + loc.pathname;
//     const socket = new WebSocket(endpoint);

//     socket.addEventListener("open", (e) => {
//       console.log("Socket opened:", e);

// 	send_message_form.addEventListener("submit", function (e) {
// 		e.preventDefault();
// 		const message = input_message.value;
// 		const newData = {
// 		  message: message,
// 		  sent_by: USER_ID,
// 		  send_to: currentChatId,
// 		};
// 		socket.send(JSON.stringify(newData));
// 		send_message_form.reset();
// 	  });
//     });

// 	socket.addEventListener("message", (e) => {
// 		console.log("Incoming message:", e);
// 		let newData = JSON.parse(e.data);
// 		let newMessage = newData.message;
// 		let sent_by_id = newData.sent_by;
// 		let send_to_id = newData.send_to;
// 		console.log("Message sent by:", sent_by_id);
// 		// SendNewMessage(newMessage, sent_by_id );
		
  
// 		// Instead of appending the new message manually,
// 		// re-fetch all messages for the chat.
// 		fetchMessagesForChat(currentChatId);

// 	});

//     socket.addEventListener("error", (e) => {
//       console.error("Socket error:", e);
//     });

//     socket.addEventListener("close", (e) => {
//       console.log("Socket closed:", e);
//     });

//     // Function to display a new message in the chat.
// 	// function SendNewMessage(newMessage, sent_by_id , send_to_id) {
// 	// 	// Validate message to avoid empty or malformed messages.
// 	// 	if (
// 	// 	  newMessage.trim() === "" ||
// 	// 	  (newMessage.includes("<") && newMessage.includes(">") && newMessage.includes("/"))
// 	// 	) {
// 	// 	  return false;
// 	// 	}
	  
// 	// 	// Construct the message element.
// 	// 	let message_element = "";
// 	// 	if (sent_by_id == USER_ID) {
// 	// 	  message_element = `<div class="message sent">
// 	// 							<div class="message-content">
// 	// 							  ${newMessage}
// 	// 							</div>
// 	// 						  </div>`;
// 	// 	}
// 	// 	else if (send_to_id )
// 	// 	{
// 	// 	  message_element = `<div class="message received">
// 	// 							<div class="message-content">
// 	// 							  ${newMessage}
// 	// 							</div>
// 	// 						  </div>`;
// 	// 	}
	  
// 	// 	// Append the new message and scroll to the bottom.
// 	// 	body_message.insertAdjacentHTML("beforeend", message_element);
// 	// 	body_message.scrollTop = body_message.scrollHeight;
	  
// 	// 	// Reset the message input field.
// 	// 	input_message.value = "";
// 	// }
	

// 	function fetchMessagesForChat(chatId) {
// 		fetch("http://127.0.0.1:8000/chat/api")
// 		  .then((response) => response.json())
// 		  .then((data) => {
// 			let messagesHtml = "";
// 			if (data.messages && data.messages.length > 0) {
// 			  data.messages.forEach((message) => {
// 				if (
// 				  message.sent_by_id == data.id &&  // assuming data.id is the current user's ID
// 				  message.send_to_id == chatId
// 				) {
// 				  messagesHtml += '<div class="message sent">';
// 				  messagesHtml += '<div class="message-content">' + message.content + "</div>";
// 				  messagesHtml += "<p><small>Sent at: " + message.timestamp + "</small></p>";
// 				  messagesHtml += "</div>";
// 				} else if (message.sent_by_id == chatId) {
// 				  messagesHtml += '<div class="message received">';
// 				  messagesHtml += '<div class="message-content">' + message.content + "</div>";
// 				  messagesHtml += "<p><small>Received at: " + message.timestamp + "</small></p>";
// 				  messagesHtml += "</div>";
// 				}
// 			  });
// 			} else {
// 			  messagesHtml = "<p>No messages found.</p>";
// 			}
// 			body_message.innerHTML = messagesHtml;
// 		  })
// 		  .catch((error) => {
// 			console.error("Error fetching messages:", error);
// 		  });
// 	  }


// 	}
// });


function formatTimestamp(timestamp) {
    const date = new Date(timestamp);

    // Format hours and minutes
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'pm' : 'am';
    
    // Convert to 12-hour format
    hours = hours % 12 || 12;

    // Format "Today" or "Yesterday"
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    const isYesterday = date.toDateString() === new Date(now.setDate(now.getDate() - 1)).toDateString();
    const dayText = isToday ? "Today" : isYesterday ? "Yesterday" : date.toLocaleDateString();

    return `${dayText}, ${hours}:${minutes} ${ampm}`;
}

let currentChatId = null;

const loc = window.location;
const dominePort = loc.host;

document.addEventListener("DOMContentLoaded", function () {
  let USER_ID;
  // 1. Fetch chat API data to populate friends list and messages.
  fetch("http://" + dominePort + "/api")
    .then((response) => response.json())
    .then((data) => {
      // Update logged in user's name
      document.getElementById("user-name").textContent = data.username;
      USER_ID = data.id;

      // Build the friends list using API data.
      let friendsHtml = "";
      data.friends.forEach((friend, index) => {
        friendsHtml += `
          <div class="user_info">
            <div class="user-item ${index === 0 ? "active" : ""}" data-chat-id="${friend.id}">
              <div>
                <strong>${friend.username}</strong>
                <div style="font-size: 12px; color: #666;">Last seen 9h ago</div>
              </div>
              <span class="notification-badge">5</span>
            </div>
          </div>
        `;
      });
      document.querySelector(".users-list").innerHTML = friendsHtml;

      // Initialize chat functionality.
      initializeChat();
    })
    .catch((error) => {
      console.error("Error fetching chat data:", error);
    });

  // 2. Initialize chat functionalities.
  function initializeChat() {
    const input_message = document.getElementById("input-message");
    const body_message = document.querySelector(".chat-messages");
    const send_message_form = document.getElementById("send-message-form");
    const userItems = document.querySelectorAll(".user-item");
    const chatHeader = document.getElementById("chat-header-username");

    // Activate a user and fetch messages.
    function activateUser(item) {
      userItems.forEach((user) => user.classList.remove("active"));
      item.classList.add("active");

      const userName = item.querySelector("strong").textContent;
      const chatId = item.getAttribute("data-chat-id");
      currentChatId = chatId;
      
      chatHeader.textContent = userName;
      body_message.innerHTML = "";
      fetchMessagesForChat(chatId);
    }

    // Bind click event to each user item.
    userItems.forEach((item) => {
      item.addEventListener("click", function () {
        activateUser(this);
      });
    });
    
    // Automatically select the first user if available.
    if (userItems.length > 0) {
      activateUser(userItems[0]);
    }
	
    // Function to fetch messages for the selected chatId.
    function fetchMessagesForChat(chatId) {
		fetch("http://" + dominePort + "/api")
		  .then((response) => response.json())
		  .then((data) => {
			
			let messagesHtml = "";
			if (data.messages && data.messages.length > 0) {
			  data.messages.forEach((message) => {
				
				if (message.sent_by_id == data.id && message.send_to_id == chatId) {
				  messagesHtml += `
					<div class="message sent" >
					  <div class="message-content">${message.content}</div>
					  <p><small>Sent at: ${formatTimestamp(message.timestamp)}</small></p>
					</div>
				  `;
				} else if (message.sent_by_id == chatId) {
				  messagesHtml += `
					<div class="message received">
					  <div class="message-content">${message.content}</div>
					  <p><small>Received at: ${formatTimestamp(message.timestamp)}</small></p>
					</div>
				  `;
				}
			  });
			} else {
			  messagesHtml = "<p>No messages found.</p>";
			}
			body_message.innerHTML = messagesHtml;
	  
			// Scroll to the last message after updating chat
			scrollToBottom();
		  })
		  .catch((error) => {
			console.error("Error fetching messages:", error);
		  });
	  }

	  function scrollToBottom() {
		const chatMessages = document.querySelector(".chat-messages");
		chatMessages.scrollTop = chatMessages.scrollHeight;
	  }

    // 3. Set up the WebSocket connection.
    
    let wsStart = "ws://";
    if (loc.protocol === "https:") {
      wsStart = "wss://";
    }
    const endpoint = wsStart + loc.host + loc.pathname;
    
	console.log("hamza : " ,dominePort)
    const socket = new WebSocket(endpoint);

    socket.addEventListener("open", (e) => {
      console.log("Socket opened:", e);
      send_message_form.addEventListener("submit", function (e) {
        e.preventDefault();
        const message = input_message.value;
        const newData = {
          message: message,
          sent_by: USER_ID,
          send_to: currentChatId,
        };
        socket.send(JSON.stringify(newData));
        send_message_form.reset();
      });
    });

    socket.addEventListener("message", (e) => {
      console.log("Incoming message:", e);
      // Re-fetch messages for the current chat when a new message arrives.
      fetchMessagesForChat(currentChatId);
    });

    socket.addEventListener("error", (e) => {
      console.error("Socket error:", e);
    });

    socket.addEventListener("close", (e) => {
      console.log("Socket closed:", e);
    });
  }
});