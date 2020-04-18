import React from 'react';
import { Dimmer, Icon, Header } from 'semantic-ui-react';

class MenuBar extends React.Component {
	render() {
		const pegsRemaining = this.props.pegsRemaining;
		
		let messageText = "";
   	let score = 0;

   	if (pegsRemaining === 1)
   		score = 5;
   	if (pegsRemaining === 2)
   		score = 3;
   	if (pegsRemaining === 3)
   		score = 1;	   
			
		messageText = "There are no more valid moves, the game is over. You finished with " + pegsRemaining + " pegs left for a score of " + score + ".";
							
		return (
	    <Dimmer active={this.props.gameOver}>
	      <Header as='h2' icon inverted>
	        <Icon name='smile outline' />
	        { messageText }
	        <br/><br/>
	        Click "New Game" to try again!
	      </Header>
	    </Dimmer>
		);
	}
}

export default MenuBar;