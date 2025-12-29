package com.dualscreenapp

import com.facebook.react.ReactActivity
import com.facebook.react.ReactActivityDelegate
import com.facebook.react.defaults.DefaultReactActivityDelegate

class SecondaryActivity : ReactActivity() {
    
    override fun getMainComponentName(): String = "DualScreenApp"
    
    override fun createReactActivityDelegate(): ReactActivityDelegate = 
        DefaultReactActivityDelegate(this, mainComponentName, false) // 禁用Fabric，使用旧架构
    
    override fun onResume() {
        super.onResume()
        // 确保窗口始终在最前面
        window.addFlags(android.view.WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON)
    }
    
    override fun onPause() {
        super.onPause()
        window.clearFlags(android.view.WindowManager.LayoutParams.FLAG_KEEP_SCREEN_ON)
    }
}