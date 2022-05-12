const express = require("express");
const bodyParser = require("body-parser");
const cors = require('cors');
var fs = require('fs');
const app = express();
const path = require('path');


// parse requests of content-type - application/json
app.use(bodyParser.json());

// parse requests of content-type - application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors());

var dir = path.join(__dirname, 'uploads');
app.use(express.static(dir));


// simple route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Diella application." });
});



//Check for Validate of Sudoku 
//Send in body name of csv file
app.post('/checkValidSudoku', (req, res) => {
  var name = req.body.name;
  var lines = [];
 
  fs.createReadStream(`./uploads/${name}.csv`, 'utf8')
  .on("data", function (row) {
    lines.push(row);
  })
  .on("end", function () {
    result = isValidSudoku(lines);
    res.send({'Validate of Sudoku: ': result});
  })
  .on("error", function (error) {
    console.log(error.message);
  });
});


function isValidSudoku(board) { 
  board = board[0].split('\r\n');
  var rows = [[], [], [], [], [], [], [], [], []];
  var columns = [[], [], [], [], [], [], [], [], []];
  var boxes = [[], [], [], [], [], [], [], [], []];

  for (let i = 0; i < board.length; i++) { 
    for (let j = 0; j < board.length; j++) {
      let cell = board[i][j];
      if(cell !== ',') {
        if (rows[i].includes(cell)) {
          return false
        } else rows[i].push(cell);

        if (columns[j].includes(cell)) {
          return false;
        } else columns[j].push(cell);

        let boxIndex = Math.floor((i / 3)) * 3 + Math.floor(j / 3);

        if (boxes[boxIndex].includes(cell)) {
          return false;
        } else boxes[boxIndex].push(cell);
      }
    }
  } 
  return true;
}


// set port, listen for requests
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});