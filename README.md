# Why express-reloadable

Express is a well known web application framework, but it lacks a standard way to hot reload your application code without a server restart. This hurts even more if you are used to develop with a HMR alike development workflow in your react/angular layer through webpack.

Express-reloadable is a way to get HMR like code reload in your express applications.


# How does it work?

We leverage the existing router feature of express and wire it together with the fantastic file-watch library chokidar. The express router will be reloaded if we detect any file change.

# Installation

```
npm install express-reloadable chokidar
```

# Getting started

You will have at least two files.

./router.js

```
export default (app) => {
  app.get("/hello", (req, res) => {
	res.send("world")
  })
}
```

The router file will be reloaded whenever itself or any imported/required resources will change.


./server.js

```
import express from "express"
import path from "path"
import reloadable from "express-reloadable"

const app = express()

reloadable(app, {
  requireFile: path.resolve(__dirname, "./router"),
  watch: path.resolve(__dirname),
})

app.listen(9090)
```

Nothing really new in the server file. You bootstrap your express application as before. But you pass your application object the "reloadable()" function right before you start listening for any requests.

See the [example](https://github.com/jzimmek/express-reloadable/tree/master/example) folder for a fully working demo application


# Reloadable configuration options:

|Name|Default|Description|
|----|-------|-----------|
|requireFile|n/a|The file to (re-)require on reload|
|watch|n/a|Paths to files, dirs to be watched recursively, or glob patterns. See https://github.com/paulmillr/chokidar#api for details.|
|clearIf|(file) => file.indexOf("node_modules") === -1|A reload is only triggered if this functions returns a truthy value.|


# How to release allocated resources on reload?

Express-reloadable supports the notion of a tearDown function. The tearDown function is called before the reload happend and gives you a chance to release any allocated resources.

```
// this will be executed on every reload
let databaseConnection = initDb()

export function tearDown(){
  // release the databaseConnection on reload
  databaseConnection.release()
}

export default (app) => {
  app.get("/hello", (req, res) => {
	res.send("world")
  })
}
```


# Integration with webpack-dev-server

Just use the existing setup hook of devServer in your webpack.config.js

```
import path from "path"

module.exports = {
  // ... 
  // add your existing webpack config here
  // ...
  devServer: {
    setup(app){
      let srcDir = path.resolve(__dirname, "src")
      reloadable(app, {
        requireFile: path.join(srcDir, "./router"),
        watch: srcDir,
      })
    }  
  }
}
```

This will add your reloadable application routes from ./router available right on the webpack-dev-server instance. Same start script, same process, same logfile ... can't be any easier.

# License

Express-reloadable is released under the MIT license.
