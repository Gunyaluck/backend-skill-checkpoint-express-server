import express from "express";
import connectionPool from "./utils/db.mjs";

const app = express();
const port = 4000;

app.use(express.json());

app.get("/test", (req, res) => {
  connectionPool.query("SELECT NOW()", (err, result) => {
    if (err) {
      return res.status(500).json({ message: "Internal server error" });
    }
    return res.json(result.rows);
  });
});

app.listen(port, () => {
  console.log(`Server is running at ${port}`);
});
