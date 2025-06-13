import { Box } from '@mantine/core';

const AnimatedBackground = () => {
  return (
    <Box
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        pointerEvents: 'none',
        zIndex: 0,
        overflow: 'hidden',
        background: '#000',
      }}
    >
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
              rgba(20, 20, 20, 0) 0deg,
              rgba(30, 30, 30, 0.15) 90deg,
              rgba(20, 20, 20, 0) 180deg,
              rgba(30, 30, 30, 0.15) 270deg,
              rgba(20, 20, 20, 0) 360deg
            )
          `,
          animation: 'rotate 20s linear infinite',
          opacity: 0.6,
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
              rgba(20, 20, 20, 0) 0deg,
              rgba(30, 30, 30, 0.1) 90deg,
              rgba(20, 20, 20, 0) 180deg,
              rgba(30, 30, 30, 0.1) 270deg,
              rgba(20, 20, 20, 0) 360deg
            )
          `,
          animation: 'rotate 15s linear infinite reverse',
          opacity: 0.5,
        }}
      />
      <Box
        style={{
          position: 'absolute',
          inset: 0,
          background: 'radial-gradient(circle at 50% 50%, transparent 0%, rgba(0, 0, 0, 0.7) 100%)',
        }}
      />

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
        `}
      </style>
    </Box>
  );
};

export default AnimatedBackground; 