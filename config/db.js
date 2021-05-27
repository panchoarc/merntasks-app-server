const { connect } = require("mongoose");

require("dotenv").config({ path: "variables.env" });

const conectarDB = async () => {
  const mongodb = process.env.DB_MONGO || "mongodb://mongo:27017/merntasks";
  try {
    await connect(mongodb, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useFindAndModify: false,
      useCreateIndex: true,
    });
  } catch (error) {
    process.exit(1);
  }
};

module.exports = conectarDB;
