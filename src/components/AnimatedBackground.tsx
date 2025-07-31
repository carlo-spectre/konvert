import { Box } from '@mantine/core';
import { motion } from 'framer-motion';

const AnimatedBackground = () => {
  return (
    <Box
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
        background: '#0a0a0a',
      }}
    >
      {/* Digital scanline effect */}
      <Box
        style={{
          position: 'absolute',
          inset: 0,
          zIndex: 1,
          pointerEvents: 'none',
          background:
            'repeating-linear-gradient(to bottom, rgba(255,255,255,0.04) 0px, rgba(255,255,255,0.04) 1px, transparent 1px, transparent 4px)',
          animation: 'scanline-move 1s linear infinite',
        }}
      />
      <Box
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '200vmax',
          height: '200vmax',
          transform: 'translate(-50%, -50%)',
          background: `
            conic-gradient(
              from 0deg at 50% 50%,
              rgba(0, 255, 255, 0) 0deg,
              rgba(0, 255, 255, 0.1) 90deg,
              rgba(255, 0, 255, 0) 180deg,
              rgba(255, 0, 255, 0.1) 270deg,
              rgba(0, 255, 255, 0) 360deg
            )
          `,
          animation: 'rotate 20s linear infinite',
          opacity: 0.4,
        }}
      />
      <Box
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: '150vmax',
          height: '150vmax',
          transform: 'translate(-50%, -50%)',
          background: `
            conic-gradient(
              from 180deg at 50% 50%,
              rgba(255, 0, 255, 0) 0deg,
              rgba(255, 0, 255, 0.1) 90deg,
              rgba(0, 255, 255, 0) 180deg,
              rgba(0, 255, 255, 0.1) 270deg,
              rgba(255, 0, 255, 0) 360deg
            )
          `,
          animation: 'rotate 15s linear infinite reverse',
          opacity: 0.3,
        }}
      />
      <Box
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at 50% 50%, transparent 0%, rgba(0, 0, 0, 0.8) 100%)',
        }}
      />

      {/* Grid overlay */}
      <Box
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: `
            linear-gradient(rgba(0, 255, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 0, 255, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px',
          animation: 'grid-move 20s linear infinite',
          opacity: 0.2,
        }}
      />

      {/* Random floating particles */}
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.div
          key={i}
          style={{
            position: 'absolute',
            width: '2px',
            height: '2px',
            background: i % 2 === 0 ? '#00ffff' : '#ff00ff',
            borderRadius: '50%',
            boxShadow: i % 2 === 0 ? '0 0 10px #00ffff' : '0 0 10px #ff00ff',
          }}
          animate={{
            x: ['0vw', '100vw'],
            y: [
              Math.random() * 100 + 'vh',
              Math.random() * 100 + 'vh',
            ],
          }}
          transition={{
            duration: Math.random() * 10 + 10,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      ))}

      <style>
        {`
          @keyframes rotate {
            from {
              transform: translate(-50%, -50%) rotate(0deg);
            }
            to {
              transform: translate(-50%, -50%) rotate(360deg);
            }
          }

          @keyframes grid-move {
            from {
              transform: translateY(0);
            }
            to {
              transform: translateY(50px);
            }
          }

          @keyframes scanline-move {
            0% { background-position-y: 0; }
            100% { background-position-y: 4px; }
          }
        `}
      </style>
    </Box>
  );
};

export default AnimatedBackground; 