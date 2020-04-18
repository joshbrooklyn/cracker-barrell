import React from 'react';
import ReactDOM from 'react-dom';

import GameBoard from './GameBoard';
import MenuBar from './MenuBar';
import { Container } from 'semantic-ui-react';

export default class CrackerBarrell extends React.Component {
	constructor(props) {
		super(props);
		
		this.unselectPeg = this.unselectPeg.bind(this);
		
		let pegLocations = this.getPegLocations(this.props.emptyPeg);		
		let selectablePegs = this.getSelectablePegs(pegLocations);
		
		
		this.state = {
			history: [{
				selectedPeg: null,
				pegLocations: pegLocations,
				selectablePegs: selectablePegs, 
				selectableHoles: null,
			}],			
			
			gameOver:0,
			pegsRemaining:null,
			oldGames:null,
		};
		
		//console.log(this.state.history);
	}
	
	getPegLocations(emptyPeg) {
		return Array(15).fill(1).map((isEmpty,idx) => {
			let retVal = emptyPeg === idx ? 0 : 1;
			
			return retVal;
		});
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
		console.log("Unselect Fired!");
		
		document.removeEventListener('click', this.unselectPeg, false);
		
		const tmpHistory = this.state.history.slice(0,this.state.history.length - 1);
		
		if (tmpHistory.length > 0) {		
					
			this.setState ({
				history: tmpHistory,						
			});
		}
	}
	
  resetGame() {
		const emptyPeg = Math.floor(Math.random() * Math.floor(14));
		const pegLocations = this.getPegLocations(emptyPeg);
		const selectablePegs = this.getSelectablePegs(pegLocations);
		
		let history = [{
			selectedPeg: null,
			pegLocations: pegLocations,
			selectablePegs: selectablePegs, 
			selectableHoles: null,
		}];
		
		this.setState ({
			history: history,						
			gameOver:0,
			pegsRemaining:null
		});
	}
	
	undoMove(e) {
		e.nativeEvent.stopImmediatePropagation();
		const selectedPeg = this.state.history[this.state.history.length - 1].selectedPeg;
		//console.log(selectedPeg);
		
		if (this.state.gameOver === 0 ) {
			if (selectedPeg == null && this.state.history.length > 2) {
				let tmpHistory = this.state.history.slice(0,this.state.history.length - 2);
				
				document.removeEventListener('click', this.unselectPeg, false);
				this.setState ({
					history: tmpHistory,						
				});				
			}	 else if (selectedPeg != null && this.state.history.length > 3) {
				let tmpHistory = this.state.history.slice(0,this.state.history.length - 3);
			
				document.removeEventListener('click', this.unselectPeg, false);			
				this.setState ({
					history: tmpHistory,						
				});				
			}
		}
	}
	
	handleClick(i) {
		let  history = this.state.history.slice(0);
		const current = history[history.length - 1];
		//console.log("handleClick: " + history.length);
		
		//console.log("Before:")
		//console.log(JSON.parse(JSON.stringify(history)));	
		let gameOver = this.state.gameOver;
		let pegsRemaining = this.state.pegsRemaining;
		
		//console.log("Game Over: " + gameOver);
		
		if (gameOver !== 1) {
		
			const selectedPeg = current.selectedPeg;
			const pegLocations = current.pegLocations.slice(0);
			const selectablePegs = current.selectablePegs.slice(0);
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
			  	});
				}
			} else { // user selected a hole
				const selectableHoles = current.selectableHoles.slice(0);
				
				if (selectableHoles[i]) { //only do something if this is a valid move
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
			  	});
					
					document.removeEventListener('click', this.unselectPeg, false);
					
					//did we win?
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
			
			//console.log("After:");
			//console.log(JSON.parse(JSON.stringify(history)));	
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
		
		//console.log(history);
		//console.log("Render: " + history.length);
		
		return (
			<Container>
				<MenuBar 
					resetGameHandler = {this.resetGame.bind(this)}
					undoMoveHandler = {this.undoMove.bind(this)}
							/>
				<GameBoard 
					pegLocations = {pegLocations}
					selectedPeg = {selectedPeg}
					selectablePegs = {selectablePegs}
					selectableHoles = {selectableHoles}
					onClick={(i) => this.handleClick(i)}/>
			</Container>
		);
	}
}


