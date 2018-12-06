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

function GameControls(props){
	return (
		<div className="game-controls">
			<div>Game Controls</div>
			<button>Reset Game</button>			
			<button>Undo Move</button>			
			<button>Get Hint</button>			
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
	  	let padding = (10 - i) / 2 * 10;
	  	
	  	const styles = {
	  		paddingLeft: padding + '%'
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
	  			<PegLocation 
	  				pegClass={pegClass} 
	  				key={key}
	  				pegNum={key}
	  				onClick={(i) => this.props.onClick(i)}
	  			/>
	  		); 		 
	  	  
	  	  key++; 		
	  	}
	  	
	  	rows.push(<div style={styles}>{col}</div>);
	  }

		return (
		  <div className="game-board">{rows}</div>
    );
	}
}

class CrackerBarrell extends React.Component {
	constructor(props) {
		super(props);
		
		this.state = {
			history: [{
				pegLocations: Array(15).fill(1).map((isEmpty,idx) => {
					let retVal = this.props.emptyPeg === idx ? 0 : 1;
					
					return retVal;
				}),
				lastMove: null,
			}],			
			
			selectedPeg:null,
		};
	}
	
	handleClick(i, selectablePegs, selectableHoles) {
		const selectedPeg = this.state.selectedPeg;
		const history = this.state.history;
		let pegLocations = history[history.length - 1].pegLocations;
		const validMoves = this.props.validMoves;
		
		if (selectedPeg === null) {		
			if (selectablePegs[i]) { // only do anyting if the peg has a valid move
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
		    //console.log(lastMove);
		    //console.log(lastMove[0]);
		    
		  	history.push({
		  	  pegLocations: pegLocations,
		  	  lastMove: lastMove   
		  	});
		  	
		  	this.setState ({
					selectedPeg: null,
					history: history,					 
				});
			}
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
			<div>
				<Board 
					pegLocations = {pegLocations}
					selectedPeg = {this.state.selectedPeg}
					selectablePegs = {selectablePegs}
					selectableHoles = {selectableHoles}
					onClick={(i) => this.handleClick(i, selectablePegs, selectableHoles)}
				/>
				<GameControls />
			</div>
		);
	}
}

ReactDOM.render(
  <CrackerBarrell 
    emptyPeg={Math.floor(Math.random() * Math.floor(14))}
    
    //below are the valid moves for each peg location, with the index of the validMoves array being th peg location key
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
