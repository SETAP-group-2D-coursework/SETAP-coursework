document.addEventListener("DOMContentLoaded", function () {
  const username = document.getElementById("student-username");
  const email = document.getElementById("student-email");
  const password = document.getElementById("password");
  const confirmPassword = document.getElementById("confirm-password");
  const registerButton = document.querySelector(".register-button");

  // assigning error messages
  const usernameError = document.getElementById("usernameError");
  const emailError = document.getElementById("emailError");
  const passwordError = document.getElementById("passwordError");
  const confirmPasswordError = document.getElementById("confirmPasswordError");

  function validateEmail(email) {
    const emailRegister = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegister.test(email);
  }

  function validatePassword(password) {
    const passwordRegister = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
    return passwordRegister.test(password);
  }

  function checkInputs() {
    let isValid = true;

    // validation of username
    if (username.value.trim() !== "" && username.value.trim().length < 3) {
      usernameError.textContent =
        "OOPS!, Your username must be atleast 3 characters";
      isValid = false;
    } else {
      usernameError.textContent = "";
    }

    // validation of email
    if (email.value.trim() !== "" && !validateEmail(email.value)) {
      emailError.textContent = "OOPS!, Please enter valid email address";
      isValid = false;
    } else {
      emailError.textContent = "";
    }

    if (password.value.trim() !== "" && !validatePassword(password.value)) {
      passwordError.textContent =
        "OOPS!, Your password must be atleast 8 characters with a letter and number inclusive";
      isValid = false;
    } else {
      passwordError.textContent = "";
    }

    // checking if password is a match
    if (
      confirmPassword.value.trim() !== "" &&
      password.value !== confirmPassword.value
    ) {
      confirmPasswordError.textContent = "OOPS!, Your passwords do not match";
      isValid = false;
    } else {
      confirmPasswordError.textContent = "";
    }

    // disabling the regiter button if the inputs are not correct
    registerButton.disabled = !isValid;
  }

  // adding event listeners
  username.addEventListener("input", checkInputs);
  email.addEventListener("input", checkInputs);
  password.addEventListener("input", checkInputs);
  confirmPassword.addEventListener("input", checkInputs);

  // will not allow submission when form is invalid
  document
    .getElementById("registerForm")
    .addEventListener("submit", function (event) {
      if (registerButton.disabled) {
        event.preventDefault();
      } else {
        alert("You have been registered successfully!");
        window.location.href =
          "/SETAP-coursework/frontend/loginpage/login.html";
      }
    });
  checkInputs();
});
