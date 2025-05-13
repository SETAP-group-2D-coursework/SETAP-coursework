console.log("javascript is working!");
document.addEventListener("DOMContentLoaded", function () {
  const createRoomForm = document.getElementById("create-room-form");
  const createRoomBtn = document.getElementById("createRoomBtn");
  const roomNameInput = document.getElementById("roomname");

  if (createRoomForm && createRoomBtn && roomNameInput) {
    const roomNameError = document.getElementById("roomNameError");

    function validateRoomName() {
      const room = roomNameInput.value.trim();
      if (room.length > 0 && room.length < 3) {
        roomNameError.textContent = "Room name must be at least 3 characters.";
        createRoomBtn.disabled = true;
      } else {
        roomNameError.textContent = "";
        // createRoomBtn.disabled = room.length === 0 || room.length < 3;
        createRoomBtn.disabled = false;
      }
    }

    roomNameInput.addEventListener("input", validateRoomName);

    createRoomForm.addEventListener('submit', async function (event) {
      event.preventDefault();
      const roomName = roomNameInput.value.trim();
      if (roomName.length < 3) return;

      try {
        const response = await fetch("http://localhost:3000/api/rooms", {
          method: "POST",
          headers: { "Content-Type" : "application/json" },
          body: JSON.stringify({ roomName })
        });
        const result = await response.json();
        if (response.status == 201) {
          alert(result.message);
          window.location.href = `/dashboard.html?roomId=${result.room.room_id}`;
        } else {
          roomNameError.textContent = result.message;
        }
      } catch (error) {
        roomNameError.textContent = "Error: " + error.message;
      }
    });

    validateRoomName();
  }
});
