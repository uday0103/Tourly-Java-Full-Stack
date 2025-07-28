const user = JSON.parse(localStorage.getItem("user"));
if (!user) {
    // Redirect to login if user is not authenticated
    window.location.href = "Login.html";
}

// Display user information
document.getElementById("userNameDisplay").innerText = user.fullName;
document.getElementById("userEmail").innerText = user.email;
document.getElementById("userMobile").innerText = user.mobile;
document.getElementById("editNameInput").value = user.fullName;

// State variables for cancellation mode
let isCancelMode = false;
let currentBookingType = ''; // Keeps track of the currently displayed booking type

// Get popup elements
const confirmationPopup = document.getElementById('confirmationPopup');
const confirmationMessage = document.getElementById('confirmationMessage');
const confirmYesBtn = document.getElementById('confirmYes');
const confirmNoBtn = document.getElementById('confirmNo');

const notificationPopup = document.getElementById('notificationPopup');
const notificationMessage = document.getElementById('notificationMessage').querySelector('span');
const notificationIcon = document.getElementById('notificationMessage').querySelector('i');

/**
 * Logs out the user by removing their data from local storage and redirecting to the login page.
 */
function logoutBtn() {
    localStorage.removeItem("user");
    window.location.href = "Login.html";
}

/**
 * Enables the input field and changes buttons to allow editing the user's name.
 */
function enableEditName() {
    document.getElementById("editNameInput").style.display = "inline-block";
    document.getElementById("userNameDisplay").style.display = "none";
    document.getElementById("editNameBtn").style.display = "none";
    document.getElementById("saveNameBtn").style.display = "inline-block";
}

/**
 * Saves the updated user name to the backend and refreshes the page.
 */
function saveUpdatedName() {
    const newName = document.getElementById("editNameInput").value.trim();

    if (!newName) {
        showNotificationPopup("Name cannot be empty.", false);
        return;
    }

    fetch(`http://localhost:8080/api/users/${user.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...user, fullName: newName })
    })
    .then(response => {
        if (!response.ok) {
            throw new Error("Failed to update name. Server responded with an error.");
        }
        return response.json();
    })
    .then(updatedUser => {
        localStorage.setItem("user", JSON.stringify(updatedUser));
        location.reload(); // Reload the page to reflect the new name
    })
    .catch(err => showNotificationPopup(`Error updating name: ${err.message}`, false));
}

/**
 * Loads and displays bookings of a specified type for the current user.
 * Dynamically creates a table with booking details.
 *
 * @param {string} type - The type of booking to load (e.g., 'cabs', 'hotels', 'flights', 'tourist').
 * @param {HTMLElement} btn - The button element that was clicked to trigger this load.
 */
function loadBookings(type, btn) {
    // Deactivate all booking type buttons and activate the clicked one
    document.querySelectorAll('.booking-type-buttons button').forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    currentBookingType = type; // Store the current booking type for later use (e.g., cancellation)
    const bookingDetailsDiv = document.getElementById("bookingDetails");
    bookingDetailsDiv.innerHTML = "<p>Loading...</p>"; // Show loading message

    // Hide "Cancel Selected" button and reset "Select Trip to Cancel" button text
    // when a new booking type is loaded and not in cancel mode
    if (!isCancelMode) {
        document.getElementById("cancelSelectedBtn").style.display = "none";
        document.getElementById("selectCancelTripBtn").innerText = "Select Trip to Cancel";
    }

    fetch(`http://localhost:8080/api/${type}/user/${user.id}`)
        .then(response => {
            if (!response.ok) {
                // Handle 404 (Not Found) specifically for no bookings
                if (response.status === 404) {
                    return []; // Return an empty array if no bookings are found
                }
                throw new Error(`Failed to load ${type} bookings.`);
            }
            return response.json();
        })
        .then(bookings => {
            if (bookings.length === 0) {
                bookingDetailsDiv.innerHTML = "<p>No bookings yet.</p>";
                return;
            }

            let tableHeaders = "";
            let tableRows = "";

            // Add checkbox column header if in cancel mode
            if (isCancelMode) {
                tableHeaders += `<th class="checkbox-col"></th>`;
            }

            // Define table headers and rows based on booking type
            switch (type) {
                case 'hotels':
                    tableHeaders += `
                        <th>Hotel Name</th>
                        <th>Guest Name</th>
                        <th>Check-in Date</th>
                        <th>Persons</th>
                        <th>Days</th>
                        <th>Total Price</th>`;
                    tableRows = bookings.map(booking => `
                        <tr data-id="${booking.id}" data-type="hotels">
                            ${isCancelMode ? `<td class="checkbox-col"><input type="checkbox" class="cancel-checkbox" data-id="${booking.id}"></td>` : ''}
                            <td>${booking.hotelName}</td>
                            <td>${booking.name}</td>
                            <td>${booking.date}</td>
                            <td>${booking.persons}</td>
                            <td>${booking.days}</td>
                            <td>₹${booking.totalPrice}</td>
                        </tr>`).join("");
                    break;
                case 'cabs':
                    tableHeaders += `
                        <th>Cab Type</th>
                        <th>Travellers</th>
                        <th>Pickup Location</th>
                        <th>Drop Location</th>
                        <th>Travel Date</th>
                        <th>Fare</th>`;
                    tableRows = bookings.map(booking => `
                        <tr data-id="${booking.id}" data-type="cabs">
                            ${isCancelMode ? `<td class="checkbox-col"><input type="checkbox" class="cancel-checkbox" data-id="${booking.id}"></td>` : ''}
                            <td>${booking.cabType}</td>
                            <td>${booking.travellers}</td>
                            <td>${booking.pickup}</td>
                            <td>${booking.dropLocation}</td>
                            <td>${booking.travelDate}</td>
                            <td>₹${booking.totalPrice}</td>
                        </tr>`).join("");
                    break;
                case 'flights':
                    tableHeaders += `
                        <th>Airline</th>
                        <th>Passenger Name</th>
                        <th>Travellers</th>
                        <th>From</th>
                        <th>To</th>
                        <th>Boarding On</th>
                        <th>Total Fare</th>`;
                    tableRows = bookings.map(booking => `
                        <tr data-id="${booking.id}" data-type="flights">
                            ${isCancelMode ? `<td class="checkbox-col"><input type="checkbox" class="cancel-checkbox" data-id="${booking.id}"></td>` : ''}
                            <td>${booking.airline}</td>
                            <td>${booking.name}</td>
                            <td>${booking.travellers}</td>
                            <td>${booking.fromLocation}</td>
                            <td>${booking.toLocation}</td>
                            <td>${booking.date}</td>
                            <td>₹${booking.totalPrice}</td>
                        </tr>`).join("");
                    break;
                case 'tourist':
                    tableHeaders += `
                        <th>Place</th>
                        <th>Guest Name</th>
                        <th>Travellers</th>
                        <th>Check-in Date</th>
                        <th>Days</th>
                        <th>Total Cost</th>`;
                    tableRows = bookings.map(booking => `
                        <tr data-id="${booking.id}" data-type="tourist">
                            ${isCancelMode ? `<td class="checkbox-col"><input type="checkbox" class="cancel-checkbox" data-id="${booking.id}"></td>` : ''}
                            <td>${booking.place}</td>
                            <td>${booking.name}</td>
                            <td>${booking.travellers}</td>
                            <td>${booking.date}</td>
                            <td>${booking.days}</td>
                            <td>₹${booking.totalCost}</td>
                        </tr>`).join("");
                    break;
                default:
                    bookingDetailsDiv.innerHTML = "<p>Unknown booking type.</p>";
                    return;
            }

            // Construct the full table HTML
            const tableHtml = `
                <table class="bookings-table">
                    <thead>
                        <tr>
                            ${tableHeaders}
                        </tr>
                    </thead>
                    <tbody>
                        ${tableRows}
                    </tbody>
                </table>
            `;
            bookingDetailsDiv.innerHTML = tableHtml;

            // Add event listener for checkboxes if in cancel mode
            if (isCancelMode) {
                document.querySelectorAll('.cancel-checkbox').forEach(checkbox => {
                    checkbox.addEventListener('change', (event) => {
                        const row = event.target.closest('tr');
                        if (event.target.checked) {
                            row.style.backgroundColor = 'rgba(255, 0, 0, 0.1)'; // Highlight selected row
                        } else {
                            row.style.backgroundColor = ''; // Remove highlight
                        }
                    });
                });
            }
        })
        .catch(error => {
            bookingDetailsDiv.innerHTML = `<p style="color: red;">Error: ${error.message}</p>`;
        });
}

/**
 * Toggles the cancellation mode, showing or hiding checkboxes and relevant buttons.
 * Reloads the current booking type to apply the checkbox changes.
 */
function toggleCancelMode() {
    isCancelMode = !isCancelMode; // Toggle the state
    const selectCancelTripBtn = document.getElementById("selectCancelTripBtn");
    const cancelSelectedBtn = document.getElementById("cancelSelectedBtn");

    if (isCancelMode) {
        selectCancelTripBtn.innerText = "Done Selecting";
        cancelSelectedBtn.style.display = "inline-block";
    } else {
        selectCancelTripBtn.innerText = "Select Trip to Cancel";
        cancelSelectedBtn.style.display = "none";
    }

    // Reload the current bookings to show/hide checkboxes based on the new mode
    const activeBtn = document.querySelector('.booking-type-buttons button.active');
    if (activeBtn && currentBookingType) { // Ensure there's an active button and type
        loadBookings(currentBookingType, activeBtn);
    } else if (isCancelMode) {
        // If entering cancel mode but no booking type is selected, show a message
        document.getElementById("bookingDetails").innerHTML = "<p>No bookings loaded. Select a booking type first.</p>";
    } else {
        // If exiting cancel mode and no booking type was selected
        document.getElementById("bookingDetails").innerHTML = "<p>Select a booking type to view your bookings.</p>";
    }
}

// Attach event listener to the "Cancel Selected" button
document.getElementById("cancelSelectedBtn").addEventListener("click", cancelSelectedBookings);

/**
 * Displays a custom confirmation popup.
 * @param {string} message - The message to display in the confirmation popup.
 * @returns {Promise<boolean>} - A promise that resolves to true if confirmed, false otherwise.
 */
function showConfirmationPopup(message) {
    return new Promise((resolve) => {
        confirmationMessage.innerText = message;
        confirmationPopup.classList.add('show');

        const handleConfirm = () => {
            confirmationPopup.classList.remove('show');
            confirmYesBtn.removeEventListener('click', handleConfirm);
            confirmNoBtn.removeEventListener('click', handleCancel);
            resolve(true);
        };

        const handleCancel = () => {
            confirmationPopup.classList.remove('show');
            confirmYesBtn.removeEventListener('click', handleConfirm);
            confirmNoBtn.removeEventListener('click', handleCancel);
            resolve(false);
        };

        confirmYesBtn.addEventListener('click', handleConfirm);
        confirmNoBtn.addEventListener('click', handleCancel);
    });
}

/**
 * Displays a custom notification popup (success or error).
 * @param {string} message - The message to display.
 * @param {boolean} isSuccess - True for success, false for error.
 */
function showNotificationPopup(message, isSuccess) {
    notificationMessage.innerText = message;
    notificationPopup.classList.remove('success', 'error'); // Reset classes
    notificationIcon.className = 'fas'; // Reset icon classes

    if (isSuccess) {
        notificationPopup.classList.add('success');
        notificationIcon.classList.add('fa-check-circle');
    } else {
        notificationPopup.classList.add('error');
        notificationIcon.classList.add('fa-times-circle');
    }

    notificationPopup.classList.add('show');

    // Automatically hide after 3 seconds
    setTimeout(() => {
        notificationPopup.classList.remove('show');
    }, 3000);
}


/**
 * Handles the cancellation of selected bookings.
 * Sends DELETE requests to the backend for each selected booking.
 */
async function cancelSelectedBookings() {
    const selectedCheckboxes = document.querySelectorAll('.cancel-checkbox:checked');
    if (selectedCheckboxes.length === 0) {
        showNotificationPopup("Please select at least one trip to cancel.", false);
        return;
    }

    const confirmationMsg = `Are you sure you want to cancel ${selectedCheckboxes.length} selected trip(s)? This action cannot be undone.`;
    const confirmed = await showConfirmationPopup(confirmationMsg);

    if (!confirmed) {
        return; // User cancelled the confirmation
    }

    const deletePromises = [];
    selectedCheckboxes.forEach(checkbox => {
        const row = checkbox.closest('tr'); // Get the parent table row
        const bookingId = row.dataset.id;     // Get the booking ID from data-id attribute
        const bookingType = row.dataset.type; // Get the booking type from data-type attribute

        if (bookingId && bookingType) {
            deletePromises.push(
                fetch(`http://localhost:8080/api/${bookingType}/${bookingId}`, {
                    method: 'DELETE'
                })
                .then(response => {
                    if (!response.ok) {
                        // If the response is not OK, throw an error
                        return response.text().then(text => { throw new Error(`Failed to cancel ${bookingType} booking with ID ${bookingId}: ${response.status} ${response.statusText} - ${text}`); });
                    }
                    return bookingId; // Return the ID for successful deletions
                })
                .catch(error => {
                    console.error(`Error deleting booking ${bookingId} of type ${bookingType}:`, error);
                    // No alert here, aggregate errors and show one summary
                    return null; // Indicate failure
                })
            );
        } else {
            console.error("Missing booking ID or type for a selected checkbox row.");
        }
    });

    // Wait for all delete operations to complete
    const results = await Promise.all(deletePromises);
    const successfulDeletions = results.filter(id => id !== null);
    const failedDeletionsCount = selectedCheckboxes.length - successfulDeletions.length;

    if (successfulDeletions.length > 0) {
        let successMessage = `${successfulDeletions.length} trip(s) cancelled successfully!`;
        if (failedDeletionsCount > 0) {
            successMessage += ` (${failedDeletionsCount} failed to cancel.)`;
            showNotificationPopup(successMessage, false); // Show as error if some failed
        } else {
            showNotificationPopup(successMessage, true); // All successful
        }
    } else {
        showNotificationPopup("No trips were cancelled. Please check the console for details.", false);
    }

    // Re-load the bookings to update the displayed list
    const activeBtn = document.querySelector('.booking-type-buttons button.active');
    if (activeBtn && currentBookingType) {
        loadBookings(currentBookingType, activeBtn);
    } else {
        // If no booking type was active, just clear the booking details
        document.getElementById("bookingDetails").innerHTML = "<p>Select a booking type to view your bookings.</p>";
    }

    // Exit cancel mode after attempting deletions
    toggleCancelMode();
}