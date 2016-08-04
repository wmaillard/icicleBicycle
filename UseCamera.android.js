import React, { Component, PropTypes} from 'react';
import { View, Text, StyleSheet,   Dimensions, Navigator, Image } from 'react-native';
import Camera from 'react-native-camera';

import { Button, Card, Toolbar } from 'react-native-material-design';


import {Surface} from "gl-react-native";
import GL from 'gl-react';
import {HelloGL} from './helloGL';




var serverUrl = 'https://api.cloudinary.com/v1_1/ochemaster/image/upload';
var up_preset = 'fty1rxtk';



export default class Preview extends Component {

  static propTypes = {
    onBack: PropTypes.func,
    globalNavigator: PropTypes.object,
    uri: PropTypes.string,
    filter: PropTypes.string


  }
  render(){

     helloGL = {frag: `
precision highp float;
varying vec2 uv;
uniform sampler2D image;
uniform float factor;
void main () {
  vec4 c = texture2D(image, uv);
  // Algorithm from Chapter 16 of OpenGL Shading Language
  const vec3 W = vec3(0.2125, 0.7154, 0.0721);
  gl_FragColor = vec4(mix(vec3(dot(c.rgb, W)), c.rgb, factor), c.a);
}
    `
  }
  var img = {uri: this.props.uri};
  var factor = 4;
  if(this.props.filter === '1'){
     factor = 1;
}



    return (
    <View  style ={{flex: 1}}>
    
      <View style ={{flex: 1}}>
            <Toolbar title={'Photo Preview'} icon={'arrow-back'} onIconPress={this.props.onBack} />
      </View>
      



      <View style ={{flex: 10}}>
        <Surface  width={400} height={500} ref = 'theImg'>
          <GL.Node shader = {helloGL}
            uniforms = {{factor: 3, image: img}}
          />
        </Surface>
                <View style ={{flexDirection: 'row'}}>
        <Button style={{flex:1}} text='Save and Upload' value = "NORMAL RAISED" raised={true} onPress = {this.capture.bind(this)} >
          </Button>
                <Button style={{flex:1}} text='Filter 2' value = "NORMAL RAISED" raised={true} onPress = {this.filter2.bind(this)}>
          </Button>
        </View>
      </View>

    </View>



    )
  }
  filter2(){
    var path = this.props.uri;
      this.props.globalNavigator.push({
            title: 'Preview',
            body: <Preview onBack = {() => {
              navigator.pop()}} globalNavigator = {navigator} 
              uri = {path} />,
            index: 4,
            outline: 'false', 
          })
  }
  capture(uri){
   const captureConfig = {
    quality: 1,
      type: "jpg",
      format: "base64"
    };
    this.refs.theImg
    .captureFrame(captureConfig)
    .then(captured =>{ 
      console.log(captured);
      this.uploadPic(captured);
      this.setState({ captured, captureConfig })});
  }
   uploadPic(uri){
    var xhr = new XMLHttpRequest();
        var body = new FormData();
        body.append('upload_preset', up_preset);
        body.append('file', uri);//{uri: uri, type: "image/jpg", name: 'name'});
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


  }
 
  
}


export default class UseCamera extends Component {

  static propTypes = {
    onBack: PropTypes.func,
    globalNavigator: PropTypes.object


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
        captureTarget ={Camera.constants.CaptureTarget.disk}
        captureQuality = {Camera.constants.CaptureQuality.med}
        orientation = {Camera.constants.Orientation.portrait}>

        <View style={{flex:5}}/>
        <Button style={{flex:1}} text='Take Picture and Upload' value = "NORMAL RAISED" raised={true} onPress={this.takePicture.bind(this)}>
        </Button>

      </Camera>
      </View>



    )
  }
 
  previewPic(uri){

  }
  takePicture() {
    var uploadPic = this.uploadPic;
    var goBack = this.props.onBack;
    var push = this.props.globalNavigator.push;
    var navigator = this.props.globalNavigator;
    this.camera.capture()
      .then(function(data){
        var path = data.path;
        console.log(data);

        push({
                  title: 'Preview',
                  body: <Preview onBack = {() => {
                    navigator.pop()}} globalNavigator = {navigator} 
                    uri = {path} />,
                  index: 4,
                  outline: 'false', 
                })
        //goBack();

        //goBack();


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
  },
  image: {
    flex: 10,
  },
});