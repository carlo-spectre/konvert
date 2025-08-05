import { MantineProvider, Box, createTheme, Group, Tabs, ActionIcon, Text } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import CurrencyConverter from './components/CurrencyConverter'
import Calculator from './components/Calculator'
import AnimatedBackground from './components/AnimatedBackground'
import GlitchTitle from './components/GlitchTitle'
import StockTicker from './components/StockTicker'
import CryptoTicker from './components/CryptoTicker'
import HistoryPanel from './components/HistoryPanel'
import { useState } from 'react'
import { IconEye, IconEyeOff } from '@tabler/icons-react'
import '@mantine/core/styles.css'

interface HistoryItem {
  expression: string;
  result: string;
  timestamp: Date;
}

const theme = createTheme({
  primaryColor: 'cyan',
  primaryShade: { light: 5, dark: 7 },
  colors: {
    cyan: [
      '#E0FFFF',
      '#B4F5F5',
      '#88EBEB',
      '#5CE1E1',
      '#30D7D7',
      '#00FFFF',
      '#00D7D7',
      '#00AFAF',
      '#008787',
      '#005F5F',
    ],
    magenta: [
      '#FFE0FF',
      '#F5B4F5',
      '#EB88EB',
      '#E15CE1',
      '#D730D7',
      '#FF00FF',
      '#D700D7',
      '#AF00AF',
      '#870087',
      '#5F005F',
    ],
  },
  components: {
    Box: {
      defaultProps: {
        style: {
          transition: 'all 0.3s ease',
        },
      },
    },
    Button: {
      defaultProps: {
        style: {
          transition: 'all 0.2s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0 0 15px #00FFFF',
          },
        },
      },
    },
  },
})

const App = () => {
  const [calculatorHistory, setCalculatorHistory] = useState<HistoryItem[]>([]);
  const [selectedHistoryExpression, setSelectedHistoryExpression] = useState<string>('');
  const [showMobileTickers, setShowMobileTickers] = useState<boolean>(false);
  const isMobile = useMediaQuery('(max-width: 768px)');

  const handleHistoryClick = (expression: string) => {
    setSelectedHistoryExpression(expression);
  };

  return (
    <MantineProvider theme={theme}>
      <style>
        {`
          /* Target ALL possible elements that could have borders */
          .mantine-Tabs-panel,
          .mantine-Tabs-root,
          .mantine-Tabs-list,
          .mantine-Tabs-tab,
          [data-mantine-tabs-panel],
          [data-mantine-tabs-list],
          [data-mantine-tabs-tab],
          .mantine-Tabs-panel *,
          .mantine-Tabs-root *,
          .mantine-Tabs-list * {
            border: none !important;
            outline: none !important;
            box-shadow: none !important;
          }
          
          /* Remove any pseudo-elements that might be causing borders */
          .mantine-Tabs-list::before,
          .mantine-Tabs-list::after,
          .mantine-Tabs-panel::before,
          .mantine-Tabs-panel::after {
            display: none !important;
          }
          
          /* Keep only the active tab indicator */
          .mantine-Tabs-tab[data-active] {
            border-bottom: 2px solid #00ffff !important;
          }
        `}
      </style>
      <Box 
        bg="black" 
        style={{ 
          minHeight: '100vh',
          width: '100%',
          margin: 0,
          padding: isMobile ? '1rem' : '2rem',
          background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 100%)',
          fontFamily: 'Orbitron, sans-serif',
          overflowX: 'hidden',
        }}
      >
        <AnimatedBackground />
        <Box style={{ position: 'relative', zIndex: 1, height: '100%', display: 'flex', flexDirection: 'column' }}>
          <Box style={{ flexShrink: 0 }}>
            <GlitchTitle text="Konvert" />
            
            {/* Desktop tickers - always visible */}
            {!isMobile && (
              <>
                <StockTicker />
                <CryptoTicker />
              </>
            )}
          </Box>
          
          {/* Mobile tickers - toggleable */}
          {isMobile && (
            <Box style={{ marginBottom: '1rem' }}>
              <Group justify="space-between" align="center">
                <Text size="sm" c="gray.4" style={{ fontFamily: '"Orbitron", sans-serif' }}>
                  Market Tickers
                </Text>
                <ActionIcon
                  variant="subtle"
                  onClick={() => setShowMobileTickers(!showMobileTickers)}
                  style={{
                    color: showMobileTickers ? '#00ffff' : 'rgba(255, 255, 255, 0.5)',
                    backgroundColor: 'rgba(0, 255, 255, 0.1)',
                    borderRadius: '6px',
                    border: `1px solid ${showMobileTickers ? 'rgba(0, 255, 255, 0.3)' : 'rgba(255, 255, 255, 0.1)'}`
                  }}
                >
                  {showMobileTickers ? <IconEyeOff size={16} /> : <IconEye size={16} />}
                </ActionIcon>
              </Group>
              
              {showMobileTickers && (
                <Box style={{ marginTop: '0.5rem' }}>
                  <StockTicker />
                  <CryptoTicker />
                </Box>
              )}
            </Box>
          )}
          
          <Box style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            {isMobile ? (
            // Mobile layout with tabs
            <Tabs 
              defaultValue="converter" 
              style={{ marginTop: '2rem' }}
              styles={{
                panel: {
                  border: 'none !important',
                  background: 'transparent !important',
                  boxShadow: 'none !important',
                  outline: 'none !important',
                },
                list: {
                  justifyContent: 'center',
                  marginBottom: '2rem',
                  background: 'transparent',
                  borderRadius: '12px',
                  padding: '4px',
                  border: 'none',
                },
                root: {
                  border: 'none !important',
                  outline: 'none !important',
                }
              }}
            >
              <Tabs.List>
                <Tabs.Tab 
                  value="converter"
                  style={{
                    color: '#00ffff',
                    fontFamily: '"Orbitron", sans-serif',
                    fontWeight: 500,
                  }}
                >
                  Converter
                </Tabs.Tab>
                <Tabs.Tab 
                  value="calculator"
                  style={{
                    color: '#00ffff',
                    fontFamily: '"Orbitron", sans-serif',
                    fontWeight: 500,
                  }}
                >
                  Calculator
                </Tabs.Tab>
                <Tabs.Tab 
                  value="history"
                  style={{
                    color: '#00ffff',
                    fontFamily: '"Orbitron", sans-serif',
                    fontWeight: 500,
                  }}
                >
                  History
                </Tabs.Tab>
              </Tabs.List>

              <Tabs.Panel value="converter">
                <Box style={{ width: '100%', minHeight: '400px', overflow: 'auto' }}>
                  <CurrencyConverter />
                </Box>
              </Tabs.Panel>

              <Tabs.Panel value="calculator">
                <Box style={{ width: '100%', minHeight: '400px', overflow: 'auto' }}>
                  <Calculator 
                    onHistoryUpdate={setCalculatorHistory} 
                    selectedExpression={selectedHistoryExpression}
                    onExpressionSelected={() => setSelectedHistoryExpression('')}
                  />
                </Box>
              </Tabs.Panel>

              <Tabs.Panel value="history">
                <Box style={{ width: '100%', minHeight: '400px', overflow: 'auto' }}>
                  <HistoryPanel 
                    history={calculatorHistory} 
                    onHistoryClick={handleHistoryClick}
                  />
                </Box>
              </Tabs.Panel>
            </Tabs>
          ) : (
            // Desktop layout with horizontal panels
            <Group align="flex-start" justify="space-between" gap="xs" style={{ width: '100%' }}>
              <Box style={{ flex: 1, height: '500px' }}>
                <CurrencyConverter />
              </Box>
              <Box style={{ flex: 1, height: '500px' }}>
                <Calculator 
                  onHistoryUpdate={setCalculatorHistory} 
                  selectedExpression={selectedHistoryExpression}
                  onExpressionSelected={() => setSelectedHistoryExpression('')}
                />
              </Box>
              <Box style={{ flex: 1, height: '500px' }}>
                <HistoryPanel 
                  history={calculatorHistory} 
                  onHistoryClick={handleHistoryClick}
                />
              </Box>
            </Group>
          )}
          </Box>
        </Box>
      </Box>
    </MantineProvider>
  )
}

export default App
