// CustomButton
import React, { Component } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
} from 'react-native';

export default class CustomNumberButton extends Component{
  static defaultProps = {
    //key: '',
    title: ' ',
    buttonColor: '',
    titleColor: '#fff',
    rightBorder: 0.3,
    onPress: () => null,
  }

  constructor(props){
    super(props);
  }

  render(){
    return (
      <TouchableOpacity
        //key={this.props.key}
        style={[
        styles.button,
        {backgroundColor: this.props.buttonColor},
        {borderRightWidth: this.props.rightBorder}
      ]}
      onPress={this.props.onPress}>
        <Text style={[
          styles.title,
          {color: this.props.titleColor}
        ]}>{this.props.title}</Text>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  button: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
  },
});
