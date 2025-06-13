import { Paper, Text, Stack } from '@mantine/core';
import { motion } from 'framer-motion';
import type { HTMLMotionProps } from 'framer-motion';

interface HistoryPanelProps {
  calculations: string[];
}

type MotionDivProps = HTMLMotionProps<"div"> & {
  p?: string;
  radius?: string;
};

const HistoryPanel = ({ calculations }: HistoryPanelProps) => {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  const MotionDiv = motion.div;

  return (
    <Paper p="md" radius="md" withBorder>
      <Text fw={500} size="lg" mb="md">
        History
      </Text>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {calculations.map((calc, index) => (
          <MotionDiv
            key={index}
            variants={item}
            initial="hidden"
            animate="show"
            style={{
              padding: '0.5rem',
              borderRadius: '0.25rem',
              backgroundColor: 'var(--mantine-color-gray-0)',
              border: '1px solid var(--mantine-color-gray-2)'
            }}
          >
            <Text size="sm" style={{ fontFamily: 'monospace' }}>
              {calc}
            </Text>
          </MotionDiv>
        ))}
        {calculations.length === 0 && (
          <Text c="dimmed" size="sm" ta="center">
            No calculations yet
          </Text>
        )}
      </div>
    </Paper>
  );
};

export default HistoryPanel; 