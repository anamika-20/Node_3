import express from "express";
import { readFile, appendFile, readFileSync } from "fs";
import fs from "fs";

import json from "body-parser";
const app = express();
const PORT = 3000;

import { fileURLToPath } from "url";
import path, { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Middleware to parse JSON bodies
app.use(json());

app.use(express.static("public"));

// Routes
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.get("/public/styles.css", (req, res) => {
  res.sendFile(__dirname + "/public/styles.css");
});

app.get("/users", async (req, res) => {
  try {
    const data = fs.readFileSync("users.txt", "utf8");
    const users = data.split("\n").filter(Boolean);
    if (users.length === 0) {
      res.redirect("/create");
      return;
    }
    res.sendFile(path.join(__dirname, "users.html"));
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});

app.get("/create", (req, res) => {
  res.sendFile(__dirname + "/create.html");
});

app.post("/add", (req, res) => {
  const { userName } = req.body;
  if (!userName) {
    return res.status(400).send("User name is required");
  }

  // Append the user name to the text file
  fs.appendFile("users.txt", `<li>${userName}</li>\n`, (err) => {
    if (err) {
      console.error("Error appending user to file:", err);
      return res.status(500).send("Error adding user");
    }

    console.log("User added successfully:", userName);
    res.status(200).send("User added successfully");
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
