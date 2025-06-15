import { MantineProvider, Box, createTheme, Group } from '@mantine/core'
import CurrencyConverter from './components/CurrencyConverter'
import Calculator from './components/Calculator'
import AnimatedBackground from './components/AnimatedBackground'
import GlitchTitle from './components/GlitchTitle'
import '@mantine/core/styles.css'

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

const App = () => (
  <MantineProvider theme={theme}>
    <Box 
      bg="black" 
      style={{ 
        minHeight: '100vh',
        minWidth: '100vw',
        margin: 0,
        padding: '2rem',
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'linear-gradient(135deg, #000000 0%, #1a1a1a 100%)',
      }}
    >
      <AnimatedBackground />
      <Box style={{ position: 'relative', zIndex: 1 }}>
        <GlitchTitle text="Konvert" />
        <Group align="flex-start" justify="center" gap="xl">
          <Box 
            style={{ 
              width: '600px',
              background: 'rgba(0, 255, 255, 0.05)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              border: '1px solid rgba(0, 255, 255, 0.1)',
              boxShadow: '0 0 20px rgba(0, 255, 255, 0.2)',
              transition: 'all 0.3s ease',
              '&:hover': {
                boxShadow: '0 0 30px rgba(0, 255, 255, 0.3)',
                transform: 'translateY(-5px)',
              },
            }}
          >
            <CurrencyConverter />
          </Box>
          <Box 
            style={{ 
              width: '700px',
              background: 'rgba(255, 0, 255, 0.05)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              border: '1px solid rgba(255, 0, 255, 0.1)',
              boxShadow: '0 0 20px rgba(255, 0, 255, 0.2)',
              transition: 'all 0.3s ease',
              '&:hover': {
                boxShadow: '0 0 30px rgba(255, 0, 255, 0.3)',
                transform: 'translateY(-5px)',
              },
            }}
          >
            <Calculator />
          </Box>
        </Group>
      </Box>
    </Box>
  </MantineProvider>
)

export default App
