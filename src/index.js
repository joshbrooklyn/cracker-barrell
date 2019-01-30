import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
//import App from './App';
import * as serviceWorker from './serviceWorker';

function PegLocation(props){
	return (
		<button id="peg-location" className={props.pegClass} onClick={props.onClick.bind(this, props.pegNum)}/>
	);
}

/*function GameMessage(props){
	return(
		<div id="game-message" style={props.showMessage ? {visibility:'visible'} : {visibility:'hidden'}}>{props.message}</div>
	)
}*/

function GameControls(props){
	//console.log(props.gameResult);
	let messageClass = "";
	let messageText = "";
	if (props.gameResult) {
		if (props.gameResult === 1) {
			messageClass = "won";
			messageText = "You Won!!!";
		}
		else if(props.gameResult === -1){
			messageClass = "lost";
			messageText = "Sorry, you are out of moves with more than one peg left, which means you lost. Click \"Reset Game\" to try again!";			
		}
						
	}
	
	return (
		<div id="game-controls">
			<div id="game-control-header">Game Controls</div>
			<button onClick={props.resetGame.bind(this)}>Reset Game</button>			
			<button onClick={props.giveHint.bind(this)}>Get Hint</button>
			<div id="game-message" className={messageClass}>{messageText}</div>			
		</div>
	)
}

class Board extends React.Component {
  /*hasValidMove(pegLocations, validMoves, pegToTest)
  {
      
  }	*/
  render() {
  
    const selectablePegs = this.props.selectablePegs;
    const selectableHoles = this.props.selectableHoles;
    const pegLocations = this.props.pegLocations;
    const selectedPeg = this.props.selectedPeg;
    
    let rows = [];
	  let key = 0;
	  
	  for (let i = 0; i <= 4; i++) {
	  	let col = [];
	  	let rowPadding = (400/2 - (40 * (i + 1))) + 1;
	  	let rowWidth = 80 * (i + 1);
	  	let cellwidth = rowWidth / (i + 1);
	  	
	  	const rowStyles = {
	  		marginLeft: rowPadding + 'px',
	  		height: "56px",
	  		backgroundColor:"transparent",
	  		//border: "1px solid black",
	  		borderBottom: "none",
	  		width: rowWidth + "px"
	  	};
	  	
	  	for (let j = 0; j <= i; j++)
	  	{
	  		let pegClass = 'peg-location-occupied';	  		
	  		
	  		if (selectedPeg === null){
		  		if (!pegLocations[key])
		  			pegClass = 'empty';
		  		else if (selectablePegs[key])
		  		  pegClass = 'from-selectable';	  			
	  		} else {
					if (selectedPeg === key) 
						pegClass = 'from-selected';
					else if (selectableHoles[key])	 			
						pegClass = 'to-selectable';
					else if (!pegLocations[key])
		  			pegClass = 'empty';
	  		}

	  		
	  		col.push(
	  		  <div style={{
	  		  	//border:"1px solid black", 
	  		  	borderBottom:"none", 
	  		  	display:"inline-block",
	  		  	height:"100%",
	  		  	width:cellwidth + "px",
	  		  	textAlign:"center",
	  		  	verticalAlign:"middle"
	  		  }}>
	  			<PegLocation 
	  				pegClass={pegClass} 
	  				key={key}
	  				pegNum={key}
	  				onClick={(i) => this.props.onClick(i)}
	  			/>
	  			</div>
	  		); 		 
	  	  
	  	  key++; 		
	  	}
	  	
	  	rows.push(<div style={rowStyles}>{col}</div>);
	  }

		return (
		  <div id="game-board">
		  	<div className="triangle"/>
		  	<div className="pegs">
		  	{rows}
		  	</div>
		 	</div>
    );
	}
}

class CrackerBarrell extends React.Component {
	constructor(props) {
		super(props);
		
		this.unslectPeg = this.unselectPeg.bind(this);
		
		this.state = {
			history: [{
				pegLocations: Array(15).fill(1).map((isEmpty,idx) => {
					let retVal = this.props.emptyPeg === idx ? 0 : 1;
					
					return retVal;
				}),
				lastMove: null,
			}],			
			
			selectedPeg:null,
			gameResult:null,
		};
	}

	unselectPeg(e) {
		/*if (this.node.contains(e.target)) {
	    return;
	  }*/
	
		const history = this.state.history;	
		
		document.removeEventListener('click', this.unslectPeg, false);
		
  	this.setState ({
			selectedPeg: null,
				history: history,					 
		});		
	};
	
  /*tryMove(jumpFrom, move)
	{
		let pegLocations = history[history.length - 1].pegLocations;
		const validMoves = this.props.validMoves;
	}*/
	
	giveHint() {
		console.log("Give Hint");
		
		/*if(tryMove(0, null)){
			console.log("Move Found");
		}
		else
		{
			console.log("No Way to Win");			
		}*/
	}
	
	resetGame() {
		let emptyPeg = Math.floor(Math.random() * Math.floor(14));
		
		this.setState ({
			history: [{
				pegLocations: Array(15).fill(1).map((isEmpty,idx) => {
					let retVal = emptyPeg === idx ? 0 : 1;
					
					return retVal;
				}),
				lastMove: null,
			}],			
			
			selectedPeg:null,
			gameResult:null,
		});
	}
	
	handleClick(i, selectablePegs, selectableHoles) {
		const selectedPeg = this.state.selectedPeg;
		const history = this.state.history;
		let pegLocations = history[history.length - 1].pegLocations;
		const validMoves = this.props.validMoves;
		
		if (selectedPeg === null) {		
			if (selectablePegs[i]) { // only do anyting if the peg has a valid move
				document.addEventListener('click', this.unslectPeg, false);	

				this.setState ({
					selectedPeg: i,
				});
			}
		} else {
			if (selectableHoles[i]) {
		  	let lastMove = validMoves[selectedPeg].filter((move) => {
		  	  return move[1] === i;
		  	});
		  	
		    pegLocations[lastMove[0][0]] = 0;
		    pegLocations[lastMove[0][1]] = 1;
		    pegLocations[selectedPeg] = 0;
		    
		  	history.push({
		  	  pegLocations: pegLocations,
		  	  lastMove: lastMove   
		  	});
				
				document.removeEventListener('click', this.unslectPeg, false);
		  	
		  	this.setState ({
					selectedPeg: null,
						history: history,					 
				});
			}
			/*else if (i === selectedPeg)
				return;*/
		}		
	} 
	
	render() {
		const history = this.state.history;
		const current = history[history.length - 1];
		const pegLocations = current.pegLocations;
		
		let selectablePegs = 0;
    let selectableHoles = 0;
    
    
    if(this.state.selectedPeg === null) {
	    selectablePegs = pegLocations.map((hasPeg,idx) => {
	     if (hasPeg === 0) return 0;
	     
	     const moves = this.props.validMoves[idx];
	     let retVal = 0;
	     
	     for (let move of moves) {
	      if (pegLocations[move[0]] !== 0 && pegLocations[move[1]] != 1)
	        retVal = 1;     
	     }
	     
	     return retVal;
	    });	
	    
	    
	    if (selectablePegs.indexOf(1) === -1 && this.state.gameResult !== -1){ 
	    	this.setState ({
	    		gameResult:-1,	
	    	});	
	    }	
	  } else {
	  	selectableHoles = pegLocations.map((hasPeg,idx) => {
	     if (hasPeg === 1) return 0;
	     
	     const moves = this.props.validMoves[this.state.selectedPeg];
	     let retVal = 0;
	     
	     for (let move of moves) {
	      if (move[1] === idx)
	        retVal = 1;     
	     }
	     
	     return retVal;
	  	});
	  }
				
		return (
			<div id="cracker-barrell">
				<Board 
					pegLocations = {pegLocations}
					selectedPeg = {this.state.selectedPeg}
					selectablePegs = {selectablePegs}
					selectableHoles = {selectableHoles}
					onClick={(i) => this.handleClick(i, selectablePegs, selectableHoles)}
				/>
				<GameControls 
					gameResult = {this.state.gameResult}
					resetGame = {() => this.resetGame()}
					giveHint ={() => this.giveHint()}
				/>
			</div>
		);
	}
}

ReactDOM.render(
  <CrackerBarrell 
    emptyPeg={Math.floor(Math.random() * Math.floor(14))}
    
    //below are the valid moves for each peg location, with the index of the validMoves array being the peg location key
    validMoves={[
      [
        [1,3],
        [2,5]  
      ],
      [
        [3,6],
        [4,8]
      ],
      [
        [4,7],
        [5,9]
      ],
      [
        [1,0],
        [4,5],
        [6,10],
        [7,12]
      ],
      [
        [7,11],
        [8,13]
      ],
      [
        [2,0],
        [4,3],
        [9,14],
        [8,12]
      ],
      [
        [3,1],
        [7,8]
      ],
      [
        [8,9],
        [4,2]
      ],
      [
        [4,1],
        [7,6]
      ],
      [
        [8,7],
        [5,2]
      ],
      [
        [6,3],
        [11,12]
      ],
      [
        [12,13],
        [7,4]
      ],
      [
        [13,14],
        [11,10],
        [7,3],
        [8,5]
      ],
      [
        [12,11],
        [8,4]
      ],
      [
        [13,12],
        [9,5]
      ]
    ]}
  />, 
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
