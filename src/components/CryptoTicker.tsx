import { Box, Text } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { motion } from 'framer-motion';

interface CryptoData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
}

const mockCryptoData: CryptoData[] = [
  { symbol: 'BTC', price: 43250.67, change: 1250.34, changePercent: 2.98 },
  { symbol: 'ETH', price: 2650.89, change: -45.23, changePercent: -1.68 },
  { symbol: 'BNB', price: 312.45, change: 8.76, changePercent: 2.88 },
  { symbol: 'SOL', price: 98.23, change: 12.45, changePercent: 14.52 },
  { symbol: 'ADA', price: 0.4856, change: -0.0234, changePercent: -4.60 },
  { symbol: 'XRP', price: 0.5678, change: 0.0234, changePercent: 4.30 },
  { symbol: 'DOT', price: 7.234, change: 0.456, changePercent: 6.73 },
  { symbol: 'MATIC', price: 0.8923, change: -0.0345, changePercent: -3.72 },
  { symbol: 'LINK', price: 15.67, change: 1.23, changePercent: 8.52 },
  { symbol: 'UNI', price: 8.456, change: -0.234, changePercent: -2.69 },
];

const CryptoTicker = () => {
  const isMobile = useMediaQuery('(max-width: 768px)');

  return (
    <Box
      style={{
        marginTop: '0.5rem',
        marginBottom: isMobile ? '1rem' : '1.5rem',
        padding: '12px 0',
        background: 'rgba(0, 0, 0, 0.3)',
        border: '1px solid rgba(255, 0, 255, 0.2)',
        borderRadius: '8px',
        backdropFilter: 'blur(10px)',
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      {/* Animated background line */}
      <motion.div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '2px',
          background: 'linear-gradient(90deg, transparent, #ff00ff, transparent)',
        }}
        animate={{
          x: ['-100%', '100%'],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: 'linear',
        }}
      />

      {/* Scrolling crypto container */}
      <Box
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '2rem',
          padding: '0 1rem',
        }}
      >
        <motion.div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '2rem',
            whiteSpace: 'nowrap',
          }}
          animate={{
            x: ['0%', '-50%'],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          {/* Duplicate the crypto array to create seamless loop */}
          {[...mockCryptoData, ...mockCryptoData].map((crypto, index) => {
            const isPositive = crypto.change >= 0;
            return (
              <Box
                key={`${crypto.symbol}-${index}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  minWidth: '180px',
                }}
              >
                <Text
                  size={isMobile ? 'sm' : 'md'}
                  style={{
                    fontFamily: '"Orbitron", sans-serif',
                    fontWeight: 600,
                    color: '#ff00ff',
                    fontSize: isMobile ? '0.8rem' : '1rem',
                  }}
                >
                  {crypto.symbol}
                </Text>

                <Text
                  size={isMobile ? 'sm' : 'md'}
                  style={{
                    fontFamily: 'monospace',
                    fontWeight: 500,
                    color: '#ffffff',
                    fontSize: isMobile ? '0.8rem' : '1rem',
                  }}
                >
                  ${crypto.price.toFixed(crypto.price < 1 ? 4 : 2)}
                </Text>

                <Box
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                  }}
                >
                  <Text
                    size={isMobile ? 'xs' : 'sm'}
                    style={{
                      fontFamily: 'monospace',
                      fontWeight: 500,
                      color: isPositive ? '#00ff00' : '#ff4444',
                      fontSize: isMobile ? '0.7rem' : '0.8rem',
                    }}
                  >
                    {isPositive ? '+' : ''}{crypto.change.toFixed(crypto.change < 1 ? 4 : 2)}
                  </Text>
                  <Text
                    size={isMobile ? 'xs' : 'sm'}
                    style={{
                      fontFamily: 'monospace',
                      fontWeight: 500,
                      color: isPositive ? '#00ff00' : '#ff4444',
                      fontSize: isMobile ? '0.7rem' : '0.8rem',
                    }}
                  >
                    ({isPositive ? '+' : ''}{crypto.changePercent.toFixed(2)}%)
                  </Text>
                </Box>
              </Box>
            );
          })}
        </motion.div>
      </Box>

      {/* Subtle glow effect */}
      <motion.div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `radial-gradient(circle at center, rgba(255, 0, 255, 0.1) 0%, transparent 70%)`,
          pointerEvents: 'none',
        }}
        animate={{
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </Box>
  );
};

export default CryptoTicker; 