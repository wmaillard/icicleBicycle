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
  ScrollView,
  BackAndroid,
  ListView,
  AsyncStorage
} from 'react-native';

import { Button, Card, Toolbar } from 'react-native-material-design';

import UseCamera from './UseCamera.android';
import Scenes from './Scenes.android';
import Camera from 'react-native-camera';

var Auth0Lock = require('react-native-lock');
var lock = new Auth0Lock({clientId: '4ZoVxGUVM5bFO0PA8C6xk409IbRl6JO0', domain: 'maillard.auth0.com'});

const base64 = require('base-64');


var username = '717148529973165';
var password = 'xAEaowxg95A2fpNk-yUVvULqOiA';
var serverUrl = 'https://api.cloudinary.com/v1_1/ochemaster/resources/image?max_results=100';

/*var nickName = 'wmaillard';
var userId = 'auth0|57a64bc925e541296cf59303';
var idToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpc3MiOiJodHRwczovL21haWxsYXJkLmF1dGgwLmNvbS8iLCJzdWIiOiJhdXRoMHw1N2E2NGJjOTI1ZTU0MTI5NmNmNTkzMDMiLCJhdWQiOiI0Wm9WeEdVVk01YkZPMFBBOEM2eGs0MDlJYlJsNkpPMCIsImV4cCI6MTQ3MDYzNDc4NCwiaWF0IjoxNDcwNTk4Nzg0fQ.WO8_x-8vpTJk4oVwY9xAsEQBGK3Vrf8TfblCISit80U';
var loggedIn = true;*/



getUserInfo(function(userInfo, err){

	if(!userInfo || userInfo.loggedIn === false){
		lock.show({}, loginCallback);
	}
});

export default class icicleBicycle extends Component {
	  render() {
	  	

    return (

    
      <Navigator
        style={{flex: 1, backgroundColor: 'powderblue'}}
        initialRoute={{wordTitle: 'PhotoShare', title: 'PhotoShare', index: 0, body: null, outline: 'true'}}
        renderScene={(route, navigator) =>
        <MyScene
            outline={route.outline}
            style={{flex: 1, backgroundColor: 'powderblue'}}
            wordTitle={route.wordTitle}
            title={route.title}
            body = {route.body}
            galleryData = {route.galleryData}

            // Function to call when a new scene should be displayed           
            onGallery ={ () => {
                console.log(typeof navigator);
                BackAndroid.addEventListener('hardwareBackPress', function() {
                   navigator.pop();
                   return true;
                });

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

                    var responseJson = JSON.parse(request.responseText);
                    var titleM = 'Gallery';

                    getUserInfo(function(userInfo, err){

						if(!userInfo || userInfo.loggedIn === false){
							console.log('hey*************', userInfo);
							 navigator.push({
		        			  wordTitle: titleM,		
		                      title: 'Gallery',
		                      index: 3,
		                      outline: 'true',
		                      galleryData: responseJson.resources
		                    })
							return;
						}else{
 							titleM = userInfo.nickName + "'s Gallery";
							 navigator.push({
		        			  wordTitle: titleM,		
		                      title: 'Gallery',
		                      index: 3,
		                      outline: 'true',
		                      galleryData: responseJson.resources
		                    })
						}
					});

                   
                  
                  } else {
                    console.warn('error');
                    console.log('************request******************');
                    console.log(request);
                    console.warn(request.responseText);
                  }
                };




            }}

            onAddImage ={ () => {
                  BackAndroid.addEventListener('hardwareBackPress', function() {
                       navigator.pop();
                       return true;
                });

                navigator.push({
                  title: 'Camera',
                  body: <UseCamera onBack = {() => {
                    navigator.pop()}} globalNavigator = {navigator} />,
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
class Gallery extends Component {




}




class MyScene extends Component {



  static propTypes = {
    title: PropTypes.string.isRequired,
    onGallery: PropTypes.func,
    onAddImage: PropTypes.func,
    onBack: PropTypes.func,
    body: PropTypes.element,
    outline: PropTypes.string,
    galleryData: PropTypes.array,
    wordTitle: PropTypes.string

  }

  render() {
    if(this.props.title === 'Gallery'){
    	console.log('****************', this.props.wordTitle);
        var data = this.props.galleryData;

        var reduceQuality = function(uri){
          console.log('****************************', uri);
          //uri = uri.rowData;
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



        var urls = [];
        for(var i = 0; i < data.length; i++){
          urls.push(data[i].url);
        }

        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => {
          r1 !== r2}});
        this.state = {
          dataSource: ds.cloneWithRows(urls)
        };

      return (


          <View style ={{flex: 1}}>
          <View style ={{flex: 1}}>
            <Toolbar title={this.props.wordTitle} icon={'arrow-back'} onIconPress={this.props.onBack} />
            </View>

          <ListView contentContainerStyle = {{justifyContent: 'center', alignItems: 'center'}}
          style={{backgroundColor: 'powderblue',  flex: 10, flexWrap: 'wrap'}}
          dataSource={this.state.dataSource}
          renderRow={(rowData) => {
            return <Image style= {styles.image} source={{uri: reduceQuality(rowData)}}/>
            }
          }
            />
          </View>


        )
    }

    else if(this.props.title === 'Camera'){
      return(this.props.body);
    }
    else if(this.props.title === 'Preview'){
      return(this.props.body);
    }




    else{

      return (
        <View>
        <View style ={{flex: 1}}>
          <Toolbar title={this.props.title}>
          </Toolbar>
        </View>
        <View style ={{flex: 9}}>
          <Card>
              <Card.Media
                  image={<Image style = {styles.image}  source={require('./img/welcome.jpg')} />}
                  height={300}
                  overlay
              />
              <Card.Body>
                  <Text>Welcome to our image sharing app!  Add an image to our gallery by pressing 'Add Image' or view our user's images 
                  by pressing 'Gallery'</Text>
              </Card.Body>

          </Card>       

          <Button  text='Gallery' value = "NORMAL RAISED" raised={true} onPress={this.props.onGallery}>
          </Button>
          <Button  text='Add Image' value = "NORMAL RAISED" raised={true} onPress={this.props.onAddImage}>
          </Button>
          <Button  text='Log Out' value = "NORMAL RAISED" raised={true} onPress={function(){
          	setUserInfo(null);
          	lock.show({}, loginCallback)}}>
          </Button>
          </View>
        </View>
      )
    }
  }
}

function loginCallback(err, profile, token){
	  if (err) {
	    console.log(err);
	    return false;
	  }
	  // Authentication worked!
	  var userInfo = {};
	  userInfo.userId = profile.userId;
	  userInfo.nickName = profile.nickname;
	  userInfo.idToken = token.idToken;
	  userInfo.loggedIn = true;
	  setUserInfo(userInfo, function(userInfo, error){
	  	console.log(userInfo);
	  	if(error){
	  		console.log('Error: ', error);
	  	}
	  });

	 // console.log('Logged in with Auth0!');
	  console.log('Profile: ', profile);
	  console.log('Token: ', token);
	  return true;


	};
 
async function setUserInfo(userInfo, callback){
	try{
		userInfo = JSON.stringify(userInfo);
		await AsyncStorage.setItem('@IceBikeUserInfo', userInfo);
		callback(userInfo);
	}catch(error){
		console.log('Problem storing user info');
		callback(userInfo, error);
	}

}
async function getUserInfo(callback){
	try{
		var userInfo = await AsyncStorage.getItem('@IceBikeUserInfo');
		userInfo = JSON.parse(userInfo);
		callback(userInfo);
	}catch(error){
		console.log('Problem getting userInfo');
		callback(userInfo, false)
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
