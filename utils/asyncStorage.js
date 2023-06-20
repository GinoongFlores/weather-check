import AsyncStorage from "@react-native-async-storage/async-storage";

export const storeData = async (key, value) => {
  try {
    await AsyncStorage.setItem(key, value);
    return true;
  } catch (err) {
    console.log("Error storing value ", err);
    return false;
  }
};

export const getData = async (key) => {
  try {
    return await AsyncStorage.getItem(key);
  } catch (err) {
    console.log("Error getting value ", err);
    return null;
  }
};
