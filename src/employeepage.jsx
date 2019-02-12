import React from 'react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';
import YearCardData from './yearcarddata';

const remote = require('electron').remote;// Load remote compnent that contains the dialog dependency
const app = remote.app;
const fs = require('fs'); // Load the File System to execute our common tasks (CRUD)

/** In this element we need to be able to display the voip data in a clean way.
 *  TODO: data for today, week month year all time
 */

export default class EmployeePage extends React.Component {

  constructor(props) {
    super(props);
    this.getYearCardData = this.getYearCardData.bind(this);
    this.state = {
      YearCardData: [],
      employeeName: "No Name",
      employeeNumber: 0,
      yearCards: [],
      callsToday: {
        hours:0,
        min:0,
        seconds:0
      },
      callsWeek: {
        hours:0,
        min:0,
        seconds:0
      },
      callsMonth: {
        hours:0,
        min:0,
        seconds:0
      },
      callsYear: {
        hours:0,
        min:0,
        seconds:0
      }
    };
  }

  componentDidMount() {
    this.setState({"employeeNumber":localStorage.getItem("exNumberToView")});
    var filePath =  app.getAppPath() + "\\dataForVoip\\" + localStorage.getItem("exNumberToView") + ".json";
    fs.readFile(filePath, 'utf-8', (err, data ) => {
      if(err) {
        console.error("There was an error reading: ", filePath, " file.");
      }
      this.setDataForEmployee(JSON.parse(data));
    });
  }

  setDataForEmployee (dataOfEmployee) {
    var date = new Date();
    const oneDay = 1000 * 60 * 60 * 24;
    var now = new Date(date);
    var start = new Date(now.getFullYear(), 0, 0);
    var diff = (now - start) + ((start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000);
    var today = Math.floor(diff / oneDay);
    var thisWeek =  (Math.floor(today/7) + 1); // Will have 56 weeks after the 364th day.
    var secondsOnPhoneDays = 0;
    var secondsOnPhoneWeeks = 0;
    var secondsOnPhoneMonths = 0;
    var noOfDays = 0;
    var noOfWeeks = 0;
    var noOfMonths = 0;
    console.log(dataOfEmployee);
    var years = dataOfEmployee.data.length;
    for (var a = 0; a < years; a++) {
      var length = 0;
      for(length = 0; length < 366; length++){
        if(dataOfEmployee.data[a].days[length] != null) {
          secondsOnPhoneDays += dataOfEmployee.data[a].days[length].time.hours * 60 * 60;
          secondsOnPhoneDays += dataOfEmployee.data[a].days[length].time.min * 60;
          secondsOnPhoneDays += dataOfEmployee.data[a].days[length].time.seconds;
          noOfDays++;
        }
      }
      for(length = 0; length < 53; length++) {
        if(dataOfEmployee.data[a].week[length] != null) {
          secondsOnPhoneWeeks += dataOfEmployee.data[a].week[length].time.hours * 60 * 60;
          secondsOnPhoneWeeks += dataOfEmployee.data[a].week[length].time.min * 60;
          secondsOnPhoneWeeks += dataOfEmployee.data[a].week[length].time.seconds;
          noOfWeeks++;
        }
      }
      for(length = 0; length < 12; length++) {
        if(dataOfEmployee.data[a].month[length] != null) {
          secondsOnPhoneMonths += dataOfEmployee.data[a].month[length].time.hours * 60 * 60;
          secondsOnPhoneMonths += dataOfEmployee.data[a].month[length].time.min * 60;
          secondsOnPhoneMonths += dataOfEmployee.data[a].month[length].time.seconds;
          noOfMonths++;
        }
      }
      // TODO: Finish this
      YearCardDataData.push({
        key: a,
        year: dataOfEmployee.data[a].year,
        callsDay: dataOfEmployee.data[a].days[today].calls,
        timeDay: this.state.stateOfVoip[a].exNumber,
        averageChangeWeek: this.state.stateOfVoip[a].allTime.calls,
        callsMonth: dataOfEmployee.data[a].week[thisWeek].calls,
        timeMonth: min,
        averageChangeYear: seconds,
        callsYear: this.state.stateOfVoip[a].name,
        timeYear: ""
      });
    }
    this.setState({YearCardData: YearCardDataData});
    console.log(secondsOnPhoneDays);
    console.log(noOfDays);
    console.log(secondsOnPhoneWeeks);
    console.log(noOfWeeks);
    console.log(secondsOnPhoneMonths);
    console.log(noOfMonths);
  }

  getYearCardData () {
    var YearCardDataData = [];
    var length = this.state.stateOfVoip.length;
    var min = "", seconds = "";
    for (var a = 0; a < length; a++) {
      if(this.state.stateOfVoip[a].allTime.time.min < 10) {min = "0" + this.state.stateOfVoip[a].allTime.time.min;}
      else {min = this.state.stateOfVoip[a].allTime.time.min;}
      if(this.state.stateOfVoip[a].allTime.time.seconds < 10) {seconds = "0" + this.state.stateOfVoip[a].allTime.time.seconds;}
      else {seconds = this.state.stateOfVoip[a].allTime.time.seconds;}
      YearCardDataData.push({
        key: a,
        callsDay: this.state.stateOfVoip[a].new,
        timeDay: this.state.stateOfVoip[a].exNumber,
        averageChangeWeek: this.state.stateOfVoip[a].allTime.calls,
        callsMonth: this.state.stateOfVoip[a].allTime.time.hours,
        timeMonth: min,
        averageChangeYear: seconds,
        callsYear: this.state.stateOfVoip[a].name,
        timeYear: ""
      });
    }
    this.setState({YearCardData: YearCardDataData});
    console.log("YearCardDataData",YearCardDataData);
  }


  /**
   * Here we will display each individual data
   * For each day, week etc, we will calculate the average and display whether we are better or worse.
   * We can even have an average of everyone
   */

  render() {
    // const YearCardData = this.state.YearCardData.map((result) => {
    //   return <Grid item key={result.key}>
    //   <YearCardData averageChangeDay="poop"
    //           callsDay="poop"
    //           timeDay="poop"
    //           averageChangeWeek="poop"
    //           callsWeek="poop"
    //           timeWeek="poop"
    //           averageChangeMonth="poop"
    //           callsMonth="poop"
    //           timeMonth="poop"
    //           averageChangeYear="poop"
    //           callsYear="poop"
    //           timeYear="poop"/>
    //   </Grid>
    // });
    return (
      // <EmployeeCard time={result.hours + ":" + result.min + ":" + result.seconds} calls={result.calls} exNumber={result.exNumber}/>
    <div style={{ marginTop: 30 }}>
      <Grid container spacing={16}>
        <Grid item xs={12}>
            <Grid container justify="center" spacing={16}>
              <Grid item>
                <h2>Employee: {this.state.employeeName}</h2>
              </Grid>
              <Grid item>
                <h2>Ex Number: {this.state.employeeNumber}</h2>
              </Grid>
            </Grid>
            <Grid container justify="center" spacing={16}>
                <Grid item>
                  <Button variant="contained" color="primary">
                    <Link style={{ textDecoration: 'none' }} to='/voip/'>Back</Link>
                  </Button>
                </Grid>
            </Grid>

            {/* <Grid container justify="center" spacing={16}>
          <Grid item>{YearCardData}</Grid>
        </Grid> */}

            <Grid container justify="center" spacing={16}>
              <Grid item>
              <YearCardData averageChangeDay="poop"
              callsDay="poop"
              timeDay="poop"
              averageChangeWeek="poop"
              callsWeek="poop"
              timeWeek="poop"
              averageChangeMonth="poop"
              callsMonth="poop"
              timeMonth="poop"
              averageChangeYear="poop"
              callsYear="poop"
              timeYear="poop"/>
              </Grid>
            </Grid>
        </Grid>
      </Grid>
    </div>
    );
  }
}
