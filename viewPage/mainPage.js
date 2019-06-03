import React, { Component } from 'react';
import { Text, View, Button } from 'react-native';

let sudokuArray = [];
let possibleCaseArray = [];
let backtracking = false;
let possibleCaseStack = new Array(81);
let sudokuAnswer = null;
let cutStack = [];
let cut = 0;

export default class mainPage extends Component {
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
      <View
        style={{
          flex:1,
          backgroundColor:'grey',
          alignItems:'center',
          justifyContent:'center'
        }}
      >
          <Text> one </Text>
          <Button title='1'
          onPress={() => this.startGame(2)}
          color='#fff'
          />
          <Text> two </Text>
          <Button title='2'
          onPress={() => this.startGame(3)}
          color='#fff'
          />
      </View>
    );
  }
}
