document.addEventListener("DOMContentLoaded", function () {
    const form = document.querySelector(".contact-form");
    const popupMessage = document.getElementById("popupMessage");

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const subject = document.getElementById("subject").value.trim();
        const message = document.getElementById("message").value.trim();

        // Validation
        if (!name || !email || !subject || !message) {
            alert("Please fill in all fields.");
            return;
        }

        const contactData = {
            name: name,
            email: email,
            subject: subject,
            message: message
        };

        fetch("http://localhost:8080/api/contact/submit", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(contactData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("Failed to send message.");
            }
            return response.json();
        })
        .then(data => {
            // Show the pop-up message
            popupMessage.classList.add("show");

            // Hide the pop-up message after 3 seconds
            setTimeout(() => {
                popupMessage.classList.remove("show");
            }, 3000); // 3000 milliseconds = 3 seconds

            form.reset(); // Clear form fields
        })
        .catch(error => {
            console.error("Error:", error);
            alert("❌ Error sending message. Please try again later.");
        });
    });
});