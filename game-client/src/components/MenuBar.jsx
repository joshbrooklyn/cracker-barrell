import React from 'react';
import { Container, Image, Menu } from 'semantic-ui-react';

class MenuBar extends React.Component {
	
	render() {
		return (
		  <Menu>  
		    <Menu.Item as="a" name="new-game" onClick={this.props.resetGameHandler}>
		      New Game
		    </Menu.Item>
		    <Menu.Item as="a" name="undo" onClick={this.props.undoMoveHandler}>
		      Undo Move
		    </Menu.Item>
		  </Menu>
		);
	}
}

export default MenuBar;
