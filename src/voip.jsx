import React from 'react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';
import AlertDialog from './alertdialog.jsx';
import CustomizedSnackbars from './customizedsnackbars.jsx';
import EmployeeCard from './employeecard.jsx';
import CircularProgress from '@material-ui/core/CircularProgress';
const remote = require('electron').remote;// Load remote compnent that contains the dialog dependency
const app = remote.app;
const dialog = remote.dialog; // Load the dialogs component of the OS
const fs = require('fs'); // Load the File System to execute our common tasks (CRUD)

export default class Voip extends React.Component {

  constructor(props) {
    super(props);
    // this.loaderEle = React.createRef();
    this.firstLoad = this.firstLoad.bind(this);
    this.myCallback = this.myCallback.bind(this);
    this.getEmployeeCards = this.getEmployeeCards.bind(this);
    this.state = {
      dialogOpen: false,
      dialogTitle: "Welcome To Viop Dashboard",
      dialogMessage: 'To start, click on load data to load in your .csv file. Whenever you need to load more data, just click load data again and load a new file.',
      stateOfVoip: [],
      openSnack: false,
      typeSnack: 'info',
      messageSnack: 'Well hello there',
      employeeCards: [],
      loading: false
    };
  }

  componentDidMount() {
    const DATAPATH =  app.getAppPath() + "\\dataForVoip\\";
    if (fs.existsSync(DATAPATH)) {
        this.getDataFromFiles().then((data) => {
          this.setState({stateOfVoip: data});
          this.getEmployeeCards();
        });
    } else {
      fs.mkdir(DATAPATH, (err) => {
        if (err) return alert("Something went wrong: ",err);
      });
      this.setState({ dialogOpen: true });
    }
  }

  openSnackBarSuccesLoadingNewFile() {
    this.setState({
      openSnack: true,
      typeSnack: 'success',
      messageSnack: 'Succesfully Loaded File',
    });
  }

  myCallback (dataFromChild) {
    this.setState({
      openSnack: dataFromChild
    });
  }

  getEmployeeCards () {
    var employeeCardsData = [];
    var length = this.state.stateOfVoip.length;
    var min = "", seconds = "";
    for (var a = 0; a < length; a++) {
      if(this.state.stateOfVoip[a].allTime.time.min < 10) {min = "0" + this.state.stateOfVoip[a].allTime.time.min;}
      else {min = this.state.stateOfVoip[a].allTime.time.min;}
      if(this.state.stateOfVoip[a].allTime.time.seconds < 10) {seconds = "0" + this.state.stateOfVoip[a].allTime.time.seconds;}
      else {seconds = this.state.stateOfVoip[a].allTime.time.seconds;}
      employeeCardsData.push({
        key: a,
        new: this.state.stateOfVoip[a].new,
        exNumber: this.state.stateOfVoip[a].exNumber,
        calls: this.state.stateOfVoip[a].allTime.calls,
        hours: this.state.stateOfVoip[a].allTime.time.hours,
        min: min,
        seconds: seconds,
        name: this.state.stateOfVoip[a].name
      });
    }
    this.setState({employeeCards: employeeCardsData});
  }

   /**
   * Function to return all the data saved for the exNumbers.
   */
  getDataFromFiles () {
      return new Promise((resolve, reject) => {
        this.setState({loading: true});
        var DATAPATHP =  app.getAppPath() + "\\dataForVoip\\";
        var allDataSaved = [];
        var promises = [];
        fs.readdir(DATAPATHP, (err,dir) => {
          if(err) {
            console.error("Error: ", err);
            return;
          }
          var length = dir.length;
          for(var a = 0; a < length; a++) {
            var filePath = DATAPATHP + dir[a];
            promises.push(new Promise(function(resolve, reject) {
              fs.readFile(filePath, 'utf-8', (err, data ) => {
                if(err) {
                  reject("There was an error reading: ", filePath, " file.");
                }
                resolve(allDataSaved.push(JSON.parse(data)));
              });
            }));
          }
          Promise.all(promises).then(() => {
            this.setState({loading: false});
            resolve(allDataSaved);
          }).catch((err) => {
            reject(console.error(err));
          });
        });
      });
    }

  readFile (filePath) {
    this.setState({loading: true});
    fs.readFile(filePath, 'utf-8', (err, data ) => {
      if(err) {
        alert("There has been an error trying to read the file.");
        console.error(err);
        return;
      }
      if (typeof(Worker) !== "undefined") {
        /* START OF FUNCTIONS */
        /**
         * Function to return the Ex numbers already in our state as an array.
         * @param {Array} savedState - Array of numbers already done.
         */
        function returnExNumbersAlreadyInFiles (savedState) {
          var toReturn = [];
          if(savedState.length > 0) {
            var length = savedState.length;
            for(var a = 0; a < length; a++) {
              toReturn.push(savedState[a].exNumber);
            }
          }
          return toReturn;
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
           * Function to return week of the year a given date.
           * @param {Date} date - The date to work out the week of the year.
           */
          function getWeek (date) {
            let day = returnDayStartAndEndForGaps(date);
            return (Math.floor(day/7) + 1); // Will have 56 weeks after the 364th day.
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
        function checkAndUpdateDataIfNeed (dataToPassBack, arrayOfGapObjects, millisecondsToCheck, indexToChange, dayForGap, fromDateToAdd, toDateToAdd, year, rowCurrentlyOn) {
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
            var indexOfYear = getIndexOfYear(dataToPassBack[indexToChange].data,year);
            dataToPassBack[indexToChange].data[indexOfYear].timeGapsDays[dayForGap].push({
                from:returnMillisecondsOfDate(fromDateToAdd),
                to:returnMillisecondsOfDate(toDateToAdd),
                new: true,
            });
            // console.log("rowon",rowCurrentlyOn);
            dataToPassBack = pushDataToArray(dataToPassBack, rowCurrentlyOn);
            return dataToPassBack;
          }
        }
        /**
         * Function to return the last date.
         * @param {Array} arrayOfData - Array of all our data to check.
         * @param {Number} noOfRows - Number of rows in file.
         */
        function findFirstAndLastDate (arrayOfData, noOfRows) {
          var firstDate;
          for(var b = (noOfRows-1); b > -1; b--) {
            if(arrayOfData[b].length > 1) {
              if(arrayOfData[b][3] !== undefined) {
                firstDate = returnMillisecondsOfDate(arrayOfData[b][3]);
                b = -1;
              }
            }
          }
          var lastDate = firstDate;
          for(var a = 0; a < noOfRows; a++) {
            if(arrayOfData[a].length > 1) {
              if(arrayOfData[a][3] !== undefined) {
                let tempDate = returnMillisecondsOfDate(arrayOfData[a][3]);
                if(tempDate < firstDate) firstDate = tempDate;
                if(tempDate > lastDate) lastDate = tempDate;
              }
            }
          }
          return {firstDate: firstDate, lastDate: lastDate};
        }

        /**
         * Function to add data to exNumber
         * @param {Array} dataArray - array of all our data.
         * @param {Object} data - The row of the data from our file.
         */
        function pushDataToArray (dataArray, data) {
          // The date of the call
          var dateOfCall = new Date(data[3]);
          var yearOfCall = dateOfCall.getFullYear();
          var monthOfCall = dateOfCall.getMonth();
          var weekOfCall = getWeek(dateOfCall);
          var dayOfCall = returnDayStartAndEndForGaps(dateOfCall);

          // Here we need to check that the call was over 20 seconds.
          var time = new Date("2018/12/15 " + data[4]);
          var seconds = time.getSeconds();
          if (seconds > 20) {
            var min = time.getMinutes();
            var hours = time.getHours();
            var length = dataArray.length;
            for (var a = 0; a < length; a++) {
              if(dataArray[a].exNumber == data[2]) { // Checking for correct exnumber
                // here we need to update our data.
                //Start of all time
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
                // End of all time.
                var indexOfYearNeeded = getIndexOfYear(dataArray[a].data,yearOfCall);

                // Start of add to day
                if (dataArray[a].data[indexOfYearNeeded].days[dayOfCall - 1] == null) { // Nothing has been added to this day yet
                  dataArray[a].data[indexOfYearNeeded].days[dayOfCall - 1] = {
                    time:{hours:hours,min:min,seconds:seconds},
                    calls:1,
                    outgoingNum:0,
                    incomingNum:0,
                    unknownNum:0
                  };
                } else {
                  // Hours and min
                  dataArray[a].data[indexOfYearNeeded].days[dayOfCall - 1].time.hours = dataArray[a].data[indexOfYearNeeded].days[dayOfCall - 1].time.hours + hours;
                  dataArray[a].data[indexOfYearNeeded].days[dayOfCall - 1].time.min = dataArray[a].data[indexOfYearNeeded].days[dayOfCall - 1].time.min + min;
                  if(dataArray[a].data[indexOfYearNeeded].days[dayOfCall - 1].time.min > 60) {
                    while (dataArray[a].data[indexOfYearNeeded].days[dayOfCall - 1].time.min > 60) {
                      dataArray[a].data[indexOfYearNeeded].days[dayOfCall - 1].time.min = dataArray[a].data[indexOfYearNeeded].days[dayOfCall - 1].time.min - 60;
                      dataArray[a].data[indexOfYearNeeded].days[dayOfCall - 1].time.hours++
                    }
                  }
                  // Seconds
                  dataArray[a].data[indexOfYearNeeded].days[dayOfCall - 1].time.seconds = dataArray[a].data[indexOfYearNeeded].days[dayOfCall - 1].time.seconds + seconds;
                  if (dataArray[a].data[indexOfYearNeeded].days[dayOfCall - 1].time.seconds > 60) {
                    while (dataArray[a].data[indexOfYearNeeded].days[dayOfCall - 1].time.seconds > 60) {
                      dataArray[a].data[indexOfYearNeeded].days[dayOfCall - 1].time.seconds = dataArray[a].data[indexOfYearNeeded].days[dayOfCall - 1].time.seconds - 60;
                      dataArray[a].data[indexOfYearNeeded].days[dayOfCall - 1].time.min++;
                    }
                  }
                  dataArray[a].data[indexOfYearNeeded].days[dayOfCall - 1].calls++;
                }
                // End of add to day

                // Start of week
                if (dataArray[a].data[indexOfYearNeeded].week[weekOfCall - 1] == null) { // Nothing has been added to this week yet
                  dataArray[a].data[indexOfYearNeeded].week[weekOfCall - 1] = {
                    time:{hours:hours,min:min,seconds:seconds},
                    calls:1,
                    outgoingNum:0,
                    incomingNum:0,
                    unknownNum:0
                  };
                } else {
                  // Hours and min
                  dataArray[a].data[indexOfYearNeeded].week[weekOfCall - 1].time.hours = dataArray[a].data[indexOfYearNeeded].week[weekOfCall - 1].time.hours + hours;
                  dataArray[a].data[indexOfYearNeeded].week[weekOfCall - 1].time.min = dataArray[a].data[indexOfYearNeeded].week[weekOfCall - 1].time.min + min;
                  if(dataArray[a].data[indexOfYearNeeded].week[weekOfCall - 1].time.min > 60) {
                    while (dataArray[a].data[indexOfYearNeeded].week[weekOfCall - 1].time.min > 60) {
                      dataArray[a].data[indexOfYearNeeded].week[weekOfCall - 1].time.min = dataArray[a].data[indexOfYearNeeded].week[weekOfCall - 1].time.min - 60;
                      dataArray[a].data[indexOfYearNeeded].week[weekOfCall - 1].time.hours++
                    }
                  }
                  // Seconds
                  dataArray[a].data[indexOfYearNeeded].week[weekOfCall - 1].time.seconds = dataArray[a].data[indexOfYearNeeded].week[weekOfCall - 1].time.seconds + seconds;
                  if (dataArray[a].data[indexOfYearNeeded].week[weekOfCall - 1].time.seconds > 60) {
                    while (dataArray[a].data[indexOfYearNeeded].week[weekOfCall - 1].time.seconds > 60) {
                      dataArray[a].data[indexOfYearNeeded].week[weekOfCall - 1].time.seconds = dataArray[a].data[indexOfYearNeeded].week[weekOfCall - 1].time.seconds - 60;
                      dataArray[a].data[indexOfYearNeeded].week[weekOfCall - 1].time.min++;
                    }
                  }
                  dataArray[a].data[indexOfYearNeeded].week[weekOfCall - 1].calls++;
                }
                // End of week
                // Start of month
                // DON'T NEED monthOfCall - 1 BECAUSE FUNCTION RETURNS 0 - 11
                if (dataArray[a].data[indexOfYearNeeded].month[monthOfCall] == null) { // Nothing has been added to this month yet
                  dataArray[a].data[indexOfYearNeeded].month[monthOfCall] = {
                    time:{hours:hours,min:min,seconds:seconds},
                    calls:1,
                    outgoingNum:0,
                    incomingNum:0,
                    unknownNum:0
                  };
                } else {
                  // Hours and min
                  dataArray[a].data[indexOfYearNeeded].month[monthOfCall].time.hours = dataArray[a].data[indexOfYearNeeded].month[monthOfCall].time.hours + hours;
                  dataArray[a].data[indexOfYearNeeded].month[monthOfCall].time.min = dataArray[a].data[indexOfYearNeeded].month[monthOfCall].time.min + min;
                  if(dataArray[a].data[indexOfYearNeeded].month[monthOfCall].time.min > 60) {
                    while (dataArray[a].data[indexOfYearNeeded].month[monthOfCall].time.min > 60) {
                      dataArray[a].data[indexOfYearNeeded].month[monthOfCall].time.min = dataArray[a].data[indexOfYearNeeded].month[monthOfCall].time.min - 60;
                      dataArray[a].data[indexOfYearNeeded].month[monthOfCall].time.hours++
                    }
                  }
                  // Seconds
                  dataArray[a].data[indexOfYearNeeded].month[monthOfCall].time.seconds = dataArray[a].data[indexOfYearNeeded].month[monthOfCall].time.seconds + seconds;
                  if (dataArray[a].data[indexOfYearNeeded].month[monthOfCall].time.seconds > 60) {
                    while (dataArray[a].data[indexOfYearNeeded].month[monthOfCall].time.seconds > 60) {
                      dataArray[a].data[indexOfYearNeeded].month[monthOfCall].time.seconds = dataArray[a].data[indexOfYearNeeded].month[monthOfCall].time.seconds - 60;
                      dataArray[a].data[indexOfYearNeeded].month[monthOfCall].time.min++;
                    }
                  }
                  dataArray[a].data[indexOfYearNeeded].month[monthOfCall].calls++;
                }
                // End of month
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
          return new Promise((mainResolve, mainReject) => {
            var DATAPATHP =  app.getAppPath() + "\\dataForVoip\\";
            var promises = [];
            // The length of this file will be the number of files to create
            var noOfFiles = dataToSave.length;
            for (var a = 0; a < noOfFiles; a++) {
              let nameOfFile = DATAPATHP + dataToSave[a].exNumber + '.json';
              promises.push(new Promise((resolve, reject) => {
                fs.writeFile(nameOfFile, JSON.stringify(dataToSave[a]), (err) => {
                  if(err){
                    reject(alert("An error ocurred creating the file "+ err.message));
                  }
                    resolve();
                });
              }));
            }
            Promise.all(promises).then(() => {
              mainResolve("All files were saved properly.");
            }).catch((err) => {
              mainReject(err);
            });
          });
        }

        /**
         * Function change all the timegaps.new to false.
         * @param {Array} allData - The data.
         * @param {Number} day - the day that we want to change in the time gap.
         */
        function changeTimgapsNew (allData, day, year) {
          var length = allData.length;
          for (var a = 0; a < length; a++) {
            var numYears = allData[a].data.length;
            for (var b = 0; b < numYears; b++) {
              var lengthOfGaps = allData[a].data[b].timeGapsDays[day].length;
              for(var c = 0; c < lengthOfGaps; c++) {
                allData[a].data[b].timeGapsDays[day][c].new = false;
              }
            }
          }
          return allData;
        }

        /**
         * Function to return the index of the year for the data.
         * @param {Array} dataOfEmployee - The data array of JUST the data part that holds each year data.
         * @param {Number} year - the year that we want look for.
         */
        function getIndexOfYear (dataOfEmployee, year) {
          var length =  dataOfEmployee.length;
          for (var a = 0; a < length; a++) {
            if (dataOfEmployee[a].year == year) {
              return a;
            }
          }
        }

        /**
         * Function to year exists for data.
         * @param {Array} allData - The data.
         * @param {Number} year - the year that we want look for.
         */
        function doesYearExist (allData, year) {
          var length =  allData.length;
          for (var a = 0; a < length; a++) {
            if (allData[a].year == year) {
              return true;
            }
          }
          return false;
        }

        function toPost (e, dataFromState) {
          // We must load our last state here.
          var exNumbers = [];
          var exNumbersThatHaveGaps = [];
          var dataToPassBack = [];
          if (dataFromState !== undefined && dataFromState !== null) {
            dataToPassBack = dataFromState;
            exNumbers = returnExNumbersAlreadyInFiles(dataFromState);
          }
          // e.data is what we will be working with. This is an array and each index of the array represents a row.
          const columns = 8;
          var rows = e.data.length;
          var firstAndLastDate = findFirstAndLastDate(e.data,rows);
          var lastDate = firstAndLastDate.lastDate;
          var firstDate = firstAndLastDate.firstDate;
          var year = new Date(e.data[1][3]);
          year = year.getFullYear();
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
                                exNumber: parseInt(e.data[a][b]),
                                name: "",
                                data:[{
                                  year:year,
                                  timeGapsDays: new Array(366),
                                  days: new Array(366),
                                  week: new Array(53),// weekNum:1-53
                                  month: new Array(12),// monthNum: 1-12
                                }],
                                allTime:{
                                    time: {hours: 0, min: 0, seconds: 0},
                                    calls:0,
                                    outgoingNum:0,
                                    incomingNum:0,
                                    unknownNum: 0
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
                            var indexOfYear = 0;
                            let tempYear = new Date(e.data[a][b]);
                            tempYear = tempYear.getFullYear();
                            var doesDataHaveYear = doesYearExist(dataToPassBack[indexToUpdate].data, tempYear);
                            if (doesDataHaveYear) {
                              indexOfYear = getIndexOfYear(dataToPassBack[indexToUpdate].data, tempYear);
                            } else {
                              // Here we need to push a new year to our array.
                              year = tempYear;
                              dataToPassBack[indexToUpdate].data.push({
                                year:year,
                                timeGapsDays: new Array(366),
                                days: new Array(366),
                                week: new Array(53),// weekNum:1-53
                                month: new Array(12),// monthNum: 1-12
                              });
                              indexOfYear = dataToPassBack[indexToUpdate].data.length - 1;
                            }
                              // Array of objects {from:, to:} -> dataToPassBack[indexToUpdate].timeGapsDays[dayToCheck]
                              if(dataToPassBack[indexToUpdate].data[indexOfYear].timeGapsDays[dayToCheck] == undefined) {
                                if (firstDateDay == lastDateDay) {
                                    dataToPassBack[indexToUpdate].data[indexOfYear].timeGapsDays[firstDateDay] = [{
                                        from:returnMillisecondsOfDate(firstDate),
                                        to:returnMillisecondsOfDate(lastDate),
                                        new: true,
                                    }];
                                } else { // When this runs, multiple days are being added. EDGE CASE.
                                    dataToPassBack[indexToUpdate].data[indexOfYear].timeGapsDays[firstDateDay] = [{
                                        from:returnMillisecondsOfDate(firstDate),
                                        to:0,
                                        new: true,
                                    }];
                                    for(var z = 1; z < (lastDateDay - firstDateDay); z++) {
                                        dataToPassBack[indexToUpdate].data[indexOfYear].timeGapsDays[firstDateDay + d] = [{
                                        from:0,
                                        to:0,
                                        new: true,
                                        }];
                                    }
                                    dataToPassBack[indexToUpdate].data[indexOfYear].timeGapsDays[lastDateDay] = [{
                                        from:0,
                                        to:returnMillisecondsOfDate(lastDate),
                                        new: true,
                                    }];
                                }
                                exNumbersThatHaveGaps.push(e.data[a][2]);
                                dataToPassBack = pushDataToArray(dataToPassBack, e.data[a]);
                              } else {
                                dataToPassBack = checkAndUpdateDataIfNeed(dataToPassBack, dataToPassBack[indexToUpdate].data[indexOfYear].timeGapsDays[dayToCheck],millisecondsToCheck, indexToUpdate,dayToCheck,firstDate,lastDate, year, e.data[a]);
                              }
                          } else { // This means that this is a new exNumber being added
                              if (firstDateDay == lastDateDay) {
                                  dataToPassBack[dataToPassBack.length - 1].data[0].timeGapsDays[firstDateDay] = [{
                                      from:returnMillisecondsOfDate(firstDate),
                                      to:returnMillisecondsOfDate(lastDate),
                                      new: true,
                                  }];
                              } else { // When this runs, multiple days are being added. EDGE CASE.
                                  dataToPassBack[dataToPassBack.length - 1].data[0].timeGapsDays[firstDateDay] = [{
                                      from:returnMillisecondsOfDate(firstDate),
                                      to:0,
                                      new: true,
                                  }];
                                  for(var d = 1; d < (lastDateDay - firstDateDay); d++) {
                                      dataToPassBack[dataToPassBack.length - 1].data[0].timeGapsDays[firstDateDay + d] = [{
                                      from:0,
                                      to:0,
                                      new: true,
                                      }];
                                  }
                                  dataToPassBack[dataToPassBack.length - 1].data[0].timeGapsDays[lastDateDay] = [{
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
              changeTimgapsNew(dataToPassBack, (firstDateDay + e));
            }
          }
          return dataToPassBack;
        }
        /*END OF FUNCTIONS*/
        /* TODO: We need to add time to each person for each day, week and month.
         * ISSUE: If two years are added it effs up.
        */
        var worker = new Worker(app.getAppPath() + "\\src\\worker.js");
        worker.addEventListener('message',  (e) => {
          // console.log('Message from Worker: ');
          // console.log(e.data);
          worker.terminate();
          var dataForFile =  toPost(e, this.state.stateOfVoip);
          this.getEmployeeCards();
          saveToFile(dataForFile).then((e) => {
              this.openSnackBarSuccesLoadingNewFile();
              this.setState({loading: false});
            }).catch((err) => {
              console.log(err);
            });
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
    const openDialog = this.state.dialogOpen;
    const titleDialog = this.state.dialogTitle;
    const messageDialog = this.state.dialogMessage;
    const openSnack = this.state.openSnack;
    const typeSnack = this.state.typeSnack;
    const messageSnack = this.state.messageSnack;
    let loadingLoader = {
      display: 'none'
    };
    let loadingRest = {
      display: 'block'
    };
    if (this.state.loading) {
      loadingLoader.display = "block";
      loadingRest.display = "none";
    }
    var employeeCards = this.state.employeeCards.sort(function(a, b) {
      return (a.exNumber - b.exNumber);
  }).map((result) => {
      return <Grid item key={result.key}><EmployeeCard time={result.hours + ":" + result.min + ":" + result.seconds} calls={result.calls} exNumber={result.exNumber} name={result.name}/></Grid>
    });
    return (
    <div style={{ marginTop: 30}}>
      <Grid container spacing={16}>
        <Grid item xs={12} style={loadingRest}>
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
                <AlertDialog message={messageDialog} title={titleDialog} open={openDialog} callbackFromParent={this.firstLoad}/>
                <Button variant="contained" className="w3-green" onClick={() => this.getData()}>
                  Load Data
                </Button>
                </Grid>
            </Grid>
        </Grid>
        <Grid container justify="center" spacing={16}>
          <Grid item>{employeeCards}</Grid>
        </Grid>
      </Grid>
      {/* Loader to show when reading new file and adding data */}
      <div style={loadingLoader}>
        <Grid container spacing={16}>
          <Grid item xs={12}>
            <Grid container justify="center" spacing={16}>
              <Grid item>
                <CircularProgress/>
              </Grid>
              <Grid item>
                <p>Loading</p>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </div>
      {/* End of loader */}
      <CustomizedSnackbars type={typeSnack} message={messageSnack} open={openSnack} callbackFromParent={this.myCallback}/>
    </div>
    );
  }
}
