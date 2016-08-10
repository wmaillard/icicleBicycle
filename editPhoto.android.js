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
import {
    Button,
    Card,
    Toolbar
} from 'react-native-material-design';
var t = require('tcomb-form-native');
var Form = t.form.Form;

var serverUrl = 'https://api.cloudinary.com/v1_1/ochemaster/image/upload';
var up_preset = 'fty1rxtk';
var myServerURL = 'http://photorest666.herokuapp.com';

export default class EditPhoto extends Component {
    static propTypes = {
        globalNavigator: PropTypes.object,
        goBack: PropTypes.func,
        userInfo: PropTypes.object, //userInfo.token is what you want
        photoData: PropTypes.object
    }
    render() {

        var reduceQuality = function(uri) {
            //uri = uri.rowData;
            var whole = uri.split('/');
            var left = "http://";
            var right = "";
            for (var i = 2; i < whole.length - 2; i++) {
                left += whole[i] + '/';
            }
            for (var i = whole.length - 2; i < whole.length; i++) {
                right += whole[i];
                if (i != whole.length - 1) {
                    right += '/';
                }
            }
            return left + 'q_50,w_500,h_500,c_fill/' + right;
        }

        var imageDescription = t.struct({
            title: t.maybe(t.String), // a required string
            location: t.maybe(t.String), // an optional string
        });

        return (

            <View  style ={{flex: 1}}>
    
      <View style ={{flex: 1}}>
            <Toolbar title={'Photo Preview'} icon={'arrow-back'} onIconPress={this.props.goBack} />
      </View>
      



      <ScrollView style ={{flex: 8}}>
        <Image style= {styles.image} source={{uri: reduceQuality(this.props.photoData.url)}}/>
       <View style ={{flexDirection: 'row'}}>

      <View style ={{flex: 4}}>
        <Form
          ref="form"
          type={imageDescription}
          value={{title: this.props.photoData.title, location: this.props.photoData.location}}
        />
        <Button style={{flex:1}} text='Save Changes' value = "NORMAL RAISED" raised={true} onPress = {this.saveChanges.bind(this)}/>

        </View>
      </View>



      </ScrollView>

    </View>

        )

    }
    saveChanges() {

        var photoDescription = this.refs.form.getValue()

        fetch(myServerURL + '/photo/' + this.props.photoData.id, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + this.props.userInfo.token

                },
                body: JSON.stringify(photoDescription)
            })
            .then(function(response) {
                if (response.ok) {

                    alert('Edit was saved');
                } else {
                    callback('Network response was not 200');
                    console.log(response);
                }

            })
            .catch(function(error) {
                console.log('Error: ' + error)
            })
            .done();

        this.props.globalNavigator.popToTop();
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
        width: 300,
        height: 300,
        margin: 10,
    },
});