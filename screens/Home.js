import React, {useState, useEffect} from 'react';
import { View, Text, StyleSheet,TouchableWithoutFeedback, Keyboard,Image,TouchableOpacity} from 'react-native';

import {WEATHER_API_KEY} from '../apikeys/WeatherAPIKey.js';
import {DarkTheme, LightTheme} from '../styles/style.js';
import{WeatherIcons} from '../weatherIcons/weather_icons.js';
import * as Location from 'expo-location';

const Home = ({navigation}) => {
    
    const [errorMsg, setErrorMsg] = useState(null);
    const [weather, setWeather] = useState(null);
 
 
    const geoLocWeatherHandler = () =>{
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
              setErrorMsg('Permission to access location was denied');
              return;
            }

            let location = await Location.getLastKnownPositionAsync({
                accuracy: 6,
              });
              let latitude;
                let longitude;
                let text;
                if (errorMsg) {
                    setWeather(errorMsg);
                } else if (location) {
                    latitude = parseFloat(JSON.stringify(location.coords.latitude));
                    longitude = parseFloat(JSON.stringify(location.coords.longitude));

                    fetchLocationKey(latitude,longitude);
            } 
          })();
    }

    const fetchLocationKey = (lat,lon) => {
        fetch(
          `http://dataservice.accuweather.com/locations/v1/cities/geoposition/search?apikey=${WEATHER_API_KEY}&q=${lat}%2C${lon}`
        )
          .then(res => res.json())
          .then(json => {
            fetchLocationName(parseInt(json.Key));
          });
    };

    const fetchLocationName = (locationKey) => {
        fetch(
            `http://dataservice.accuweather.com/locations/v1/${locationKey}?apikey=${WEATHER_API_KEY}`
          )
          
            .then(res => res.json())
            .then(json => {
                fetchMainLocationKey(json.AdministrativeArea.EnglishName);
            });
    }

    const fetchMainLocationKey = (locationName) => {
        fetch(
            `http://dataservice.accuweather.com/locations/v1/cities/search?apikey=${WEATHER_API_KEY}&q=${locationName}`
          )
          
            .then(res => res.json())
            .then(json => {
                setWeather({"cityName":json[0].EnglishName}); 
              fetchWeather(json[0].Key.slice(2, 8));
            });
    }

    const fetchWeather = (locationKey) => {

        fetch(
            `http://dataservice.accuweather.com/currentconditions/v1/${locationKey}?apikey=${WEATHER_API_KEY}`
            )
            .then(res => res.json())
            .then(json => {
                setWeather((prevState)=>
                (
                    {...prevState,"weatherText":json[0].WeatherText, "temperature":json[0].Temperature.Metric.Value, "weatherIcon":json[0].WeatherIcon, "isDayTime":json[0].IsDayTime}
                )
                    );
        });
    }

    useEffect(() => {
        geoLocWeatherHandler();
    }, []);

    return (
        <TouchableWithoutFeedback onPress={() => {Keyboard.dismiss(); }}>
            
            <View style = {styles.homeScreen}>

            <View style={styles.menuButtonContainer}>
                <TouchableOpacity onPress={()=>{navigation.navigate("CityMenu")}}>
                <Image style={styles.menuButton} source={require( '../weatherIcons/' + 'menu-button' + '.png')} />
                </TouchableOpacity>
            </View>

            <View style={styles.weatherInfoContainer}>
            <Text style = {styles.homeCityName}>{weather===null ? "Loading..." : weather.cityName}</Text>

            <Text style={styles.homeCityTemp}>{weather === null || parseInt(weather.temperature) === NaN ? "Loading..." : parseInt(weather.temperature)}°C</Text>

            <Image style={styles.weatherIcon} source={weather === null ? WeatherIcons["Sunny"] : WeatherIcons[weather.weatherText]} />

            <Text style={styles.homeCityWeather}>{weather===null ? "Loading..." : weather.weatherText}</Text>
            </View>
            </View>
        </TouchableWithoutFeedback>
    );
};

const styles= StyleSheet.create(
    {
        homeScreen:{
            flex: 1,  
            backgroundColor: LightTheme.BACKGROUND_COLOR
        },

        homeCityName:{
            paddingTop: 123,
            fontFamily: "Quicksand_Medium", 
            fontSize: 40,
            color: LightTheme.TEXT_COLOR
        },

        homeCityTemp:{
            padding: 5,
            fontFamily: "Quicksand_SemiBold",
            fontSize: 50,
            color: LightTheme.TEXT_COLOR
        },

        homeCityWeather:{
            padding:5,
            fontFamily: "Quicksand_SemiBold", 
            fontSize: 30,
            color: LightTheme.TEXT_COLOR
        },

        weatherIcon:{
            width:95,
            height:83.6,
            margin: 5,
        },
        weatherInfoContainer:{
            alignItems:'center',
            padding: 40
        },
        menuButtonContainer:{
            paddingLeft:25,
            paddingTop:60
        }
    }
);

export default Home;