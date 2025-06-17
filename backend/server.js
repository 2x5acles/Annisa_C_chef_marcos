const express = require("express");
const app = express();
const PORT = 8080;

// Middleware to parse JSON
app.use(express.json());

// App-level logging
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path}`);
  next();
});

// Sample menu
const menu = [
  { id: 1, dish: "Baked Shrimp Scampi", price: 20 },
  { id: 2, dish: "Chicken Parmigiana", price: 14 },
  { id: 3, dish: "Margherita Pizza", price: 17 },
  { id: 4, dish: "Penne with Vodka Sauce", price: 18 }
];

// Home Route
app.get("/", (req, res) => {
  res.send("Welcome to Chef Marco's Italian Bistro!");
});

// Menu Route (with optional price filtering)
app.get("/menu", (req, res) => {
  const { maxPrice } = req.query;
  if (maxPrice) {
    const filtered = menu.filter(item => item.price <= Number(maxPrice));
    return res.json(filtered);
  }
  res.json(menu);
});

// Get item by ID
app.get("/menu/:menuItem", (req, res) => {
  const item = menu.find(i => i.id === Number(req.params.menuItem));
  if (item) {
    res.json(item);
  } else {
    res.status(404).send("Menu item not found");
  }
});

// Placeholder reservations route (for earlier exercise)
app.post("/reservations", (req, res) => {
  const { name, date, time } = req.body;
  if (!name || !date || !time) {
    return res.status(400).send("Missing name, date, or time");
  }
  res.status(201).send(
    `${name}, thank you for reserving at Chef Marco’s Restaurant on ${date} at ${time}! Your reservation is confirmed`
  );
});

// Route-level middleware to protect chef recipes
const onlyChefs = (req, res, next) => {
  if (req.headers.role !== "chef") {
    return res.status(401).send("Only chefs can access this!");
  }
  next();
};

// Secret recipe route
app.get("/chef/secret-recipe", onlyChefs, (req, res) => {
  res.json({ recipe: "Secret Sauce: Butter, garlic, parmesan!" });
});

// Fallback for not implemented (if needed)
// app.post("/reservations", (req, res) => {
//   res.status(501).send("Route exists but isn’t implemented yet!");
// });

app.listen(PORT, () => {
  console.log(`Server is listening on http://localhost:${PORT}`);
});

