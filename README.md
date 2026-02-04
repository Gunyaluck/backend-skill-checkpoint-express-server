# ❓💬 Q&A API Service (Quora-like Backend)

A RESTful API service for a Question & Answer platform inspired by Quora.  
This project was developed as part of a backend skill assessment and strictly follows the provided Software Requirements.

---

## ✨ Features

- ✍️ Create, read, update, and delete questions  
- 🏷️ Categorize questions (e.g. Software, Food, Travel, Science)  
- 🔍 Search questions by title or category  
- 💬 Create answers for specific questions (max 300 characters)  
- 📖 Retrieve answers for a question  
- 🗑️ Delete questions and their related answers via API logic  

---

## 🛠 Tech Stack

- 🟢 **Node.js**
- ⚡ **Express.js**
- 🐘 **PostgreSQL**
- 🔐 **dotenv**
- 📦 ES Modules (ESM)

---

## 📂 Project Structure

```bash
.
├── app.mjs
├── routes
│   ├── question.mjs
│   └── answer.mjs
├── utils
│   └── db.mjs
├── package.json
└── README.md