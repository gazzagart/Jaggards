import React from 'react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';
import YearCardData from './yearcarddata';
import CustomizedSnackbars from './customizedsnackbars.jsx';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

const remote = require('electron').remote;// Load remote compnent that contains the dialog dependency
const app = remote.app;
const fs = require('fs'); // Load the File System to execute our common tasks (CRUD)

/** In this element we need to be able to display the voip data in a clean way.
 *  TODO: data for today, week month year all time
 */
export default class EmployeePage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      yearCardData: [],
      employeeData: {},
      employeeName: "No Name",
      employeeNumber: 0,
      yearCards: [],
      openSnack: false,
      typeSnack: 'info',
      messageSnack: 'Well hello there',
      openDialog: false,
      name: ""
    };
    this.state.yearCardData = [];
    this.getYearCardData = this.getYearCardData.bind(this);
    this.myCallback = this.myCallback.bind(this);
    this.firstLoad = this.firstLoad.bind(this);
    this.handleClose = this.handleClose.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    this.handleAuthorChange = this.handleAuthorChange.bind(this);
  }

  componentDidMount() {
    this.setState({"employeeNumber":localStorage.getItem("exNumberToView")});
    var filePath =  app.getAppPath() + "\\dataForVoip\\" + localStorage.getItem("exNumberToView") + ".json";
    fs.readFile(filePath, 'utf-8', (err, data ) => {
      if(err) {
        console.error("There was an error reading: ", filePath, " file.");
      }
      this.setState({employeeData: JSON.parse(data)})
      this.setState({employeeName: this.state.employeeData.name});
      this.getYearCardData();
    });
  }

  /**
   * Function Update Name of employee.
   * @param {Array} dataToSave - this is an array of all the data to write to files
   */
  saveToFile () {
    var nameOfFile =  app.getAppPath() + "\\dataForVoip\\" + localStorage.getItem("exNumberToView") + ".json";
    var dataToSave = this.state.employeeData;
    console.log(dataToSave);
    dataToSave.name = this.state.name;
    this.setState({employeeData: dataToSave});
    fs.writeFile(nameOfFile, JSON.stringify(dataToSave), (err) => {
      if(err){
        return(alert("An error ocurred creating the file "+ err.message));
      }
      this.openSnackBarSucces();
    });
  }

  firstLoad (dataFromChild) {
    this.setState({
      dialogOpen: dataFromChild
    });
  }

  getYearCardData () {
    var dataOfEmployee = this.state.employeeData;
    var date = new Date();
    const oneDay = 1000 * 60 * 60 * 24;
    var now = new Date(date);
    var start = new Date(now.getFullYear(), 0, 0);
    var diff = (now - start) + ((start.getTimezoneOffset() - now.getTimezoneOffset()) * 60 * 1000);
    var today = Math.floor(diff / oneDay);
    var thisWeek =  (Math.floor(today/7) + 1); // Will have 56 weeks after the 364th day.
    var secondsOnPhone = 0;
    var callsThisYear = 0;
    var timeOnPhoneToday = 0;
    var timeOnPhoneWeek = 0;
    var timeOnPhoneMonth = 0;
    var noOfDays = 0;
    var noOfWeeks = 0;
    var noOfMonths = 0;
    var YearCardDataData = [];
    var years = dataOfEmployee.data.length;
    for (var a = 0; a < years; a++) {
      var length = 0;
      for(length = 0; length < 366; length++){
        if(dataOfEmployee.data[a].days[length] != null) {
          secondsOnPhone += dataOfEmployee.data[a].days[length].time.hours * 60 * 60;
          secondsOnPhone += dataOfEmployee.data[a].days[length].time.min * 60;
          secondsOnPhone += dataOfEmployee.data[a].days[length].time.seconds;
          noOfDays++;
          if((length + 1) == today) {
            timeOnPhoneToday += dataOfEmployee.data[a].days[length].time.hours * 60 * 60;
            timeOnPhoneToday += dataOfEmployee.data[a].days[length].time.min * 60;
            timeOnPhoneToday += dataOfEmployee.data[a].days[length].time.seconds;
          }
        }
      }
      for(length = 0; length < 53; length++) {
        if(dataOfEmployee.data[a].week[length] != null) {
          noOfWeeks++;
          if((length + 1) == thisWeek) {
            timeOnPhoneWeek += dataOfEmployee.data[a].days[length].time.hours * 60 * 60;
            timeOnPhoneWeek += dataOfEmployee.data[a].days[length].time.min * 60;
            timeOnPhoneWeek += dataOfEmployee.data[a].days[length].time.seconds;
          }
        }
      }
      for(length = 0; length < 12; length++) {
        if(dataOfEmployee.data[a].month[length] != null) {
          callsThisYear += dataOfEmployee.data[a].month[length].calls;
          noOfMonths++;
          if(length == date.getMonth()) {
            timeOnPhoneMonth += dataOfEmployee.data[a].days[length].time.hours * 60 * 60;
            timeOnPhoneMonth += dataOfEmployee.data[a].days[length].time.min * 60;
            timeOnPhoneMonth += dataOfEmployee.data[a].days[length].time.seconds;
          }
        }
      }
      var todaysCalls = dataOfEmployee.data[a].days[today]
      var thisWeeksCalls = dataOfEmployee.data[a].week[thisWeek];
      var thisMonthsCalls =  dataOfEmployee.data[a].month[date.getMonth()];
      if (todaysCalls != null) todaysCalls = dataOfEmployee.data[a].days[today].calls;
      else todaysCalls = 0;
      if (thisWeeksCalls != null) thisWeeksCalls = dataOfEmployee.data[a].week[thisWeek].calls;
      else thisWeeksCalls = 0;
      if (thisMonthsCalls != null) thisMonthsCalls = dataOfEmployee.data[a].month[date.getMonth()].calls;
      else thisMonthsCalls = 0;
      YearCardDataData.push({
        key: a,
        year: dataOfEmployee.data[a].year,
        averageChangeDay: secondsOnPhone/noOfDays,
        callsDay: todaysCalls,
        timeDay: timeOnPhoneToday,
        averageChangeWeek: secondsOnPhone/noOfWeeks,
        callsWeek: thisWeeksCalls,
        timeWeek: timeOnPhoneWeek,
        averageChangeMonth: secondsOnPhone/noOfMonths,
        callsMonth: thisMonthsCalls,
        timeMonth: timeOnPhoneMonth,
        averageChangeYear: secondsOnPhone/years,
        callsYear: callsThisYear,
        timeYear: secondsOnPhone
      });
    }
    this.setState({yearCardData: YearCardDataData});
  }

  openSnackBarSucces() {
    this.setState({
      openSnack: true,
      typeSnack: 'success',
      messageSnack: 'Succesfully updated name',
    });
  }

  myCallback (dataFromChild) {
    this.setState({
      openSnack: dataFromChild
    });
  }

  handleClickOpen () {
    this.setState({ openDialog: true });
  }

  handleClose() {
    this.setState({ openDialog: false });
    this.setState({ employeeName: this.state.name });
    console.log(this.state.name);
    this.saveToFile();
  }

  handleCancel() {
    this.setState({ openDialog: false });
  }

  handleAuthorChange (event) {
    let value = event.target;
    this.setState({ name: value.value });
  }


  /**
   * Here we will display each individual data
   * For each day, week etc, we will calculate the average and display whether we are better or worse.
   * We can even have an average of everyone
   */

  render() {
    var yearCardData;
    if (this.state.yearCardData != undefined) {
      yearCardData = this.state.yearCardData.map((result) => {return <Grid item key={result.key}><YearCardData year = {result.year} averageChangeDay = {result.averageChangeDay} callsDay = {result.callsDay} timeDay = {result.timeDay} averageChangeWeek = {result.averageChangeWeek} callsWeek = {result.callsWeek} timeWeek = {result.timeWeek} averageChangeMonth = {result.averageChangeMonth} callsMonth = {result.callsMonth} timeMonth = {result.timeMonth} averageChangeYear = {result.averageChangeYear} callsYear = {result.callsYear} timeYear = {result.timeYear}/></Grid>});
    }
    const openSnack = this.state.openSnack;
    const typeSnack = this.state.typeSnack;
    const messageSnack = this.state.messageSnack;
    var employeeName = this.state.employeeName;
    if (employeeName == "") {
      employeeName = "No Name";
    }
    return (
      // <EmployeeCard time={result.hours + ":" + result.min + ":" + result.seconds} calls={result.calls} exNumber={result.exNumber}/>
    <div style={{ marginTop: 30 }}>
      <Grid container spacing={16}>
        <Grid item xs={12}>
          <Grid container justify="center" spacing={16}>
              <Grid item>
                <h2>Ex Number: {this.state.employeeNumber}</h2>
              </Grid>
            </Grid>
            <Grid container justify="center" spacing={16}>
              <Grid item>
                <h2>Employee: {employeeName}</h2>
              </Grid>
              <Grid item>
                <p><Button variant="contained" color="primary" onClick={() => {this.setState({ openDialog: true });}}>change</Button></p>
              </Grid>
            </Grid>
            <Grid container justify="center" spacing={16}>
                <Grid item>
                  <Button variant="contained" color="primary" className="w3-green">
                    <Link style={{ textDecoration: 'none' }} to='/voip/'>Back</Link>
                  </Button>
                </Grid>
            </Grid>

            <Grid container justify="center" spacing={16}>
              <Grid item>{yearCardData}</Grid>
            </Grid>

        </Grid>
      </Grid>

      <Dialog
          open={this.state.openDialog}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Update Name</DialogTitle>
          <DialogContent>
            <DialogContentText>
              To change the name, please enter the name here.
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              label="Name of employee"
              type="text"
              fullWidth
              onChange={this.handleAuthorChange}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleCancel} color="primary">
              Cancel
            </Button>
            <Button onClick={this.handleClose} color="primary">
              Subscribe
            </Button>
          </DialogActions>
        </Dialog>

      <CustomizedSnackbars type={typeSnack} message={messageSnack} open={openSnack} callbackFromParent={this.myCallback}/>
    </div>
    );
  }
}
