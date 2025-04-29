import express from "express";

const app = express();
const port = 3000;

app.use(express.json());

const users = [];
const sessions = [];
let tasks = [];
let taskId = 1;

/* Middleware handler to check if the user have valid token in the sessions array */
function authenticateUser(req, res, next) {
  try {
    const token = req.headers.authorization;

    // check if the token from header and token from session match if mathces then add username to the req object
    if (token && sessions[token]) {
      req.username = sessions[token];
      next();
    } else {
      res.status(401).send("Unauthorized");
    }
  } catch (error) {
    res.status(500).send("Something went wrong, try again!");
  }
}

// Login user and return token if user exists in users array
app.post("/login", (req, res) => {
  try {
    const { username, password } = req.body;
    const user = users.find((user) => user.username === username.toLowerCase() && user.password === password);

    if (user) {
      const token = Date.now();
      sessions[token] = username;
      res.status(200).send({ token, message: "Please copy this token and add this in the header with Authorization as a key, for future requests" });
    } else {
      res.status(401).send("Invalid credentials");
    }
  } catch (error) {
    res.status(500).send("Something went wrong, Try again!");
  }
});
``;
/* Create new user in the users array */
app.post("/signup", (req, res) => {
  try {
    const { username, password } = req.body;
    const isUserExists = users.some((user) => user.username === username.toLowerCase());

    // check user exists in the users array or not
    if (isUserExists) {
      res.status(409).send("User already exists, try login!");
    }

    // add user detials in the array of users and return the username and passwrod to the user for login
    const usernameLowerCase = username.toLowerCase();
    users.push({ username: usernameLowerCase, password });
    res.status(201).send(`User created succesfully, login with username: ${username} and password: ${password}`);
  } catch (error) {
    res.status(500).send("Something went wrong, Try again!");
  }
});

app.get("/tasks", (req, res) => {
  res.send("Tasks will appear");
});

app.get("/tasks/:id", (req, res) => {
  res.send("here is the id", req.params.id);
});

app.post("/tasks", (req, res) => {
  res.send("here is the task", req);
});

app.put("/tasks/:id", (req, res) => {
  res.send("here is updated task", req);
});

app.delete("/tasks/:id", (req, res) => {
  res.send("her is the deleted task", req);
});

app.listen(3000, () => {
  console.log("it is running");
});
