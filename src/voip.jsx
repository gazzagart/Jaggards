import React from 'react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import { Link } from 'react-router-dom';
var remote = require('electron').remote;// Load remote compnent that contains the dialog dependency
var app = remote.app;
var dialog = remote.dialog; // Load the dialogs component of the OS
var fs = require('fs'); // Load the File System to execute our common tasks (CRUD)

export default class Voip extends React.Component {

  componentDidMount() {
    const DATAPATH =  app.getAppPath() + "\\allSaveData.json";
    console.log(DATAPATH);
    fs.readFile(DATAPATH, 'utf-8', (err, data ) => {
      if(err) { // File does not exist yet.
        alert("There has been an error trying to read the file.");
        var content = {
            summary: {},
            headingRow: ["ID","RefNum","Extension Number","Call Date","Call Duration","Number Called","LCD","Call Direction"]
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
        console.log(JSON.parse(data));
      }
    });
  }

  readFile (filePath) {
    fs.readFile(filePath, 'utf-8', (err, data ) => {
      if(err) {
        alert("There has been an error trying to read the file.");
        console.error(err);
        return;
      }
      if (typeof(Worker) !== "undefined") {
        var worker = new Worker("worker.js");
        worker.addEventListener('message', function(e) {
          console.log('Message from Worker: ');
          console.log(e.data[0][0]);
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

  render() {
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
                    <Link to='/main/'>Main Page</Link>
                  </Button>
                </Grid>
                <Grid item>
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
