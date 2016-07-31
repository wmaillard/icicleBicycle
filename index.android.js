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
  Image,
  ScrollView
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
        style={{flex: 1, backgroundColor: 'powderblue'}}
        initialRoute={{ title: 'Home Page', index: 0, body: null, outline: 'true'}}
        renderScene={(route, navigator) =>
          <MyScene
            outline={route.outline}
            style={{flex: 1, backgroundColor: 'red'}}
            title={route.title}
            body = {route.body}
            galleryData = {route.galleryData}

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
                   // console.log(request.responseText);
                   // console.log('************************');
                    var responseJson = JSON.parse(request.responseText);
                  //  console.log(responseJson.resources);
                  /*  var images = "";
                    for(var i = 0; i < 2; i++){ //responseJson.resources.length
                      images +=  "<Image style= {styles.image} source={{uri:" + responseJson.resources[i].url + "}}/>"

                    }*/

                   // var inner = {__html: images};
                    navigator.push({
                      title: 'Gallery',
                      body: <Text>Hey</Text> ,
                      index: 3,
                      outline: 'true',
                      galleryData: responseJson.resources
                    })
                  
                    console.log('success');
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
                  body: <UseCamera onBack = {() => {
                    navigator.pop()}} />,
                  index: 1,
                  outline: 'false', 
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
    onGallery: PropTypes.func,
    onAddImage: PropTypes.func,
    onBack: PropTypes.func,
    body: PropTypes.element,
    outline: PropTypes.string,
    galleryData: PropTypes.array

  }
  render() {
    if(this.props.title === 'Gallery'){
        var data = this.props.galleryData;

        var reduceQuality = function(uri){
          var whole = uri.split('/');
          var left = "http://";
          var right = "";
          for(var i = 2; i < whole.length - 2; i++){
            left += whole[i] + '/';
          }
          for(var i = whole.length - 2; i < whole.length; i++){
            right += whole[i];
            if(i != whole.length - 1){
              right += '/';
            }
          }
          return left + 'q_50,w_500,h_500,c_fill/' + right;
        }



        var imgs1 = [];
        var imgs2 = [];
        var imgs3 = [];



        for(var i = 0; i < data.length; i++){
          if(i % 3 == 0){
           imgs1.push(<Image style= {styles.image} source={{uri: reduceQuality(data[i].url)}}/>);
         }
          else if(i % 3 == 1) {
            imgs2.push(<Image style= {styles.image} source={{uri: reduceQuality(data[i].url)}}/>);
          }
          else {
            imgs3.push(<Image style= {styles.image} source={{uri: reduceQuality(data[i].url)}}/>);
          }

        }


        var theGallery = function(theImgs){
          return(
              [theImgs]

          )
        }


      return (


          <View style ={{flex: 1}}>
            <View style = {{flex: 1}}>
              <Text>Gallery</Text>
            </View>
            <ScrollView contentContainerStyle = {{justifyContent: 'center', alignItems: 'center'}} style={{  flex: 6, flexWrap: 'wrap', backgroundColor: 'blue'}}>

                {theGallery(imgs1)}
                {theGallery(imgs2)}
                {theGallery(imgs3)}


           
            </ScrollView>
          </View>


        )
    }

    else if(this.props.title === 'Camera'){
      return(this.props.body);
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
    flex: 1,

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
    width: 200,
    height: 200,
    margin: 10,
  },
});

AppRegistry.registerComponent('icicleBicycle', () => icicleBicycle);
