const chat = document.getElementById("chat");
const form = document.getElementById("chatForm");
const input = document.getElementById("messageInput");
const suggestions = document.getElementById("suggestions");

let sessionId = null;

function addMessage(role, text) {
  const div = document.createElement("div");
  div.className = `message ${role}`;
  div.textContent = text;
  chat.appendChild(div);
  chat.scrollTop = chat.scrollHeight;
}

function renderSuggestions(items = []) {
  suggestions.innerHTML = "";
  items.forEach((item) => {
    const btn = document.createElement("button");
    btn.className = "suggestion";
    btn.type = "button";
    btn.textContent = item;
    btn.onclick = () => {
      input.value = item;
      form.requestSubmit();
    };
    suggestions.appendChild(btn);
  });
}

async function startSession() {
  const response = await fetch("/api/v1/chat/start", { method: "POST" });
  const data = await response.json();
  sessionId = data.session_id;
  addMessage("assistant", data.message);
}

async function sendMessage(text) {
  addMessage("user", text);
  const response = await fetch("/api/v1/chat/message", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ session_id: sessionId, text }),
  });
  const data = await response.json();
  addMessage("assistant", data.reply);
  renderSuggestions(data.suggestions);
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const text = input.value.trim();
  if (!text || !sessionId) return;
  input.value = "";
  await sendMessage(text);
});

startSession();
