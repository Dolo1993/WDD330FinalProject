document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("login-form");
    const registrationForm = document.getElementById("registration-form");
    const taskListContainer = document.getElementById("task-list-container");
    const loginUsernameInput = document.getElementById("login-username");
    const loginPasswordInput = document.getElementById("login-password");
    const registerUsernameInput = document.getElementById("register-username");
    const registerPasswordInput = document.getElementById("register-password");
    const addTaskForm = document.getElementById("add-task-form");
    const taskTitleInput = document.getElementById("task-title");
    const taskPriorityInput = document.getElementById("task-priority");
    const taskAddedDateInput = document.getElementById("task-added-date");
    const taskList = document.getElementById("task-list");

    document.getElementById("exit-button").addEventListener("click", () => {
        // Clear authenticated user and show login/registration forms
        authenticatedUser = null;
        loginForm.style.display = "block";
        registrationForm.style.display = "block";
        taskListContainer.style.display = "none";
    });

    // Load users from local storage or initialize an empty array
    let users = JSON.parse(localStorage.getItem("users")) || [];

    // Initialize tasks array or load from local storage
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

    loginForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const username = loginUsernameInput.value;
        const password = loginPasswordInput.value;

        // Check if the username and password are not empty
        if (username.trim() === "" || password.trim() === "") {
            alert("Please enter both username and password.");
            return;
        }

        // Check if the user exists and credentials match
        const user = users.find((user) => user.username === username);
        if (user && user.password === password) {
            authenticatedUser = username;
            loginForm.style.display = "none"; // Hide the login form
            registrationForm.style.display = "none"; // Hide the registration form
            taskListContainer.style.display = "block";
            showTasks();
        } else {
            alert("Invalid credentials. Please try again.");
        }
    });

    registrationForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const username = registerUsernameInput.value;
        const password = registerPasswordInput.value;

        // Check if the username and password are not empty
        if (username.trim() === "" || password.trim() === "") {
            alert("Please enter both username and password.");
            return;
        }

        // Check if the username is already taken
        if (users.some((user) => user.username === username)) {
            alert("Username already taken. Please choose another.");
        } else {
            // Register the user
            users.push({ username, password });
            alert("Registration successful. You can now log in.");
            // Clear the registration form
            registerUsernameInput.value = "";
            registerPasswordInput.value = "";
            registrationForm.style.display = "none"; // Hide the registration form
            // Update local storage with the new user data
            localStorage.setItem("users", JSON.stringify(users));
        }
    });

    addTaskForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const title = taskTitleInput.value;
        const priority = taskPriorityInput.value;
        const addedDate = taskAddedDateInput.value; 

        // Add the task to the array 
        const task = { title, priority, addedDate }; 
        tasks.push(task);
        // Update local storage with the new tasks
        localStorage.setItem("tasks", JSON.stringify(tasks));
        // Clear the form inputs
        taskTitleInput.value = "";
        taskPriorityInput.value = "High";
        taskAddedDateInput.value = ""; // Clear the added date input
        // Refresh the task list
        showTasks();
    });

    // Function to populate tasks
    function showTasks() {
        taskList.innerHTML = ""; // Clear the existing task list
        tasks.forEach((task, index) => {
            const li = document.createElement("li");
            li.className = "task-item";
            li.innerHTML = `
                <span>${task.title} (Priority: ${task.priority}, Added Date: ${task.addedDate})</span>
                <div class="task-actions">
                    <button onclick="editTask(${index})">Edit</button>
                    <button onclick="deleteTask(${index})">Delete</button>
                </div>
            `;
            taskList.appendChild(li);
        });
    }

    // Function to edit a task
    window.editTask = function (index) {
        const newTitle = prompt("Enter the new title:");
        const newPriority = prompt("Enter the new priority:");
        const newAddedDate = prompt("Enter the new added date:"); 

        if (newTitle !== null && newPriority !== null && newAddedDate !== null) {
            tasks[index].title = newTitle;
            tasks[index].priority = newPriority;
            tasks[index].addedDate = newAddedDate; 
            localStorage.setItem("tasks", JSON.stringify(tasks));
            showTasks();
        }
    };

    // Function to delete a task
    window.deleteTask = function (index) {
        const confirmDelete = confirm("Are you sure you want to delete this task?");
        if (confirmDelete) {
            tasks.splice(index, 1);
            localStorage.setItem("tasks", JSON.stringify(tasks));
            showTasks();
        }
    };
});
