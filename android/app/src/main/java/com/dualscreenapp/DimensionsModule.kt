package com.dualscreenapp

import android.app.Activity
import android.content.Context
import android.util.DisplayMetrics
import android.view.Display
import android.view.WindowManager
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.bridge.ReactContextBaseJavaModule
import com.facebook.react.bridge.ReactMethod
import com.facebook.react.bridge.Promise

class DimensionsModule(reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {
    
    override fun getName(): String = "DimensionsModule"
    
    @ReactMethod
    fun getCurrentScreenDimensions(promise: Promise) {
        val currentActivity = reactApplicationContext.currentActivity
        if (currentActivity != null) {
            try {
                val windowManager = currentActivity.getSystemService(Context.WINDOW_SERVICE) as WindowManager
                val display = windowManager.defaultDisplay
                val metrics = DisplayMetrics()
                
                // 获取当前显示的尺寸
                display.getMetrics(metrics)
                
                val dimensions = mapOf(
                    "width" to metrics.widthPixels.toDouble(),
                    "height" to metrics.heightPixels.toDouble(),
                    "scale" to metrics.density,
                    "fontScale" to metrics.scaledDensity
                )
                
                promise.resolve(dimensions)
            } catch (e: Exception) {
                promise.reject("ERROR", e.message)
            }
        } else {
            promise.reject("ERROR", "No current activity")
        }
    }
    
    @ReactMethod
    fun getCurrentActivityName(promise: Promise) {
        val currentActivity = reactApplicationContext.currentActivity
        if (currentActivity != null) {
            promise.resolve(currentActivity.localClassName)
        } else {
            promise.reject("ERROR", "No current activity")
        }
    }
    
    @ReactMethod
    fun getDisplayCount(promise: Promise) {
        val currentActivity = reactApplicationContext.currentActivity
        if (currentActivity != null) {
            try {
                // 使用DisplayManager获取显示设备数量
                val displayManager = currentActivity.getSystemService(Context.DISPLAY_SERVICE) as android.hardware.display.DisplayManager
                val displays = displayManager.displays
                promise.resolve(displays.size)
            } catch (e: Exception) {
                promise.reject("ERROR", e.message)
            }
        } else {
            promise.reject("ERROR", "No current activity")
        }
    }
    
    @ReactMethod
    fun getDisplayMetrics(displayId: Int, promise: Promise) {
        val currentActivity = reactApplicationContext.currentActivity
        if (currentActivity != null) {
            try {
                // 使用DisplayManager获取显示设备
                val displayManager = currentActivity.getSystemService(Context.DISPLAY_SERVICE) as android.hardware.display.DisplayManager
                val displays = displayManager.displays
                
                // 查找指定ID的显示设备
                var targetDisplay: Display? = null
                for (display in displays) {
                    if (display.displayId == displayId) {
                        targetDisplay = display
                        break
                    }
                }
                
                if (targetDisplay != null) {
                    val metrics = DisplayMetrics()
                    targetDisplay.getMetrics(metrics)
                    
                    val dimensions = mapOf(
                        "width" to metrics.widthPixels.toDouble(),
                        "height" to metrics.heightPixels.toDouble(),
                        "scale" to metrics.density,
                        "fontScale" to metrics.scaledDensity
                    )
                    
                    promise.resolve(dimensions)
                } else {
                    promise.reject("ERROR", "Display not found")
                }
            } catch (e: Exception) {
                promise.reject("ERROR", e.message)
            }
        } else {
            promise.reject("ERROR", "No current activity")
        }
    }
}