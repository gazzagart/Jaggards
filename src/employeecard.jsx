import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Card from '@material-ui/core/Card';
import CardActions from '@material-ui/core/CardActions';
import CardContent from '@material-ui/core/CardContent';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

const styles = {
  card: {
    minWidth: 275,
  },
  title: {
    fontSize: 14,
  },
  pos: {
    marginBottom: 12,
  },
};

class EmployeeCard extends React.Component {

    constructor(props) {
        super(props);
      }

  render () {
    const { classes } = props;
    let width = window.screen.availWidth;
    let widthToPass = '';
    if (width > 720) {
        widthToPass = '60%';
      } else {
        widthToPass = '90%';
      }
    return (
        <Card className={classes.card} style={{width:widthToPass}}>
          <CardContent>
            <Typography className={classes.title} color="textSecondary" gutterBottom>
              Extension Number: {this.props.exNumber}
            </Typography>
            <Typography variant="h5" component="h2">
              {this.props.calls}
            </Typography>
            <Typography variant="h5" component="h2">
              {this.props.time}
            </Typography>
          </CardContent>
          <CardActions>
            <Button size="small">Learn More</Button>
          </CardActions>
        </Card>
      );
  }
}

SimpleCard.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(EmployeeCard);