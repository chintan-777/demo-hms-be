var bodyParser = require("body-parser");

const express = require("express");
const mongoose = require("mongoose");
const app = express();
const port = 3000;

const property = require("./routes/property.routes");
const room = require("./routes/room.routes");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/property", property);
app.use("/room", room);

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
