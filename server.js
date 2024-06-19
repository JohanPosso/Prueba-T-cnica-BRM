const { app } = require("./app");
const dotenv = require("dotenv");
const { database } = require("./database/database");
const { initModels } = require("./database/initModels");
dotenv.config({ path: "./.env" });

database
  .authenticate()
  .then(() => console.log("Base de datos Autenticada"))
  .catch((err) => console.log(err));

initModels();

database
  .sync()
  .then(() => console.log("Base de datos Sincronizada"))
  .catch((err) => console.log(err));

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Servidor Corriendo en el Puerto: ${PORT}`);
});
