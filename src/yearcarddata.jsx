import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Typography from '@material-ui/core/Typography';


const styles = theme => ({
  card: {
    minWidth: 275,
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
});

class YearCardData extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            widthToPass: 275,
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
            },
            averageCallsDay: {
              hours:0,
              min:0,
              seconds:0
            },
            averageCallsWeek: {
              hours:0,
              min:0,
              seconds:0
            },
            averageCallsMonth: {
              hours:0,
              min:0,
              seconds:0
            },
            averageCallsYear: {
              hours:0,
              min:0,
              seconds:0
            },
            isThisYear: false
        };
    }

    componentDidMount() {
      var callsYear = {
        hours:0,
        min:0,
        seconds:0
      };
      var callsDay = {
        hours:0,
        min:0,
        seconds:0
      };
      var callsWeek = {
        hours:0,
        min:0,
        seconds:0
      };
      var callsMonth = {
        hours:0,
        min:0,
        seconds:0
      };
      var averageCallsDay = {
        hours:0,
        min:0,
        seconds:0
      };
      var averageCallsWeek = {
        hours:0,
        min:0,
        seconds:0
      };
      var averageCallsMonth = {
        hours:0,
        min:0,
        seconds:0
      };
      var averageCallsYear = {
        hours:0,
        min:0,
        seconds:0
      };
      //Start of day calculation
      let timeDayTemp = this.props.timeDay;
      if (timeDayTemp > 60) {
        while (timeDayTemp > 60) {
          timeDayTemp = timeDayTemp - 60;
          callsDay.min++;
        }
      }
      if(callsDay.min > 60) {
        while (callsDay.min > 60) {
          callsDay.min = callsDay.min - 60;
          callsDay.hours++;
        }
      }
      callsDay.seconds = timeDayTemp;
      this.setState({callsDay: callsDay});
      //End of todays calculation

      //Start of week calculation
      let timeWeekTemp = this.props.timeWeek;
      if (timeWeekTemp > 60) {
        while (timeWeekTemp > 60) {
          timeWeekTemp = timeWeekTemp - 60;
          callsWeek.min++;
        }
      }
      if(callsWeek.min > 60) {
        while (callsWeek.min > 60) {
          callsWeek.min = callsWeek.min - 60;
          callsWeek.hours++;
        }
      }
      callsWeek.seconds = timeWeekTemp;
      this.setState({callsWeek: callsWeek});
      //End of weeks calculation

      //Start of month calculation
      let timeMonthTemp = this.props.timeMonth;
      if (timeMonthTemp > 60) {
        while (timeMonthTemp > 60) {
          timeMonthTemp = timeMonthTemp - 60;
          callsMonth.min++;
        }
      }
      if(callsMonth.min > 60) {
        while (callsMonth.min > 60) {
          callsMonth.min = callsMonth.min - 60;
          callsMonth.hours++;
        }
      }
      callsMonth.seconds = timeMonthTemp;
      this.setState({callsMonth: callsMonth});
      //End of months' calculation

      //Start of this years calculation
      let timeYearTemp = this.props.timeYear;
      if (timeYearTemp > 60) {
        while (timeYearTemp > 60) {
          timeYearTemp = timeYearTemp - 60;
          callsYear.min++;
        }
      }
      if(callsYear.min > 60) {
        while (callsYear.min > 60) {
          callsYear.min = callsYear.min - 60;
          callsYear.hours++;
        }
      }
      callsYear.seconds = timeYearTemp;
      this.setState({callsYear: callsYear});
      //End of this years calculation.

      //Start of this average calls day calculation
      let averageTimeDayTemp = this.props.averageChangeDay;
      if (averageTimeDayTemp > 60) {
        while (averageTimeDayTemp > 60) {
          averageTimeDayTemp = averageTimeDayTemp - 60;
          averageCallsDay.min++;
        }
      }
      if(averageCallsDay.min > 60) {
        while (averageCallsDay.min > 60) {
          averageCallsDay.min = averageCallsDay.min - 60;
          averageCallsDay.hours++;
        }
      }
      averageCallsDay.seconds = averageTimeDayTemp;
      this.setState({averageCallsDay: averageCallsDay});
      //End of this average calls day calculation.

      //Start of this average calls week calculation
      let averageTimeWeekTemp = this.props.averageChangeWeek;
      if (averageTimeWeekTemp > 60) {
        while (averageTimeWeekTemp > 60) {
          averageTimeWeekTemp = averageTimeWeekTemp - 60;
          averageCallsWeek.min++;
        }
      }
      if(averageTimeWeekTemp.min > 60) {
        while (averageTimeWeekTemp.min > 60) {
          averageTimeWeekTemp.min = averageTimeWeekTemp.min - 60;
          averageCallsWeek.hours++;
        }
      }
      averageCallsWeek.seconds = averageTimeWeekTemp;
      this.setState({averageCallsWeek: averageCallsWeek});
      //End of this average calls week calculation.

      //Start of this average calls Month calculation
      let averageTimeMonthTemp = this.props.averageChangeMonth;
      if (averageTimeMonthTemp > 60) {
        while (averageTimeMonthTemp > 60) {
          averageTimeMonthTemp = averageTimeMonthTemp - 60;
          averageCallsMonth.min++;
        }
      }
      if(averageTimeMonthTemp.min > 60) {
        while (averageTimeMonthTemp.min > 60) {
          averageTimeMonthTemp.min = averageTimeMonthTemp.min - 60;
          averageCallsMonth.hours++;
        }
      }
      averageCallsMonth.seconds = averageTimeMonthTemp;
      this.setState({averageCallsMonth: averageCallsMonth});
      //End of this average calls Month calculation.

      //Start of this average calls Year calculation
      let averageTimeYearTemp = this.props.averageChangeYear;
      if (averageTimeYearTemp > 60) {
        while (averageTimeYearTemp > 60) {
          averageTimeYearTemp = averageTimeYearTemp - 60;
          averageCallsYear.min++;
        }
      }
      if(averageTimeYearTemp.min > 60) {
        while (averageTimeYearTemp.min > 60) {
          averageTimeYearTemp.min = averageTimeYearTemp.min - 60;
          averageCallsYear.hours++;
        }
      }
      averageCallsYear.seconds = averageTimeYearTemp;
      this.setState({averageCallsYear: averageCallsYear});
      //End of this average calls Year calculation.
      let tempDate = new Date();
      tempDate.getFullYear();
      if(this.props.year == tempDate.getFullYear()) {
        this.setState({isThisYear: true});
      }
    }

  render () {
    const { classes } = this.props;
    var actualPassDay, actualPassWeek, actualPassMonth;
    var callsDayPass = this.state.callsDay;
    actualPassDay = callsDayPass;
    let loadRest = {
      display: 'none'
    };
    if (this.state.isThisYear) {
      loadRest.display = "block";
    }
    if(callsDayPass == undefined) {
      callsDayPass = {hours:0,min:0,seconds:0};
      actualPassDay = {hours:0,min:0,seconds:0};
    }
    else {
      if (callsDayPass.min == 0) callsDayPass.min = 0;
      if (callsDayPass.seconds == 0) callsDayPass.seconds = 0;
      if(callsDayPass.min < 10) {actualPassDay.min = "0" + callsDayPass.min;}
      if(callsDayPass.seconds < 10) {actualPassDay.seconds = "0" + callsDayPass.seconds;}
    }
    var callsWeekPass = this.state.callsWeek;
    actualPassWeek = callsWeekPass;
    if(callsWeekPass == undefined) {
      callsWeekPass = {hours:0,min:0,seconds:0};
      actualPassWeek = callsWeekPass;
    }
    else {
      if (callsWeekPass.min == 0) callsWeekPass.min = 0;
      if (callsWeekPass.seconds == 0) callsWeekPass.seconds = 0;
      if(callsWeekPass.min < 10) {actualPassWeek.min = "0" + callsWeekPass.min;}
      if(callsWeekPass.seconds < 10) {actualPassWeek.seconds = "0" + callsWeekPass.seconds;}
    }
    var callsMonthPass = this.state.callsMonth;
    actualPassMonth = callsMonthPass;
    if(callsMonthPass == undefined) {
      callsMonthPass = {hours:0,min:0,seconds:0};
      actualPassMonth = callsMonthPass;
    }
    else {
      if (callsMonthPass.min == 0) callsMonthPass.min = 0;
      if (callsMonthPass.seconds == 0) callsMonthPass.seconds = 0;
      if(callsMonthPass.min < 10) {actualPassMonth.min = "0" + callsMonthPass.min;}
      if(callsMonthPass.seconds < 10) {actualPassMonth.seconds = "0" + callsMonthPass.seconds;}
    }
    var callsYearPass = this.state.callsYear;
    var actualPassYear = callsYearPass;
    if(callsYearPass == undefined) {
      callsYearPass = {hours:0,min:0,seconds:0};
      actualPassYear = callsYearPass;
    }
    else {
      if (callsYearPass.min == 0) callsYearPass.min = 0;
      if (callsYearPass.seconds == 0) callsYearPass.seconds = 0;
      if(callsYearPass.min < 10) {actualPassYear.min = "0" + callsYearPass.min;}
      if(callsYearPass.seconds < 10) {actualPassYear.seconds = "0" + callsYearPass.seconds;}
    }
    var averageChangeDayPass = this.state.averageCallsDay;
    var actualAveragePassDay = averageChangeDayPass;
    if(averageChangeDayPass == undefined) {
      averageChangeDayPass = {hours:0,min:0,seconds:0};
      actualAveragePassDay = averageChangeDayPass;
    }
    else {
      if (averageChangeDayPass.min == 0) averageChangeDayPass.min = 0;
      if (averageChangeDayPass.seconds == 0) averageChangeDayPass.seconds = 0;
      if(averageChangeDayPass.min < 10) {actualAveragePassDay.min = "0" + averageChangeDayPass.min;}
      if(averageChangeDayPass.seconds < 10) {actualAveragePassDay.seconds = "0" + averageChangeDayPass.seconds;}
    }
    var averageChangeWeekPass = this.state.averageCallsWeek;
    var actualAveragePassWeek = averageChangeWeekPass;
    if(averageChangeWeekPass == undefined) {
      averageChangeWeekPass = {hours:0,min:0,seconds:0};
      actualAveragePassWeek = averageChangeWeekPass;
    }
    else {
      if (averageChangeWeekPass.min == 0) averageChangeWeekPass.min = 0;
      if (averageChangeWeekPass.seconds == 0) averageChangeWeekPass.seconds = 0;
      if(averageChangeWeekPass.min < 10) {actualAveragePassWeek.min = "0" + averageChangeWeekPass.min;}
      if(averageChangeWeekPass.seconds < 10) {actualAveragePassWeek.seconds = "0" + averageChangeWeekPass.seconds;}
    }
    var averageChangeMonthPass = this.state.averageCallsMonth;
    var actualAveragePassMonth = averageChangeMonthPass;
    if(averageChangeMonthPass == undefined) {
      averageChangeMonthPass = {hours:0,min:0,seconds:0};
      actualAveragePassMonth = averageChangeMonthPass;
    }
    else {
      if (averageChangeMonthPass.min == 0) averageChangeMonthPass.min = 0;
      if (averageChangeMonthPass.seconds == 0) averageChangeMonthPass.seconds = 0;
      if(averageChangeMonthPass.min < 10) {actualAveragePassMonth.min = "0" + averageChangeMonthPass.min;}
      if(averageChangeMonthPass.seconds < 10) {actualAveragePassMonth.seconds = "0" + averageChangeMonthPass.seconds;}
    }
    var averageChangeYearPass = this.state.averageCallsYear;
    var actualAveragePassYear = averageChangeYearPass;
    if(averageChangeYearPass == undefined) {
      averageChangeYearPass = {hours:0,min:0,seconds:0};
      actualAveragePassYear = averageChangeYearPass;
    }
    else {
      if (actualAveragePassYear.min == 0) actualAveragePassYear.min = 0;
      if (actualAveragePassYear.seconds == 0) actualAveragePassYear.seconds = 0;
      if(averageChangeYearPass.min < 10) {actualAveragePassYear.min = "0" + averageChangeYearPass.min;}
      if(averageChangeYearPass.seconds < 10) {actualAveragePassYear.seconds = "0" + averageChangeYearPass.seconds;}
    }

    return (
    <div>
        <Card  style={{minWidth:450, maxWidth:720, marginBottom:16}}>
          <CardContent>
          <CardContent>
            <Typography variant="h5" component="h2" className="w3-center">
                Year: {this.props.year}
            </Typography>
            <br></br>
          </CardContent>
          <div style={loadRest}>
            <Typography variant="h5" component="h2">
                Today
            </Typography>
            <br></br>
            <Typography className={classes.title} color="textSecondary" gutterBottom>
              Average Change: {actualAveragePassDay.hours + ":" + actualAveragePassDay.min + ":" + actualAveragePassDay.seconds}
            </Typography>
            <Typography variant="h5" component="h2">
              Number of Calls: {this.props.callsDay}
            </Typography>
            <br></br>
            <Typography variant="h5" component="h2">
              Time calling: {actualPassDay.hours + ":" + actualPassDay.min + ":" + actualPassDay.seconds}
            </Typography>
            </div>
          </CardContent>
        </Card>

        <Card  style={{minWidth:450, maxWidth:720, marginBottom:16}}>
          <div style={loadRest}>
            <CardContent>
                <Typography variant="h5" component="h2">
                    This Week
                </Typography>
                <br></br>
                <Typography className={classes.title} color="textSecondary" gutterBottom>
                    Average Change: {actualAveragePassWeek.hours + ":" + actualAveragePassWeek.min + ":" + actualAveragePassWeek.seconds}
                </Typography>
                <Typography variant="h5" component="h2">
                    Number of Calls: {this.props.callsWeek}
                </Typography>
                <br></br>
                <Typography variant="h5" component="h2">
                    Time calling: {actualPassWeek.hours + ":" + actualPassWeek.min + ":" + actualPassWeek.seconds}
                </Typography>
            </CardContent>
          </div>
        </Card>

        <Card  style={{minWidth:450, maxWidth:720, marginBottom:16}}>
        <div style={loadRest}>
          <CardContent>
            <Typography variant="h5" component="h2">
                This Month
            </Typography>
            <Typography className={classes.title} color="textSecondary" gutterBottom>
              Average Change: {actualAveragePassMonth.hours + ":" + actualAveragePassMonth.min + ":" + actualAveragePassMonth.seconds}
            </Typography>
            <Typography variant="h5" component="h2">
              Number of Calls: {this.props.callsMonth}
            </Typography>
            <br></br>
            <Typography variant="h5" component="h2">
              Time calling: {actualPassMonth.hours + ":" + actualPassMonth.min + ":" + actualPassMonth.seconds}
            </Typography>
          </CardContent>
        </div>
        </Card>


        <Card  style={{minWidth:450, maxWidth:720, marginBottom:16}}>
          <CardContent>
            <Typography variant="h5" component="h2">
                Whole Year
            </Typography>
            <Typography className={classes.title} color="textSecondary" gutterBottom>
              Average Change: {actualAveragePassYear.hours + ":" + actualAveragePassYear.min + ":" + actualAveragePassYear.seconds}
            </Typography>
            <Typography variant="h5" component="h2">
              Number of Calls: {this.props.callsYear}
            </Typography>
            <br></br>
            <Typography variant="h5" component="h2">
              Time calling: {actualPassYear.hours + ":" + actualPassYear.min + ":" + actualPassYear.seconds}
            </Typography>
          </CardContent>
          <CardActions>
          </CardActions>
        </Card>
    </div>
      );
  }
}

YearCardData.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(YearCardData);