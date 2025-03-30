const express = require("express");
const app = express();
const routes = require("./api/routes");
const cors = require("cors");

app.use(cors());
app.use(express.json());
app.use("/api", routes);

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
