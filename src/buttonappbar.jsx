import React from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import CancelIcon from '@material-ui/icons/Cancel';
import MinimizeIcon from '@material-ui/icons/Minimize';
import FullscreenIcon from '@material-ui/icons/Fullscreen';
import FullscreenExitIcon from '@material-ui/icons/FullscreenExit';
import SwipeableDrawer from '@material-ui/core/SwipeableDrawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import HomeIcon from '@material-ui/icons/Home';
import PhoneIcon from '@material-ui/icons/Phone';
import EqualizerIcon from '@material-ui/icons/Equalizer';
import { Link } from 'react-router-dom';

const remote = require('electron').remote;

export default class ButtonAppBar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            top: false,
            left: false,
            bottom: false,
            right: false,
        };
    }
    toggleDrawer(open) {
      this.setState({
        left: open,
      });
    };
  render() {
    const styles = {
      root: {
        flexGrow: 1,
      },
      grow: {
        flexGrow: 1,
      },
      menuButton: {
        marginLeft: -12,
        marginRight: 20,
        WebkitAppRegion: 'no-drag',
      },
      largeIcon: {
        fontSize: "3em",
        WebkitAppRegion: 'no-drag',
      },
      hide: {
        display: "none",
      },
      drag: {
        WebkitAppRegion: 'drag',
      },
      noDrag: {
        WebkitAppRegion: 'no-drag',
      },
    };
    const classes  = styles;
    return (
      <div style={classes.root} style={classes.drag}>
        <AppBar position="static">
          <Toolbar>
            <IconButton style={classes.menuButton} color="inherit" aria-label="Menu" onClick={() => this.toggleDrawer(true)}>
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" color="inherit" style={classes.grow}>
              Jaggards
            </Typography>
            <IconButton style={classes.largeIcon} color="inherit" aria-label="Close" onClick={() => remote.getCurrentWindow().minimize()}>
              <MinimizeIcon/>
            </IconButton>
            <IconButton style={classes.largeIcon} color="inherit" aria-label="MaxMinApp"
            onClick={() => {
                var window = remote.getCurrentWindow();
                if (!window.isMaximized()) {
                    window.maximize();
                    document.getElementById('maxIcon').style.display = "none";
                    document.getElementById('minIcon').style.display = "block";
                } else {
                    window.unmaximize();
                    document.getElementById('minIcon').style.display = "none";
                    document.getElementById('maxIcon').style.display = "block";
                };
              }
            }>
              <FullscreenIcon id="maxIcon"/>
              <FullscreenExitIcon style={classes.hide} id="minIcon"/>
            </IconButton>
            <IconButton style={classes.largeIcon} color="inherit" aria-label="Close" onClick={() => remote.getCurrentWindow().close()}>
              <CancelIcon/>
            </IconButton>
          </Toolbar>
        </AppBar>
        <SwipeableDrawer
              open={this.state.left}
              onClose={() => this.toggleDrawer(false)}
              onOpen={() => this.toggleDrawer(true)}
            >
            <div
              tabIndex={0}
              role="button"
              onClick={() => this.toggleDrawer(false)}
              onKeyDown={() => this.toggleDrawer(false)}
            >
              <div style={{width: 250}} >
                <List>
                  <Link style={{ textDecoration: 'none' }} to='/main/'>
                    <ListItem button key={"home"}>
                        <ListItemIcon>
                          <HomeIcon />
                        </ListItemIcon>
                        <ListItemText primary={"Home"} />
                    </ListItem>
                  </Link>
                </List>
                <Divider />
                <List>
                <Link style={{ textDecoration: 'none' }} to='/voip/'>
                    <ListItem button key={"voipDash"}>
                        <ListItemIcon>
                          <PhoneIcon />
                        </ListItemIcon>
                        <ListItemText primary={"Voip Dash"} />
                    </ListItem>
                    </Link>
                </List>
                <Divider />
                <List>
                  <Link style={{ textDecoration: 'none' }} to="/excelMonthEnd/">
                    <ListItem button key={"excelSheet"}>
                      <ListItemIcon>
                        <EqualizerIcon />
                      </ListItemIcon>
                      <ListItemText primary={"Excel Sheet"} />
                    </ListItem>
                    </Link>
                </List>
              </div>
            </div>
          </SwipeableDrawer>
      </div>
    );
  }
}