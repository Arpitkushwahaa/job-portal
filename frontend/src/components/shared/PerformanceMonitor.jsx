import React, { useEffect, useState } from 'react'

const PerformanceMonitor = () => {
  const [metrics, setMetrics] = useState({})
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Only show in development
    if (process.env.NODE_ENV !== 'development') return

    // Performance monitoring
    const measurePerformance = () => {
      if ('performance' in window) {
        const navigation = performance.getEntriesByType('navigation')[0]
        const paint = performance.getEntriesByType('paint')
        
        const newMetrics = {
          // Page load metrics
          dnsLookup: navigation?.domainLookupEnd - navigation?.domainLookupStart || 0,
          tcpConnection: navigation?.connectEnd - navigation?.connectStart || 0,
          serverResponse: navigation?.responseEnd - navigation?.requestStart || 0,
          domContentLoaded: navigation?.domContentLoadedEventEnd - navigation?.domContentLoadedEventStart || 0,
          loadComplete: navigation?.loadEventEnd - navigation?.loadEventStart || 0,
          
          // Paint metrics
          firstPaint: paint.find(p => p.name === 'first-paint')?.startTime || 0,
          firstContentfulPaint: paint.find(p => p.name === 'first-contentful-paint')?.startTime || 0,
          
          // Memory usage (if available)
          memory: performance.memory ? {
            used: Math.round(performance.memory.usedJSHeapSize / 1048576 * 100) / 100,
            total: Math.round(performance.memory.totalJSHeapSize / 1048576 * 100) / 100,
            limit: Math.round(performance.memory.jsHeapSizeLimit / 1048576 * 100) / 100
          } : null
        }
        
        setMetrics(newMetrics)
      }
    }

    // Measure after page loads
    if (document.readyState === 'complete') {
      measurePerformance()
    } else {
      window.addEventListener('load', measurePerformance)
    }

    // Monitor for performance issues
    const observer = new PerformanceObserver((list) => {
      list.getEntries().forEach((entry) => {
        if (entry.entryType === 'navigation' && entry.loadEventEnd > 3000) {
          console.warn('⚠️ Slow page load detected:', entry.loadEventEnd, 'ms')
        }
      })
    })

    try {
      observer.observe({ entryTypes: ['navigation'] })
    } catch (e) {
      // PerformanceObserver not supported
    }

    return () => {
      window.removeEventListener('load', measurePerformance)
      observer?.disconnect()
    }
  }, [])

  // Toggle visibility with Ctrl+Shift+P
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key === 'P') {
        setIsVisible(prev => !prev)
      }
    }

    document.addEventListener('keydown', handleKeyPress)
    return () => document.removeEventListener('keydown', handleKeyPress)
  }, [])

  if (!isVisible || process.env.NODE_ENV !== 'development') return null

  return (
    <div className="fixed bottom-4 right-4 bg-black/90 text-white p-4 rounded-lg text-xs font-mono z-50 max-w-xs">
      <div className="flex items-center justify-between mb-2">
        <h3 className="font-bold">Performance Metrics</h3>
        <button 
          onClick={() => setIsVisible(false)}
          className="text-gray-400 hover:text-white"
        >
          ×
        </button>
      </div>
      
      <div className="space-y-1">
        <div>DNS: {metrics.dnsLookup?.toFixed(2)}ms</div>
        <div>TCP: {metrics.tcpConnection?.toFixed(2)}ms</div>
        <div>Server: {metrics.serverResponse?.toFixed(2)}ms</div>
        <div>DOM Ready: {metrics.domContentLoaded?.toFixed(2)}ms</div>
        <div>Load: {metrics.loadComplete?.toFixed(2)}ms</div>
        <div>FP: {metrics.firstPaint?.toFixed(2)}ms</div>
        <div>FCP: {metrics.firstContentfulPaint?.toFixed(2)}ms</div>
        
        {metrics.memory && (
          <div className="mt-2 pt-2 border-t border-gray-600">
            <div>Memory: {metrics.memory.used}MB / {metrics.memory.total}MB</div>
            <div>Limit: {metrics.memory.limit}MB</div>
          </div>
        )}
      </div>
      
      <div className="mt-2 pt-2 border-t border-gray-600 text-xs text-gray-400">
        Press Ctrl+Shift+P to toggle
      </div>
    </div>
  )
}

export default PerformanceMonitor
