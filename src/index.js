const express = require("express");
const app = express();
const math = require("mathjs");
app.listen(3000, () => console.log("listening"));
app.use(express.static("public"));
app.use(express.json() );
let pickUpRobot; // 0 for Tugger, 1 for bmw
let exchangeRobot; //0 for Tugger, 1 for bmw

let userData = {}; //get startCoords, exchangeCoords & finalCoords;
let tuggerTrainData = {}; //get Coords of tugger robot
let bmwData = {}; //get Coords of bmw robot
const v_tugger_max;
const v_bmw_max;
app.post("/api", (request, response)=> {
  inputData = request.body;
  console.log(userData);

  response.json({
    status: "sucess"
  })
})
function getCoordinates(userData,tuggerTrainData,bmwData){
  let coordinates = {
    startCoords: userData.start_value,
    exchangeCoords: userData.exchange_value,
    tuggerTrainCoords: tuggerTrainData,
    bmwCoords: bmwData //assuming everything is in the same coordinate frame -> needs fixing later
  }
  return coordinates;
}
function computeDistances(coordinates){
   //compute Distances between each robot and start point and each robot and exchange point; next_step: retrieving distance estimation from robot as well -> more precise;
  let distances = {
    tugger_to_start:  math.distance(coordinates.startCoords, coordinates.tuggerTrainCoords),
    bmw_to_start:  math.distance(coordinates.startCoords, coordinates.bmwCoords),
    start_to_exchange:  math.distance(coordinates.startCoords, coordinates.exchangeCoords),
    tugger_to_exchange: math.distance(coordinates.exchangeCoords,coordinates.tuggerTrainCoords),
    bmw_to_exchange:  math.distance(coordinates.exchangeCoords,coordinates.bmwCoords),

  };
  return distances;
}
function timeEstimation(distances){
  //might need unit conversions
  let times = {
  tugger_to_start:  distances.tugger_to_start / v_tugger_max,
  bmw_to_start:  distances.bmw_to_start / v_bmw_max,
  start_tugger_to_exchange: distances.start_to_exchange / v_tugger_max,
  start_bmw_to_exchange: distances.start_to_exchange / v_bmw_max,
  tugger_to_exchange:  distances.tugger_to_exchange / v_tugger_max,
  bmw_to_exchange: distances.bmw_to_exchange / v_bmw_max
  }
  return times
}
function pickVehicle(times){ //only the most basic solution for pick up decision making, needs improvement
  if (times.tugger_to_start < times.bmw_to_start) {
    console.log("Tugger train to pick up order");
    pickUpRobot = 0;
    exchangeRobot = 1;
  }else if (times.tugger_to_start > times.bmw_to_start) {
    console.log("BMW robot to pick up order");
    pickUpRobot = 1;
    exchangeRobot = 0;
  }else if(times.tugger_to_start == times.bmw_to_start){
    console.log("Picking Random Robot");
    pickUpRobot = 1;
    exchangeRobot = 0;
  }
}
function computationProcess(userData,tuggerTrainData,bmwData){
  coordinates = getCoordinates(userData,tuggerTrainData,bmwData);
  distances = computeDistances(coordinates);
  times = timeEstimation(distances);
  pickVehicle(times);
}
