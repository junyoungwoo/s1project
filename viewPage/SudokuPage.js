import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, Button} from 'react-native';
import * as Progress from 'react-native-progress';
import CustomAnswerButton from './../custom/CustomAnswerButton';
import CustomNumberButton from './../custom/CustomNumberButton';


let emptyBox = 0;
let sudokuAnswer = [];
let sudokuArray = [];
let numBox = [];


export default class SudokuPage extends Component {
  constructor(props){
    super(props);
    const { navigation } = this.props;
    emptyBox = navigation.getParam('emptyBox');
    sudokuAnswer = navigation.getParam('sudokuAnswer');
    sudokuArray = navigation.getParam('sudokuArray');
    this.zeroToEmpty();

    this.state = {
      enemyHp : emptyBox,
      enemyHpGage : 1,
      myHp : 3,
      myHpGage: 1,
      selectIdx: -1,
      selectVal: 0,
      _sudokuArray: sudokuArray,
      visibleModal: false,
    };

    this.makeTableNumber();
  }

  zeroToEmpty(){
    for(let i=0; i < sudokuArray.length; i++){
      if(sudokuArray[i]==0){
        sudokuArray[i] = '';
      }
    }
  }

  makeTableNumber(idx){
    let j = 0;
    numBox = [];
    let boxCheck = false;
    for(let i=0; i<9; i++){
      let numRow = [];
      let isRow = false;
      while(j<81){
        let component2;

        let _rightBorder = (j%9 == 2 || j%9 == 5)?2:0.3;
        //선택한 박스영역 Color
        let _buttonColor = (j%9 == idx%9||this.doBoxCheck(idx,j))?'#cca951': null;
        // 선택숫자와 같은 숫자 Color
        if(this.isEqualValue(idx,j)){
          _buttonColor = '#b0d7f2';
        }
        // 선택숫자 Color
        if(j==idx){
          isRow = true;
          _buttonColor = '#62b5ef';
        };

        component2  = (
              <CustomNumberButton key={j} title={sudokuArray[j]} rightBorder={_rightBorder} buttonColor={_buttonColor} onPress={this.selectSudokuBox.bind(this,j)}/>
           );

        numRow.push(component2);
        if(j % 9 == 8){
          j++;
          break;
        };
        j++;
      }

      let rowColor = (isRow)?'#cca951':'#f7d580';
      console.log(i + '------------' + rowColor);
      let component1;
      if(i==2||i==5){
      component1 = (
        <View key={i} style={[styles.content_floor_line, {backgroundColor: rowColor}]}>
          { numRow }
        </View>
      );
      }else{
        component1 = (
          <View key={i} style={[styles.content_floor, {backgroundColor: rowColor}]}>
            { numRow }
          </View>
        );
      }
      numBox.push(component1)
    }
  }

  doBoxCheck(idx,i){
    let result = false;

    if(idx <= 26){
    	if(idx%9 <= 2){
      	if(i%9 <= 2 && i <=26){
          result = true;
        }
      }else if(idx%9 <= 5){
      	if(i%9 > 2 && i%9 <= 5 && i <=26){
          result = true;
        }
      }else if(idx%9 <= 8){
      	if(i%9 > 5 && i%9 <= 8 && i <=26){
          result = true;
        }
      }
    }else if(idx > 26 && idx <= 53){
    	if(idx%9 <= 2){
      	if(i%9 <= 2 && i > 26 && i <=53){
          result = true;
        }
      }else if(idx%9 <= 5){
      	if(i%9 > 2 && i%9 <= 5 && i <=53 && i > 26){
          result = true;
        }
      }else if(idx%9 <= 8){
      	if(i%9 > 5 && i%9 <= 8 && i <=53 && i > 26){
          result = true;
        }
      }
    }else if(idx > 53 && idx <= 80){
    	if(idx%9 <= 2){
      	if(i%9 <= 2 && i > 53 && i <=80){
          result = true;
        }
      }else if(idx%9 <= 5){
      	if(i%9 > 2 && i%9 <= 5 && i <=80 && i > 53){
          result = true;
        }
      }else if(idx%9 <= 8){
      	if(i%9 > 5 && i%9 <= 8 && i <=80 && i > 53){
          result = true;
        }
      }
    }
    return result;

  }

  isEqualValue(idx, j){
    if(sudokuArray[idx] == sudokuArray[j]){
      return true;
    }else{
      return false;
    }
  }

  reduceEnemyHp(){
    this.setState({
      enemyHp:this.state.enemyHp-1,
      enemyHpGage:this.state.enemyHpGage-(1/emptyBox)
    });
  }

  reduceMyHp(){
    this.setState({
      myHp:this.state.myHp-1,
      myHpGage:this.state.myHpGage-0.34
    });
  }

  checkAnswer(num){
    if(num == sudokuAnswer[this.state.selectIdx]){
      return true;
    }else{
      return false;
    }
  }

  selectSudokuBox(idx){
    console.log('idx = ' +  idx);
    this.setState({
      selectIdx:idx,
      selectVal:sudokuArray[idx]
    });
    this.makeTableNumber(idx);
  }

  updateArray(num){
    if(sudokuArray[this.state.selectIdx] == ''){
      for(let i=0; i<81; i++){
        if(i==this.state.selectIdx){
          sudokuArray[i] = num;
          break;
        }
      }
    }
    return sudokuArray;
  }

  submitAnswer(num){
    if(this.state.selectVal == ''){
      if(this.checkAnswer(num)){
        this.setState({
          _sudokuArray: this.updateArray(num)
        });
        this.makeTableNumber(this.state.selectIdx);
        this.reduceEnemyHp();
      }else{
        this.reduceMyHp();
      }
    }
  }

  modalControll(){

    this.setState({
      visibleModal: !this.state.visibleModal
    });
    console.log(this.state.visibleModal);
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.header_menu}><Button title={'menu'} onPress={()=> this.modalControll()}/></View>
          <View style={styles.header_main}>
            <View style={styles.header_main_up}></View>
            <View style={styles.header_main_bottom}>
              <Progress.Bar progress={this.state.enemyHpGage} width={100} indeterminateAnimationDuration={10}/>
              <Text>{this.state.enemyHp} / {emptyBox}</Text>
            </View>
          </View>
          <View style={styles.header_img}></View>
        </View>
        <View style={styles.content}>
          <View style={styles.content_table}>
            {numBox}
          </View>
        </View>
        <View style={styles.adContent}><Text>{this.state.selectIdx} / {this.state.selectVal}</Text></View>
        <View style={styles.footer}>
          <View style={styles.footer_front}>
            <View style={styles.footer_front_up1}></View>
            <View style={styles.footer_front_up2}>
              <Progress.Bar progress={this.state.myHpGage} width={50} indeterminateAnimationDuration={10}/>
              <Text>{this.state.myHp}/3</Text>
            </View>
            <View style={styles.footer_front_bottom}></View>
          </View>
          <View style={styles.footer_back}>
            <View style={styles.footer_back_up}>
              <CustomAnswerButton title={'1'} onPress={() => this.submitAnswer(1)}/>
              <CustomAnswerButton title={'2'} onPress={() => this.submitAnswer(2)}/>
              <CustomAnswerButton title={'3'} onPress={() => this.submitAnswer(3)}/>
              <CustomAnswerButton title={'4'} onPress={() => this.submitAnswer(4)}/>
              <CustomAnswerButton title={'5'} onPress={() => this.submitAnswer(5)}/>
            </View>
            <View style={styles.footer_back_bottom}>
              <CustomAnswerButton title={'6'} onPress={() => this.submitAnswer(6)}/>
              <CustomAnswerButton title={'7'} onPress={() => this.submitAnswer(7)}/>
              <CustomAnswerButton title={'8'} onPress={() => this.submitAnswer(8)}/>
              <CustomAnswerButton title={'9'} onPress={() => this.submitAnswer(9)}/>
              <CustomAnswerButton title={'메모'} onPress={() => alert('1')}/>
            </View>
          </View>
        </View>


      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'red'
  },
  header: {
    flex:1.5,
    flexDirection: 'row',
    backgroundColor: 'green'
  },
  header_menu: {
    flex:1,
    backgroundColor: 'grey'
  },
  header_main: {
    flex:3,
    backgroundColor: 'red'
  },
  header_img: {
    flex:1,
    backgroundColor: 'pink'
  },
  header_main_up: {
    flex:1,
    backgroundColor: 'blue'
  },
  header_main_bottom: {
    flex:1,
    backgroundColor: 'yellow',
    alignItems: 'center',
    justifyContent: 'center'
  },
  content: {
    flex:7,
    backgroundColor: 'blue',
    alignItems: 'center',
    justifyContent: 'center'
  },
  content_table: {
    width: '96%',
    height: '96%',
    backgroundColor: '#f7d580'
  },
  content_floor: {
    flex:1,
    flexDirection: 'row',
    borderBottomWidth: 0.3,
  },
  content_floor_line: {
    flex:1,
    flexDirection: 'row',
    borderBottomWidth: 2,
  },
  content_row: {
    flex:1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'yellow'
  },
  content_row_a: {
    flex:1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'red'
  },
  adContent: {
    flex:1,
    backgroundColor: 'yellow'
  },
  footer: {
    flex:2,
    flexDirection: 'row',
    backgroundColor: 'orange'
  },
  footer_front: {
    flex:2
  },
  footer_front_up1: {
    flex:1.5
  },
  footer_front_up2: {
    flex:1.5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 2
  },
  footer_front_bottom: {
    flex:8,
    borderWidth: 1
  },
  footer_back: {
    flex:7
  },
  footer_back_up: {
    flex: 1,
    flexDirection: 'row'
  },
  footer_back_bottom: {
    flex: 1,
    flexDirection: 'row'
  },
  modalDesign: {
    width: '70%',
    height: '60%',
    backgroundColor: 'grey'
  },
});
