const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

// Mount routes
app.use("/api/announcements", require("./routers/announcement.routes"));
app.use("/api/news", require("./routers/news.routes"))

module.exports = app;
