const text = "Get things done with our fast-tracking scheduling app!";
const typingTextElement = document.querySelector("#typing-text");
let index = 0;
const typingSpeed = 100;

function typeText() {
  if (index < text.length) {
    typingTextElement.textContent += text.charAt(index);
    index++;
    setTimeout(typeText, typingSpeed);
  } else {
    setTimeout(clearText, 2000); // Pause for 2 seconds before resetting
  }
}

function clearText() {
  typingTextElement.textContent = "";
  index = 0;
  typeText();
}

typeText();
// Redirect to login page after 5 seconds
setTimeout(function () {
  window.location.href = "/loginpage/login.html";
}, 10000);
