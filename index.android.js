'use strict';
import React, { Component, PropTypes } from 'react';
import {
  AppRegistry,
  Dimensions,
  StyleSheet,
  Text,
  TouchableHighlight,
  View, 
  Navigator,
  Image
} from 'react-native';

import UseCamera from './UseCamera.android';
import Scenes from './Scenes.android';
import Camera from 'react-native-camera';
import mime from 'mime';
import fs from 'fs';
import util from 'util';





export default class icicleBicycle extends Component {
  render() {

    return (

    
      <Navigator
        style={{flex: 1, backgroundColor: 'blue'}}
        initialRoute={{ title: 'Home Page', index: 0, body: null}}
        renderScene={(route, navigator) =>
          <MyScene
            style={{flex: 1, backgroundColor: 'red'}}
            title={route.title}
            body = {route.body}

            // Function to call when a new scene should be displayed           
            onForward={ () => {


              /*
              fetch('https://api.cloudinary.com/v1_1/ochemaster/image/upload', {
                method: 'POST',
                headers: {
                  'Accept': 'application/json',
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                  file: 'yourValue',
                  secondParam: 'yourOtherValue',
                })
              })*/




              const nextIndex = route.index + 1;
              if(route.index == 2){
                navigator.push({
                  title: 'Camera',
                  body: <UseCamera />
                })
              }
              else{
                navigator.push({
                  title: 'Scene ' + nextIndex,
                  index: nextIndex,
                  body: <Text>Hey</Text>
                });
              }
            }}

            // Function to call to go back to the previous scene
            onBack={() => {
              if (route.index > 0) {
                navigator.pop();
              }
            }}
          />
        
      }
     
      />


    

    )
  }
}

class MyScene extends Component {
  static propTypes = {
    title: PropTypes.string.isRequired,
    onForward: PropTypes.func.isRequired,
    onBack: PropTypes.func.isRequired,
    body: PropTypes.element
  }
  render() {
    if(this.props.title === 'Camera'){
      console.log(this.props.body);
      return (this.props.body);
    }else{
      console.log(this.props.body);
      return (

        <View>

        <Image style= {styles.image} source={{uri: 'file:///data/user/0/com.iciclebicycle/cache/IMG_20160724_161401-1610158601.jpg'}}/>         
        <Text>Current Scene: { this.props.title }</Text>
          <TouchableHighlight onPress={this.props.onForward}>
            <Text>Tap me to load the next scene</Text>
          </TouchableHighlight>
          <TouchableHighlight onPress={this.props.onBack}>
            <Text>Tap me to go back</Text>
          </TouchableHighlight>
        </View>
      )
    }
  }
}


 


const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  preview: {
    flex: 1,
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    color: '#000',
    padding: 10,
    margin: 40
  },
    image: {
    width: 100,
    height: 100,
    margin: 10,
  },
});

AppRegistry.registerComponent('icicleBicycle', () => icicleBicycle);