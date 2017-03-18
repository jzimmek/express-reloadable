const express = require("express"),
      path = require("path"),
      reloadable = require("reloadable-middleware").default

const app = express()

reloadable(app, {
  requireFile: path.resolve(__dirname, "./router"),
  clearIf: (file) => file.indexOf(path.resolve(__dirname)) !== -1,
  watch: path.resolve(__dirname),
})

app.listen(9090)
