var fs = require("fs")
var express = require('express');

var app = express();

app.get("/", (req, res) => {
    res.redirect("/index.html")
})
app.use(express.static("./pages"))
app.use(express.raw({ type: "*/*" }))

app.listen(10000)

console.log("server is on")