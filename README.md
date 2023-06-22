# weather-check
Created using React Native with Expo

> android emulator must be installed through Android Studio

## How to run the App
1. Install npm packages
```
npm install
```
2. Run the App using Expo [App on Playstore](https://play.google.com/store/apps/details?id=host.exp.exponent&hl=en&gl=US&pli=1)
``` 
npx expo start
```
*Run the App in a clean state*
```
npx expo start -c
```

## How to build the App in APK
1. Build the app 
> `production` is the name of the profile configuration on `eas.json` 
```
eas build -p android --profile production
```
2. Run the app on an emulator
```
eas build -p android --latest
```
*For more information on building an APK. Please visit **Expo Docs**: [Build APKs for Android Emulators and devices
](https://docs.expo.dev/build-reference/apk/)*

## For more updated information
*Visit Expo Docs at https://docs.expo.dev*
