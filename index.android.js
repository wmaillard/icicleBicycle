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
  AsyncStorage,
  Modal
} from 'react-native';

import { Button, Card, Toolbar } from 'react-native-material-design';

import UseCamera from './UseCamera.android';  //These have to be capitalized, stop forgetting
import Scenes from './Scenes.android';
import Camera from 'react-native-camera';
import EditPhoto from './editPhoto.android';

var Auth0Lock = require('react-native-lock');
var lock = new Auth0Lock({clientId: '4ZoVxGUVM5bFO0PA8C6xk409IbRl6JO0', domain: 'maillard.auth0.com'});
var t = require('tcomb-form-native');
var Form = t.form.Form;

const base64 = require('base-64');


var username = '717148529973165';
var password = 'xAEaowxg95A2fpNk-yUVvULqOiA';
var serverUrl = 'https://api.cloudinary.com/v1_1/ochemaster/resources/image?max_results=100';
var myServerURL = 'http://photorest666.herokuapp.com';

var globalNavigator = {};
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
            userData = {route.userData}
            userInfo = {route.userInfo}
            photoData = {route.photoData}
            globalNavigator = {route.globalNavigator}


            // Function to call when a new scene should be displayed           
            onGallery ={ () => {
            	globalNavigator = navigator;
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
                  getUserInfo(function(userInfo, err){

                     console.log('hey*************', userInfo);
                    
                    

                  fetch(myServerURL + '/user/' + userInfo.id, {
                    method: "GET",
                    headers: {
                      'Content-Type' : 'application/json',
                      'Authorization': 'Bearer ' + userInfo.token,
                      'Data-Type': 'application/json'

                    }
                  })
                  .then(function(response){
                    if(response.ok){
                      console.log('hurray!!!!!!');
                      console.log(response._bodyText);
                      var userData = JSON.parse(response._bodyText);
                      console.log(userData);
                      var titleM = userInfo.nickName + "'s Gallery";
                      var photosData = [];
                      if(userData.photos.length === 0){

                      	navigator.push({
                            wordTitle: titleM,    
                            title: 'Gallery',
                            index: 3,
                            outline: 'true',
                            galleryData: [],
                            userInfo: userInfo,
                            globalNavigator: {navigator}
                                })
                            }


                      else{
                      for(var i = 0; i < userData.photos.length; i++){

                        fetch(myServerURL + '/photo/' + userData.photos[i], {
                          method: "GET",
                          headers: {
                          'Content-Type' : 'application/json',
                          'Authorization': 'Bearer ' + userInfo.token,
                          'Data-Type': 'application/json'

                          }
                        })
                      .then(function(response){
                        if(response.ok){
                          var photoD = JSON.parse(response._bodyText);
                          photosData.push(photoD);
                          console.log('photoD: ', photoD);
                          if(photosData.length == userData.photos.length){
                          	console.log('Navigator: ')
                          	console.log(navigator);
                            navigator.push({
	                            wordTitle: titleM,    
	                            title: 'Gallery',
	                            index: 3,
	                            outline: 'true',
	                            galleryData: photosData,
	                            userInfo: userInfo,
	                            globalNavigator: {navigator}
                            })

                          }
                        }
                      })
                    }



                      return;


                    }
                }
                    else{
                      console.log('Network response was not 200');
                      console.log(response);
                    }
                  })
                  .catch(function(error){
                    console.log('Error: ' + error)
                  })
                  .done();
            })
          						
					}}
        }

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




class MyScene extends Component {



  static propTypes = {
    title: PropTypes.string.isRequired,
    onGallery: PropTypes.func,
    onAddImage: PropTypes.func,
    onBack: PropTypes.func,
    body: PropTypes.element,
    outline: PropTypes.string,
    galleryData: PropTypes.array,
    wordTitle: PropTypes.string,
    userData: PropTypes.object,
    userInfo: PropTypes.object,
    globalNavigator: PropTypes.object
  }


      //This is how you refresh views, finally found it!  Sets state and refreshes referenced data

  
  render() {
    if(this.props.title === 'Gallery'){
    	console.log('****************', this.props.wordTitle);


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





        const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => {
          r1 !== r2}});
        this.state = {
          dataSource: ds.cloneWithRows(this.props.galleryData),
          modalVisible: false
        };

        function deletePhoto(){
			console.log('^^^^^^^^^^^^');
			alert('Deleted your photo with id: '+ this.id);
			this.goBack();
            fetch(myServerURL + '/photo/' + this.id, {
              method: "Delete",
              headers: {
              'Content-Type' : 'application/json',
              'Authorization': 'Bearer ' + this.userInfo.token,
              'Data-Type': 'application/json'

              }
            })
          .then(function(response){
            if(response.ok){
              console.log('Deleted Photo');
          }else{
          	console.log('Error: ', response)
          }
      })
			

		}



	function editPhotoButton() {

          /*		onBack: PropTypes.func,
		userInfo: PropTypes.object,  //userInfo.token is what you want
		photoInfo: PropTypes.object*/
        globalNavigator.push({
          title: 'Edit Photo',
          body: <EditPhoto goBack = {this.goBack} userInfo = {this.userInfo} photoData = {this.photoData} />, //
          index: 6,
          outline: 'false', 
        })
    }


      return (


          <View style ={{flex: 1}}>








          <View style ={{flex: 1}}>
            <Toolbar title={this.props.wordTitle} icon={'arrow-back'} onIconPress={this.props.onBack} />
           </View>

          <ListView 
          style={{ backgroundColor: 'powderblue',  flex: 10}}
          dataSource={this.state.dataSource}
          renderRow={(rowData) => {
            return (
              <View>
            <Card >
              <Card.Media
                  image={<Image style= {styles.image} source={{uri: reduceQuality(rowData.url)}}/>}
                  height={300}
                  width= {300}

                  overlay
              />
              <Card.Body>
                  <Text>Title: {rowData.title}</Text>
                  <Text>Location: {rowData.id}</Text>
              </Card.Body>

          </Card>       

          <Button  text='Edit Image Info' value = "NORMAL RAISED" raised={true} onPress={editPhotoButton.bind({goBack: this.props.onBack, photoData: rowData, globalNavigator: this.props.globalNavigator, userInfo: this.props.userInfo})}>

          </Button>
          <Button  text='Delete Image' value = "NORMAL RAISED" raised={true} onPress={deletePhoto.bind({id: rowData.id, goBack: this.props.onBack, userInfo: this.props.userInfo})}>
          </Button>

              
          </View>

              )
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
    else if(this.props.title === 'Edit Photo'){
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
    console.log(profile);
	  var userInfo = {};
	  userInfo.id = profile.userId;
	  userInfo.nickName = profile.nickname;
	  userInfo.token = token.idToken;
	  userInfo.createdAt = profile.createdAt;
	  userInfo.loggedIn = true;


	  setUserInfo(userInfo, function(userInfo, error){
	  	console.log(userInfo);
	  	if(error){
	  		console.log('Error: ', error);
	  	}
	  });
	  postUserInfo(userInfo);

	 // console.log('Logged in with Auth0!');
	  console.log('Profile: ', profile);
	  console.log('Token: ', token);
	  return true;


	};
 
async function setUserInfo(userInfo, callback){
	try{
    if(userInfo){
    userInfo.id = userInfo.id.split('|').pop();
		userInfo = JSON.stringify(userInfo);

		await AsyncStorage.setItem('@IceBikeUserInfo', userInfo);
		if(callback){
      callback(userInfo);
  }
  }


	}catch(error){
		console.log('Problem storing user info');
    if(callback){
		  callback(userInfo, error);
  }
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
function postUserInfo(userInfo){
	fetch(myServerURL + '/user/' + userInfo.id, {
	    method: "GET",
	    headers: {
	      'Content-Type' : 'application/json',
	      'Authorization': 'Bearer ' + userInfo.token,
	      'Data-Type': 'application/json'

	    }
	  })
	  .then(function(response){
	    if(response.ok){

	    	console.log('response**********************:');
	    	console.log(response._bodyText);
	    	console.log(typeof response._bodyText);

	    	if(response._bodyText === 'null'){		//user doesn't exist, so add it
	    		var token = userInfo.token;
	    		delete userInfo.token;
	    		delete userInfo.loggedIn;
	    		userInfo.photos = [];
		        fetch(myServerURL + '/user', {
		          method: "POST",
		          headers: {
		          'Content-Type' : 'application/json',
		          'Authorization': 'Bearer ' + token

		          },
    				body: JSON.stringify(userInfo)
		        })
		      .then(function(response){
		        if(response.ok){
		          console.log('***************Added user to the database ***');
		        }
			    else{
			      console.log('Network response was not 200');
			      console.log(response);
			    }

		      }).catch(function(error){
			    console.log('Error adding user to database: ' + error);
			  })
			  .done();
		    }else{
		    	console.log('User is already in the database');
		    }


		}
	})
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
    width: 300,
    height: 300,
    margin: 10,
  },
});

AppRegistry.registerComponent('icicleBicycle', () => icicleBicycle);
