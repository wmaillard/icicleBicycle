import {AsyncStorage} from 'react-native';
export async function getUserInfo(callback){
    try{
      var userInfo = await AsyncStorage.getItem('@IceBikeUserInfo');
      userInfo = JSON.parse(userInfo);
      callback(userInfo);
    }catch(error){
      console.log('Problem getting userInfo');
      callback(userInfo, false)
    }

  }
export async function setUserInfo(userInfo, callback){
    try{
      userInfo = JSON.stringify(userInfo);
      await AsyncStorage.setItem('@IceBikeUserInfo', userInfo);
      callback(userInfo);
    }catch(error){
      console.log('Problem storing user info');
      callback(userInfo, error);
    }

  }
