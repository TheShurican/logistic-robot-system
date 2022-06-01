const express = require("express");
const app = express();
const fs = require("fs");
app.listen(3000, () => console.log("listening"));
app.use(express.static("public"));
app.use(express.json() );

let inputData = {};
app.post("/api", (request, response)=> {
  inputData = request.body;


  console.log(inputData);
  response.json({
    status: "sucess"
  })
})
