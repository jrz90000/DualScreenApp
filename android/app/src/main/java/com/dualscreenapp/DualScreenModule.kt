package com.dualscreenapp

import android.app.Activity
import android.content.Context
import android.content.Intent
import android.hardware.display.DisplayManager
import android.view.Display
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise

class DualScreenModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    
    override fun getName(): String = "DualScreenModule"
    
    @ReactMethod
    fun isDualScreenAvailable(promise: Promise) {
        val context = reactApplicationContext
        val displayManager = context.getSystemService(Context.DISPLAY_SERVICE) as DisplayManager
        val displays = displayManager.displays
        
        // 检查是否有多个显示设备
        val isAvailable = displays.size > 1
        promise.resolve(isAvailable)
    }
    
    @ReactMethod
    fun getDisplayCount(promise: Promise) {
        val context = reactApplicationContext
        val displayManager = context.getSystemService(Context.DISPLAY_SERVICE) as DisplayManager
        val displays = displayManager.displays
        
        promise.resolve(displays.size)
    }
    
    @ReactMethod
    fun startSecondaryActivity() {
        val currentActivity = reactApplicationContext.currentActivity
        if (currentActivity != null) {
            val intent = Intent(currentActivity, SecondaryActivity::class.java)
            currentActivity.startActivity(intent)
        }
    }
    
    @ReactMethod
    fun showSecondaryScreen() {
        val currentActivity = reactApplicationContext.currentActivity
        if (currentActivity != null) {
            val intent = Intent(currentActivity, SecondaryActivity::class.java)
            intent.addFlags(Intent.FLAG_ACTIVITY_NEW_TASK)
            
            // 获取显示管理器
            val displayManager = currentActivity.getSystemService(Context.DISPLAY_SERVICE) as DisplayManager
            val displays = displayManager.displays
            
            // 如果有第二个显示设备，在第二个设备上启动Activity
            if (displays.size > 1) {
                val secondaryDisplay = displays[1]
                // 在Android 10+上，使用ActivityOptions.setLaunchDisplayId
                if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.Q) {
                    // 使用正确的方式设置显示ID
                    val options = android.app.ActivityOptions.makeBasic()
                    options.launchDisplayId = secondaryDisplay.displayId
                    currentActivity.startActivity(intent, options.toBundle())
                } else {
                    // 旧版本Android，直接启动
                    currentActivity.startActivity(intent)
                }
            } else {
                // 只有一个显示设备，直接启动
                currentActivity.startActivity(intent)
            }
        }
    }
}