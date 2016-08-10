import React, {
    Component,
    PropTypes
} from 'react';
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    Navigator,
    Image,
    AsyncStorage,
    ScrollView,
    Slider
} from 'react-native';
import Camera from 'react-native-camera';

import {
    Button,
    Card,
    Toolbar
} from 'react-native-material-design';

import {
    Surface
} from "gl-react-native";
import GL from 'gl-react';

import ImageRotate from 'react-native-image-rotate'; //To fix the Samsung bugs that takes images sideways

import {
    setUserInfo,
    getUserInfo
} from './asyncStorage';
var t = require('tcomb-form-native');

var Form = t.form.Form;
var serverUrl = 'https://api.cloudinary.com/v1_1/ochemaster/image/upload';
var up_preset = 'fty1rxtk';
var myServerURL = 'http://photorest666.herokuapp.com';
import filters from './filters';

export default class Preview extends Component {
	constructor (props){
		super(props);
		this.state = {userFilter: filters.saturate, 
						filterLevel: 1,
						filter: {
							saturate: false,
							contrast: true,
							brighten: false,
						},
					uniforms: {factor: 1,  image: this.props.uri}

					
	}
}

    static propTypes = {
        onBack: PropTypes.func,
        globalNavigator: PropTypes.object,
        uri: PropTypes.string,
        filter: PropTypes.string

    }
    render() {
        //Saturation filter taken from gl-react-native example pages

        var img = {
            uri: this.props.uri
        };

        var imageDescription = t.struct({
            title: t.maybe(t.String), // a required string
            location: t.maybe(t.String), // an optional string
        });

        return (
            <View  style ={{flex: 1}}>
    
      <View style ={{flex: 1}}>
            <Toolbar title={'Photo Preview'} icon={'arrow-back'} onIconPress={this.props.onBack} />
      </View>
      



      <ScrollView style ={{flex: 10}} contentContainerStyle = {{alignItems: 'center'}}>
        <Surface  width={275} height={375} ref = 'theImg'>
          <GL.Node shader = {this.state.userFilter}
            uniforms = {this.state.uniforms}
          />
        </Surface>
                

      <View style ={{ flexDirection: 'row'}}>     
      		<Button style={{flex:1}} text='Contrast' value = "NORMAL RAISED" raised={!this.state.filter.contrast} onPress = {this.addFilter.bind({old: this, filterSelected: 'contrast'})} />
            <Button style={{flex:1}} text='Saturate' value = "NORMAL RAISED" raised={!this.state.filter.saturate} onPress = {this.addFilter.bind({old: this, filterSelected: 'saturate'})} />
            <Button style={{flex:1}} text='Brighten' value = "NORMAL RAISED" raised={!this.state.filter.brighten} onPress = {this.addFilter.bind({old: this, filterSelected: 'brighten'})} />

      </View>
      <View>
        <Text style={styles.filterText} >
          {this.state.filterLevel && +this.state.filterLevel.toFixed(3)}
        </Text>
      	<Slider style = {{height: 10, width: 300}} minimumValue = {0} step = {1} maximumValue = {10} value = {this.state.filterLevel} onValueChange = {
      		(value) =>{var factor = value * 8 / 10; 
      			console.log(factor); 
      			var state = {};
      			state.uniforms = {};
      			state.filterLevel = value;
      			state.uniforms.image = this.props.uri;


      			state.uniforms.factor = value * 8 / 10;

      			this.setState(state)
      		}}/>
      	<Text style= {styles.filterText} >Filter Strength </Text>
      	</View>


      <View style= {{padding: 40}}>

        <Form
          ref="form"
          type={imageDescription}
        />
        <Button text='Save and Upload' value = "NORMAL RAISED" raised={true} onPress = {this.capture.bind(this)} />

     </View>
      



      </ScrollView>

    </View>

        )
    }
    addFilter(){
    	console.log(this.filterSelected);

    	var newState = {};
    	newState.filter = {}
    	newState.filter.brighten = false;
    	newState.filter.saturate = false;
    	newState.filter.contrast = false;
    	newState.filter[this.filterSelected] = true;
    	newState.userFilter = filters[this.filterSelected];


    	this.old.setState(newState)
    }
    filter2() {
        var path = this.props.uri;
        this.props.globalNavigator.push({
            title: 'Preview',
            body: <Preview onBack = {
                () => {
                    navigator.pop()
                }
            }
            globalNavigator = {
                navigator
            }
            uri = {
                path
            }
            />,
            index: 4,
            outline: 'false',
        })
    }
    capture(uri) {
        var photoDescription = this.refs.form.getValue();

        const captureConfig = {
            quality: 1,
            type: "jpg",
            format: "base64"
        };
        this.refs.theImg
            .captureFrame(captureConfig)
            .then(captured => {
                this.uploadPic(captured, photoDescription);
                this.setState({
                    captured,
                    captureConfig
                })
            });
    }
    uploadPic(uri, photoDescription) {
        var xhr = new XMLHttpRequest();
        var body = new FormData();
        body.append('upload_preset', up_preset);
        body.append('file', uri); //{uri: uri, type: "image/jpg", name: 'name'});
        xhr.open('POST', serverUrl);
        xhr.send(body);
        xhr.onreadystatechange = function(e) {
            if (xhr.readyState !== 4) {
                return;
            }

            if (xhr.status === 200) {
                getUserInfo(function(userInfo, err) {
                    if (err) {
                        console.log('Error: ', err);
                    } else {
                        var photoData = {};
                        var res = JSON.parse(xhr.responseText);
                        photoData.location = photoDescription.location;
                        photoData.title = photoDescription.title;
                        photoData.id = res.public_id;
                        photoData.url = res.url;
                        photoData.userId = userInfo.id;

                        postPhoto(userInfo.token, photoData, function(err) {
                            if (err) {
                                alert('Uploading your image failed :(: ' + err);
                            } else alert('Successfully uploaded your photo');
                        });

                    }
                });

            } else {

                alert('Uploading your image failed :(')

            }
        }
        this.props.globalNavigator.popToTop();

    }

}

export default class UseCamera extends Component {

    static propTypes = {
        onBack: PropTypes.func,
        globalNavigator: PropTypes.object

    }
    render() {
        return (
            <View style ={{flex: 1}}>

      <View style ={{flex: 2}}>
            <Toolbar title={'Upload a Photo'} icon={'arrow-back'} onIconPress={this.props.onBack} />
      </View>
  

      <Camera 
        style = {{flex: 8}}
        ref={(cam) => {
          this.camera = cam;
        }}
        aspect={Camera.constants.Aspect.fill}
        captureTarget ={Camera.constants.CaptureTarget.disk}
        captureQuality = {Camera.constants.CaptureQuality.med}
        orientation = {Camera.constants.Orientation.portrait}>

      </Camera>

      <View style={{flex:2}}>
        <Button style={{flex:1}} text='Take Picture' value = "NORMAL RAISED" raised={true} onPress={this.takePicture.bind(this)}/>
      </View>

      </View>

        )
    }

    previewPic(uri) {

    }
    takePicture() {

        var uploadPic = this.uploadPic;
        var goBack = this.props.onBack;
        var push = this.props.globalNavigator.push;
        var navigator = this.props.globalNavigator;
        this.camera.capture()
            .then(function(data) {
                    var path = data.path;
                    ImageRotate.rotateImage(
                        path,
                        90,
                        (uri) => {

                            push({
                                title: 'Preview',
                                body: <Preview onBack = {
                                    () => {
                                        navigator.pop()
                                    }
                                }
                                globalNavigator = {
                                    navigator
                                }
                                uri = {
                                    uri
                                }
                                />,
                                index: 4,
                                outline: 'false',
                            })
                        },
                        (error) => {
                            console.log('Error:' + error);
                        }

                    )
                }

            )
            .catch(err => console.error(err));
    }
}

async function postPhoto(token, photoInfo, callback) {

    fetch(myServerURL + '/photo', {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer ' + token

            },
            body: JSON.stringify(photoInfo)
        })
        .then(function(response) {
            if (response.ok) {
                callback();
            } else {
                callback('Network response was not 200');
            }

        })
        .catch(function(error) {
            callback('Error: ' + error)
        })
        .done();
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
    filterText: {
    fontSize: 14,
    textAlign: 'center',
    fontWeight: '500',
    margin: 10,
  }
});