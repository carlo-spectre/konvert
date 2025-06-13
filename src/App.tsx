import { MantineProvider, Box, Title, createTheme, Group } from '@mantine/core'
import CurrencyConverter from './components/CurrencyConverter'
import Calculator from './components/Calculator'
import AnimatedBackground from './components/AnimatedBackground'
import '@mantine/core/styles.css'

const theme = createTheme({
  primaryColor: 'blue',
  primaryShade: { light: 6, dark: 8 },
  components: {
    Select: {
      defaultProps: {
        rightSectionWidth: 0
      }
    }
  }
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
      }}
    >
      <AnimatedBackground />
      <Box style={{ position: 'relative', zIndex: 1 }}>
        <Title ta="center" mb="xl" c="gray.1">Konvert</Title>
        <Group align="flex-start" justify="center" gap="xl">
          <Box style={{ width: '600px' }}>
            <CurrencyConverter />
          </Box>
          <Box style={{ width: '700px' }}>
            <Calculator />
          </Box>
        </Group>
      </Box>
    </Box>
  </MantineProvider>
)

export default App
