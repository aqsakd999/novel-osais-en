import { useMediaQuery } from '@mui/material'
import React, { useEffect, useRef } from 'react'

interface AdsterraProps {
  type: 'left-sticky' | 'right-sticky' | 'header-banner' | 'footer-sticky'
  adKey: string
  id?: string
}

const Adsterra: React.FC<AdsterraProps> = ({ type, adKey, id }) => {
  const iframeRef = useRef<HTMLIFrameElement>(null)

  // Ad configurations based on type
  const getAdConfig = () => {
    switch (type) {
      case 'left-sticky':
        return {
          width: 160,
          height: 300,
          format: 'iframe',
        }
      case 'right-sticky':
        return {
          width: 160,
          height: 300,
          format: 'iframe',
        }
      case 'header-banner':
        return {
          width: 468,
          height: 60,
          format: 'iframe',
        }
      case 'footer-sticky':
        return {
          width: 468,
          height: 60,
          format: 'iframe',
        }
      default:
        return {
          width: 300,
          height: 250,
          format: 'iframe',
        }
    }
  }

  const config = getAdConfig()

  useEffect(() => {
    if (!iframeRef.current) return

    const iframe = iframeRef.current

    // Create the HTML content for the iframe
    const iframeContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <style>
          body { 
            margin: 0; 
            padding: 0; 
            overflow: hidden; 
            background: #f9f9f9;
            display: flex;
            align-items: center;
            justify-content: center;
          }
          #ad-container { 
            width: 100%; 
            height: 100%; 
            display: flex; 
            align-items: center; 
            justify-content: center; 
          }
        </style>
      </head>
      <body>
        <div id="ad-container">
          <script type="text/javascript">
            atOptions = {
              'key': '${adKey}',
              'format': '${config.format}',
              'height': ${config.height},
              'width': ${config.width},
              'params': {}
            };
          </script>
          <script type="text/javascript" src="//www.highperformanceformat.com/${adKey}/invoke.js"></script>
        </div>
      </body>
      </html>
    `

    // Write content to iframe
    iframe.onload = () => {
      const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document
      if (iframeDoc) {
        iframeDoc.open()
        iframeDoc.write(iframeContent)
        iframeDoc.close()
      }
    }

    // Trigger load
    iframe.src = 'about:blank'
  }, [adKey, config])

  // Styling based on ad type
  const getContainerStyle = (): React.CSSProperties => {
    const baseStyle: React.CSSProperties = {
      width: `${config.width}px`,
      height: `${config.height}px`,
      backgroundColor: '#f9f9f9',
      border: '1px solid #e0e0e0',
      borderRadius: '4px',
      overflow: 'hidden',
      zIndex: 1000,
      maxWidth: '100vw',
      marginLeft: 'auto',
    }

    switch (type) {
      case 'left-sticky':
        return {
          ...baseStyle,
          position: 'fixed',
          left: '10px',
          top: '50%',
          transform: 'translateY(-50%)',
          boxShadow: '2px 0 8px rgba(0,0,0,0.1)',
        }
      case 'right-sticky':
        return {
          ...baseStyle,
          position: 'fixed',
          right: '10px',
          top: '50%',
          transform: 'translateY(-50%)',
          boxShadow: '-2px 0 8px rgba(0,0,0,0.1)',
        }
      case 'header-banner':
        return {
          ...baseStyle,
          margin: '10px auto',
          textAlign: 'center',
        }
      case 'footer-sticky':
        return {
          ...baseStyle,
          position: 'fixed',
          bottom: '0',
          left: '50%',
          transform: 'translateX(-50%)',
          boxShadow: '0 -2px 8px rgba(0,0,0,0.1)',
          borderRadius: '4px 4px 0 0',
        }
      default:
        return baseStyle
    }
  }

  return (
    <div style={getContainerStyle()}>
      <iframe
        ref={iframeRef}
        style={{
          width: '100%',
          height: '100%',
          border: 'none',
        }}
        title={`${type}-ad-${id || adKey}`}
      />

      {/* Close button for sticky ads */}
      {(type === 'left-sticky' || type === 'right-sticky' || type === 'footer-sticky') && (
        <button
          onClick={() => {
            const container = document.querySelector(
              `[title="${type}-ad-${id || adKey}"]`,
            )?.parentElement
            if (container) {
              ;(container as HTMLElement).style.display = 'none'
            }
          }}
          style={{
            position: 'absolute',
            top: '5px',
            right: '5px',
            width: '20px',
            height: '20px',
            backgroundColor: 'rgba(0,0,0,0.7)',
            color: 'white',
            border: 'none',
            borderRadius: '50%',
            fontSize: '12px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1001,
          }}
          title='Close ad'
        >
          ×
        </button>
      )}
    </div>
  )
}

// Usage Example Component
const AdsterraDemo: React.FC<{
  showTop?: boolean
  showBottom?: boolean
  showSide?: boolean
}> = ({ showTop = true, showBottom = true, showSide = true }) => {
  const isMobile = useMediaQuery('(max-width: 720px)')

  return (
    <div>
      {/* Sticky Ads - These will be positioned fixed */}
      {!isMobile && showSide && (
        <>
          <Adsterra type='left-sticky' adKey='b740e8679cd18ebe26072edc8f4666e4' id='left-sidebar' />
          <Adsterra
            type='right-sticky'
            adKey='b740e8679cd18ebe26072edc8f4666e4'
            id='right-sidebar'
          />
        </>
      )}
      {showTop && (
        <Adsterra type='header-banner' adKey='b5c628d38e33d2e21c1f8c9e255b816d' id='header-ad' />
      )}
      {showBottom && (
        <Adsterra
          type='footer-sticky'
          adKey='b5c628d38e33d2e21c1f8c9e255b816d'
          id='footer-banner'
        />
      )}
    </div>
  )
}

export default AdsterraDemo
