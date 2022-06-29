#!/usr/bin/env node

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
const v_tugger_max = 5; //must be changed to actual velocity and careful of units
const v_bmw_max = 5;





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
   //compute Distances between each robot and start point and each robot and exchange point; next_step: retrieving distance estimation from robot as well -> more precise (Update: not possible)
   //Instead we will compute the distances using A* or Dijkstra; issue -> will only output path coordinates not distance (Distance computation can become costly)
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
  start_tugger_to_exchange: distances.start_to_exchange / v_tugger_max, // if v_tugger_max == v_bmw_max you can simplify this step
  start_bmw_to_exchange: distances.start_to_exchange / v_bmw_max,
  tugger_to_exchange:  distances.tugger_to_exchange / v_tugger_max,
  bmw_to_exchange: distances.bmw_to_exchange / v_bmw_max
  }
  return times
}


function pickVehicle(times){ //calculating the combinations of the system and picking the most effective one. Need to know if the vehicle velos are approx. equal
  let combination1 = times.tugger_to_start + times.start_tugger_to_exchange + times.bmw_to_exchange;
  let combination2 = times.bmw_to_start + times.start_bmw_to_exchange + times.tugger_to_exchange;
  if(combination1 <= combination2){
    console.log(""); //later on implement return of the time estimation for the process to complete
    pickUpRobot = 0; //poor method  -> function should return the robots in order (which one goes to start which one goes to exchange)
    exchangeRobot = 1; //with a time estimation as well
  }else{
    console.log("");
    pickUpRobot = 1;
    exchangeRobot = 0;
  }
}
function computationProcess(userData,tuggerTrainData,bmwData){
  coordinates = getCoordinates(userData,tuggerTrainData,bmwData);
  distances = computeDistances(coordinates);
  times = timeEstimation(distances);
  pickVehicle(times);
  let cache = {
    coordinates: coordinates,
    distances: distances,
    times: times,
  }
  return cache
}
