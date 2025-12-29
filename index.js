/**
 * @format
 */

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

// 注册App组件，两个屏幕都使用同一个组件
AppRegistry.registerComponent(appName, () => App);

// 确保组件被正确注册
console.log('组件注册信息:', {
  appName,
  mainComponent: App
});
