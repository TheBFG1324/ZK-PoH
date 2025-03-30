const express = require("express");
const app = express();
const routes = require("./api/routes");

app.use(express.json());
app.use("/api", routes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
