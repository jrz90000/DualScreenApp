/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { useEffect, useState } from 'react';
import { StatusBar, StyleSheet, Text, useColorScheme, View, Button, NativeModules } from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { DualScreenManager } from './src/DualScreenManager';

// 获取DimensionsModule
const { DimensionsModule } = NativeModules;

// 默认App组件，根据当前Activity名称显示不同内容
function App() {
  const isDarkMode = useColorScheme() === 'dark';
  const [isSecondaryScreen, setIsSecondaryScreen] = useState(false);
  const [isDualScreen, setIsDualScreen] = useState(false);
  const [displayCount, setDisplayCount] = useState(1);
  const [status, setStatus] = useState('检测中...');
  const [currentActivity, setCurrentActivity] = useState('未知');

  useEffect(() => {
    // 检测当前是哪个屏幕
    const checkCurrentScreen = async () => {
      try {
        // 获取当前Activity名称
        const activityName = await DimensionsModule.getCurrentActivityName();
        setCurrentActivity(activityName);
        
        // 调试信息
        console.log('当前Activity名称:', activityName);
        
        // 直接设置为第二屏幕，用于测试
        // 因为在某些设备上，获取Activity名称可能不准确
        setIsSecondaryScreen(true);
        
        // 只有主屏幕才需要检测双屏和启动第二屏幕
        if (activityName !== 'SecondaryActivity') {
          const dualScreenAvailable = await DualScreenManager.isDualScreenAvailable();
          const count = await DualScreenManager.getDisplayCount();
          
          setIsDualScreen(dualScreenAvailable);
          setDisplayCount(count);
          
          if (dualScreenAvailable) {
            setStatus('设备支持双屏，正在启动第二屏幕...');
            DualScreenManager.showSecondaryScreen();
            setStatus('第二屏幕已启动');
          } else {
            setStatus('设备不支持双屏，仅主屏幕可用');
          }
        }
      } catch (error) {
        console.error('检测屏幕出错:', error);
        // 出错时，根据当前组件名称判断是否为第二屏幕
        // 这是一个备选方案
        const isSecondary = global.__DEV__ && typeof window !== 'undefined' && window.location.href.includes('secondary');
        setIsSecondaryScreen(isSecondary);
      }
    };
    
    checkCurrentScreen();
  }, []);

  // 第二屏幕内容
  if (isSecondaryScreen) {
    return (
      <SafeAreaProvider>
        <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
        <View style={[styles.container, { backgroundColor: '#F0F0F0' }]}>
          <View style={styles.content}>
            <Text style={styles.title}>第二屏幕</Text>
            <Text style={styles.description}>这是Android设备的第二屏幕</Text>
            <Text style={styles.info}>React Native 0.83 双屏异显示例</Text>
            <Text style={styles.info}>当前Activity: {currentActivity}</Text>
            <Text style={styles.info}>使用旧架构，禁用Fabric</Text>
          </View>
        </View>
      </SafeAreaProvider>
    );
  }

  // 主屏幕内容
  return (
    <SafeAreaProvider>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <View style={[styles.container, { backgroundColor: '#FFFFFF' }]}>
        <View style={styles.content}>
          <Text style={styles.title}>主屏幕</Text>
          <Text style={styles.description}>这是Android设备的主屏幕</Text>
          <Text style={styles.info}>React Native 0.83 双屏异显示例</Text>
          <Text style={styles.info}>当前Activity: {currentActivity}</Text>
          
          <View style={styles.statusContainer}>
            <Text style={styles.statusTitle}>双屏状态:</Text>
            <Text style={[styles.statusText, isDualScreen ? styles.successText : styles.errorText]}>
              {isDualScreen ? '支持双屏' : '不支持双屏'}
            </Text>
            <Text style={styles.statusDetail}>显示设备数量: {displayCount}</Text>
            <Text style={styles.statusMessage}>{status}</Text>
          </View>
          
          <View style={styles.buttonContainer}>
            <Button 
              title="手动启动第二屏幕" 
              onPress={async () => {
                try {
                  setStatus('正在手动启动第二屏幕...');
                  DualScreenManager.showSecondaryScreen();
                  setStatus('第二屏幕已手动启动');
                } catch (error) {
                  console.error('手动启动第二屏幕出错:', error);
                  setStatus('手动启动出错: ' + error.message);
                }
              }}
              color="#007AFF"
            />
          </View>
          
          <View style={styles.buttonContainer}>
            <Button 
              title="启动第二屏幕Activity" 
              onPress={async () => {
                try {
                  setStatus('正在启动第二屏幕Activity...');
                  DualScreenManager.startSecondaryActivity();
                  setStatus('第二屏幕Activity已启动');
                } catch (error) {
                  console.error('启动第二屏幕Activity出错:', error);
                  setStatus('启动Activity出错: ' + error.message);
                }
              }}
              color="#34C759"
            />
          </View>
        </View>
      </View>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#000000',
  },
  description: {
    fontSize: 18,
    marginBottom: 20,
    color: '#666666',
  },
  info: {
    fontSize: 14,
    color: '#999999',
    marginBottom: 20,
  },
  statusContainer: {
    backgroundColor: '#F5F5F5',
    padding: 15,
    borderRadius: 8,
    marginBottom: 20,
    width: '100%',
    alignItems: 'center',
  },
  statusTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333333',
  },
  statusText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  successText: {
    color: '#34C759',
  },
  errorText: {
    color: '#FF3B30',
  },
  statusDetail: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 5,
  },
  statusMessage: {
    fontSize: 14,
    color: '#999999',
    textAlign: 'center',
  },
  buttonContainer: {
    marginTop: 15,
    paddingHorizontal: 20,
    width: '100%',
  },
});

export default App;
