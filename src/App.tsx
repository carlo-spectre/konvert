import { MantineProvider, Box, createTheme, Group, ActionIcon, Text } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import CurrencyConverter from './components/CurrencyConverter'
import Calculator from './components/Calculator'
import AnimatedBackground from './components/AnimatedBackground'
import GlitchTitle from './components/GlitchTitle'
import StockTicker from './components/StockTicker'
import CryptoTicker from './components/CryptoTicker'
import HistoryPanel from './components/HistoryPanel'
import { useState, useEffect } from 'react'
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
  const [activeTab, setActiveTab] = useState<string>('converter');
  const isMobile = useMediaQuery('(max-width: 768px)');

  // Ensure initial state is properly applied
  useEffect(() => {
    // Force a re-render to ensure initial styling is applied
    setActiveTab('converter');
    console.log('Initial activeTab set to:', 'converter');
  }, []);

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
          
          /* Custom tab styles - removed old Mantine overrides */
          
          /* Custom scrollbar that's always visible */
          .always-visible-scrollbar {
            overflow-y: scroll !important;
          }
          
          .always-visible-scrollbar::-webkit-scrollbar {
            width: 12px !important;
            background: rgba(0, 0, 0, 0.2) !important;
          }
          
          .always-visible-scrollbar::-webkit-scrollbar-track {
            background: rgba(0, 0, 0, 0.2) !important;
            border-radius: 6px !important;
          }
          
          .always-visible-scrollbar::-webkit-scrollbar-thumb {
            background: rgba(0, 255, 255, 0.6) !important;
            border-radius: 6px !important;
            border: 2px solid rgba(0, 0, 0, 0.2) !important;
          }
          
          .always-visible-scrollbar::-webkit-scrollbar-thumb:hover {
            background: rgba(0, 255, 255, 0.8) !important;
          }
          
          /* Firefox scrollbar */
          .always-visible-scrollbar {
            scrollbar-width: thin !important;
            scrollbar-color: rgba(0, 255, 255, 0.6) rgba(0, 0, 0, 0.2) !important;
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
              // Mobile layout with custom tabs
              /* Custom Tab Navigation */
            <Box style={{ marginTop: '2rem' }}>
              {/* Tab Headers */}
              <Box 
                style={{ 
                  display: 'flex', 
                  justifyContent: 'center', 
                  marginBottom: '2rem',
                  gap: '0',
                  background: 'transparent',
                  borderRadius: '12px',
                  padding: '4px'
                }}
              >
                <Box
                  onClick={() => {
                    console.log('Converter clicked, setting activeTab to converter');
                    setActiveTab('converter');
                  }}
                  style={{
                    cursor: 'pointer',
                    padding: '8px 12px',
                    color: (activeTab === 'converter' || activeTab === '' || activeTab === undefined) ? '#00ffff' : 'rgba(255, 255, 255, 0.5)',
                    borderBottom: (activeTab === 'converter' || activeTab === '' || activeTab === undefined) ? '2px solid #00ffff' : '2px solid transparent',
                    transition: 'all 0.1s ease',
                    fontSize: '0.8rem',
                    fontWeight: 500,
                    userSelect: 'none',
                    border: 'none',
                    background: 'transparent'
                  }}
                  onMouseEnter={(e) => {
                    if (activeTab !== 'converter') {
                      e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (activeTab !== 'converter') {
                      e.currentTarget.style.color = 'rgba(255, 255, 255, 0.5)';
                    }
                  }}
                >
                  Converter
                </Box>
                
                <Box
                  onClick={() => setActiveTab('calculator')}
                  style={{
                    cursor: 'pointer',
                    padding: '8px 12px',
                    color: activeTab === 'calculator' ? '#00ffff' : 'rgba(255, 255, 255, 0.5)',
                    borderBottom: activeTab === 'calculator' ? '2px solid #00ffff' : '2px solid transparent',
                    transition: 'all 0.1s ease',
                    fontSize: '0.8rem',
                    fontWeight: 500,
                    userSelect: 'none',
                    border: 'none',
                    background: 'transparent'
                  }}
                  onMouseEnter={(e) => {
                    if (activeTab !== 'calculator') {
                      e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (activeTab !== 'calculator') {
                      e.currentTarget.style.color = 'rgba(255, 255, 255, 0.5)';
                    }
                  }}
                >
                  Calculator
                </Box>
                
                <Box
                  onClick={() => setActiveTab('history')}
                  style={{
                    cursor: 'pointer',
                    padding: '8px 12px',

                    color: activeTab === 'history' ? '#00ffff' : 'rgba(255, 255, 255, 0.5)',
                    borderBottom: activeTab === 'history' ? '2px solid #00ffff' : '2px solid transparent',
                    transition: 'all 0.1s ease',
                    fontSize: '0.8rem',
                    fontWeight: 500,
                    userSelect: 'none',
                    border: 'none',
                    background: 'transparent'
                  }}
                  onMouseEnter={(e) => {
                    if (activeTab !== 'history') {
                      e.currentTarget.style.color = 'rgba(255, 255, 255, 0.7)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (activeTab !== 'history') {
                      e.currentTarget.style.color = 'rgba(255, 255, 255, 0.5)';
                    }
                  }}
                >
                  History
                </Box>
              </Box>

              {/* Tab Content */}
              {activeTab === 'converter' && (
                <Box style={{ width: '100%', minHeight: '400px', overflow: 'auto', display: 'flex', justifyContent: 'center' }}>
                  <CurrencyConverter />
                </Box>
              )}
              
              {activeTab === 'calculator' && (
                <Box style={{ width: '100%', minHeight: '400px', overflow: 'auto', display: 'flex', justifyContent: 'center' }}>
                  <Calculator 
                    onHistoryUpdate={setCalculatorHistory} 
                    selectedExpression={selectedHistoryExpression}
                    onExpressionSelected={() => setSelectedHistoryExpression('')}
                  />
                </Box>
              )}
              
              {activeTab === 'history' && (
                <Box style={{ width: '100%', minHeight: '400px', overflow: 'auto', display: 'flex', justifyContent: 'center' }}>
                  <HistoryPanel 
                    history={calculatorHistory} 
                    onHistoryClick={handleHistoryClick}
                  />
                </Box>
              )}
            </Box>
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
