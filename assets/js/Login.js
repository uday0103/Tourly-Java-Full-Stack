document.getElementById("loginForm").addEventListener("submit", function (event) {
    event.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const responseMsgElement = document.getElementById("responseMsg");

    // Function to display messages with animation
    function showMessage(message, type) {
        responseMsgElement.innerText = message;
        responseMsgElement.classList.remove("show-success", "show-error"); // Clear previous classes
        responseMsgElement.classList.add("show", `show-${type}`);

        // Remove the 'show' class after the animation completes (4 seconds)
        setTimeout(() => {
            responseMsgElement.classList.remove("show", `show-${type}`);
        }, 4000); // Matches the animation duration
    }

    if (!email || !password) {
        showMessage("Email and password are required.", "error");
        return;
    }

    // Optional: Use a flag to determine if it's an admin based on email (you can also split the forms)
    const isAdmin = email.includes("admin"); // OR use a separate checkbox/input if needed

    const url = isAdmin
        ? "http://localhost:8080/api/admin/login"
        : "http://localhost:8080/api/users/login";

    fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(errorData => {
                throw new Error(errorData.message || "Login failed");
            });
        }
        return response.json();
    })
    .then(data => {
        console.log("Login successful:", data);
        localStorage.setItem("user", JSON.stringify(data));
        showMessage("Login successful!", "success"); // Show success message

        const role = data.role || "USER"; // fallback just in case

        // Redirect after a short delay to allow the success message to be seen
        setTimeout(() => {
            if (role === "ADMIN") {
                window.location.href = "Admin.html";
            } else {
                window.location.href = "User.html";
            }
        }, 1500); // Redirect after 1.5 seconds
    })
    .catch(error => {
        console.error("Login error:", error);
        showMessage(error.message, "error"); // Show error message
    });
});