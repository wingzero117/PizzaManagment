# Pizza Management App

This is a **Pizza Management App** that allows users to create, edit, delete, and manage pizzas and their toppings.  
It has a **frontend (React)** and a **backend (TypeScript with Node.js & MySQL)**.

To access the frontend publicly use http://3.147.58.86 below are the steps to build, run, and test locally.

---

## Getting Started

### **1. Clone the Repository**
```bash
git clone https://github.com/yourusername/PizzaManagement.git
cd PizzaManagement
```

### **2. Install Dependencies**

run the following in both frontend/ and backend/ directories:

```bash
cd frontend
npm install # or yarn install
```

```bash
cd ../backend
npm install # or yarn install
```

```bash
cd ../e2e
npm install # or yarn install
```

### **3. Running the App**

**Currently the backend backend is deployed on the EC2 instance so the frontend will prioritize the EC2 connection and not connect to the backend locally, but below is how you can start the backend**

## **Start the backend**

```bash
cd backend
npm start
```

## **Start the frontend**

```bash
cd frontend
npm start
```

### **4. Running Tests**

## **Run backend tests (jest)**

```bash
cd backend
npm test
```

## **Run frontend tests (jest)**

```bash
cd frontend
npm test
```

## **Run end-to-end tests (Playwright)**

```bash
cd e2e
npx playwright test
```

