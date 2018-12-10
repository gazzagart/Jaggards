importScripts('node_modules/papaparse/papaparse.js');
    // /**
    //  * Function to return the day of the year out of 366. Returns a number.
    //  * @param {string} date - Date you want the day of the year.
    //  */
    function returnDayStartAndEndForGaps (date) {
        const oneDay = 1000 * 60 * 60 * 24;
        var now = new Date(date);
        var start = new Date(now.getFullYear(), 0, 0);
        var diff = (now - start) + ((start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000);
        var day = Math.floor(diff / oneDay);
        return day;
        }
    // /**
    //  * Function to return the amount of milliseconds since 1970. Returns a number.
    //  * @param {string} date - Date you want the milliseconds of.
    //  */
    function returnMillisecondsOfDate (date) {
    var toCalc = new Date(date);
    toCalc = toCalc.getTime();
    return toCalc;
    }
    // /**
    //  * Function to return if we have already added time gaps for this file.
    //  * @param {Array} arrayOfExNumbersCompleted - Array of numbers already done.
    //  * @param {Number} exNumberToCheck - Number to see if it is in our array passed.
    //  */
    function returnIfGapsBeenAdded (arrayOfExNumbersCompleted, exNumberToCheck) {
        var length = arrayOfExNumbersCompleted.length;
        for(var a = 0; a < length; a++) {
            if (exNumberToCheck == arrayOfExNumbersCompleted[a]) {
            return true;
            } else {
            return false;
            }
        }
    }
    // /**
    //  * Function to return index of array where exNumber is found.
    //  * @param {Array} arrayToCheck - Array of data of all our exNumbers.
    //  * @param {Number} exNumberToFind - Number to see if it is in our array passed.
    //  */
    function returnPlaceInArrayToCheckAndUpdate (arrayToCheck, exNumberToFind) {
        var length = arrayToCheck.length;
        for(var a = 0; a < length; a++) {
            if(arrayToCheck[a].exNumber == exNumberToFind) {
            return a;
            }
        }
    }
    // /**
    //  * Function to return updated array for the time gaps.
    //  * @param {Array} dataToPassBack - Array of all our data.
    //  * @param {Number} arrayOfGapObjects - Array of objects containing to and from values to check.
    //  * @param {Number} millisecondsToCheck - The milliseconds to see if we have the data from this date already.
    //  * @param {Number} indexToChange - Index of our data array that we want to update.
    //  * @param {Number} dayForGap - Day that we need to update in our timeGaps array.
    //  * @param {Date} fromDateToAdd - Date object to add to our gaps.
    //  * @param {Date} toDateToAdd - Date object to add to our gaps.
    //  */
    function checkAndUpdateDataIfNeed (dataToPassBack, arrayOfGapObjects, millisecondsToCheck, indexToChange, dayForGap, fromDateToAdd, toDateToAdd) {
        var length = arrayOfGapObjects.length;
        for(var a = 0; a < length; a++) {
            if(arrayOfGapObjects[a].from <= millisecondsToCheck && arrayOfGapObjects[a].to >= millisecondsToCheck) {
            // It is between the gap we have already added
            return dataToPassBack;
            }
        }
        dataToPassBack[indexToChange].timeGapsDays[dayForGap].push({
            from:returnMillisecondsOfDate(fromDateToAdd),
            to:returnMillisecondsOfDate(toDateToAdd)
        });
        return dataToPassBack;
    }

    function toPost (e) {
        var exNumbers = [];
        var exNumbersThatHaveGaps = [];
        var dataToPassBack = [];
        // e.data is what we will be working with. This is an array and each index of the array represents a row.
        const columns = 8;
        var rows = e.data.length;
        var lastDate = e.data[rows-1][3];
        var firstDate = e.data[1][3];
        // These two variables would normally equal, but maybe they dont.
        var lastDateDay = returnDayStartAndEndForGaps(lastDate);
        var firstDateDay = returnDayStartAndEndForGaps(firstDate);
        for(var a = 1; a < rows; a++) {// a = 1 becasue our first row is useless to us.
            for (var b = 0; b < columns; b++) {
                if(b == 2) {// Here we must check if we have this person in our exNumbers
                // If we don't have them, then we need to load new file.
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
                        dataToPassBack.push({
                            new: true,
                            exNumber: e.data[a][b],
                            name: "",
                            timeGapsDays: new Array(366),
                            today: {
                                time:0,
                                calls:0,
                                outgoingNum:0,
                                incomingNum:0
                            },
                            week: new Array(51),// weekNum:1-52
                            month: new Array(11),// monthNum: 1-12
                            allTime:{
                                time:0,
                                calls:0,
                                outgoingNum:0,
                                incomingNum:0
                            }
                        });
                        exNumbers.push(e.data[a][b]);
                    }
                }
                if (b == 3 && !returnIfGapsBeenAdded(e.data[a][2])){ //on date started
                    if(checkNumber){ // Need to get time gaps and check this one.
                        //code
                        // Get the place in our dataToPassBack Array to check and change.
                        var indexToUpdate = returnPlaceInArrayToCheckAndUpdate(dataToPassBack, e.data[a][2]);
                        // For both cases now we dont need if (firstDateDay == lastDateDay)
                        var dayToCheck = returnDayStartAndEndForGaps(e.data[a][b]);
                        var millisecondsToCheck = returnMillisecondsOfDate(e.data[a][b]);
                        // Array of objects {from:, to:} -> dataToPassBack[indexToUpdate].timeGapsDays[dayToCheck]
                        dataToPassBack = checkAndUpdateDataIfNeed(dataToPassBack, dataToPassBack[indexToUpdate].timeGapsDays[dayToCheck],millisecondsToCheck, indexToUpdate,dayToCheck,firstDate,lastDate);
                    } else { // This means that this is a new exNumber being added
                        if (firstDateDay == lastDateDay) {
                            dataToPassBack[dataToPassBack.length - 1].timeGapsDays[firstDateDay] = [{
                                from:returnMillisecondsOfDate(firstDate),
                                to:returnMillisecondsOfDate(lastDate)
                            }];
                        } else { // When this runs, multiple days are being added. EDGE CASE.
                            dataToPassBack[dataToPassBack.length - 1].timeGapsDays[firstDateDay] = [{
                                from:returnMillisecondsOfDate(firstDate),
                                to:0
                            }];
                            for(var d = 1; d < (lastDateDay - firstDateDay); d++) {
                                dataToPassBack[dataToPassBack.length - 1].timeGapsDays[firstDateDay + d] = [{
                                from:0,
                                to:0
                                }];
                            }
                            dataToPassBack[dataToPassBack.length - 1].timeGapsDays[lastDateDay] = [{
                                from:0,
                                to:returnMillisecondsOfDate(lastDate)
                            }];
                        }
                        exNumbersThatHaveGaps.push(e.data[a][2]);
                    }
                }
            }
        }
        return dataToPassBack;
    }

    self.addEventListener(
        "message",
        function(e) {
            Papa.parse(e.data, {
                //worker: true, worker does not seem to be working. Might be an electron issue
                complete: function(results) {
                    self.postMessage(toPost(results.data));
                }
            });
    //   self.postMessage(e.data);
    },
    false
    );