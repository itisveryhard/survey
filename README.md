# 📌 Vue 3 + TypeScript + Vite + PrimeVue Project

## 🚀 Installation and Setup

You can get the project up and running with just two commands:

```sh
npm install  # Install dependencies
npm run build # Build the project
```

### 📌 Running the Dev Server

To start the project in development mode:

```sh
npm run dev
```

## 🛠️ Core Technologies

- [Vue 3](https://vuejs.org/) – modern frontend framework  
- [TypeScript](https://www.typescriptlang.org/) – strict typing for JavaScript  
- [Vite](https://vitejs.dev/) – lightning-fast build tool  
- [PrimeVue](https://primevue.org/) – UI component library

## 🧩 Project Description

This project is an interface for creating surveys with flexible branching logic.

### 🔧 Basic Features:
- Create a survey (with a main title)
- Add multiple questions (each with its own title and answer options)

### 🧠 Conditional Logic (Connection Types):
- **Connection Type 1** – after answering a question, the flow continues to a predefined question regardless of the selected answer.
- **Connection Type 2** – each answer option defines its own target question, allowing dynamic branching based on user selection.

This enables the creation of non-linear surveys with custom navigation between questions.
