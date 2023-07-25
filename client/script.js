import bot from "./assets/bot.svg";
import user from "./assets/user.svg";

const form = document.querySelector("form");
const chatContainer = document.querySelector("#chat_container");

function generateUniqueId() {
  const timestamp = Date.now();
  const randomNumber = Math.random();
  const hexadecimalString = randomNumber.toString(16);

  return `id-${timestamp}-${hexadecimalString}`;
}

function createChatStripe(isAi, value, uniqueId) {
  return `
    <div class="wrapper ${isAi ? "ai" : ""}">
        <div class="chat">
            <div class="profile">
                <img src=${isAi ? bot : user} alt="${isAi ? "bot" : "user"}" />
            </div>
            <div class="message" id="${uniqueId}">${value}</div>
        </div>
    </div>
  `;
}

function appendToChatContainer(html) {
  const tempDiv = document.createElement("div");
  tempDiv.innerHTML = html.trim();
  chatContainer.appendChild(tempDiv.firstChild);
}

async function sendMessageToBot(prompt) {
  const uniqueId = generateUniqueId();
  const loadingStripe = createChatStripe(true, " ", uniqueId);
  appendToChatContainer(loadingStripe);

  const response = await fetch("https://ai-app-an34.onrender.com", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt: prompt,
    }),
  });

  const messageDiv = document.getElementById(uniqueId);
  messageDiv.textContent = "";

  if (response.ok) {
    const data = await response.json();
    const parsedData = data.bot.trim();
    return parsedData;
  } else {
    const err = await response.text();
    alert("Something went wrong");
    return "";
  }
}

async function handleFormSubmit(e) {
  e.preventDefault();
  const data = new FormData(form);
  const prompt = data.get("prompt");

  appendToChatContainer(createChatStripe(false, prompt));

  form.reset();
  chatContainer.scrollTop = chatContainer.scrollHeight;

  const botResponse = await sendMessageToBot(prompt);
  const botResponseStripe = createChatStripe(true, botResponse);
  appendToChatContainer(botResponseStripe);
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

form.addEventListener("submit", handleFormSubmit);
form.addEventListener("keyup", (e) => {
  if (e.keyCode === 13) {
    handleFormSubmit(e);
  }
});
