const inputBox = document.getElementById('input-box');
const listContainer = document.getElementById('list-container');

// Request permission for showing notifications
const requestNotificationPermission = async () => {
    if (!("Notification" in window)) {
        swal({
            title: "Info - Notifications",
            text: "This browser does not support notifications.",
            icon: "info",
            button: "OK",
        });
        return false;
    }
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
        return true;
    } else {
        swal({
            title: "Info - Notifications",
            text: "Notifications are disabled. Please enable them in your browser settings.",
            icon: "info",
            button: "OK",
        });
        return false;
    }
};

// Set a reminder for a task
const setReminder = (taskText, reminderTime) => {
    const reminderInMs = reminderTime * 60 * 1000;

    setTimeout(() => {
        if (Notification.permission === "granted") {
            new Notification("Task Reminder", {
                body: `Reminder: ${taskText}`,
                icon: "./assets/reminder-icon.png",
            });
        } else {
            swal(`Reminder for "${taskText}" could not be shown because notifications are disabled.`);
        }
    }, reminderInMs);

    swal({
        title: "Reminder Set",
        text: `Reminder for "${taskText}" set for ${reminderTime} minute(s).`,
        icon: "success",
        button: "OK",
    });
};

// Save the tasks to localStorage
const saveData = () => {
    localStorage.setItem('data', listContainer.innerHTML);
}

// Load the saved tasks from localStorage
const showTasks = () => {
    listContainer.innerHTML = localStorage.getItem('data');
}
showTasks();

// Adding a new task
const addTask = () => {
    if(inputBox.value === ''){
        swal({
            title: "Reminder!",
            text: "Please enter a task",
            icon: "info",
            button: "I'll do it",
        });
    } else {
        let li = document.createElement('li');
        let taskText = document.createElement('span');
        taskText.textContent = inputBox.value;
        li.appendChild(taskText);

         // Reminder-Button
         let reminderBtn = document.createElement('button');
         reminderBtn.classList.add('reminder-btn');
         reminderBtn.textContent = 'Set Reminder';
         reminderBtn.addEventListener('click', async () => {
             const notificationsEnabled = await requestNotificationPermission();
             if (notificationsEnabled) {
                 const reminderTime = prompt("Set reminder time in minutes:");
                 if (reminderTime && reminderTime > 0) {
                     setReminder(taskText.textContent, reminderTime);
                 } else {
                     swal("Invalid time entered.");
                 }
             } else {
                 swal("Notifications are disabled.");
             }
         });
 
         // Remove-Button
         let img = document.createElement('img');
         img.src = './assets/remove.png';
         img.alt = 'remove';
         img.style.cursor = 'pointer';
         img.style.marginLeft = '10px';
         img.addEventListener('click', () => {
             li.remove();
             saveData();
         });
 
         li.appendChild(reminderBtn);
         li.appendChild(img);
         listContainer.appendChild(li);
         saveData();
    }
    inputBox.value = '';
}

// Event-Listener for marking tasks as done and removing tasks
listContainer.addEventListener('click', (e) => {
    if(e.target.tagName === 'LI'){
        e.target.classList.toggle('checked');
        saveData();
    } else if(e.target.tagName === 'IMG'){
        e.target.parentElement.remove();
        saveData();
    }
}, false);

