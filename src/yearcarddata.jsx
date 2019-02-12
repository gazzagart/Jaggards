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
        };
    }

  render () {
    const { classes } = this.props;
    return (
    <div>
        <Card  style={{minWidth:450, maxWidth:720, marginBottom:16}}>
          <CardContent>
            <Typography variant="h5" component="h2">
                Today
            </Typography>
            <br></br>
            <Typography className={classes.title} color="textSecondary" gutterBottom>
              Average Change: {this.props.averageChangeDay}
            </Typography>
            <Typography variant="h5" component="h2">
              Number of Calls: {this.props.callsDay}
            </Typography>
            <br></br>
            <Typography variant="h5" component="h2">
              Time calling: {this.props.timeDay}
            </Typography>
          </CardContent>
          <CardActions>
          </CardActions>
        </Card>

        <Card  style={{minWidth:450, maxWidth:720, marginBottom:16}}>
            <CardContent>
                <Typography variant="h5" component="h2">
                    This Week
                </Typography>
                <br></br>
                <Typography className={classes.title} color="textSecondary" gutterBottom>
                    Average Change: {this.props.averageChangeWeek}
                </Typography>
                <Typography variant="h5" component="h2">
                    Number of Calls: {this.props.callsWeek}
                </Typography>
                <br></br>
                <Typography variant="h5" component="h2">
                    Time calling: {this.props.timeWeek}
                </Typography>
            </CardContent>
            <CardActions>
            </CardActions>
        </Card>

        <Card  style={{minWidth:450, maxWidth:720, marginBottom:16}}>
          <CardContent>
            <Typography variant="h5" component="h2">
                This Month
            </Typography>
            <Typography className={classes.title} color="textSecondary" gutterBottom>
              Average Change: {this.props.averageChangeMonth}
            </Typography>
            <Typography variant="h5" component="h2">
              Number of Calls: {this.props.callsMonth}
            </Typography>
            <br></br>
            <Typography variant="h5" component="h2">
              Time calling: {this.props.timeMonth}
            </Typography>
          </CardContent>
          <CardActions>
          </CardActions>
        </Card>


        <Card  style={{minWidth:450, maxWidth:720, marginBottom:16}}>
          <CardContent>
            <Typography variant="h5" component="h2">
                Whole Year
            </Typography>
            <Typography className={classes.title} color="textSecondary" gutterBottom>
              Average Change: {this.props.averageChangeYear}
            </Typography>
            <Typography variant="h5" component="h2">
              Number of Calls: {this.props.callsYear}
            </Typography>
            <br></br>
            <Typography variant="h5" component="h2">
              Time calling: {this.props.timeYear}
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