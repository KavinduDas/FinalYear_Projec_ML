const chatBox = document.getElementById("chatbox");
const userInput = document.getElementById("userInput");

function sendMessage() {
    const message = userInput.value;
    if (!message) return;

    
    const userDiv = document.createElement("div");
    userDiv.textContent = "You: " + message;
    chatBox.appendChild(userDiv);

    
    userInput.value = "";

    
    fetch("/chat", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ message })
    })
    .then(res => res.json())
    .then(data => {
        const botDiv = document.createElement("div");
        botDiv.textContent = "AI: " + data.response;
        chatBox.appendChild(botDiv);
        chatBox.scrollTop = chatBox.scrollHeight; // Auto-scroll
    })
    .catch(err => console.error(err));
}