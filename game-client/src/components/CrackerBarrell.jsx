import React from 'react';
import ReactDOM from 'react-dom';

import GameBoard from './GameBoard';
import MenuBar from './MenuBar';
import { Grid } from 'semantic-ui-react';
import { Container } from 'semantic-ui-react';

export default class CrackerBarrell extends React.Component {
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
			gameOver:0,
			pegsRemaining:null,
			oldGames:null,
		};
	}

	unselectPeg(e) {
		const history = this.state.history;	
		
		document.removeEventListener('click', this.unslectPeg, false);
		
  	this.setState ({
			selectedPeg: null,
				history: history,					 
		});		
	};
	
  resetGame() {
		let emptyPeg = Math.floor(Math.random() * Math.floor(14));
		let history = [{
			pegLocations: Array(15).fill(1).map((isEmpty,idx) => {
				let retVal = emptyPeg === idx ? 0 : 1;
				
				return retVal;
			}),
			lastMove: null,
		}];
		
		this.setState ({
			history: history,						
			selectedPeg:null,
			gameOver:0,
			pegsRemaining:null
		});
	}
	
	undoMove() {
		let tmpHistory = this.state.history.slice(0,this.state.history.length - 1);
		
		if (tmpHistory.length > 0 && this.state.gameOver === 0) {		
			//console.log(this.state.history.length);
			//console.log(tmpHistory);
					
			this.setState ({
				history: tmpHistory,						
				selectedPeg:null,
				gameOver:0,
			});
		}
	}
	
	handleClick(i, selectablePegs, selectableHoles) {
		const selectedPeg = this.state.selectedPeg;
		const history = this.state.history;
		
		let pegLocations = history[history.length - 1].pegLocations.slice(0);
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
	      	if (pegLocations[move[0]] !== 0 && pegLocations[move[1]] !== 1)
	        retVal = 1;     
	     	}
	     
	     	return retVal;
	    });	
	    
	    if (selectablePegs.indexOf(1) === -1) { // there are no more valid moves
	    	if (this.state.gameOver !== 1) { // avoid infinite render loop
	    	
		    	let pegsRemaining = pegLocations.filter((itm) => {
		    		return itm === 1;
		    	}).length;
		    	
		    	let score = 0;
		    	if (pegsRemaining === 1)
		    		score = 5;
		    	if (pegsRemaining === 2)
		    		score = 3;
		    	if (pegsRemaining === 3)
		    		score = 1;	    			    	
	    	
	    		this.setState({
		    			gameOver:1,
		    			pegsRemaining: pegsRemaining,
		    	});
		    }
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
				<Grid>
					<Grid.Row>
						<MenuBar/>
					</Grid.Row>
					<Grid.Row>
						<Container centered>	
							<GameBoard 
								pegLocations = {pegLocations}
								selectedPeg = {this.state.selectedPeg}
								selectablePegs = {selectablePegs}
								selectableHoles = {selectableHoles}
								onClick={(i) => this.handleClick(i, selectablePegs, selectableHoles)}/>
						</Container>								
					</Grid.Row>
				</Grid>
		);
	}
}


