import React, { Component } from 'react';
import { Text, View, Button, StyleSheet, Platform } from 'react-native';
import CustomLevelButton from './../custom/CustomLevelButton';
import AsyncStorage from '@react-native-community/async-storage';

let sudokuArray = [];
let possibleCaseArray = [];
let backtracking = false;
let possibleCaseStack = new Array(81);
let sudokuAnswer = null;
let cutStack = [];
let cut = 0;
let _mapLevel = [];

//let userLevel = 1;

export default class mainPage extends Component {
  constructor(props) {
    super(props);
    const { navigation } = this.props;
     this.state = {
       userLevel: 0,
       mapLevel : [],
       levelBox: [],
     };
   this.getValue().then(() => {
      this.makeLevelList();
      this.makeLevelTable();
   });
  }
  makeLevelList() {
    console.log("makeLevelList");
    console.log("typeof userLevel = " + typeof userLevel);
    _userLevel = parseInt(this.state.userLevel);
    console.log(typeof _userLevel);
    for(let i=0; i<20; i++){
      if(i<_userLevel){
        console.log("true");
        _mapLevel.push({level:i+1,empty:i+2,isClear:true});
      }else{
        console.log("false");
        _mapLevel.push({level:i+1,empty:i+2,isClear:false});
      }
      console.log("mapLevel = " + _mapLevel[i].level );
    }
    this.setState({
      mapLevel:_mapLevel
    });
  }

  // userlevel을 조회 조회데이터가 없으면 1로 저장
  getValue = async () => {
    try {
      const value = await AsyncStorage.getItem('@User_level')
      console.log('조회완료');
      console.log(value);
      this.setState({
        userLevel: value
      });
    } catch(e) {
      console.log('조회안됨');
      this.setValue();
    }
  }

  setValue = async () => {
    try {
      await AsyncStorage.setItem('@User_level', '1');
      console.log('저장완료');
    } catch(e) {
      console.log('저장실패');
    }

  }

  makeLevelTable() {
    console.log("makeLevelTable");
    let j = 0;
    let _levelBox = [];
    for(let i=0; i<5; i++){
      let levelRow = [];
      let isRow = false;
      while(j<20){
        console.log(this.state.mapLevel[j].empty);
        let component2;

        component2  = (
              <CustomLevelButton key={j}
              onPress={this.startGame.bind(this,this.state.mapLevel[j].empty)}
              isClear={this.state.mapLevel[j].isClear}/>
           );

        levelRow.push(component2);
        if(j % 4 == 3){
          j++;
          break;
        };
        j++;
      }

      let component1;
      component1 = (
        <View key={i} style={styles.content_floor}>
          { levelRow }
        </View>
      );
      _levelBox.push(component1)
    }
    this.setState({
      levelBox:_levelBox
    })
  }

  startGame(emptyBox) {
    cut = emptyBox;
    sudokuArray = this.makeSudokuArray();
    possibleCaseArray = this.makePossibleCaseArray();
    possibleCaseArray = this.shufflePossibleCaseArray(possibleCaseArray);
    this.searchValidAnswer();
    sudokuAnswer = this.copySudokuAnswer(sudokuArray);
    while(true){
  		if(cutStack.length==cut) break;
  		this.cutNumbers();
  	}
    possibleCaseArray = this.checkPossibleNumbers();
    console.log("sudokuArray = " + sudokuArray);
    console.log("sudokuAnswer = " + sudokuAnswer);
    console.log("possibleCaseArray = " + possibleCaseArray);
  	possibleCaseStack.push(this.copy2DArray(possibleCaseArray));

    this.props.navigation.navigate("Game",{
      userLevel: this.state.userLevel,
      emptyBox: emptyBox,
      sudokuArray: sudokuArray,
      sudokuAnswer: sudokuAnswer,
    });
  }

  makeSudokuArray(){
  	let array = new Array(81);
  	for(let i=0; i<array.length; i++){
  		array[i] = 0;
  	};
    return array;
  }

  makePossibleCaseArray(){
    let possibleCaseArray = new Array(81);
  	for(let i=0; i<possibleCaseArray.length; i++){
  		possibleCaseArray[i] = [1,2,3,4,5,6,7,8,9];
  	}
  	return possibleCaseArray;
  }

  shufflePossibleCaseArray(array){
  	let tempArray = new Array(array.length);
  	for(let i=0; i<array.length; i++){
  		tempArray[i] = this.shuffle(array[i].slice());
  	}
  	return tempArray;
  }

  shuffle(array) {

  	let currentIndex = array.length, temporaryValue, randomIndex;

  	while (0 !== currentIndex) {
  	  randomIndex = Math.floor(Math.random() * currentIndex);
  	  currentIndex -= 1;
  	  temporaryValue = array[currentIndex];
  	  array[currentIndex] = array[randomIndex];
  	  array[randomIndex] = temporaryValue;
  	}
  	return array;
  }

  searchValidAnswer(){
  	let i=0;
  	while(true){
  		if(i>80) break;
  		else if(backtracking){
  			this.undoSudokuArray(i);
  			backtracking = false;
  		}else{
  			i = this.fillSudokuArray(i);
  		}
  	}
  }

  undoSudokuArray(i){
  	let presentNumber = sudokuArray[i];
  	sudokuArray[i] = 0;
  	possibleCaseStack[i] = null;
  	possibleCaseArray = this.copy2DArray(possibleCaseStack[i-1]);
  	for(let cnt=0; cnt<possibleCaseArray[i].length; cnt++){
  		if(possibleCaseArray[i][cnt]==presentNumber)
  			possibleCaseArray[i].splice(cnt,1);
  	}
  	possibleCaseStack[i-1] = this.copy2DArray(possibleCaseArray);

  }

  copy2DArray(array2D){
  	var tempArray = new Array(array2D.length);
  	for(var i=0; i<tempArray.length; i++){
  		if(array2D[i]!=null)
  			tempArray[i] = array2D[i].slice();
  		else
  			tempArray[i] = null;
  	}
  	return tempArray;
  }

  fillSudokuArray(i){
  	if(possibleCaseArray[i].length==0){
  		backtracking = true;
  		return i-1;
  	}
  	let presentNumber = possibleCaseArray[i].pop();
  	sudokuArray[i] = presentNumber;
  	this.remove(i,presentNumber);
  	possibleCaseStack[i] = this.copy2DArray(possibleCaseArray);
  	return i+1;
  }

  remove(ii,num){
  	let i = Math.floor(ii/9);
  	let j = ii%9;
  	this.colRemove(i,j,num);
  	this.rowRemove(i,j,num);
  	this.boxRemove(i,j,num);
  }

  colRemove(i,j,num){
  	for(let cnt=0; cnt<9; cnt++){
  		this.removeNumber(cnt,j,num);
  	}
  }

  rowRemove(i,j,num){
  	for(let cnt=0; cnt<9; cnt++){
  		this.removeNumber(i,cnt,num);
  	}
  }

  boxRemove(i,j,num){
  	let box=0, mi=0, mj=0;
  	if(i<3){
  		if(j<3) box=1;
  		else if(j<6) box=2;
  		else box=3;
  	} else if(i<6){
  		if(j<3) box=4;
  		else if(j<6) box=5;
  		else box=6;
  	} else{
  		if(j<3) box=7;
  		else if(j<6) box=8;
  		else box=9;
  	}

  	switch(box){
  	case 1:
  		mi=0, mj=0;
  		break;
  	case 2:
  		mi=0, mj=3;
  		break;
  	case 3:
  		mi=0, mj=6;
  		break;
  	case 4:
  		mi=3, mj=0;
  		break;
  	case 5:
  		mi=3, mj=3;
  		break;
  	case 6:
  		mi=3, mj=6;
  		break;
  	case 7:
  		mi=6, mj=0;
  		break;
  	case 8:
  		mi=6, mj=3;
  		break;
  	case 9:
  		mi=6, mj=6;
  		break;
  	}

  	for(var mii=mi; mii<mi+3; mii++){
  		for(var mjj=mj; mjj<mj+3; mjj++){
  			this.removeNumber(mii,mjj,num);
  		}
  	}
  }

  removeNumber(ii,jj,num){
  	for(let cnt=0; cnt<possibleCaseArray[ii*9+jj].length; cnt++){
  		if(possibleCaseArray[ii*9+jj][cnt]==num){
  			possibleCaseArray[ii*9+jj].splice(cnt,1);
  		}
  	}
  }

  copySudokuAnswer(array){
  	let tempArray = new Array(81);
  	tempArray = array.slice();
  	return tempArray;
  }

  cutNumbers(){
  	let key = Math.floor(Math.random()*81); // 0~80
  	for(let cnt=0; cnt<cutStack.length; cnt++){
  		if(key == cutStack[cnt])
  			return;
  	}
  	sudokuArray[key]=0;
  	cutStack.push(key);
  }

  checkPossibleNumbers(){
  	let tempArray = new Array(81);
  	for(let i=0; i<tempArray.length; i++){
  		tempArray[i] = [1,2,3,4,5,6,7,8,9];
  	}

  	for(let i=0; i<cutStack.length; i++){
  		let key = cutStack[i];
  		let ii = Math.floor(key/9);
  		let jj = key%9;

  		// row test
  		for(let mj=0; mj<9; mj++){
  			for(let cnt=0; cnt<tempArray[key].length; cnt++){
  				if(sudokuArray[ii*9+mj]==tempArray[key][cnt])
  					tempArray[key].splice(cnt,1);
  			}
  		}
  		// column test
  		for(let mi=0; mi<9; mi++){
  			for(let cnt=0; cnt<tempArray[key].length; cnt++){
  				if(sudokuArray[mi*9+jj]==tempArray[key][cnt])
  					tempArray[key].splice(cnt,1);
  			}
  		}
  		// 33box test
  		let box=0, mi=0, mj=0;
  		if(ii<3){
  			if(jj<3) box=1;
  			else if(jj<6) box=2;
  			else box=3;
  		} else if(ii<6){
  			if(jj<3) box=4;
  			else if(jj<6) box=5;
  			else box=6;
  		} else{
  			if(jj<3) box=7;
  			else if(jj<6) box=8;
  			else box=9;
  		}

  		switch(box){
  		case 1:
  			mi=0, mj=0;
  			break;
  		case 2:
  			mi=0, mj=3;
  			break;
  		case 3:
  			mi=0, mj=6;
  			break;
  		case 4:
  			mi=3, mj=0;
  			break;
  		case 5:
  			mi=3, mj=3;
  			break;
  		case 6:
  			mi=3, mj=6;
  			break;
  		case 7:
  			mi=6, mj=0;
  			break;
  		case 8:
  			mi=6, mj=3;
  			break;
  		case 9:
  			mi=6, mj=6;
  			break;
  		}

  		for(let mii=mi; mii<mi+3; mii++){
  			for(let mjj=mj; mjj<mj+3; mjj++){
  				for(var cnt=0; cnt<tempArray[key].length; cnt++){
  					if(sudokuArray[mii*9+mjj]==tempArray[key][cnt])
  						tempArray[key].splice(cnt,1);
  				}
  			}
  		}
  	}

  	return tempArray;
  }

  render() {
      return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.header_menu}></View>
          <View style={styles.header_main}>
          </View>
          <View style={styles.header_img}></View>
        </View>
        <View style={styles.content}>
          <View style={styles.content_table}>
          {this.state.levelBox}
          </View>
        </View>

        <View style={styles.footer}>
          <View style={styles.footer_front} >
          </View>
          <View style={styles.footer_empty} >
          </View>
          <View style={styles.footer_back} >
          </View>
        </View>
        <View style={styles.adContent}></View>
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
  content: {
    flex:7.5,
    backgroundColor: 'blue',
    alignItems: 'center',
    justifyContent: 'center'
  },
  content_table: {
    width: '85%',
    height: '96%',
    backgroundColor: '#f7d580'
  },
  content_floor: {
    flex:1,
    flexDirection: 'row',
    margin: 3,
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
    flex:1.5,
    flexDirection: 'row',
    backgroundColor: 'orange'
  },
  footer_front: {
    flex:2
  },
  footer_empty: {
    flex:6
  },
  footer_back: {
    flex:2
  },

  modalDesign: {
    width: '70%',
    height: '60%',
    backgroundColor: 'grey'
  },
  tennisBall: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'greenyellow',
    borderRadius: 100,
    width: 50,
    height: 50,
    position: 'absolute'
  },
});
