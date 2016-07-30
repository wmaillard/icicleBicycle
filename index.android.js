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
const base64 = require('base-64');


var username = '717148529973165';
var password = 'xAEaowxg95A2fpNk-yUVvULqOiA';
var serverUrl = 'https://api.cloudinary.com/v1_1/ochemaster/resources/image';



export default class icicleBicycle extends Component {
  render() {

    return (

    
      <Navigator
        style={{flex: 1, backgroundColor: 'blue'}}
        initialRoute={{ title: 'Home Page', index: 0, body: null, outline: 'true'}}
        renderScene={(route, navigator) =>
          <MyScene
            outline={route.outline}
            style={{flex: 1, backgroundColor: 'red'}}
            title={route.title}
            body = {route.body}

            // Function to call when a new scene should be displayed           
            onGallery ={ () => {
                console.log('********************');


               var creds = base64.encode(username + ':' + password);

                var request = new XMLHttpRequest();
                request.open('GET', serverUrl);
                request.setRequestHeader("Authorization", "Basic " + creds);

                request.send();

                request.onreadystatechange = (e) => {
                  if (request.readyState !== 4) {
                    return;
                  }

                  if (request.status === 200) {
                    console.log(request.responseText);
                    console.log('************************');
                    var responseJson = JSON.parse(request.responseText);
                    console.log(responseJson.resources);
                    var images = "";
                    for(var i = 0; i < responseJson.resources.length; i++){
                      images +=  "<Image style= {styles.image} source={{uri:" + responseJson.resources[i].url + "}}/>"

                    }
                    navigator.push({
                      title: 'Gallery',
                      body: images,
                      index: 3,
                      outline: 'true'
                    })
                  
                    console.log('success', request.responseText);
                  } else {
                    console.warn('error');
                    console.log('************request******************');
                    console.log(request);
                    console.warn(request.responseText);
                  }
                };




            }}

            onAddImage ={ () => {

                navigator.push({
                  title: 'Camera',
                  body: <UseCamera />,
                  index: 1,
                  outline: 'false'
                })

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
    onGallery: PropTypes.func.isRequired,
    onAddImage: PropTypes.func.isRequired,
    onBack: PropTypes.func.isRequired,
    body: PropTypes.element,
    outline: PropTypes.string.isRequired

  }
  render() {
    if(this.props.title === 'Gallery'){
      console.log(this.props.body);
      return (       
       <View>
        <Image style= {styles.image} source={{uri: 'file:///data/user/0/com.iciclebicycle/cache/IMG_20160724_161401-1610158601.jpg'}}/>         
        <Text>Title: </Text>
      </View>);
    }






    else{
      console.log(this.props.body);
      return (

        <View>

        <Image style= {styles.image} source={{uri: 'file:///data/user/0/com.iciclebicycle/cache/IMG_20160724_161401-1610158601.jpg'}}/>         
        <Text>Current Scene: { this.props.title }</Text>
          <TouchableHighlight onPress={this.props.onGallery}>
            <Text>Gallery</Text>
          </TouchableHighlight>
          <TouchableHighlight onPress={this.props.onAddImage}>
            <Text>Add Image</Text>
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
