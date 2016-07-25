import React, { Component } from 'react';
import { View, Text, StyleSheet,   Dimensions } from 'react-native';
import Camera from 'react-native-camera';

export default class UseCamera extends Component {
  render(){
    return (
 
      <Camera
      	style = {{flex: 1}}
        ref={(cam) => {
          this.camera = cam;
        }}
        aspect={Camera.constants.Aspect.fill}
        captureTarget ={Camera.constants.CaptureTarget.temp}>

        <Text onPress={this.takePicture.bind(this)}>[CAPTURE]</Text>
      </Camera>

    )
  }
  takePicture() {
    this.camera.capture()
      .then((data) => console.log(data))
      .catch(err => console.error(err));
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
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
  }
});