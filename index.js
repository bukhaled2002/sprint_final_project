const express = require("express");
const { connectToDb, getDb } = require("./db");
const { ObjectId } = require("mongodb");
const fs = require("fs");

const requestLogger = (req, res, next) => {
  const logMessage = `[${new Date().toISOString()}] ${req.method} ${req.url}\n`;

  fs.appendFile("log.txt", logMessage, (err) => {
    if (err) {
      console.error("Error writing to log file:", err);
    }
  });

  next();
};

const app = express();
console.log(ObjectId);

app.use(express.urlencoded());
app.use(express.json());
app.use(requestLogger);

// db connection
let db;

connectToDb((err) => {
  if (!err) {
    app.listen(3000, () => {
      console.log("all is well");
    });
    db = getDb();
    // console.log(db);
  }
});

app.get("/movie", (req, res) => {
  // console.log(dbc);
  let movies = [];
  db.collection("movie")
    .find()
    .sort({ author: 1 })
    .forEach((movie) => movies.push(movie))
    .then(() => {
      res.status(200).json(movies);
    });
});
app.get("/movie/:id", (req, res) => {
  if (ObjectId.isValid(req.params.id)) {
    db.collection("movie")
      .findOne({ _id: new ObjectId(req.params.id) })
      .then((doc) => {
        console.log(doc);
        res.status(200).json(doc);
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    res.json({ message: "error is here" });
  }
});
// add
app.post("/movie/add-item", (req, res) => {
  db.collection("movie")
    .insertOne(req.body)
    .then((doc) => {
      res.json(doc);
    })
    .catch((err) => {
      console.log(err);
    });
});

// update
app.patch("/movie/:id", (req, res) => {
  db.collection("movie")
    .updateOne({ _id: new ObjectId(req.params.id) }, { $set: req.body })
    .then((doc) => {
      res.json(doc);
    })
    .catch((err) => {
      console.log(err);
    });
});

// delete
app.delete("/movie/:id", (req, res) => {
  if (ObjectId.isValid(req.params.id)) {
    db.collection("movie")
      .deleteOne({ _id: new ObjectId(req.params.id) })
      .then((doc) => {
        console.log(doc);
        res.status(200).json(doc);
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    res.json({ message: "error is here" });
  }
});
