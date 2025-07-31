import { MantineProvider, Box, createTheme, Group, Tabs } from '@mantine/core'
import { useMediaQuery } from '@mantine/hooks'
import CurrencyConverter from './components/CurrencyConverter'
import Calculator from './components/Calculator'
import AnimatedBackground from './components/AnimatedBackground'
import GlitchTitle from './components/GlitchTitle'
import HistoryPanel from './components/HistoryPanel'
import { useState } from 'react'
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
  const isMobile = useMediaQuery('(max-width: 768px)');

  return (
    <MantineProvider theme={theme}>
      <Box 
        bg="black" 
        style={{ 
          minHeight: '100vh',
          minWidth: '100vw',
          margin: 0,
          padding: isMobile ? '1rem' : '2rem',
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 100%)',
          fontFamily: 'Orbitron, sans-serif',
        }}
      >
        <AnimatedBackground />
        <Box style={{ position: 'relative', zIndex: 1 }}>
          <GlitchTitle text="Konvert" />
          
          {isMobile ? (
            // Mobile layout with tabs
            <Tabs defaultValue="converter" style={{ marginTop: '2rem' }}>
              <Tabs.List 
                style={{ 
                  justifyContent: 'center',
                  marginBottom: '2rem',
                  background: 'rgba(255, 255, 255, 0.05)',
                  borderRadius: '12px',
                  padding: '4px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
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
                <Box style={{ width: '100%', height: '500px' }}>
                  <CurrencyConverter />
                </Box>
              </Tabs.Panel>

              <Tabs.Panel value="calculator">
                <Box style={{ width: '100%', height: '500px' }}>
                  <Calculator onHistoryUpdate={setCalculatorHistory} />
                </Box>
              </Tabs.Panel>

              <Tabs.Panel value="history">
                <Box style={{ width: '100%', height: '500px' }}>
                  <HistoryPanel history={calculatorHistory} />
                </Box>
              </Tabs.Panel>
            </Tabs>
          ) : (
            // Desktop layout with horizontal panels
            <Group align="flex-start" justify="center" gap="xl">
              <Box style={{ width: '400px', height: '600px' }}>
                <CurrencyConverter />
              </Box>
              <Box style={{ width: '400px', height: '600px' }}>
                <Calculator onHistoryUpdate={setCalculatorHistory} />
              </Box>
              <Box style={{ width: '400px', height: '600px' }}>
                <HistoryPanel history={calculatorHistory} />
              </Box>
            </Group>
          )}
        </Box>
      </Box>
    </MantineProvider>
  )
}

export default App
