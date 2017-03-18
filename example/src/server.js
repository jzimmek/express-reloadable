const express = require("express"),
      path = require("path"),
      reloadable = require("express-reloadable").default

const app = express()

reloadable(app, {
  requireFile: path.resolve(__dirname, "./router"),
  watch: path.resolve(__dirname),
})

app.listen(9090)
