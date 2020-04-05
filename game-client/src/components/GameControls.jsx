function GameControls(props){
	
	let messageClass = "";
	let messageText = "";
	if (props.gameOver) {
		if (props.pegsRemaining > 3) {
			messageClass = "lost";
			messageText = "There are no more valid moves, the game is over. You finished with 4 or more pegs left, so you scored 0 points. Click \"Reset Game\" to try again!";
		}
		else{
    	let score = 0;
    	if (props.pegsRemaining === 1)
    		score = 5;
    	if (props.pegsRemaining === 2)
    		score = 3;
    	if (props.pegsRemaining === 3)
    		score = 1;	   
			
			messageClass = "won";
			messageText = "There are no more valid moves, the game is over. You finished with " + props.pegsRemaining + " pegs left for a score of " + score + ". Click \"Reset Game\" to try again!";
		}
						
	}
	
	return (
		<div id="game-controls">
			<div id="game-control-header">Game Controls</div>
			<div id="game-control-main">
				<button onClick={props.resetGame.bind(this)}>Reset Game</button>			
				<button onClick={props.undoMove.bind(this)}>Undo Move</button>
				<div id="game-message" className={messageClass}>{messageText}</div>			
			</div>
		</div>
	)
}