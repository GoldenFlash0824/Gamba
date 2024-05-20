/**
 * @format
 */

import {AppRegistry} from 'react-native'
import axios from 'axios'
import App from './App'
import {name as appName} from './app.json'
import {BASE_URL} from './src/services/index'

axios.defaults.baseURL = BASE_URL

AppRegistry.registerComponent(appName, () => App)
