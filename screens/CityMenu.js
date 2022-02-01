import React, {useState, useEffect} from 'react';
import { View ,StyleSheet,Text,Image,TouchableOpacity} from "react-native";

const CityMenu = ({navigation, route}) => {
    return (
        <View style={{flex:1}}>

        <View style={{paddingLeft: 330, paddingTop: 50  }}>
                <TouchableOpacity onPress={()=>{navigation.navigate("Home")}}>
                <Image  source={require( '../weatherIcons/' + 'back-arrow' + '.png')} />
                </TouchableOpacity>
        </View>

        <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
            <Text>City Menu (To be implemented...)</Text>
        </View>
        </View>
    );
};


const styles= StyleSheet.create();

export default CityMenu;