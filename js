function evolve(arr){
  var rows = arr.length;
  var cols = arr[0].length;
  var newArr = [];
  
  function nextStage(i, j, array){
    var rows = array.length;
    var cols = array[0].length;
    var count = 0;
    var out = 0;
    
    //scan top, bot row
    for (var k = 0; k < 3; k++){
      var rowTop = (i + 1) % rows;
      var rowBot = (i - 1 + rows) % rows;
      var col = (j + k - 1 + cols) % cols;
      count += array[rowTop][col];
      count += array[rowBot][col];
    }
    
    //scan left, right
    var leftCol = (j - 1 + cols) % cols;
    var rightCol = (j + 1) % cols;
    count += array[i][leftCol];
    count += array[i][rightCol];
    
    if (array[i][j] == 1){
      if (count == 2 || count == 3){ out = 1; }
    } else {
      if (count == 3){ out = 1; }
    }
    return out;
  }
  
  var newRow = [];
  
  for (var i = 0; i < rows; i++){
    newRow = [];
    for (var j = 0; j < cols; j++){
      newRow.push(nextStage(i, j, arr));
    }
    newArr.push(newRow);
  }
  return newArr;
}

class Box extends React.Component {
  constructor(props){
    super(props);
    this.state = { 
      coords: [props.rowIndex, props.colIndex],
      mode: props.mode //Init or Play mode
    };
    this.mouseEnter = this.mouseEnter.bind(this);
  }
  
  mouseEnter(){
    if (this.state.mode == 'Init'){
      var currState = this.state;
      var color = currState.style.backgroundColor;
      var newColor;
      if (color == 'white'){
        newColor = 'grey'; 
      } else {
        newColor = 'white';
      }
      currState.style.backgroundColor = newColor;
      this.setState(currState);
    }
  }
  
  render(){
    var coords = this.state.coords;
    var id = coords[0] + "," + coords[1];
    //console.log(this.props.style.backgroundColor)
    var box = <div className='box' id={id} style={this.props.style} onMouseEnter={this.mouseEnter} onMouseLeave={this.mouseEnter} onClick={this.props.boxClick} ></div>;
    return box;
  }
}

class Row extends React.Component {
  render(){
    //Info passed to contruct row from board
    var rowIndex = this.props.rowIndex;
    var arr = this.props.arr;
    var mode = this.props.mode;
    
    
    const size = 13
    const number = arr.length;
  
    function rowStyle(index) {
      var style = {
        margin: 'auto',
        height: size,
        width: (size-1)*number,
        position: 'relative',
        top: -index
      };
      return style;
    }
  
    function boxStyle(left, top, i, state){
      var color;
      if (state == 1){color = 'black';}
      if (state == 0){color = 'white';}
    
      var style = {
        height: size,
        width: size,
        position: 'relative',
        top: top,
        left: left,
        borderStyle: 'solid',
        borderWidth: 1,
        backgroundColor: color
      };
      return style;
    }
  
    var boxArr = [];
    for (var i = 0; i < number; i++){
      var left = (size-1)*i; //ensure borders are 1 px
      var top = -size*i;
      var state = arr[i];
      var newStyle = boxStyle(left, top, i, state);
      
      //store row and col indices
      var box = <Box colIndex={i} rowIndex={rowIndex} style={newStyle} mode={mode} boxClick={this.props.boxClick} />
      boxArr.push(box);
    }
  
    return (<div className='board' id={'row'+rowIndex} style={rowStyle(rowIndex)}>
      {boxArr}
        </div>);
  }
}

class Board extends React.Component {
  constructor(props) {
    super(props);
    
    //Initialize empty board
    var boardArr = [];
    var defaultCols = 30;
    var defaultRows = 30;
    for (var i = 0; i < defaultRows; i++){
      var row = [];
      for (var j = 0; j < defaultCols; j++){
        var rand = Math.random();
        if (rand < 0.1){ row.push(1); }
        else{ row.push(0); }
      }
      boardArr.push(row);
    }
    this.state = { board: boardArr, mode: 'Play' };
    this.handleBoxClick = this.handleBoxClick.bind(this);
  }
  
  componentDidMount(){
    if (this.state.mode == 'Play'){
      var nextBoard = evolve(this.state.board);
      setTimeout(function(){
        this.setState({ board: nextBoard, mode: 'Play' });
      }.bind(this), 150);
    }
  }
  
  componentWillUpdate(){
    if (this.state.mode == 'Play'){
      var nextBoard = evolve(this.state.board);
      setTimeout(function(){
        this.setState({ board: nextBoard, mode: 'Play' });
      }.bind(this), 150);
    }
  }
  
  handleBoxClick(e){
    var id = e.target.id;
    console.log(id);
  }
  
  render(){
    var board = this.state.board;
    //console.log(board);
    var rows = board.length;
    var cols = board[0].length;
    
    var outArr = [];
    for (var i = 0; i < rows; i++) {
      //makes row based on array
      outArr.push(<Row rowIndex={i} arr={board[i]} mode={this.state.mode} boxClick={this.handleBoxClick} />)
    }
    return <div className='play'>{outArr}</div>;
  }
}
ReactDOM.render(<Board />, document.getElementById('app'));
