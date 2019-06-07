import React, { Component } from 'react';
import { createSwitchNavigator, createAppContainer } from 'react-navigation';
import SudokuPage from './viewPage/SudokuPage.js';
import MainPage from './viewPage/mainPage.js';
import TestPage from './viewPage/TestPage.js';

//test
const RootStack = createSwitchNavigator(
  {
    Test: TestPage,
    Home: MainPage,
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
