import express from "express";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import { writeFile } from "fs";

const app = express();
const PORT = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(express.static(__dirname));
app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.sendFile(join(__dirname, "index.html"));
});

app.get("/users", (req, res) => {
  res.sendFile(join(__dirname, "users.html"));
});

app.get("/create", (req, res) => {
  res.sendFile(join(__dirname, "create.html"));
});

// Route to handle form submission and add users to the "users.txt" file
app.post("/add", async (req, res) => {
  const { userName } = req.body; // Extract userName from req.body
  try {
    await writeFile("users.txt", userName + "\n", { flag: "a" });
    console.log("User added to file");
    res.send("User added successfully");
  } catch (err) {
    console.error("Error writing to file:", err);
    res.status(500).send("Error adding user");
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
