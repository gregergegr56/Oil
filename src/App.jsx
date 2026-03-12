import { useState, useEffect } from 'react'
import vkBridge from '@vkontakte/vk-bridge'
import {
  Panel,
  PanelHeader,
  PanelHeaderButton,
  Header,
  Group,
  SimpleCell,
  Div,
  Progress,
  Footnote,
  Spinner,
  Caption,
  Text,
  Tabbar,
  TabbarItem,
  View,
  Button
} from '@vkontakte/vkui'

const API_URL = 'https://api.oilpriceapi.com/v1/demo/prices'

const CATEGORIES = {
  oil: { id: 'oil', name: 'Нефть', icon: '🛢️' },
  energy: { id: 'energy', name: 'Энергия', icon: '⚡' },
  metals: { id: 'metals', name: 'Металлы', icon: '🥇' },
  currency: { id: 'currency', name: 'Валюты', icon: '💱' }
}

const CATEGORY_MAP = {
  BRENT_CRUDE_USD: 'oil',
  WTI_CRUDE_USD: 'oil',
  US_NATURAL_GAS_USD: 'energy',
  HEATING_OIL_USD: 'energy',
  GASOLINE_USD: 'energy',
  DIESEL_GULF_COAST_USD: 'energy',
  GOLD_USD: 'metals',
  EUR_USD: 'currency',
  GBP_USD: 'currency'
}

function App() {
  const [prices, setPrices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [lastUpdate, setLastUpdate] = useState(null)
  const [activeTab, setActiveTab] = useState('oil')
  const [view, setView] = useState('main')
  const [userName, setUserName] = useState('')

  useEffect(() => {
    vkBridge.send('VKWebAppGetUserInfo')
      .then(data => {
        if (data && data.first_name) {
          setUserName(`${data.first_name} ${data.last_name || ''}`)
        }
      })
      .catch(() => {})
  }, [])

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

  const getPricesByCategory = (categoryId) => {
    return prices.filter(item => CATEGORY_MAP[item.code] === categoryId)
  }

  const renderPriceCard = (item) => (
    <SimpleCell
      key={item.code}
      multiline
      subtitle={
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', marginTop: '4px' }}>
          <Caption style={{ color: '#999' }}>
            🕐 {item.updated_at ? new Date(item.updated_at).toLocaleString('ru-RU') : '—'}
          </Caption>
          <Caption style={{ color: '#999' }}>
            за 24ч
          </Caption>
        </div>
      }
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
  )

  const renderCategoryPanel = (categoryId) => {
    const categoryPrices = getPricesByCategory(categoryId)
    const category = CATEGORIES[categoryId]

    if (loading && prices.length === 0) {
      return (
        <Panel header={<PanelHeader>{category.icon} {category.name}</PanelHeader>}>
          <Div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
            <Spinner size="large" />
          </Div>
        </Panel>
      )
    }

    if (error && prices.length === 0) {
      return (
        <Panel header={<PanelHeader>{category.icon} {category.name}</PanelHeader>}>
          <Div>
            <Text weight="2" style={{ color: '#ff3b30', textAlign: 'center' }}>
              {error}
            </Text>
            <Div style={{ marginTop: 16 }}>
              <Button size="l" stretched onClick={handleRefresh}>
                Попробовать снова
              </Button>
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
              <PanelHeaderButton onClick={handleRefresh}>
                🔃
              </PanelHeaderButton>
            }
          >
            {category.icon} {category.name}
          </PanelHeader>
        }
      >
        {loading && <Progress value={50} style={{ marginTop: 8 }} />}
        
        {categoryPrices.length > 0 ? (
          <Group>
            {categoryPrices.map(renderPriceCard)}
          </Group>
        ) : (
          <Group>
            <Div style={{ textAlign: 'center', padding: '32px 0' }}>
              <Footnote style={{ color: '#999' }}>
                Нет данных в этой категории
              </Footnote>
            </Div>
          </Group>
        )}

        <Group>
          <Div style={{ display: 'flex', justifyContent: 'center' }}>
            <Button
              size="l"
              stretched
              onClick={handleRefresh}
              disabled={loading}
            >
              {loading ? 'Обновление...' : '🔄 Обновить данные'}
            </Button>
          </Div>
        </Group>
      </Panel>
    )
  }

  return (
    <View activePanel={view}>
      <Panel id="main">
        <PanelHeader
          right={
            <PanelHeaderButton onClick={handleRefresh}>
              🔃
            </PanelHeaderButton>
          }
        >
          💰 {userName || 'Цены на сырьё'}
        </PanelHeader>

        <Group>
          <Div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
            {Object.values(CATEGORIES).map((cat) => (
              <Button
                key={cat.id}
                size="s"
                mode={activeTab === cat.id ? 'primary' : 'secondary'}
                onClick={() => setActiveTab(cat.id)}
              >
                {cat.icon} {cat.name}
              </Button>
            ))}
          </Div>
        </Group>

        {renderCategoryPanel(activeTab)}

        <Tabbar>
          <TabbarItem
            selected={activeTab === 'oil'}
            onClick={() => setActiveTab('oil')}
            text="Нефть"
          >
            🛢️
          </TabbarItem>
          <TabbarItem
            selected={activeTab === 'energy'}
            onClick={() => setActiveTab('energy')}
            text="Энергия"
          >
            ⚡
          </TabbarItem>
          <TabbarItem
            selected={activeTab === 'metals'}
            onClick={() => setActiveTab('metals')}
            text="Металлы"
          >
            🥇
          </TabbarItem>
          <TabbarItem
            selected={activeTab === 'currency'}
            onClick={() => setActiveTab('currency')}
            text="Валюты"
          >
            💱
          </TabbarItem>
        </Tabbar>
      </Panel>
    </View>
  )
}

export default App
