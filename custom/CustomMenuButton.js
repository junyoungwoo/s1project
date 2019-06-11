// CustomButton
import React, { Component } from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  Image,
} from 'react-native';


export default class CustomMenuButton extends Component{
  static defaultProps = {
    menuKind: '',
    onPress: () => null,
  }

  constructor(props){
    super(props);
    this.imgSource = this.menuKindImg();
  }

  menuKindImg() {
    if(this.props.menuKind == 'menu'){
      return require('./../img/menu.jpg')
    }
  }

  render(){
    return (
      <TouchableOpacity style={ styles.button }
      onPress={this.props.onPress}>
      <Image
            style={{height:'100%',width:'100%'}}
            source={this.imgSource}/>
      </TouchableOpacity>
    )
  }
}

const styles = StyleSheet.create({
  button: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 3,
    borderRadius: 5
  },
  title: {
    fontSize: 15,
  },
});
