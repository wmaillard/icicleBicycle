import React, { Component, PropTypes} from 'react';
import { View, Text, StyleSheet,   Dimensions, Navigator } from 'react-native';
import Camera from 'react-native-camera';

import { Button, Card, Toolbar } from 'react-native-material-design';

var serverUrl = 'https://api.cloudinary.com/v1_1/ochemaster/image/upload';
var up_preset = 'fty1rxtk';

export default class UseCamera extends Component {

  static propTypes = {
    onBack: PropTypes.func


  }
  render(){
    return (
    <View style ={{flex: 1}}>

      <View style ={{flex: 1}}>
            <Toolbar title={'Upload a Photo'} icon={'arrow-back'} onIconPress={this.props.onBack} />
      </View>
  

      <Camera
      	style = {{flex: 10}}
        ref={(cam) => {
          this.camera = cam;
        }}
        aspect={Camera.constants.Aspect.fill}
        captureTarget ={Camera.constants.CaptureTarget.temp}
        captureQuality = {Camera.constants.CaptureQuality.low}>

        <Text onPress = {this.takePicture.bind(this)}>[CAPTURE]</Text>
        <Text >Exit</Text>
      </Camera>
      </View>



    )
  }
  takePicture() {
    var goBack = this.props.onBack;
    this.camera.capture()
      .then(function(data){
        var xhr = new XMLHttpRequest();
        var body = new FormData();
        body.append('upload_preset', up_preset);
        body.append('file', {uri: data.path, type: "image/jpg", name: 'name'});
        body.append('tags', 'asdfasdffsdf, sdfgdfafsDF')
        xhr.open('POST', serverUrl);
        xhr.send(body);
        xhr.onreadystatechange = function(e){
          if(xhr.readyState !==4){
            return;
          }
          if(xhr.status === 200){

            alert('Successfully uploaded your photo');
            var res = JSON.parse(xhr.responseText);

          }else{
            console.log('******************');
            console.log(xhr.responseText);
            alert('Uploading your image failed :(')
            console.warn('error');

          }
        }

        goBack();

       //navigator.pop();

        })
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