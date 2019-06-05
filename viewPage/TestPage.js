import React, { Component } from 'react';
import { Animated, TouchableWithoutFeedback, Text, View, StyleSheet } from 'react-native';

export default class App extends Component {
  constructor(props) {
    super(props)
    this.moveAnimation = new Animated.ValueXY({ x: 10, y: 450 })
    this.state = {
      isClick: false
    };

  }

  _moveBall = () => {
    console.log('start');
    this.setState({
      isClick: true
    });
    Animated.spring(this.moveAnimation, {
      toValue: {x: 0, y: 100},
    }).start(() => {this.setState({
      isClick: false
    })});

  }

  find_dimesions(layout){
    const {x, y, width, height} = layout;
    console.warn(x);
    console.warn(y);
    console.warn(width);
    console.warn(height);
  }

  render() {
    return (
      <View style={styles.container}>
        <Animated.View style={[styles.tennisBall,
          this.moveAnimation.getLayout(),
          {opacity: this.state.isClick?100:0}]}>
        </Animated.View>
        <TouchableWithoutFeedback style={styles.button} onPress={this._moveBall} onLayout={(event) => { this.find_dimesions(event.nativeEvent.layout) }}>
          <Text style={styles.buttonText}>Press</Text>
        </TouchableWithoutFeedback>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ecf0f1',
  },
  tennisBall: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'greenyellow',
    borderRadius: 100,
    width: 100,
    height: 100,
  },
  button: {
    paddingTop: 24,
    paddingBottom: 24,
  },
  buttonText: {
    fontSize: 24,
    color: '#333',
  }
});
