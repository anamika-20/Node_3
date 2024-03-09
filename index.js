import express from "express";
import { readFile, appendFile, readFileSync } from "fs";
import fs from "fs";

import json from "body-parser";
const app = express();
const PORT = process.env.PORT || 3000;

import { fileURLToPath } from "url";
import { dirname } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Middleware to parse JSON bodies
app.use(json());

// Serve static HTML files
// app.use(static("public"));
// Remove this line that uses 'static' keyword
app.use(express.static("public"));

// Routes
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

app.get("/public/styles.css", (req, res) => {
  res.sendFile(__dirname + "/public/styles.css");
});

app.get("/users", (req, res) => {
  try {
    const data = readFileSync("users.txt", "utf8");
    if (!data.trim()) {
      return res.redirect("/create");
    }
    const users = data.trim().split("\n");
    res.send(`
            <h1>Users</h1>
            <ul>${users.map((user) => `<li>${user}</li>`).join("")}</ul>
        `);
  } catch (err) {
    console.error("Error reading file:", err);
    res.redirect("/create");
  }
});

// app.get("/users", (req, res) => {
//   try {
//     const data = readFileSync("users.txt", "utf8");
//     if (!data.trim()) {
//       return res.redirect("/create");
//     }
//     const users = data
//       .trim()
//       .split("\n")
//       .map((user) => `<li>${user}</li>`)
//       .join("");
//     res.send(`<h1>Users</h1><ul>${users}</ul>`);
//   } catch (err) {
//     console.error("Error reading file:", err);
//     res.redirect("/create");
//   }
// });

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
