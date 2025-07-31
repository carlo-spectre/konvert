import { useState } from 'react';
import { Box, Text, Group, Tooltip, ScrollArea } from '@mantine/core';

interface HistoryItem {
  expression: string;
  result: string;
  timestamp: Date;
}

interface HistoryPanelProps {
  history?: HistoryItem[];
}

const HistoryPanel = ({ history = [] }: HistoryPanelProps) => {
  return (
    <Box
      style={{
        background: 'linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
        backdropFilter: 'blur(10px)',
        borderRadius: '16px',
        padding: '24px',
        border: '1px solid rgba(255,255,255,0.1)',
        width: '100%',
        height: '100%',
      }}
    >
      <Text size="xl" c="gray.1" mb="xl" style={{ fontFamily: '"Orbitron", sans-serif' }}>
        Calculation History
      </Text>

      <Box style={{ height: '400px', overflow: 'hidden' }}>
        <ScrollArea h={400} type="scroll">
          <Box>
            {history.length > 0 && (
              <Box mb="xs">
                <Group gap="md" align="center" style={{ opacity: 0.7 }}>
                  <Text size="xs" style={{ minWidth: 90, color: '#fff' }}>Expression</Text>
                  <Text size="xs" style={{ minWidth: 36, textAlign: 'center', color: '#fff' }}>Result</Text>
                  <Text size="xs" style={{ minWidth: 70, textAlign: 'right', marginLeft: 'auto', color: '#fff' }}>Time</Text>
                </Group>
              </Box>
            )}
            {history.map((item, idx) => (
              <Group
                key={idx}
                align="center"
                gap="md"
                style={{
                  borderBottom: '1px solid rgba(255,255,255,0.07)',
                  padding: '4px 0',
                  margin: 0,
                }}
              >
                <Tooltip label={item.expression}>
                  <Text size="sm" style={{ minWidth: 90, color: '#fff', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {item.expression}
                  </Text>
                </Tooltip>
                <Text fw={700} size="md" style={{ color: '#fff', minWidth: 36, textAlign: 'center' }}>
                  {Number(item.result).toLocaleString()}
                </Text>
                <Text size="xs" c="dimmed" style={{ marginLeft: 'auto', minWidth: 70, textAlign: 'right', color: '#fff' }}>
                  {new Date(item.timestamp).toLocaleTimeString()}
                </Text>
              </Group>
            ))}
            {history.length === 0 && (
              <Text size="sm" c="dimmed" ta="center" mt="xl">
                No calculations yet
              </Text>
            )}
          </Box>
        </ScrollArea>
      </Box>
    </Box>
  );
};

export default HistoryPanel; 