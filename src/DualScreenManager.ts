import { NativeModules } from 'react-native';

const { DualScreenModule } = NativeModules;

export const DualScreenManager = {
  /**
   * 检查是否支持双屏
   */
  isDualScreenAvailable: async (): Promise<boolean> => {
    try {
      return await DualScreenModule.isDualScreenAvailable();
    } catch (error) {
      console.error('检查双屏可用时出错:', error);
      return false;
    }
  },
  
  /**
   * 获取显示设备数量
   */
  getDisplayCount: async (): Promise<number> => {
    try {
      return await DualScreenModule.getDisplayCount();
    } catch (error) {
      console.error('获取显示设备数量时出错:', error);
      return 1;
    }
  },
  
  /**
   * 启动第二屏幕Activity
   */
  startSecondaryActivity: (): void => {
    try {
      DualScreenModule.startSecondaryActivity();
    } catch (error) {
      console.error('启动第二屏幕Activity时出错:', error);
    }
  },
  
  /**
   * 在第二屏幕上显示内容
   */
  showSecondaryScreen: (): void => {
    try {
      DualScreenModule.showSecondaryScreen();
    } catch (error) {
      console.error('在第二屏幕上显示内容时出错:', error);
    }
  },
};
