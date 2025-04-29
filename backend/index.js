import express from "express";

const app = express();
const port = 3000;

app.use(express.json());

const users = [];
const sessions = {};
let tasks = [];
let taskId = 1;

/* Login user and return token if user exists in users array */
app.post("/login", (req, res) => {
  try {
    const { username, password } = req.body;
    const user = users.find((user) => user.username === username.toLowerCase() && user.password === password);

    if (user) {
      const token = Date.now();
      sessions[token] = username;
      return res.status(200).send({ token, message: `Please copy this in the headers, key as "token" and value as ${token} to access protected routes` });
    }

    res.status(401).send("Invalid credentials");
  } catch (error) {
    res.status(500).send("Something went wrong, Try again!");
  }
});

/* Create new user in the users array */
app.post("/signup", (req, res) => {
  try {
    // get username and password from user
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).send("Username and password are required to signup");

    // check user exists in the users array or not
    const isUserExists = users.some((user) => user.username === username.toLowerCase());
    if (isUserExists) return res.status(409).send("User already exists, try login!");

    // add user detials in the array of users and return the username and passwrod to the user for login
    const usernameLowerCase = username.toLowerCase();
    users.push({ username: usernameLowerCase, password });
    res.status(201).send(`User created succesfully, login with username: ${username} and password: ${password} to generate token.`);
  } catch (error) {
    res.status(500).send("Something went wrong, Try again!");
  }
});

/* GET route to retrive all tasks from tasks array */
app.get("/tasks", authenticateUser, (req, res) => {
  try {
    let userTasks = tasks.filter((tasks) => tasks.owner === req.username);
    if (userTasks.length === 0) return res.status(404).send("You does not have any tasks please add task first");

    // filter tasks based on title
    if (req.query.title) {
      userTasks = userTasks.filter((task) => task.title.includes(req.query.title));
    }

    // filter tasks based on description
    if (req.query.description) {
      userTasks = userTasks.filter((task) => task.description.includes(req.query.description));
    }

    // sort userTasks on basis of "title" and "description"
    if (req.query.sortby) {
      const sortBy = req.query.sortby;
      userTasks = userTasks.sort((m, n) => {
        if (m[sortBy] < n[sortBy]) return -1;
        if (m[sortBy] > n[sortBy]) return 1;
        return 0;
      });
    }

    // pagination of userTasks
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || userTasks.length;
    const startIndex = (page - 1) * limit;
    const paginatedTasks = userTasks.slice(startIndex, startIndex + limit);

    res.status(200).send({ message: `Tasks of ${req.username}`, page, limit, totalTasks: userTasks.length, userTasks: paginatedTasks });
  } catch (error) {
    res.status(500).send("Something went wrong, try again!");
  }
});

/* GET route with param id to retrive specific task associated with that id */
app.get("/tasks/:id", authenticateUser, (req, res) => {
  try {
    // get the id from params
    const id = Number(req.params.id);
    if (!id) return res.status(400).send("Please provide ID to get specific task");

    // get specific task using id, if owser is logged in user
    const task = tasks.find((task) => task.id === id && task.owner === req.username);
    if (!task) return res.status(404).send(`Task does found for id: ${id}`);

    res.status(200).send({ message: "Fetched task successfully", task });
  } catch (error) {
    res.status(500).send("Something went wrong, try again");
  }
});

/* POST route to create new task in the tasks array, only if user is authenticated */
app.post("/tasks", authenticateUser, (req, res) => {
  try {
    const { title, description } = req.body;
    if (!title || !description) return res.status(400).send("Title and Description is required to create new task");

    // create new task with id, title, desciption and owner field and push to tasks array
    const newTask = { id: taskId++, title, description, owner: req.username };
    tasks.push(newTask);
    res.status(201).send({ message: "Task created successfully!", newTask });
  } catch (error) {
    res.status(500).send("Something went wrong, try again!");
  }
});

/* PUT route with param id to update whole task object, only if user is authenticated */
app.put("/tasks/:id", authenticateUser, (req, res) => {
  try {
    // get the id from params
    const id = Number(req.params.id);
    if (!id) return res.status(400).send("Please provide ID to get specific task");

    // get title and desciption from user
    const { title, description } = req.body;
    if (!title || !description) return res.status(400).send("Title and Description is required to update task");

    // find task using id, if the ownser is logged in user
    const task = tasks.find((task) => task.id === id && task.owner === req.username);
    if (!task) return res.status(404).send("Task does not found");

    task.title = title;
    task.description = description;
    res.status(200).send({ message: "Task updated successfully", task });
  } catch (error) {
    res.status(500).send("Something went wrong, try again!");
  }
});

/* DELETE route with param id to delete specific task associated with id, only if user is authenticated*/
app.delete("/tasks/:id", authenticateUser, (req, res) => {
  try {
    // get the id from params
    const id = Number(req.params.id);
    if (!id) return res.status(400).send("Please provide ID to get specific task");

    // find the index of the task using id
    const taskIndex = tasks.findIndex((task) => task.id === id && task.owner === req.username);
    if (taskIndex === -1) return res.status(404).send("Task does not found");

    // remove the specific task at taskIndex from tasks array
    tasks.splice(taskIndex, 1);
    res.status(200).send(`Task deleted with id: ${id}`);
  } catch (error) {
    res.status(500).send("Something went wrong, try again!");
  }
});

// start server
app.listen(port, () => {
  console.log("it is running");
});

/* Middleware handler to check if the user have valid token in the sessions array */
function authenticateUser(req, res, next) {
  try {
    const token = req.headers.token;

    // check if the token from header and token from session match if mathces then add username to the req object
    if (token && sessions[token]) {
      req.username = sessions[token];
      next();
    }

    return res.status(401).send("Unauthorized");
  } catch (error) {
    res.status(500).send("Something went wrong, try again!");
  }
}
