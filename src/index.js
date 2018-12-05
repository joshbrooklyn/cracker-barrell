import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
//import App from './App';
import * as serviceWorker from './serviceWorker';

function PegLocation(props){
	return (
		<button className={props.pegClass} onClick={props.onClick.bind(this, props.pegNum)}/>
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
	render() {
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
	  		
	  		if (!this.props.pegLocations[key])
	  			pegClass = 'peg-location-empty';
	  		else if (this.props.selectedPeg === key)
	  			pegClass = 'peg-location-selected';
	  		
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
					onClick={(i) => this.handleClick(i)}
				/>
				<GameControls />
			</div>
		);
	}
}

ReactDOM.render(<CrackerBarrell emptyPeg={Math.floor(Math.random() * Math.floor(14))}/>, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
