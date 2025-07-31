import { motion } from 'framer-motion';
import { Title } from '@mantine/core';
import { useEffect, useState } from 'react';
import { useMediaQuery } from '@mantine/hooks';

interface GlitchTitleProps {
  text: string;
}

const GlitchTitle = ({ text }: GlitchTitleProps) => {
  const [isGlitching, setIsGlitching] = useState(false);
  const isMobile = useMediaQuery('(max-width: 768px)');

  useEffect(() => {
    const glitchInterval = setInterval(() => {
      setIsGlitching(true);
      setTimeout(() => setIsGlitching(false), 200);
    }, 3000);

    return () => clearInterval(glitchInterval);
  }, []);

  return (
    <motion.div
      style={{
        position: 'relative',
        display: 'inline-block',
        marginBottom: '2rem',
      }}
      animate={{
        textShadow: isGlitching
          ? [
              '2px 2px #ff00ff, -2px -2px #00ffff',
              '-2px 2px #ff00ff, 2px -2px #00ffff',
              '2px -2px #ff00ff, -2px 2px #00ffff',
              '-2px -2px #ff00ff, 2px 2px #00ffff',
            ]
          : '0 0 20px #00ffff, 0 0 30px #00ffff, 0 0 40px #00ffff',
      }}
      transition={{ duration: 0.1 }}
    >
      <Title
        ta="center"
        style={{
          fontSize: isMobile ? '2.5rem' : '4rem',
          fontFamily: '"Orbitron", sans-serif',
          color: '#fff',
          textTransform: 'uppercase',
          letterSpacing: isMobile ? '0.1em' : '0.2em',
        }}
      >
        {text}
      </Title>
      {isGlitching && (
        <>
          <motion.div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              color: '#ff00ff',
              clipPath: 'polygon(0 0, 100% 0, 100% 45%, 0 45%)',
            }}
            animate={{ x: [-2, 2, -2] }}
            transition={{ duration: 0.2 }}
          >
            <Title
              ta="center"
              style={{
                fontSize: isMobile ? '2.5rem' : '4rem',
                fontFamily: '"Orbitron", sans-serif',
                textTransform: 'uppercase',
                letterSpacing: isMobile ? '0.1em' : '0.2em',
              }}
            >
              {text}
            </Title>
          </motion.div>
          <motion.div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              color: '#00ffff',
              clipPath: 'polygon(0 45%, 100% 45%, 100% 100%, 0 100%)',
            }}
            animate={{ x: [2, -2, 2] }}
            transition={{ duration: 0.2 }}
          >
            <Title
              ta="center"
              style={{
                fontSize: isMobile ? '2.5rem' : '4rem',
                fontFamily: '"Orbitron", sans-serif',
                textTransform: 'uppercase',
                letterSpacing: isMobile ? '0.1em' : '0.2em',
              }}
            >
              {text}
            </Title>
          </motion.div>
        </>
      )}
    </motion.div>
  );
};

export default GlitchTitle; 