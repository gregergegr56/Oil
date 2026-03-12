import { useState, useEffect } from 'react'
import vkBridge from '@vkontakte/vk-bridge'
import {
  Panel,
  PanelHeader,
  Header,
  Group,
  SimpleCell,
  Div,
  Progress,
  InfoRow,
  Footnote,
  Spinner,
  Card,
  Caption,
  Text
} from '@vkontakte/vkui'
import { Icon24Refresh } from '@vkontakte/icons'

const API_URL = 'https://api.oilpriceapi.com/v1/demo/prices'
const REFRESH_INTERVAL = 10000 // 10 секунд

function App() {
  const [prices, setPrices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [lastUpdate, setLastUpdate] = useState(null)

  const fetchPrices = async () => {
    try {
      const response = await fetch(API_URL)
      if (!response.ok) {
        throw new Error('Ошибка сети')
      }
      const data = await response.json()
      
      if (data.status === 'success' && data.data?.prices) {
        setPrices(data.data.prices)
        setLastUpdate(new Date())
        setError(null)
      } else {
        throw new Error('Неверный формат данных')
      }
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPrices()
    
    const interval = setInterval(fetchPrices, REFRESH_INTERVAL)
    return () => clearInterval(interval)
  }, [])

  const handleRefresh = () => {
    setLoading(true)
    fetchPrices()
  }

  const formatPrice = (price, currency) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency || 'USD',
      minimumFractionDigits: 2
    }).format(price)
  }

  const formatChange = (change) => {
    const sign = change >= 0 ? '+' : ''
    return `${sign}${change.toFixed(2)}%`
  }

  const getChangeColor = (change) => {
    if (change > 0) return '#4bb34b'
    if (change < 0) return '#ff3b30'
    return '#999'
  }

  if (loading && prices.length === 0) {
    return (
      <Panel header={<PanelHeader>Цены на нефть</PanelHeader>}>
        <Div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
          <Spinner size="large" />
        </Div>
      </Panel>
    )
  }

  if (error && prices.length === 0) {
    return (
      <Panel header={<PanelHeader>Цены на нефть</PanelHeader>}>
        <Div>
          <Text weight="2" style={{ color: '#ff3b30', textAlign: 'center' }}>
            {error}
          </Text>
          <Div style={{ marginTop: 16 }}>
            <button onClick={handleRefresh} style={{ width: '100%', padding: '12px', background: '#0077FF', color: 'white', border: 'none', borderRadius: '8px' }}>
              Попробовать снова
            </button>
          </Div>
        </Div>
      </Panel>
    )
  }

  return (
    <Panel
      header={
        <PanelHeader
          right={
            <div onClick={handleRefresh} style={{ cursor: 'pointer', padding: '8px' }}>
              <Icon24Refresh fill="#0077FF" style={{ transform: loading ? 'rotate(360deg)' : 'none', transition: 'transform 0.3s' }} />
            </div>
          }
        >
          Цены на нефть
        </PanelHeader>
      }
    >
      <Group>
        <Div>
          <Header mode="secondary">Нефть и энергоносители</Header>
          {loading && <Progress value={50} style={{ marginTop: 8 }} />}
        </Div>
      </Group>

      <Group>
        {prices.map((item) => (
          <SimpleCell
            key={item.code}
            subtitle={
              <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                <InfoRow header="Обновлено">
                  {item.updated_at ? new Date(item.updated_at).toLocaleTimeString('ru-RU') : '—'}
                </InfoRow>
              </div>
            }
            multiline
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: '16px' }}>{item.name}</div>
                <Caption style={{ color: '#999' }}>{item.code}</Caption>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontWeight: 700, fontSize: '18px' }}>
                  {formatPrice(item.price, item.currency)}
                </div>
                <div style={{ 
                  color: getChangeColor(item.change_24h), 
                  fontWeight: 500,
                  fontSize: '14px'
                }}>
                  {formatChange(item.change_24h)}
                </div>
              </div>
            </div>
          </SimpleCell>
        ))}
      </Group>

      <Group>
        <Div style={{ textAlign: 'center' }}>
          <Footnote style={{ color: '#999' }}>
            Данные предоставлены в демо-режиме<br />
            {lastUpdate && `Последнее обновление: ${lastUpdate.toLocaleTimeString('ru-RU')}`}
          </Footnote>
        </Div>
      </Group>
    </Panel>
  )
}

export default App
