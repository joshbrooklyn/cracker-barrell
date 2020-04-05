import React, { Component } from 'react';


function PegLocation(props){
	return (
		<button id="peg-location" className={props.pegClass} onClick={props.onClick.bind(this, props.pegNum)}/>
	);
}

class GameBoard extends React.Component {

  render() {
  
    const selectablePegs = this.props.selectablePegs;
    const selectableHoles = this.props.selectableHoles;
    const pegLocations = this.props.pegLocations;
    const selectedPeg = this.props.selectedPeg;
    
    let rows = [];
	  let key = 0;
	  	  
	 	const triangleBase = 600;
	 	const triangleHeight = 520; 	  
	 	const pegDiameter = 60;
	  
	  for (let i = 0; i <= 4; i++) {
	  	let col = [];
	  	let rowPadding = (triangleBase/2) - (pegDiameter * (i + 1) / 2) - (pegDiameter * i / 2);
	  	let rowWidth = pegDiameter * (i + i + 1);
	  	let cellwidth = rowWidth / (i + 1);
	  	let rowHeight = triangleHeight / 5 - 5;
	  	
	  	const rowStyles = {
	  		marginLeft: rowPadding + 'px',
	  		height: rowHeight + 'px',
	  		backgroundColor:"transparent",
	  		borderBottom: "none",
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
	  		  }}
	  		  key={key}>
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
	  	
	  	rows.push(<div style={rowStyles} key={i}>{col}</div>);
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

export default GameBoard;