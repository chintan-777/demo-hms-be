const bodyParser = require("body-parser");
const express = require("express");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");
const app = express();
const port = 4000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// routes
const property = require("./routes/property.routes");
const room = require("./routes/room.routes");
const auth = require("./routes/auth.routes");
const user = require("./routes/user.routes");

app.use("/property", property);
app.use("/room", room);
app.use("/auth", auth);
app.use("/user", user);

const path = require("path");
app.use("/upload", express.static(path.join(__dirname, "upload")));

app.listen(port, () => {
  mongoose
    .connect("mongodb://localhost:27017/demo_hms_be")
    .then((e) => {
      console.log("Successfully connected");
    })
    .catch((err) => {
      console.log(err.message);
    });
  console.log(`Example app listening on port ${port}`);
});
