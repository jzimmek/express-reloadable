import express from "express"
import chokidar from "chokidar"

export default (app,{requireFile,watch,clearIf,watchOpts}) => {

  if(!clearIf)
    clearIf = (file) => file.indexOf("node_modules") === -1

  let router = express.Router(),
      {default: fn, tearDown} = require(requireFile)

  fn(router)

  chokidar.watch(watch, {
    awaitWriteFinish: {
      stabilityThreshold: 500,
      pollInterval: 100,
    },
    ...watchOpts
  }).on("all", () => {
    if(tearDown)
      tearDown()

    Object.keys(require.cache).forEach(function(key){
      if(clearIf(key))
        delete require.cache[key]
    })

    let {default: nextFn, tearDown: nextTearDown} = require(requireFile)

    router = express.Router()
    nextFn(router)
    tearDown = nextTearDown
  })

  app.use("/", (req,res,next) => {
    router(req,res,next)
  })
}
