document.addEventListener('DOMContentLoaded', function() {
    const chatMessages = document.getElementById('chat-messages');
    const userInput = document.getElementById('user-input');
    const sendButton = document.getElementById('send-button');
    const suggestionButtons = document.querySelectorAll('.suggestion');
    
    // Function to add a message to the chat
    function addMessage(message, isUser) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message');
        messageDiv.classList.add(isUser ? 'user' : 'bot');
        
        const messageContent = document.createElement('div');
        messageContent.classList.add('message-content');
        messageContent.textContent = message;
        
        messageDiv.appendChild(messageContent);
        chatMessages.appendChild(messageDiv);
        
        // Scroll to the bottom of the chat
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    // Function to send a message to the Rasa server
    async function sendMessage(message) {
        addMessage(message, true);
        
        // Show typing indicator
        const typingDiv = document.createElement('div');
        typingDiv.classList.add('message', 'bot', 'typing');
        const typingContent = document.createElement('div');
        typingContent.classList.add('message-content');
        typingContent.textContent = "...";
        typingDiv.appendChild(typingContent);
        chatMessages.appendChild(typingDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        try {
            const response = await fetch('http://localhost:5005/webhooks/rest/webhook', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    sender: "user",
                    message: message
                }),
            });
            
            const data = await response.json();
            
            // Remove typing indicator
            chatMessages.removeChild(typingDiv);
            
            if (data.length > 0) {
                data.forEach(response => {
                    if (response.text) {
                        addMessage(response.text, false);
                    }
                });
            } else {
                addMessage("I'm sorry, I couldn't process your request. Please try again.", false);
            }
        } catch (error) {
            // Remove typing indicator
            chatMessages.removeChild(typingDiv);
            
            console.error('Error:', error);
            addMessage("I'm having trouble connecting to my brain. Please check your connection and try again.", false);
        }
    }
    
    // Event listener for send button
    sendButton.addEventListener('click', function() {
        const message = userInput.value.trim();
        if (message) {
            sendMessage(message);
            userInput.value = '';
        }
    });
    
    // Event listener for Enter key
    userInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            const message = userInput.value.trim();
            if (message) {
                sendMessage(message);
                userInput.value = '';
            }
        }
    });
    
    // Event listeners for suggestion buttons
    suggestionButtons.forEach(button => {
        button.addEventListener('click', function() {
            const message = this.getAttribute('data-text');
            sendMessage(message);
        });
    });
});
