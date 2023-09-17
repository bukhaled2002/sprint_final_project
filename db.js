const { MongoClient } = require("mongodb");

let dbConnection;
module.exports = {
  connectToDb: (cb) => {
    // console.log(MongoClient);
    MongoClient.connect("mongodb://localhost:27017/Movies")
      .then((client) => {
        dbConnection = client.db();

        return cb();
      })
      .catch((err) => {
        console.log(err);
        return cb(err);
      });
  },
  getDb: () => dbConnection,
};
