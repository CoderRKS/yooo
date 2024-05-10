const firebaseConfig = {
  apiKey: "AIzaSyDr1-gy1vViN3ULBTp5cJUBZ1NxAeJHHRA",
  authDomain: "userdata-e7a6c.firebaseapp.com",
  databaseURL: "https://userdata-e7a6c-default-rtdb.firebaseio.com",
  projectId: "userdata-e7a6c",
  storageBucket: "userdata-e7a6c.appspot.com",
  messagingSenderId: "1010009740328",
  appId: "1:1010009740328:web:0961c85f6764ff0900111d",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

var username = document.getElementById("usernameInput").value;
var password = document.getElementById("passwordInput").value;

function checkpass() {
  var username = document.getElementById("usernameInput").value;
  var password = document.getElementById("passwordInput").value;
  var confirmPassword = document.getElementById("passwordInput2").value;

  var message = document.getElementById("message");

  var uppercaseRegex = /[A-Z]/;
  var lowercaseRegex = /[a-z]/;
  var numberRegex = /[0-9]/;
  var specialCharRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
  var spaceRegex = /\s/; // Regular expression to check for spaces

  // Check if username input box is empty
  if (isEmptyOrWhitespace(username)) {
    message.textContent = "Username cannot be empty.";
  } else {
    // Check username availability in Firebase

    message.textContent = ""; // Clear username message if it's not empty

    // Check if the password meets all criteria
    if (password.length < 8) {
      message.textContent = "*Password should be at least 8 characters long.";
    } else if (spaceRegex.test(password)) {
      message.textContent = "*Password should not contain spaces.";
    } else if (!uppercaseRegex.test(password)) {
      message.textContent =
        "*Password should contain at least one uppercase letter.";
    } else if (!lowercaseRegex.test(password)) {
      message.textContent =
        "*Password should contain at least one lowercase letter.";
    } else if (!numberRegex.test(password)) {
      message.textContent = "*Password should contain at least one number.";
    } else if (!specialCharRegex.test(password)) {
      message.textContent =
        "*Password should contain at least one special character.";
    } else if (password !== confirmPassword) {
      message.textContent = "*Confirm Passward Correctly";
    } else {
      signup();
    }
  }
}

function isEmptyOrWhitespace(input) {
  return !input || !input.trim();
}

function signup() {
  username = document.getElementById("usernameInput").value;
  password = document.getElementById("passwordInput").value;
  // Check if the username already exists in Firebase
  firebase
    .database()
    .ref("/" + username)
    .once("value")
    .then(function (snapshot) {
      var userData = snapshot.val();
      if (userData) {
        document.getElementById("message").innerHTML =
          "*Username already exists";
      } else {
        // Username is available, proceed with signup
        // Save user credentials to Firebase Realtime Database
        firebase
          .database()
          .ref("/" + username)
          .set({
            username: username,
            password: password,
          })
          .then(function () {
            saveCredentials_log(username, password)
            document.getElementById("part1").style.display = "none";
            document.getElementById("part2").style.display = "none";
            document.getElementById("part3").style.display = "none";
            document.getElementById("part4").style.display = "block";
            document.getElementById("sumbitSignIn").style.display = "none";
            localStorage.setItem("username",username);
          })
          .catch((error) => {
            // Handle errors
            alert("Error occurred while signing up: " + error.message);
          });
      }
    })
    .catch(function (error) {
      // Handle errors
      alert(
        "Error occurred while checking username availability: " + error.message
      );
    });
}

function saveCredentials(username, password) {
  // Check if there are existing username and password cookies
  var existingUsername = getCookie("username");
  var existingPassword = getCookie("password");

  // If existing cookies exist, remove them
  if (existingUsername) {
    document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  }
  if (existingPassword) {
    document.cookie = "password=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  }

  // Save the new username and password as cookies
  document.cookie =
    "username=" +
    username +
    "; expires=" +
    new Date(new Date().getTime() + 365 * 24 * 60 * 60 * 1000).toUTCString();
  document.cookie =
    "password=" +
    password +
    "; expires=" +
    new Date(new Date().getTime() + 365 * 24 * 60 * 60 * 1000).toUTCString();

  // Print message on the console
  console.log("Credentials saved with username: " + username + " and password: " + password);
}

// Function to retrieve a cookie by name
function getCookie(name) {
  var value = "; " + document.cookie;
  var parts = value.split("; " + name + "=");
  if (parts.length == 2) return parts.pop().split(";").shift();
}


// Add an event listener to the div#edit element
document.getElementById("edit").addEventListener("click", function () {
  // Create an input element of type file
  var input = document.getElementById("files");

  // Add an event listener to handle file selection
  input.addEventListener("change", function (event) {
    // Get the selected file
    var file = event.target.files[0];

    // Check if a file is selected
    if (file) {
      // Create a FileReader object to read the selected file
      var reader = new FileReader();

      // Set up the FileReader onload function
      reader.onload = function (e) {
        // Update the src attribute of the img tag with the selected image URL
        document.getElementById("my_img").src = e.target.result;
      };
      document.getElementById("btn_img_next").innerHTML = "continue";
      // Read the selected file as a data URL
      reader.readAsDataURL(file);
    }
  });

  // Trigger a click event on the input element to open the file selection dialog
  input.click();
});

function uploadImage() {
  var fileInput = document.getElementById("files");

  // Check if files are selected
  if (fileInput.files.length > 0) {
    var file = fileInput.files[0];
    if (file) {
      var reader = new FileReader();
      reader.onload = function (event) {
        var imageDataUrl = event.target.result;
        // Save the image data URL to the database with the specified file name
        saveImageToDatabase(imageDataUrl);
        console.log("Image uploaded successfully.");
      };
      reader.readAsDataURL(file);
    } else {
      console.log("No file selected.");
    }
  } else {
    console.log("No file selected.");
  }
}

function saveImageToDatabase(imageDataUrl) {
  firebase
    .database()
    .ref("/" + username)
    .update({
      imageDataUrl: imageDataUrl,
    })
    .then(() => {
      console.log("Image data URL saved to the database successfully.");
      window.location ="Main_index.html";
    })
    .catch((error) => {
      console.error("Error saving image data URL to the database:", error);
    });
}

function showHidePass() {
  var passwordInput = document.getElementById("passwordInput");
  var showeye = document.getElementById("show");
  var hideeye = document.getElementById("hide");

  if (passwordInput.type === "password") {
    passwordInput.type = "text";
    showeye.style.display = "none";
    hideeye.style.display = "block";
  } else {
    passwordInput.type = "password";
    showeye.style.display = "block";
    hideeye.style.display = "none";
  }
}

function showHidePassc() {
  var passwordInput = document.getElementById("passwordInput2");
  var showeye = document.getElementById("showc");
  var hideeye = document.getElementById("hidec");

  if (passwordInput.type === "password") {
    passwordInput.type = "text";
    showeye.style.display = "none";
    hideeye.style.display = "block";
  } else {
    passwordInput.type = "password";
    showeye.style.display = "block";
    hideeye.style.display = "none";
  }
}

function showHidePassl() {
  var passwordInput = document.getElementById("logpass");
  var showeye = document.getElementById("showl");
  var hideeye = document.getElementById("hidel");

  if (passwordInput.type === "password") {
    passwordInput.type = "text";
    showeye.style.display = "none";
    hideeye.style.display = "block";
  } else {
    passwordInput.type = "password";
    showeye.style.display = "block";
    hideeye.style.display = "none";
  }
}

// login-----------------------------------------------------------
function login() {
  var username = document.getElementById("logemail").value;
  var password = document.getElementById("logpass").value;

  // Check if username is empty
  if (!username) {
    document.getElementById("message_log").innerHTML = "*Username cannot be empty";
    return; // Exit the function early if username is empty
  }

  // Check if the username exists in the Firebase database
  firebase
    .database()
    .ref("/" + username) // Ensure username is properly formatted as a path
    .once("value")
    .then(function (snapshot) {
      var userData = snapshot.val();
      if (userData) {
        // Username exists, check if the password matches
        if (userData.password === password) {
          // Password matches, proceed with login
          console.log("Login successful!");
          document.getElementById("message_log")
          saveCredentials_log(username, password);
          window.location ="Main_index.html";
        } else {
          // Password doesn't match
          document.getElementById("message_log").innerHTML = "*Invalid password";
        }
      } else {
        // Username doesn't exist
        document.getElementById("message_log").innerHTML = "*Username dosen't exist";
      }
    })
    .catch(function (error) {
      // Handle errors
      alert("Error occurred while logging in: " + error.message);
    });
}

function saveCredentials_log(username, password) {
  // Check if there are existing username and password cookies
  var existingUsername = getCookie("username");
  var existingPassword = getCookie("password");

  // If existing cookies exist, remove them
  if (existingUsername) {
    document.cookie = "username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  }
  if (existingPassword) {
    document.cookie = "password=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
  }

  // Save the new username and password as cookies
  document.cookie =
    "username=" +
    username +
    "; expires=" +
    new Date(new Date().getTime() + 365 * 24 * 60 * 60 * 1000).toUTCString();
  document.cookie =
    "password=" +
    password +
    "; expires=" +
    new Date(new Date().getTime() + 365 * 24 * 60 * 60 * 1000).toUTCString();

  // Print message on the console
  console.log("Credentials saved with username: " + username + " and password: " + password);
}

// Function to retrieve a cookie by name
function getCookie(name) {
  var value = "; " + document.cookie;
  var parts = value.split("; " + name + "=");
  if (parts.length == 2) return parts.pop().split(";").shift();
}


