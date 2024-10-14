/**
 * @format
 */

import {AppRegistry} from 'react-native';

import {name as appName} from './app.json';
import { PriceTracker } from './src/PriceTracker';

AppRegistry.registerComponent(appName, () => PriceTracker);
