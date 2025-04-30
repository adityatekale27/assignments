# Task Management API

This is a basic RESTful API, using Node.js and Express.js to manage tasks. It includes user signup/login and token-based authentication. All data is stored in memory.

---

## 🔧 Features

- User signup and login
- Token-based authentication
- CRUD operations on tasks
- Filtering, sorting, and pagination
- Error handling and validations
- In-memory data storage

---

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Run the server

```bash
node index.js
```

Server runs at: `http://localhost:3000`

---

## How to Test (Postman or curl)

### Signup

**POST** `/signup`  
Body (JSON):
```json
{
  "username": "testuser",
  "password": "testpass"
}
```

---

### Login (to get token)

**POST** `/login`  
Body (JSON):
```json
{
  "username": "testuser",
  "password": "testpass"
}
```

Copy the `token` from the response. You’ll need it in headers for the protected routes.

---

### Create a Task

**POST** `/tasks`  
Headers:
```
token: <your-token>
```
Body (JSON):
```json
{
  "title": "Buy groceries",
  "description": "Milk, Eggs, Bread"
}
```

---

### Get All Tasks

**GET** `/tasks`  
Headers:
```
token: <your-token>
```
Optional query params:
- `title`, `description` (filter)
- `sortby=title` (sort)
- `page=1&limit=5` (pagination)

---

### Get Task by ID

**GET** `/tasks/:id`  
Headers:
```
token: <your-token>
```

---

### Update a Task

**PUT** `/tasks/:id`  
Headers:
```
token: <your-token>
```
Body (JSON):
```json
{
  "title": "Buy more groceries",
  "description": "Milk, Eggs, Bread, Butter"
}
```

---

### Delete a Task

**DELETE** `/tasks/:id`  
Headers:
```
token: <your-token>
```
