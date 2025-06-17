const express = require("express"); // Import express
const app = express(); // Instantiate a new instance of express

// Create a new endpoint on the root route
app.get("/", function (request, response) {
  // Send back to the client
  response.send("Welcome to Chef Marco's Italian Bistro!").end();
});

// Tell the express app to listen on port 8080
app.listen(8080, function () {
  console.log("Server is listening on port 8080 🍝");
});
