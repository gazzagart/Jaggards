import React from 'react';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import AlertDialog from './alertdialog.jsx';
import { Link } from 'react-router-dom';
import CircularProgress from '@material-ui/core/CircularProgress';

var app = require('electron').remote; 
var dialog = app.dialog;

var ExcelJS = require('exceljs');

export default class Excel extends React.Component {

  constructor (props) {
    super(props);
    this.firstLoad = this.firstLoad.bind(this);
    this.state = {
      dialogOpen: false,
      dialogTitle: "Welcome To Excel Processor",
      dialogMessage: 'To start, click on load data to load in your .xlsv (Excel) file. Whenever you need to load more data, just click load data again and load a new file. This will export a new Excel file with the data processed. You can then open the new file to use it.',
      loading: false,
      tryAgain: false,
      dataForFile: {}
    };
  }

  componentDidMount() {
    this.setState({ dialogOpen: true });
  }

  firstLoad (dataFromChild) {
    this.setState({
      dialogOpen: dataFromChild
    });
  }

  saveUpdatedExcelFile () {
    alert("Please select the destionation and file name you wish to create for your processed Excel file.");
    // You can obviously give a direct path without use the dialog (C:/Program Files/path/myfileexample.txt)
    dialog.showSaveDialog((fileName) => {
      if (fileName === undefined){
          alert("You didn't save the file. Please try again.");
          console.log("You didn't save the file");
          this.setState({loading: false});
          this.setState({tryAgain: true});
          return;
      }

      if (fileName.includes(".") && !fileName.endsWith(".xlsx")) {
        alert("Please save as .xlsx file or dont use a period, '.', in the name: Didn't save file, please try again.");
        this.setState({loading: false});
        this.setState({tryAgain: true});
        return;
      }

      if (!fileName.endsWith(".xlsx")) {
        fileName = fileName + ".xlsx";
      }
      var workbook = new ExcelJS.Workbook();
      workbook.creator = 'Gareth Maybery';
      workbook.lastModifiedBy = 'The Jaggards';
      workbook.created = new Date(2019, 2, 1);
      workbook.modified = new Date();
      workbook.lastPrinted = new Date();
      // create a sheet with blue tab colour
      var workSheet = workbook.addWorksheet('Processed Data', {properties:{tabColor:{argb:'3333ff'}}});
      var columnOneValues = Object.keys(this.state.dataForFile);
      var columnTwoValues = Object.values(this.state.dataForFile);
      workSheet.getColumn(1).values = columnOneValues;
      var passToColumn = [];
      var length = columnTwoValues.length;
      for (var a = 0; a < length; a++) {
        var string = "";
        var length_2 = columnTwoValues[a].length;
        for (var b = 0; b < length_2; b++) {
          if (b != (length_2-1)) {
            string += columnTwoValues[a][b] + ", ";
          } else {
            string += columnTwoValues[a][b];
          }
        }
        passToColumn.push(string);
      }
      workSheet.getColumn(2).values = passToColumn;
      workbook.xlsx.writeFile(fileName)
      .then(() => {
        this.setState({loading: false});
        this.setState({tryAgain: false});
        alert("The file has been succesfully saved; ", fileName);
      });
    });
  }

  readFile (filePath) {
    this.setState({loading: true});
    var processedData = {};
    var workbook = new ExcelJS.Workbook();
    workbook.xlsx.readFile(filePath)
        .then(() => {
            // use workbook
            workbook.eachSheet((worksheet, sheetId) => {
                // get all sheets??
                if (sheetId == 1) { // Get the first sheet.
                  //Start of processing data
                  var firstCol = worksheet.getColumn(1);
                  firstCol.eachCell({ includeEmpty: true }, function(cell, rowNumber) {
                      // each cell in each sheet
                      var nextCell = worksheet.getRow(rowNumber).getCell(2);
                      // Add unique keys
                      var alreadyAdded = false;
                      var keyArray = Object.keys(processedData);
                      var length = keyArray.length;
                      for (var a = 0; a < length; a++) {
                        if (keyArray[a] == cell.value) {
                          alreadyAdded = true;
                          a = length;
                        }
                      }
                      if(!alreadyAdded) {
                        processedData[cell.value] = [];
                        processedData[cell.value].push(nextCell.value);
                      } else { // This key has already been added now check if this key has the data added to it.
                        if(processedData[cell.value].indexOf(nextCell.value) == -1) {
                          processedData[cell.value].push(nextCell.value);
                        }
                      }
                  });
                  this.setState({dataForFile: processedData});
                  //console.log('processedData',processedData); // The processed data
                  //End of processing data
                }
            });
        }).then(() => {
          this.saveUpdatedExcelFile();
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
    let loadingLoader = {
      display: 'none'
    };
    let loadingRest = {
      display: 'block'
    };
    let tryAgain = {
      display: 'none'
    };
    if (this.state.loading) {
      loadingLoader.display = "block";
      loadingRest.display = "none";
    }
    if (this.state.tryAgain) tryAgain.display = "block";
    return (
    <div style={{ marginTop: 30 }}>
      <Grid container spacing={16}>
        <Grid item xs={12} style={loadingRest}>
            <Grid container justify="center" spacing={16}>
                <h2>Excel Month End</h2>
            </Grid>
            <AlertDialog message={this.state.dialogMessage} title={this.state.dialogTitle} open={this.state.dialogOpen} callbackFromParent={this.firstLoad}/>
            <Grid container justify="center" spacing={16}>
                <Grid item>
                  <Button variant="contained" color="primary">
                    <Link style={{ textDecoration: 'none' }} to='/main/'>Main Page</Link>
                  </Button>
                </Grid>
                <Grid item>
                  <Button variant="contained" className="w3-green" onClick={() => this.getData()}>
                    Load Data
                  </Button>
                </Grid>
                <Grid item style={tryAgain}>
                  <Button variant="contained" className="w3-orange" onClick={() => this.saveUpdatedExcelFile()}>
                    Try Again
                  </Button>
                </Grid>
            </Grid>
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

    </div>
    );
  }
}
