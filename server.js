const express = require("express");
const connectDB = require("./config/db");
const users = require("./routes/API/usersAPI");
const auth = require("./routes/API/authAPI");
const app = express();
const path = require("path");
const http = require("http");
const server = http.createServer(app);
var bodyParser = require("body-parser");

require("./socket")(server);
connectDB();
const port = process.env.PORT || 5000;
app.use(express.json({ extended: false }));
app.use("/api/users", users);
app.use("/api/auth", auth);

server.listen(port, () => console.log("server is running on port 5000"));

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/build"));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "build", "index.html"));
  });
}
