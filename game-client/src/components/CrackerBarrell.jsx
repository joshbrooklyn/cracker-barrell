import React from 'react';
import ReactDOM from 'react-dom';

import GameBoard from './GameBoard';
import MenuBar from './MenuBar';
import { Grid } from 'semantic-ui-react';
import { Container } from 'semantic-ui-react';

export default class CrackerBarrell extends React.Component {
	constructor(props) {
		super(props);
		
		this.unselectPeg = this.unselectPeg.bind(this);
		
		let pegLocations = Array(15).fill(1).map((isEmpty,idx) => {
			let retVal = this.props.emptyPeg === idx ? 0 : 1;
			
			return retVal;
		});
		
		let selectablePegs = this.getSelectablePegs(pegLocations);
		
		
		this.state = {
			history: [{
				selectedPeg: null,
				pegLocations: pegLocations,
				selectablePegs: selectablePegs, 
				selectableHoles: null,
				lastMove: null,
			}],			
			
			gameOver:0,
			pegsRemaining:null,
			oldGames:null,
		};
	}
	
	getSelectablePegs(pegLocations) {
		return pegLocations.map((hasPeg,idx) => {
	   	if (hasPeg === 0) return 0;
	   
	   	const moves = this.props.validMoves[idx];
	   	let retVal = 0;
	   
	   	for (let move of moves) {
	    	if (pegLocations[move[0]] !== 0 && pegLocations[move[1]] !== 1)
	      retVal = 1;     
	   	}
	   
	   	return retVal;
  	});		
	}
	
	getSelectableHoles(pegLocations, selectedPeg) {
  	return pegLocations.map((hasPeg,idx) => {
	     if (hasPeg === 1) return 0;
	     
	     const moves = this.props.validMoves[selectedPeg];
	     let retVal = 0;
	     
	     for (let move of moves) {
	      if (move[1] === idx)
	        retVal = 1;     
	     }
	     
	     return retVal;
  	});		
	}	

	unselectPeg(e) {
		document.removeEventListener('click', this.unselectPeg, false);
		
		const tmpHistory = this.state.history.slice(0,this.state.history.length - 1);
		
		if (tmpHistory.length > 0) {		
					
			this.setState ({
				history: tmpHistory,						
			});
		}
	}
	
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
			this.setState ({
				history: tmpHistory,						
			});
		}
	}
	
	handleClick(i) {
		const history = this.state.history;
		const current = history[history.length - 1];
		console.log(history.length - 1);
		
		let gameOver = this.state.gameOver;
		let pegsRemaining = this.state.pegsRemaining;
		
		console.log("Game Over: " + gameOver);
		
		if (gameOver !== 1) {
		
			const selectedPeg = current.selectedPeg;
			const pegLocations = current.pegLocations;
			const selectablePegs = current.selectablePegs;
			const selectableHoles = current.selectableHoles;
			const validMoves = this.props.validMoves;		
						
			if (selectedPeg === null) {	//user selected a peg	
				if (selectablePegs[i]) { // only do anyting if the peg has a valid move
					document.addEventListener('click', this.unselectPeg, false);	

					const selectableHoles = this.getSelectableHoles(pegLocations, i);

			  	history.push({
					selectedPeg: i,
					pegLocations: pegLocations,
					selectablePegs: selectablePegs, 
					selectableHoles: selectableHoles,
					lastMove: null,
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
			    
			    const selectablePegs = this.getSelectablePegs(pegLocations);
			    
			  	history.push({
			  		selectedPeg:null,
			  	  pegLocations: pegLocations,
			  	  selectablePegs: selectablePegs,
			  	  selectableHoles:null,
			  	  lastMove: null   
			  	});
					
					document.removeEventListener('click', this.unselectPeg, false);
					
					//did we win
					if (selectablePegs.indexOf(1) === -1) { // there are no more valid moves
						pegsRemaining = pegLocations.filter((itm) => {
			    		return itm === 1;
			    	}).length;
			    	
			    	let score = 0;
			    	if (pegsRemaining === 1)
			    		score = 5;
			    	if (pegsRemaining === 2)
			    		score = 3;
			    	if (pegsRemaining === 3)
			    		score = 1;	    			    	
		    	
		    		gameOver = 1;
			    }				
				}			
			}
			
	  	this.setState ({
					history: history,		
					gameOver: gameOver,
					pegsRemaining: pegsRemaining			 
			});		
		}
	} 
	
	render() {
		const gameOver = this.state.gameOver;
		const history = this.state.history;
		const current = history[history.length - 1];
		const selectedPeg = current.selectedPeg;
		const pegLocations = current.pegLocations;
		const selectablePegs = current.selectablePegs;
		const selectableHoles = current.selectableHoles;
		
		console.log(history);
		
		return (
				<Grid>
					<Grid.Row>
						<MenuBar 
							resetGameHandler = {this.resetGame.bind(this)}
							undoMoveHandler = {this.undoMove.bind(this)}
						/>
					</Grid.Row>
					<Grid.Row>
						<Container>	
							<GameBoard 
								pegLocations = {pegLocations}
								selectedPeg = {selectedPeg}
								selectablePegs = {selectablePegs}
								selectableHoles = {selectableHoles}
								onClick={(i) => this.handleClick(i)}/>
						</Container>								
					</Grid.Row>
				</Grid>
		);
	}
}


