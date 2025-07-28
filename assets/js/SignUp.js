document.getElementById("signupForm").addEventListener("submit", function (event) {
    event.preventDefault();

    const fullName = document.getElementById("fullName").value.trim();
    const mobile = document.getElementById("mobile").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    const responseMsgElement = document.getElementById("responseMsg"); // Renamed for clarity

    // Function to display messages with animation (copied from Login.js)
    function showMessage(message, type) {
        responseMsgElement.innerText = message;
        responseMsgElement.classList.remove("show-success", "show-error"); // Clear previous classes
        responseMsgElement.classList.add("show", `show-${type}`);

        // Remove the 'show' class after the animation completes (4 seconds)
        setTimeout(() => {
            responseMsgElement.classList.remove("show", `show-${type}`);
            responseMsgElement.innerText = ""; // Clear text after animation
        }, 4000); // Matches the animation duration
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        showMessage("Please enter a valid email address.", "error");
        return;
    }

    // Mobile validation (10 digit number)
    const mobileRegex = /^[6-9]\d{9}$/;
    if (!mobileRegex.test(mobile)) {
        showMessage("Please enter a valid 10-digit mobile number starting with 6-9.", "error");
        return;
    }

    // Password validation (at least 6 characters, includes at least one number)
    const passwordRegex = /^(?=.*\d).{6,}$/;
    if (!passwordRegex.test(password)) {
        showMessage("Password must be at least 6 characters long and contain at least one number.", "error");
        return;
    }

    // Confirm password check
    if (password !== confirmPassword) {
        showMessage("Passwords do not match.", "error");
        return;
    }

    // Proceed with fetch
    fetch("http://localhost:8080/api/users/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, mobile, email, password })
    })
    .then(response => {
        if (!response.ok) {
            // Check for specific error messages from the backend if available
            return response.json().then(errorData => {
                throw new Error(errorData.message || "Sign-up failed. Please try again.");
            });
        }
        return response.json();
    })
    .then(data => {
        localStorage.setItem("user", JSON.stringify(data));
        showMessage("Sign-up successful! Redirecting...", "success"); // Show success message

        // Redirect after a short delay to allow the success message to be seen
        setTimeout(() => {
            window.location.href = "User.html";
        }, 1500); // Redirect after 1.5 seconds
    })
    .catch(error => {
        console.error("Sign-up error:", error);
        showMessage(error.message, "error"); // Show error message
    });
});