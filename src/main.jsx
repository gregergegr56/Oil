import React from 'react'
import ReactDOM from 'react-dom/client'
import { AdaptivityProvider, ConfigProvider, useAdaptivityWithJSMediaQueries } from '@vkontakte/vkui'
import '@vkontakte/vkui/dist/vkui.css'
import App from './App'
import vkBridge from '@vkontakte/vk-bridge'

vkBridge.send('VKWebAppInit')

const Root = () => {
  return (
    <ConfigProvider>
      <AdaptivityProvider>
        <App />
      </AdaptivityProvider>
    </ConfigProvider>
  )
}

ReactDOM.createRoot(document.getElementById('root')).render(<Root />)
