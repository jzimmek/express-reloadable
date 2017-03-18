module.exports = {
  // optional
  tearDown: () => {
    // release resources before reload
  },
  default: (app) => {
    app.get("/hello", (req, res) => {
      res.send("world")
    })
  }
}
