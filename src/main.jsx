import React from 'react'
import ReactDOM from 'react-dom/client'
import { AdaptivityProvider, ConfigProvider } from '@vkontakte/vkui'
import { useAppearance } from '@vkontakte/vk-bridge-react'
import '@vkontakte/vkui/dist/vkui.css'
import App from './App'
import vkBridge from '@vkontakte/vk-bridge'

vkBridge.send('VKWebAppInit')

const Root = () => {
  const appearance = useAppearance()
  
  return (
    <ConfigProvider appearance={appearance} isWebView={vkBridge.isWebView()}>
      <AdaptivityProvider>
        <App />
      </AdaptivityProvider>
    </ConfigProvider>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(<Root />)
