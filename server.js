const express = require("express");
const app = express();

// ===== App Level Middleware for Logging =====
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path}`);
  next();
});

// ===== Middleware to Parse JSON =====
app.use(express.json());

// ===== Global Menu Array =====
const menu = [
  { id: 1, dish: "Baked Shrimp Scampi", price: 20 },
  { id: 2, dish: "Chicken Parmigiana", price: 14 },
  { id: 3, dish: "Margherita Pizza", price: 17 },
  { id: 4, dish: "Penne with Vodka Sauce", price: 18 }
];

// ===== Root Route =====
app.get("/", (req, res) => {
  res.send("Welcome to Chef Marco's Italian Bistro!").end();
});

// ===== GET /menu with optional price filter =====
app.get("/menu", (req, res) => {
  const { maxPrice } = req.query;

  if (maxPrice) {
    const filtered = menu.filter(item => item.price <= parseFloat(maxPrice));
    return res.json(filtered);
  }

  res.json(menu);
});

// ===== GET /menu/:menuItem =====
app.get("/menu/:menuItem", (req, res) => {
  const id = parseInt(req.params.menuItem);
  const item = menu.find(d => d.id === id);
  if (item) {
    res.json(item);
  } else {
    res.status(404).json({ error: "Menu item not found" });
  }
});

// ===== POST /reservations (Not Implemented Fallback) =====
app.post("/reservations", (req, res, next) => {
  // If body is empty or missing fields, handle below
  const { name, date, time } = req.body;

  if (!name || !date || !time) {
    return res.status(400).json({ error: "Missing name, date, or time" });
  }

  res.status(201).send(`${name}, thank you for reserving at Chef Marco’s Restaurant on ${date} at ${time}! Your reservation is confirmed`);
});

// ===== Route-level Middleware for Chef Access =====
const verifyChef = (req, res, next) => {
  const role = req.headers.role;
  if (role === "chef") {
    next();
  } else {
    res.status(401).json({ error: "Only chefs can access this!" });
  }
};

// ===== GET /chef/secret-recipe =====
app.get("/chef/secret-recipe", verifyChef, (req, res) => {
  res.json({
    "Secret Sauce": "Butter, garlic, parmesan, and a splash of white wine 🍷"
  });
});

// ===== Start the Server =====
app.listen(8080, () => {
  console.log("Server is listening on port 8080 🍝");
});

