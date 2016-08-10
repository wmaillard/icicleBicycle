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
    ScrollView
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

export default class Preview extends Component {

    static propTypes = {
        onBack: PropTypes.func,
        globalNavigator: PropTypes.object,
        uri: PropTypes.string,
        filter: PropTypes.string

    }
    render() {
        //Saturation filter taken from gl-react-native example pages
        helloGL = {
            frag: `
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
      



      <ScrollView style ={{flex: 8}}>
        <Surface  width={400} height={400} ref = 'theImg'>
          <GL.Node shader = {helloGL}
            uniforms = {{factor: 3, image: img}}
          />
        </Surface>
                <View style ={{flexDirection: 'row'}}>

      <View style ={{flex: 4}}>
        <Form
          ref="form"
          type={imageDescription}
        />
        <Button style={{flex:1}} text='Save and Upload' value = "NORMAL RAISED" raised={true} onPress = {this.capture.bind(this)} />

        </View>
      </View>



      </ScrollView>

    </View>

        )
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
        captureQuality = {Camera.constants.CaptureQuality.low}
        orientation = {Camera.constants.Orientation.portrait}>

      </Camera>

      <View style={{flex:2}}>
        <Button style={{flex:1}} text='Take Picture and Upload' value = "NORMAL RAISED" raised={true} onPress={this.takePicture.bind(this)}/>
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
                                body: < Preview onBack = {
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
});