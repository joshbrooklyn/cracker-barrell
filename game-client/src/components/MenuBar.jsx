import React from 'react';
import { Container, Header, Menu } from 'semantic-ui-react';

class MenuBar extends React.Component {
	
	render() {
		return (
		  <Header block>
		  <Menu>  
		    <Menu.Item as="a" name="new-game" onClick={this.props.resetGameHandler}>New Game</Menu.Item>
		    <Menu.Item as="a" name="undo" onClick={this.props.undoMoveHandler}>Undo Move</Menu.Item>
		    <Menu.Item as="a" name="help" onClick={this.props.undoMoveHandler}>How to Play</Menu.Item>
		  </Menu>
		  </Header>
		);
	}
}

export default MenuBar;
