
# Key Map
## 🚀 Overview
This is a web application that helps users design their own database schemas through an interactive, AI-powered conversation.  
Users answer guided questions, and the system generates a NoSQL database schema (in JSON format) for them. Each project is saved and accessible via a unique URL based on a uniquely generated `slug`.

✅ Demo
👉  Demo: https://www.loom.com/share/072b59b871554e8cb02644eee23135d7

---

## ✅ Tech Stack

| Layer      | Technology                        | Reasoning                                                              |
|------------|-----------------------------------|------------------------------------------------------------------------|
| Frontend   | React + Tailwind CSS              | Lightweight, and rapid styling to easily convert figma design to code       |
| Backend    | Node.js with Express              | Efficient, simple, and flexible backend framework for REST APIs         |
| Database   | MongoDB (Atlas)                   | 	Ideal for dynamic structures, allows embedding of `aiSessions` directly, instead of keeping them in a seprate table |
| AI Provider| OpenAI GPT-4o-mini model          | Fast and capable conversational model ideal for generating structured schema outputs |

---

## ✅ Why MongoDB (NoSQL) and JSON Schema?
- **Universal compatibility** -JSON Schema can represent both SQL and NoSQL database structures
- **Tool support** - Many database tools and code generators can directly consume JSON Schema as input
- **Easy transformation** - The same JSON Schema can be easily transformed into specific database implementations like
- **Frontend friendly** -  JSON is native to JavaScript, making it simple to visualize and manipulate the schema in the frontend

---

## ✅ Database Schema (MongoDB)


### **projects**
| Field Name     | Type      | Description                                                           |
|----------------|-----------|-----------------------------------------------------------------------|
| _id            | ObjectId  | Primary Key (also used in project URL)                                |
| title          | String    | Project title                                                         |
| description    | String    | Optional project description                                           |
| schemaJson     | Object    | The generated JSON schema                                              |
| schemaText     | String    | Optional human-readable text or MongoDB shell-style schema definition  |
| createdAt      | Date      | Auto creation timestamp                                                |
| updatedAt      | Date      | Auto update timestamp                                                  |
| aiSessions     | Array     | Embedded array of Q&A exchanges                                        |
| versions       | Array     | Embedded array of previous schema versions                              |

---

### **projects.aiSessions (embedded)**
| Field Name  | Type   | Description                    |
|-------------|--------|--------------------------------|
| question    | String | The AI-generated question      |
| answer      | String | The user’s response            |
| createdAt   | Date   | Timestamp for that exchange    |

---

### **projects.versions (embedded)**
| Field Name   | Type   | Description                       |
|--------------|--------|-----------------------------------|
| schemaJson   | Object | A backup snapshot of the schema   |
| schemaText   | String | Optional text version backup      |
| createdAt    | Date   | Timestamp of that version save    |

---

## 🤖 AI Integration Details
### AI Integration
- **Conversation Flow** - Used OpenAI API to create a multi-turn conversation where the AI asks targeted questions about data requirements
- **Context Management** - Each question-answer pair is stored and sent as context for subsequent interactions
- **Completion Detection** - AI automatically signals when it has gathered sufficient information using "DONE_ASKING_QUESTIONS"

### Schema Generation
- **Universal Representation** - AI generates a standardized JSON Schema format with entities, attributes and relationships
- **Format Structure** - Schema includes entity definitions with attributes, types, constraints and relationship mappings
- **Human-Readable Output** - Alongside JSON, a text description explains the schema design in plain language

### Storage Mechanisms
- **MongoDB Backend** - Projects stored with embedded arrays for conversation history and schema versions
- **Version Control** - Previous schema versions preserved when edits are made
- **Slug-Based Access** - Each project accessible via unique URL for easy sharing and retrieval


---



## ✅ Setup Instructions

### 1. Clone the repository
```bash
git clone https://github.com/mrnabdulai/gigsama-fullstack-test-002
cd gigsama-fullstack-test-002
```

### 2. Backend Setup
```bash
cd backend
yarn
```
- Create a `.env` file with the following variables:
```
MONGODB_URI=your_mongodb_atlas_uri
OPENAI_API_KEY=your_openai_api_key
```
- Start the backend server:
```bash
yarn build
yarn start
```

---

### 3. Frontend Setup
```bash
cd frontend
yarn 
yarn dev
```
- Open [http://localhost:5173](http://localhost:7173) in your browser.

---

## ✅ API Endpoints Reference
| Method | Route                     | Description                                                       |
|--------|---------------------------|-------------------------------------------------------------------|
| POST   | `/api/projects/start-session`      | Starts a new session and creates a new project                    |
| POST   | `/api/projects/ask-question`       | Sends user input to AI, receives the next question, and logs it   |
| POST   | `/api/projects/generate-schema`    | Sends all responses to AI and generates the final JSON schema     |
| GET    | `/api/project/:slug`        | Fetch project details by ID                                       |
| GET   | `/api/projects`   |Get all projects |

---
