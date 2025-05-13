const config = require("../../config");

document
  .getElementById("login-form")
  .addEventListener("submit", async (event) => {
    event.preventDefault();

    const studentEmailUsername = document.getElementById(
      "student-username-email"
    ).value;
    const password = document.getElementById("password").value;
    try {
      const response = await fetch(`${config.API_URL}/api/login`, {
        method: "POST",
        headers: {
          "Content-type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          email: studentEmailUsername.includes("@")
            ? studentEmailUsername
            : null,
          username: studentEmailUsername,
          password: password,
        }),
      });

      const result = await response.json();
      alert(result.message);
      if (response.status === 200) {
        window.location.href = "Dashboard/dashboard.html";
      }
    } catch (error) {
      alert("An error occured: " + error.message);
    }
  });
