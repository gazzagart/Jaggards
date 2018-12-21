import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
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

class EmployeeCard extends React.Component {

    constructor(props) {
        super(props);
        this.componentDidMount = this.componentDidMount.bind(this);
        this.state = {
          widthToPass: 275,
        };
      }

  render () {
    const { classes } = this.props;
    return (
        <Card  style={{minWidth:275, maxWidth:720, margin:16}}>
          <CardContent>
            <Typography className={classes.title} color="textSecondary" gutterBottom>
              Extension Number: {this.props.exNumber}
            </Typography>
            <Typography variant="h5" component="h2">
              Number of Calls: {this.props.calls}
            </Typography>
            <br></br>
            <Typography variant="h5" component="h2">
              Time calling: {this.props.time}
            </Typography>
          </CardContent>
          <CardActions>
            <Button size="small">Learn More</Button>
          </CardActions>
        </Card>
      );
  }
}

EmployeeCard.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(EmployeeCard);