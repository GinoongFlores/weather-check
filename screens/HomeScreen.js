import React, { useCallback, useEffect, useState } from "react";
import {
  Text,
  View,
  Image,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import { theme } from "../theme";
import { MagnifyingGlassIcon } from "react-native-heroicons/outline";
import { MapPinIcon } from "react-native-heroicons/solid";
import { CalendarDaysIcon } from "react-native-heroicons/mini";
import { debounce } from "lodash";
import { fetchLocation, fetchWeatherForecast } from "../api/weather";
import { weatherImages } from "../constants";
import * as Progress from "react-native-progress";
import { getData, storeData } from "../utils/asyncStorage";

const HomeScreen = () => {
  const [showSearch, toggleSearch] = useState(false);
  const [locations, setLocations] = useState([]);
  const [weather, setWeather] = useState({});
  const [loading, setLoading] = useState(true);

  const handleLocation = (location) => {
    // console.log("location", location); // show locations data from the api
    setLocations([]); // clear locations
    toggleSearch(false);
    setLoading(true); // set loading to true when the data is not yet fetched
    fetchWeatherForecast({
      cityName: location.name,
      days: "14",
    }).then((data) => {
      setWeather(data);
      setLoading(false); // set loading to false when the data is fetched
      storeData("city", location.name);
      // console.log("get forecast: ", data); // show forecast data from the api
    });
  };

  const handleSearch = (value) => {
    // fetch locations
    if (value.length > 2) {
      fetchLocation({ cityName: value }).then((data) => {
        setLocations(data);
      });
    }
  };

  // fetch the API weather data when the app reloads
  useEffect(() => {
    fetchMyWeatherData();
  }, []);

  // fetch the API weather data when the app reloads
  const fetchMyWeatherData = async () => {
    let myCity = await getData("city"); // get the city from async storage
    let cityName = "Cagayan de Oro City"; // default city
    if (myCity) cityName = myCity; // if there is a city in local storage, then use that city

    fetchWeatherForecast({
      cityName,
      days: "14",
    }).then((data) => {
      setWeather(data);
      setLoading(false); // set loading to false when the data is fetched
    });
  };

  const handleTextDebounce = useCallback(debounce(handleSearch, 1200), []);

  // destructuring array of objects from the api based on the weather object in state. This passed the objects from the api to the useState hook.
  const { current, location } = weather;

  return (
    // <KeyboardAwareScrollView>
    <View className={"flex-1 relative"}>
      <StatusBar style={"light"} />
      <Image
        blurRadius={70}
        source={require("../assets/images/rounded_bg.png")}
        className={"absolute w-full h-full"}
      />

      {
        // when loading is true we show the loading indicator
        loading ? (
          <View className={"flex-1 flex-row justify-center items-center"}>
            <Progress.CircleSnail thickness={10} size={140} color={"#0bb3b2"} />
          </View>
        ) : (
          // and when it is false we show the weather data
          <SafeAreaView className={"flex flex-1"}>
            {/* search section */}
            <View
              style={{ height: "7%" }}
              className={"mt-8 mx-4 relative z-50"}
            >
              {/* search icon and input */}
              <View
                className={"flex-row justify-end items-center rounded-full"}
                style={{
                  backgroundColor: showSearch
                    ? theme.bgWhite(0.2)
                    : "transparent",
                }}
              >
                {showSearch ? (
                  <TextInput
                    onChangeText={handleTextDebounce}
                    placeholder={"Search City"}
                    placeholderTextColor={"lightgray"}
                    className={"pl-6 h-10 pb-1 flex-1 text-base text-white"}
                  />
                ) : null}

                <TouchableOpacity
                  onPress={() => toggleSearch(!showSearch)}
                  style={{ backgroundColor: theme.bgWhite(0.3) }}
                  className={"rounded-full p-3 m-1"}
                >
                  <MagnifyingGlassIcon size={25} color={"white"} />
                </TouchableOpacity>
              </View>
              {locations.length > 0 && showSearch ? (
                <View
                  className={"absolute w-full bg-gray-300 top-16 rounded-3xl"}
                >
                  {locations.map((location, index) => {
                    let showBorder = index + 1 !== locations.length;
                    let borderClass = showBorder
                      ? " border-b-2 border-b-gray-400"
                      : " ";
                    return (
                      <TouchableOpacity
                        onPress={() => handleLocation(location)}
                        key={index}
                        className={
                          "flex-row items-center border-0 p-3 px-4 mb-1" +
                          borderClass
                        }
                      >
                        <MapPinIcon size={20} color={"gray"} />
                        <Text clasName={"text-black text-lg ml-2"}>
                          {location?.name}, {location?.country}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              ) : null}
            </View>

            {/*  forecast section */}

            <View className={"mx-4 flex justify-around flex-1 mb-2"}>
              {/*  location */}
              <Text className={"text-white text-center text-2xl font-bold"}>
                {location?.name},
              </Text>
              <Text className={"text-2xl text-center font-semibold text-gray-300"}>
                {location?.country}
              </Text>
              {/*  weather image */}
              <View className={"flex-row justify-center"}>
                <Image
                  source={weatherImages[current?.condition?.text]}
                  className={"w-52 h-52"}
                />
              </View>

              {/*  degree celsius */}
              <View className={"space-y-2"}>
                <Text
                  className={
                    "text-center font-bold text-white text-6xl ml-5 pt-1"
                  }
                >
                  {current?.temp_c}&#176;
                </Text>
                <Text
                  className={"text-center text-white text-xl tracking-widest"}
                >
                  {current?.condition?.text}
                </Text>
              </View>

              {/* other stats */}
              <View className={"flex-row justify-between mx-4"}>
                <View className={"flex-row space-x-2 items-center"}>
                  <Image
                    source={require("../assets/icons/wind.png")}
                    className={"w-6 h-6"}
                  />
                  <Text className={"text-white font-semibold text-base"}>
                    {current?.wind_kph}km
                  </Text>
                </View>

                <View className={"flex-row space-x-2 items-center"}>
                  <Image
                    source={require("../assets/icons/drop.png")}
                    className={"w-6 h-6"}
                  />
                  <Text className={"text-white font-semibold text-base"}>
                    {current?.humidity}%
                  </Text>
                </View>

                <View className={"flex-row space-x-2 items-center"}>
                  <Image
                    source={require("../assets/icons/sun.png")}
                    className={"w-6 h-6"}
                  />
                  <Text className={"text-white font-semibold text-base"}>
                    {weather?.forecast?.forecastday[0]?.astro?.sunrise}
                  </Text>
                </View>
              </View>
            </View>

            {/*  forecast for next days */}
            <View className={"mb-2 space-y-3 pt-5"}>
              <View className={"flex-row items-center mx-5 space-x-2"}>
                <CalendarDaysIcon size={22} color={"white"} />
                <Text className={"text-white text-base"}>14-Day forecast</Text>
              </View>

              <ScrollView
                horizontal
                contentContainerStyle={{ paddingHorizontal: 15 }}
                showsHorizontalScrollIndicator={false}
              >
                {weather?.forecast?.forecastday?.map((item, index) => {
                  let date = new Date(item.date);
                  let options = { weekday: "long" };
                  let dayName = date
                    .toLocaleDateString("en-US", options)
                    .split(",")[0];

                  return (
                    <View
                      key={index}
                      className={
                        "flex justify-center items-center w-24 rounded-3xl py-3 space-y-1 mr-4"
                      }
                      style={{ backgroundColor: theme.bgWhite(0.15) }}
                    >
                      <Image
                        source={weatherImages[item?.day?.condition?.text]}
                        className={"w-11 h-11"}
                      />
                      <Text className={"text-white"}>{dayName}</Text>
                      <Text className={"text-white text-xl font-semibold"}>
                        {item?.day?.avgtemp_c}&#176;
                      </Text>
                    </View>
                  );
                })}
              </ScrollView>
            </View>
          </SafeAreaView>
        )
      }
    </View>

    // </KeyboardAwareScrollView>
  );
};

export default HomeScreen;
