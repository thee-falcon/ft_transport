let input_message = $('#input-message')
let body_message = $('.chat-messages')
let send_message_form = $('#send-message-form')
let user_list = $('.users-list')
const USER_ID = $('#logged-in-user').val()




document.addEventListener('DOMContentLoaded', () => {
    let currentChatId = null; // Variable to store the selected chat ID

    const userItems = document.querySelectorAll('.user-item');
	const chatHeader = document.querySelector('.chat-header span'); // Ensure correct selection
	
    
    function activateUser(item) {
        // Remove active class from all users
        userItems.forEach(u => u.classList.remove('active'));
        
        // Add active class to clicked user
        item.classList.add('active');
        
        // Get selected user details
        const userName = item.querySelector('strong').textContent;
        const chatId = item.dataset.chatId; // Retrieve chat-id from data attribute
        currentChatId = chatId; // Store the selected chat ID in the variable
        console.log(`Selected: ${userName}, Chat ID: ${chatId}`);
        // console.log("haarab");
		chatHeader.textContent = userName; // ✅ Correctly update header
    }


    userItems.forEach(item => {
        item.addEventListener('click', () => activateUser(item));
    });
	// console.log("hamza : " ,userItems);
    // Automatically select and "click" the first user on page load
    if (userItems.length > 0) {
        activateUser(userItems[0]);
    }

    socket.onopen = function(e) {
        console.log('Socket opened:', e);
		

        // Handle form submission
        send_message_form.on('submit', function(e) {
            e.preventDefault();

            let message = input_message.val();

            let newData = {
                'message': message,
                'sent_by': USER_ID,
                'send_to': currentChatId, // Use the current chat ID here
            };

            newData = JSON.stringify(newData);
            socket.send(newData);

            // Reset the form
            $(this)[0].reset();
        });
    };
});



let loc = window.location
let wsStart = 'ws://'

if (loc.protocol === 'https') {
	wsStart = 'wss://'
}
let endpoint = wsStart + loc.host + loc.pathname

var socket = new WebSocket(endpoint)


socket.onmessage = async function(e){
	console.log('message', e)
	let newData = JSON.parse(e.data);
	let newMessage = JSON.parse(newData['text'])["message"]
	let sent_by_id = JSON.parse(newData['text'])["sent_by"]
	console.log(sent_by_id)
	SendNewMessage(newMessage, sent_by_id)
}

socket.onerror = async function(e){
	console.log('error', e)
}

socket.onclose = async function(e){
	console.log('close', e)
}


function SendNewMessage(newMessage, sent_by_id) {
	if ($.trim(newMessage) === '' || (newMessage.includes("<") && newMessage.includes(">") && newMessage.includes("/"))){
		return false;
	}
	let message_element;
	if (sent_by_id == USER_ID){
		message_element = 
			<div class="message sent">
				<div class="message-content">
					${newMessage}
				</div>
			</div>
		
	}
	else {
		message_element = 
			<div class="message received">
				<div class="message-content">
					${newMessage}
				</div>
			</div>
		
	}
	body_message.append($(message_element))
	body_message.animate({
		scrollTop: $(document).height()
	}, 100);
	input_message.val(null);
}
