build debug
----------------
01. Run below command
    react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res
02. Navigate to android folder in terminal using below command
    cd android
03. Run below command
    ./gradlew assembleDebug
04. Now you can find the debug apk file under below location
    yourProject/android/app/build/outputs/apk/debug/app-debug.apk