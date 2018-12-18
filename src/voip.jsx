import React from 'react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';
import AlertDialog from './alertdialog.jsx';
const remote = require('electron').remote;// Load remote compnent that contains the dialog dependency
const app = remote.app;
const dialog = remote.dialog; // Load the dialogs component of the OS
const fs = require('fs'); // Load the File System to execute our common tasks (CRUD)

export default class Voip extends React.Component {

  constructor(props) {
    super(props);
    this.firstLoad = this.firstLoad.bind(this);
    this.state = {
      dialogOpen: false,
      dialogTitle: "Welcome To Viop Dashboard",
      dialogMessage: 'To start, click on load data to load in your .csv file. Whenever you need to load more data, just click load data again and load a new file.',
      stateOfVoip: [],
    };
  }

  componentDidMount() {
    const DATAPATH =  app.getAppPath() + "\\allSaveData.json";
    console.log(DATAPATH);
    fs.readFile(DATAPATH, 'utf-8', (err, data ) => {
      if(err) { // File does not exist yet.
        this.setState({ dialogOpen: true });
        var content = {
            summary: {},
            headingRow: ["ID","RefNum","Extension Number","Call Date","Call Duration","Number Called","LCD","Call Direction"],
            state: null
        };
        content = JSON.stringify(content);
        // fileName is a string that contains the path and filename.
        fs.writeFile(DATAPATH, content, (err) => {
          if(err){
              alert("An error ocurred creating the file "+ err.message);
              return;
          }
              console.log("The file has been succesfully saved");
        });
        console.error(err);
        return;
      } else { // The file exists
        console.log("Data from file: ",JSON.parse(data));
        let dataFromFile = JSON.parse(data);
        this.setState({stateOfVoip: dataFromFile.state});
      }
    });
  }

  readFile (filePath) {
    var exNumbersToCheck = this.state.stateOfVoip;
    fs.readFile(filePath, 'utf-8', (err, data ) => {
      if(err) {
        alert("There has been an error trying to read the file.");
        console.error(err);
        return;
      }
      if (typeof(Worker) !== "undefined") {
        var worker = new Worker("worker.js");
        worker.addEventListener('message', function(e) {
          // console.log('Message from Worker: ');
          // console.log(e.data);

  /**
   * Function to return if we have already added Ex number for this file.
   * We need to check for every line of the file.
   * @param {Array} arrayOfExNumbersCompleted - Array of numbers already done.
   * @param {Number} exNumberToCheck - Number to see if it is in our array passed.
   */
  function returnIfBeenDoneForThisTimeAndExNumberForFile (arrayOfExNumbersCompleted, exNumberToCheck) {
    if(arrayOfExNumbersCompleted !== undefined) {
      var length = arrayOfExNumbersCompleted.length;
      for(var a = 0; a < length; a++) {
        if (exNumberToCheck == arrayOfExNumbersCompleted[a]) {
          return true;
        } else {
          return false;
        }
      }
    }
}

  /**
   * Function to return the day of the year out of 366. Returns a number.
   * @param {string} date - Date you want the day of the year.
   */
  function returnDayStartAndEndForGaps (date) {
    const oneDay = 1000 * 60 * 60 * 24;
    var now = new Date(date);
    var start = new Date(now.getFullYear(), 0, 0);
    var diff = (now - start) + ((start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000);
    var day = Math.floor(diff / oneDay);
    return day;
  }
  /**
   * Function to return the amount of milliseconds since 1970. Returns a number.
   * @param {string} date - Date you want the milliseconds of.
   */
  function returnMillisecondsOfDate (date) {
    var toCalc = new Date(date);
    toCalc = toCalc.getTime();
    return toCalc;
  }
  /**
   * Function to return index of array where exNumber is found.
   * @param {Array} arrayToCheck - Array of data of all our exNumbers.
   * @param {Number} exNumberToFind - Number to see if it is in our array passed.
   */
  function returnPlaceInArrayToCheckAndUpdate (arrayToCheck, exNumberToFind) {
      var length = arrayToCheck.length;
      for(var a = 0; a < length; a++) {
        if(arrayToCheck[a].exNumber == exNumberToFind) {
          return a;
        }
      }
  }
  /**
   * Function to return updated array for the time gaps.
   * @param {Array} dataToPassBack - Array of all our data.
   * @param {Array} arrayOfGapObjects - Array of objects containing to and from values to check.
   * @param {Number} millisecondsToCheck - The milliseconds to see if we have the data from this date already.
   * @param {Number} indexToChange - Index of our data array that we want to update.
   * @param {Number} dayForGap - Day that we need to update in our timeGaps array.
   * @param {Date} fromDateToAdd - Date object to add to our gaps.
   * @param {Date} toDateToAdd - Date object to add to our gaps.
   * @param {Number} year - The year of the data passed.
   * @param {Object} rowCurrentlyOn - This is the row we are on to pass to another funtion if our checks are okay.
   */
  function checkAndUpdateDataIfNeed (dataToPassBack, arrayOfGapObjects, millisecondsToCheck, indexToChange, dayForGap, fromDateToAdd, toDateToAdd, rowCurrentlyOn) {
    if(arrayOfGapObjects !== undefined ){
      var length = arrayOfGapObjects.length;
      for(var a = 0; a < length; a++) {
        if(arrayOfGapObjects[a].from <= millisecondsToCheck && arrayOfGapObjects[a].to >= millisecondsToCheck) {
          // It is between the gap we have already added
          if (arrayOfGapObjects[a].new) {
            dataToPassBack = pushDataToArray(dataToPassBack, rowCurrentlyOn);
          }
          return dataToPassBack;
        }
      }
      dataToPassBack[indexToChange].data.timeGapsDays[dayForGap].push({
          from:returnMillisecondsOfDate(fromDateToAdd),
          to:returnMillisecondsOfDate(toDateToAdd),
          new: true,
      });
      dataToPassBack = pushDataToArray(dataToPassBack, rowCurrentlyOn);
      return dataToPassBack;
    }
  }
   /**
   * Function to return the last date.
   * @param {Array} arrayOfData - Array of all our data to check.
   * @param {Number} lastRow - last row of our data.
   */
  function findLastDate (arrayOfData, lastRow) {
    for(var a = (lastRow-1); a > -1; a--) {
      if(arrayOfData[a].length > 1) {
        if(arrayOfData[a][3] !== undefined) {
          return arrayOfData[a][3];
        }
      }
    }
  }
  /**
   * Function to check if the year changes in this file.
   * @param {String} firstDate - String found at the bottom of our file representing the date.
   * @param {String} lastDate - String found at the top of our file representing the date.
   */
  function doesTheYearChangeFunction (firstDate, lastDate) {
    let firstDateTemp = new Date(firstDate);
    let lastDateTemp = new Date(lastDate);
    if (firstDateTemp.getFullYear() !== lastDateTemp.getFullYear()) {
      return false;
    } else {
      return true;
    }
  }

  /**
   * Function to add data to exNumber
   * @param {Array} dataArray - array of all our data.
   * @param {Object} data - The row of the data from our file.
   */
  function pushDataToArray (dataArray, data) {
    // Here we need to check that the call was over 20 seconds.
    var time = new Date("2018/12/15 " + data[4]);
    var seconds = time.getSeconds();
    if (seconds > 20) {
      var min = time.getMinutes();
      var hours = time.getHours();
      var length = dataArray.length;
      for (var a = 0; a < length; a++) {
        if(dataArray[a].exNumber == data[2]) {
          // here we need to update our data.
          dataArray[a].allTime.time.hours = dataArray[a].allTime.time.hours + hours;
          dataArray[a].allTime.time.min = dataArray[a].allTime.time.min + min;
          if(dataArray[a].allTime.time.min > 60) {
            while (dataArray[a].allTime.time.min > 60) {
              dataArray[a].allTime.time.min = dataArray[a].allTime.time.min - 60;
              dataArray[a].allTime.time.hours++
            }
          }
          dataArray[a].allTime.time.seconds = dataArray[a].allTime.time.seconds + seconds;
          if (dataArray[a].allTime.time.seconds > 60) {
            while (dataArray[a].allTime.time.seconds > 60) {
              dataArray[a].allTime.time.seconds = dataArray[a].allTime.time.seconds - 60;
              dataArray[a].allTime.time.min++;
            }
          }
          dataArray[a].allTime.calls++;
          return dataArray;
        }
      }
    }
    return dataArray;
  }

  /**
   * Function to save to files. Files will be named after each ex number. Files will be ordered into years.
   * @param {Array} dataToSave - this is an array of all the data to write to files
   */
  function saveToFile (dataToSave) {
    var DATAPATHP =  app.getAppPath() + "\\dataForVoip\\";
    // The length of this file will be the number of files to create
    var noOfFiles = dataToSave.length;
    for (var a = 0; a < noOfFiles; a++) {
      let nameOfFile = DATAPATHP + dataToSave[a].exNumber + '.json';
      console.log('dataToSave[a]', dataToSave[a]);
      fs.writeFile(nameOfFile, JSON.stringify(dataToSave[a]), (err) => {
        if(err){
          alert("An error ocurred creating the file "+ err.message);
          return;
        }
          console.log("The file ",nameOfFile," has been succesfully saved");
      });
    }
    console.log("All files were saved properly.");
  }

  /**
   * Function to return all the data saved for the exNumbers.
   */
  function getDataFromFiles () {
    var DATAPATHP =  app.getAppPath() + "\\dataForVoip\\";
    console.log(DATAPATHP);
    var allDataSaved = [];
    fs.readdir(DATAPATHP, (err,dir) => {
      if(err) {
        console.error("Error: ", err);
        return;
      }
      var length = dir.length;
      for(var a = 0; a < length; a++) {
        var filePath = DATAPATHP + dir[a];
        console.log(filePath);
        fs.readFile(filePath, 'utf-8', (err, data ) => {
          allDataSaved.push(JSON.parse(data));
        });
      }
    });
    return allDataSaved;
  }

  /**
   * Function change all the timegaps.new to false.
   * @param {Array} allData - The data.
   * @param {Number} day - the day that we want to change in the time gap.
   */
  function changeTimgapsNew (allData, day) {
    var length = allData.length;
    for (var a = 0; a < length; a++) {
      allData[a].data.timeGapsDays[day].new = false;
    }
    return allData;
  }

  function toPost (e) {
    // We must load our last state here.
    var exNumbers = [];
    var exNumbersThatHaveGaps = [];
    var dataToPassBack = [];
    // e.data is what we will be working with. This is an array and each index of the array represents a row.
    const columns = 8;
    var rows = e.data.length;
    var lastDate = e.data[1][3];
    var firstDate = findLastDate(e.data, rows);
    var year = new Date(e.data[1][3]);
    var doesTheYearChange = doesTheYearChangeFunction(firstDate, lastDate);
    // These two variables would normally equal, but maybe they dont.
    var lastDateDay = returnDayStartAndEndForGaps(lastDate);
    var firstDateDay = returnDayStartAndEndForGaps(firstDate);
    for(var a = 1; a < rows; a++) {// a = 1 becasue our first row is useless to us.
        for (var b = 0; b < (columns - 1); b++) {
            if(e.data[a][b] !== undefined) {
              if(b == 2) {// Here we must check if we have this person in our exNumbers
                // If we don't have them, then we need to load them.
                var exNumbersLen = exNumbers.length;
                var checkNumber = false;
                for(var c = 0; c < exNumbersLen; c++) {
                  if(exNumbers[c] == e.data[a][b]) {
                    // set a bool;
                    checkNumber = true;
                    c = exNumbersLen; // Break out of loop.
                  }
                }
                  if(!checkNumber){
                      //Ex number is not there.
                      let tempYear = new Date(e.data[a][3]);
                      tempYear = tempYear.getFullYear();
                      if(tempYear !== year) {
                        year = tempYear;
                      }
                      dataToPassBack.push({
                          new: true,
                          exNumber: e.data[a][b],
                          name: "",
                          data:{
                            year:year,
                            timeGapsDays: new Array(366),
                            days: new Array(366),
                            week: new Array(52),// weekNum:1-52
                            month: new Array(12),// monthNum: 1-12
                          },
                          allTime:{
                              time: {hours: 0, min: 0, seconds: 0},
                              calls:0,
                              outgoingNum:0,
                              incomingNum:0
                          }
                      });
                      exNumbers.push(e.data[a][b]);
                  }
                }
                if (b == 3 ) { //on date started
                  // Get the place in our dataToPassBack Array to check and change.
                  var indexToUpdate = returnPlaceInArrayToCheckAndUpdate(dataToPassBack, e.data[a][2]);
                  // For both cases now we dont need if (firstDateDay == lastDateDay)
                  var dayToCheck = returnDayStartAndEndForGaps(e.data[a][b]);
                  var millisecondsToCheck = returnMillisecondsOfDate(e.data[a][b]);
                    if(checkNumber) { // Need to get time gaps and check this one.
                      let tempYear = new Date(e.data[a][b]);
                      tempYear = tempYear.getFullYear();
                      if(tempYear !== year) {
                        year = tempYear;
                      }
                        // Array of objects {from:, to:} -> dataToPassBack[indexToUpdate].timeGapsDays[dayToCheck]
                        dataToPassBack = checkAndUpdateDataIfNeed(dataToPassBack, dataToPassBack[indexToUpdate].data.timeGapsDays[dayToCheck],millisecondsToCheck, indexToUpdate,dayToCheck,firstDate,lastDate, e.data[a]);
                    } else { // This means that this is a new exNumber being added
                        if (firstDateDay == lastDateDay) {
                            dataToPassBack[dataToPassBack.length - 1].data.timeGapsDays[firstDateDay] = [{
                                from:returnMillisecondsOfDate(firstDate),
                                to:returnMillisecondsOfDate(lastDate),
                                new: true,
                            }];
                        } else { // When this runs, multiple days are being added. EDGE CASE.
                            dataToPassBack[dataToPassBack.length - 1].data.timeGapsDays[firstDateDay] = [{
                                from:returnMillisecondsOfDate(firstDate),
                                to:0,
                                new: true,
                            }];
                            for(var d = 1; d < (lastDateDay - firstDateDay); d++) {
                                dataToPassBack[dataToPassBack.length - 1].data.timeGapsDays[firstDateDay + d] = [{
                                from:0,
                                to:0,
                                new: true,
                                }];
                            }
                            dataToPassBack[dataToPassBack.length - 1].data.timeGapsDays[lastDateDay] = [{
                                from:0,
                                to:returnMillisecondsOfDate(lastDate),
                                new: true,
                            }];
                        }
                        exNumbersThatHaveGaps.push(e.data[a][2]);
                        dataToPassBack = pushDataToArray(dataToPassBack, e.data[a]);
                    }
                }
            }
        }
    }
    if (firstDateDay == lastDateDay) {
      changeTimgapsNew(dataToPassBack, firstDateDay);
    } else {
      var length = lastDateDay - firstDateDay;
      for (var e = 0; e <= length; e++) {
        changeTimgapsNew(dataToPassBack, (firstDateDay + a));
      }
    }
    return dataToPassBack;
  }

  var dataForFile = toPost(e);
  console.log(dataForFile);
  // saveToFile(dataForFile);
  console.log(getDataFromFiles());

          if(localStorage.getItem("exNumbers") !== null) {
            exNumbers = localStorage.getItem("exNumbers");
          }
        });
        worker.postMessage(data);
    } else {
        console.log("There is no worker support :(");
    }
    });
  }

  getData() {
    dialog.showOpenDialog((filenames) => {
      if(filenames === undefined) {
        alert("No file was selected");
      } else {
        this.readFile(filenames[0]);
      }
    });
  }

  firstLoad (dataFromChild) {
    this.setState({
      dialogOpen: dataFromChild
    });
  }

  render() {
    const open = this.state.dialogOpen;
    const title = this.state.dialogTitle;
    const message = this.state.dialogMessage;
    return (
    <div style={{ marginTop: 30 }}>
      <Grid container spacing={16}>
        <Grid item xs={12}>
            <Grid container justify="center" spacing={16}>
                <h2>VoIP Dashboard</h2>
            </Grid>
            <Grid container justify="center" spacing={16}>
                <Grid item>
                  <Button variant="contained" color="primary">
                    <Link style={{ textDecoration: 'none' }} to='/main/'>Main Page</Link>
                  </Button>
                </Grid>
                <Grid item>
                <AlertDialog message={message} title={title} open={open} callbackFromParent={this.firstLoad}/>
                <Button variant="contained" className="w3-green" onClick={() => this.getData()}>
                  Load Data
                </Button>
                </Grid>
            </Grid>
        </Grid>
      </Grid>
    </div>
    );
  }
}
