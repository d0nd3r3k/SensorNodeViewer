const serviceUuid = "19b10010-e8f2-537e-4f6c-d104768a1214";
const characteristicsUUID = {
  led:"19b10011-e8f2-537e-4f6c-d104768a1214",
  button:"19b10012-e8f2-537e-4f6c-d104768a1214",
  tmp:"a128ee54-89e6-4757-825a-1e0aeeb728ff",
  hum:"cec1c3e3-6810-4901-a70d-91a5f378c191",
  pre:"7b9c78ea-154c-4f90-8f2f-ffcfe2202e7b",
  r:"403934a1-c64b-45f0-adcc-a6888b06e76c",
  g:"ff8e979c-2798-4cdb-982e-3feed933e018",
  b:"0a63b771-59d2-415b-b9d0-f93eddf10893",
  a:"a10b350c-d110-4ecd-befe-598ad355db7c"
}
let buttonCharacteristic;
let tmpCharacteristic;
let humCharacteristic;
let preCharacteristic;
let rCharacteristic;
let gCharacteristic;
let bCharacteristic;
let aCharacteristic;
let ledCharacteristic;
let myBLE;

var data = [];
var dataList = [];
var colorDataList = [];
var currentID=0;
var latitude;
var longitude;

let buttonValue = 0;

function setup() {
  // Create a p5ble class
  myBLE = new p5ble();

}

function setConnButtonState(enabled) {
  if (enabled) {
    document.getElementById("clientConnectButton").innerHTML = "Disconnect";
  } else {
    document.getElementById("clientConnectButton").innerHTML = "Connect";
  }
}

function connectAndStartNotify() {
  // Connect to a device by passing the service UUID
  myBLE.connect(serviceUuid, gotCharacteristics);
}

function gotCharacteristics(error, characteristics) {
  setConnButtonState(true);
  if (error) console.log('error: ', error);
  for(let i = 0; i < characteristics.length;i++){
    if(characteristics[i].uuid == characteristicsUUID.button){
      buttonCharacteristic = characteristics[i];
      myBLE.startNotifications(buttonCharacteristic, handleButton);
    }
    else if(characteristics[i].uuid == characteristicsUUID.led){
      ledCharacteristic = characteristics[i];
    }
    else if(characteristics[i].uuid == characteristicsUUID.tmp){
      tmpCharacteristic = characteristics[i];
      myBLE.startNotifications(tmpCharacteristic, handleTmp);
    }
    else if(characteristics[i].uuid == characteristicsUUID.hum){
      humCharacteristic = characteristics[i];
      myBLE.startNotifications(humCharacteristic, handleHum);
    }else if(characteristics[i].uuid == characteristicsUUID.pre){
      preCharacteristic = characteristics[i];
      myBLE.startNotifications(preCharacteristic, handlePre);
    }
    else if(characteristics[i].uuid == characteristicsUUID.r){
      rCharacteristic = characteristics[i];
      myBLE.startNotifications(rCharacteristic, handleR);
    }
    else if(characteristics[i].uuid == characteristicsUUID.g){
      gCharacteristic = characteristics[i];
      myBLE.startNotifications(gCharacteristic, handleG);
    }
    else if(characteristics[i].uuid == characteristicsUUID.b){
      bCharacteristic = characteristics[i];
      myBLE.startNotifications(bCharacteristic, handleB);
    }
    else if(characteristics[i].uuid == characteristicsUUID.a){
      aCharacteristic = characteristics[i];
      myBLE.startNotifications(aCharacteristic, handleA);
    }
  }
}

function handleButton(data) {
  console.log('Button: ', data);
  buttonValue = Number(data);
}

function handleTmp(data) {
  console.log('Tmp: ', data);
  if(longitude && latitude)
  dataList.push({"id":currentID,"tmp":data,"t":Date.now(),"lon":longitude,"lat":latitude});
  else
  dataList.push({"id":currentID,"tmp":data,"t":Date.now()});
}

function handleHum(data) {
  console.log('Hum: ', data);
  if(longitude && latitude)
  dataList.push({"id":currentID,"hum":data,"t":Date.now(),"lon":longitude,"lat":latitude});
  else
  dataList.push({"id":currentID,"hum":data,"t":Date.now()});
}

function handlePre(data) {
  console.log('Pre: ', data);
  if(longitude && latitude)
  dataList.push({"id":currentID,"pre":data,"t":Date.now(),"lon":longitude,"lat":latitude});
  else
  dataList.push({"id":currentID,"pre":data,"t":Date.now()});
  updateDOMByID(currentID);
  currentID++;
}

function handleR(data) {
  console.log('R: ', data);
}

function handleG(data) {
  console.log('G: ', data);
}

function handleB(data) {
  console.log('B: ', data);
}

function handleA(data) {
  console.log('A: ', data);
}

function toggleLED(){
  myBLE.read(ledCharacteristic, handleLED);
}

function saveGeo(){
  navigator.geolocation.getCurrentPosition(success, error);

  function success(position) {
    latitude  = position.coords.latitude;
    longitude = position.coords.longitude;
  }
  function error() {
    console.log('Unable to retrieve your location');
  }
}

function handleLED(error, data){
  if (error) console.log('error: ', error);
  console.log('LED: ', data);
  myBLE.write(ledCharacteristic, !data);
}

function updateDOMByID(id){
  var dataCollection = [];
  data = [];
  for(var i=0; i<dataList.length-2;i++){
    if(dataList[i].id == dataList[i+1].id){
      var entry = {"id":dataList[i].id,"tmp":dataList[i].tmp, "hum":dataList[i+1].hum,"pre":dataList[i+2].pre,"t":dataList[i].t}
      if(dataList[i].lon)
      entry = {"id":dataList[i].id,"tmp":dataList[i].tmp, "hum":dataList[i+1].hum,"pre":dataList[i+2].pre,"t":dataList[i].t, "lon":dataList[i].lon,"lat":dataList[i].lat}
      dataCollection.push(entry);
      i+=2;
    }
  }

  for(var i=0; i<dataCollection.length;i++){
    data.push(dataCollection[i]);
    console.log(dataCollection[i]);
  }

  var sensor_el = document.getElementById("sensor-el");

  if(dataList[id].lon)
    sensor_el.innerHTML ="<p>ID: "+dataCollection[id].id+" TEMPERATURE: "+dataCollection[id].tmp+"ºC HUMIDITY: "+dataCollection[id].hum+"% PRESSURE: "+dataCollection[id].pre+" hPa</p><p>LONG: "+dataList[id].lon+" LAT: "+ dataList[id].lat+"</p>";
  else
      sensor_el.innerHTML ="<p>ID: "+dataCollection[id].id+" TEMPERATURE: "+dataCollection[id].tmp+"ºC HUMIDITY: "+dataCollection[id].hum+"% PRESSURE: "+dataCollection[id].pre+" hPa</p>"
}

function printDataList(){
  for(var i=0; i<dataList.length;i++){console.log(dataList[i])}
}

function printDataCollection(){
  var dataCollection = [];
  data = [];
  for(var i=0; i<dataList.length-2;i++){
    if(dataList[i].id == dataList[i+1].id){
      var entry = {"id":dataList[i].id,"tmp":dataList[i].tmp, "hum":dataList[i+1].hum,"pre":dataList[i+2].pre,"t":dataList[i].t}
      if(dataList[i].lon)
      entry = {"id":dataList[i].id,"tmp":dataList[i].tmp, "hum":dataList[i+1].hum,"pre":dataList[i+2].pre,"t":dataList[i].t, "lon":dataList[i].lon,"lat":dataList[i].lat}
      dataCollection.push(entry);
      i+=2;
    }
  }

  for(var i=0; i<dataCollection.length;i++){
    data.push(dataCollection[i]);
    console.log(dataCollection[i]);
  }

}

function download_csv() {
  printDataCollection()
  var csv = 'id,tmp,hum,pres,t,lon,lat\n';
  for(var i=0; i<data.length;i++){
    if(data[i].lat){
      csv += data[i].id + "," + data[i].tmp + "," + data[i].hum + "," + data[i].pre + "," + data[i].t + "," + data[i].lon + "," + data[i].lat;
    }
    else {
      csv += data[i].id + "," + data[i].tmp + "," + data[i].hum + "," + data[i].pre + "," + data[i].t;
    }
    csv += "\n";
  }

  console.log(csv);
  var hiddenElement = document.createElement('a');
  hiddenElement.href = 'data:text/csv;charset=utf-8,' + encodeURI(csv);
  hiddenElement.target = '_blank';
  hiddenElement.download = 'data'+Date.now()+'.csv';
  hiddenElement.click();
}
