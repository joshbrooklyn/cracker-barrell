import React from 'react';
import { Container, Image, Menu } from 'semantic-ui-react';
export default () => (
  <Menu>
    <Menu.Item as="a" name="login">
      New Game
    </Menu.Item>
    <Menu.Item as="a" name="register">
      Undo Move
    </Menu.Item>

  </Menu>
);