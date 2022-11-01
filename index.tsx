/**
 * @format
 */

import {AppRegistry} from 'react-native';
import AppBootstrap from './src/components/app/AppBootstrap';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => AppBootstrap);
