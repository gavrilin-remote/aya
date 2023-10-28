import * as dotenv from "dotenv";
import createApp from "./src/app";
import config from "config";

dotenv.config({ path: "../.env.base" });
dotenv.config({ path: "../.env", override: true });

createApp()
  .then((app) => {
    const port = config.get<string>("port");
    app.listen(port);
    console.log(`Listening on http://localhost:${port}`);
  })
  .catch((err) => {
    throw err;
  });
