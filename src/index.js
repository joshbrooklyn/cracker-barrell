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
  
    let pegLocations = this.props.pegLocations;
    let validMoves = this.props.validMoves;
    
    let pegsWithValidMoves = pegLocations.map((hasPeg,idx) => {
     if (hasPeg === 0) return 0;
     
     const moves = validMoves[idx];
     let retVal = 0;
     
     //console.log(idx);
     for (let move of moves) {
      console.log(move[1]);
      if (pegLocations[move[1]] !== 1)
        retVal = 1;     
     }
     
     return retVal;
    });
    //console.log(validMoves[0]);
    //console.log(pegLocations);
    //console.log(pegsWithValidMoves);
    
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
	  		
	  		if (!pegLocations[key])
	  			pegClass = 'empty';
	  		else if (this.props.selectedPeg === key)
	  			pegClass = 'from-selected';
	  		else if (pegsWithValidMoves[key])
	  		  pegClass = 'from-selectable';
	  		
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
	
	handleClick(i) {
		let selectedPeg = null;
		const history = this.state.history;
		
		if (this.state.selectedPeg === null){
			selectedPeg = i;
		}
		
		this.setState ({
			history: history,
			selectedPeg: selectedPeg, 
		});
	} 
	
	/*resetGame() {
		let emptyPeg = Math.floor(Math.random() * Math.floor(14));	
		
	}*/
		
	render() {
		const history = this.state.history;
		const current = history[history.length - 1];
		
		return (
			<div>
				<Board 
					pegLocations = {current.pegLocations}
					selectedPeg = {this.state.selectedPeg}
					validMoves = {this.props.validMoves}
					onClick={(i) => this.handleClick(i)}
				/>
				<GameControls />
			</div>
		);
	}
}

ReactDOM.render(
  <CrackerBarrell 
    //emptyPeg={Math.floor(Math.random() * Math.floor(14))}
    emptyPeg={5}
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
      ],
      [
        [3,6],
        [4,8]
      ],
      [
        [3,6],
        [4,8]
      ],
      [
        [3,6],
        [4,8]
      ],
      [
        [3,6],
        [4,8]
      ],
      [
        [3,6],
        [4,8]
      ],
      [
        [3,6],
        [4,8]
      ],
      [
        [3,6],
        [4,8]
      ],
      [
        [3,6],
        [4,8]
      ],
      [
        [3,6],
        [4,8]
      ],
      [
        [3,6],
        [4,8]
      ],
      [
        [3,6],
        [4,8]
      ]
    ]}
  />, 
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
