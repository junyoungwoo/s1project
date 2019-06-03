import React, { Component } from 'react';
import { createSwitchNavigator, createAppContainer } from 'react-navigation';
import SudokuPage from './viewPage/SudokuPage.js';
import mainPage from './viewPage/mainPage.js';

//test
const RootStack = createSwitchNavigator(
  {
    Home: mainPage,
    Game: SudokuPage,
  },
  {
    initialRouteName: 'Home',
  }
);

const AppContainer = createAppContainer(RootStack);

export default class App extends React.Component {
  render() {
    return <AppContainer />;
  }
}
