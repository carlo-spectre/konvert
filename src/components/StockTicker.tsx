import { Box, Text } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';

interface StockData {
  symbol: string;
  price: number;
  change: number;
  changePercent: number;
}

const mockStockData: StockData[] = [
  { symbol: 'AAPL', price: 175.43, change: 2.15, changePercent: 1.24 },
  { symbol: 'GOOGL', price: 142.56, change: -1.23, changePercent: -0.85 },
  { symbol: 'MSFT', price: 378.85, change: 5.67, changePercent: 1.52 },
  { symbol: 'TSLA', price: 248.42, change: -3.21, changePercent: -1.28 },
  { symbol: 'AMZN', price: 145.24, change: 1.89, changePercent: 1.32 },
  { symbol: 'NVDA', price: 485.09, change: 12.45, changePercent: 2.64 },
  { symbol: 'META', price: 334.92, change: -2.34, changePercent: -0.69 },
  { symbol: 'NFLX', price: 492.19, change: 8.76, changePercent: 1.81 },
  { symbol: 'SPY', price: 456.78, change: 3.45, changePercent: 0.76 },
  { symbol: 'QQQ', price: 389.12, change: -1.89, changePercent: -0.48 },
];

const StockTicker = () => {
  const isMobile = useMediaQuery('(max-width: 768px)');

  return (
    <Box
      style={{
        marginTop: isMobile ? '1rem' : '1.5rem',
        marginBottom: isMobile ? '1rem' : '1.5rem',
        padding: '12px 0',
        background: 'rgba(0, 0, 0, 0.3)',
        border: '1px solid rgba(0, 255, 255, 0.2)',
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
          background: 'linear-gradient(90deg, transparent, #00ffff, transparent)',
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

      {/* Scrolling stocks container */}
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
            duration: 30,
            repeat: Infinity,
            ease: 'linear',
          }}
        >
          {/* Duplicate the stocks array to create seamless loop */}
          {[...mockStockData, ...mockStockData].map((stock, index) => {
            const isPositive = stock.change >= 0;
            return (
              <Box
                key={`${stock.symbol}-${index}`}
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
                    color: '#00ffff',
                    fontSize: isMobile ? '0.8rem' : '1rem',
                  }}
                >
                  {stock.symbol}
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
                  ${stock.price.toFixed(2)}
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
                    {isPositive ? '+' : ''}{stock.change.toFixed(2)}
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
                    ({isPositive ? '+' : ''}{stock.changePercent.toFixed(2)}%)
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
          background: `radial-gradient(circle at center, rgba(0, 255, 255, 0.1) 0%, transparent 70%)`,
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

export default StockTicker; 