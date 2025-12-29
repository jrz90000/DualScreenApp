import { Dimensions, Platform } from 'react-native';
import { NativeModules } from 'react-native';

const { DimensionsModule } = NativeModules;

export interface ScreenDimensions {
  width: number;
  height: number;
  scale: number;
  fontScale: number;
}

class ScreenDimensionsManager {
  private static instance: ScreenDimensionsManager;
  private dimensionsCache: Map<string, ScreenDimensions> = new Map();
  
  private constructor() {
  }
  
  public static getInstance(): ScreenDimensionsManager {
    if (!ScreenDimensionsManager.instance) {
      ScreenDimensionsManager.instance = new ScreenDimensionsManager();
    }
    return ScreenDimensionsManager.instance;
  }
  
  /**
   * 获取当前屏幕的尺寸
   */
  public async getCurrentScreenDimensions(): Promise<ScreenDimensions> {
    if (Platform.OS === 'android') {
      try {
        const nativeDimensions = await DimensionsModule.getCurrentScreenDimensions();
        if (nativeDimensions) {
          return nativeDimensions;
        }
      } catch (error) {
        console.error('获取原生屏幕尺寸失败:', error);
      }
    }
    
    const { width, height, scale, fontScale } = Dimensions.get('window');
    return { width, height, scale, fontScale };
  }
  
  /**
   * 更新当前屏幕的尺寸
   */
  public async updateCurrentScreenDimensions(): Promise<void> {
    const dimensions = await this.getCurrentScreenDimensions();
    let activityName = 'default';
    if (Platform.OS === 'android') {
      try {
        activityName = await DimensionsModule.getCurrentActivityName();
      } catch (error) {
        console.error('获取当前Activity名称失败:', error);
      }
    }
    this.dimensionsCache.set(activityName, dimensions);
  }

  /**
   * 获取指定屏幕的尺寸
   */
  public getScreenDimensions(activityName: string): ScreenDimensions {
    return this.dimensionsCache.get(activityName) || { width: 0, height: 0, scale: 1, fontScale: 1 };
  }
}

export default ScreenDimensionsManager.getInstance();
