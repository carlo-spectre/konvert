import { useState } from 'react';
import { Box, Text, Group, Tooltip, ScrollArea } from '@mantine/core';

interface HistoryItem {
  expression: string;
  result: string;
  timestamp: Date;
}

interface HistoryPanelProps {
  history?: HistoryItem[];
  onHistoryClick?: (expression: string) => void;
}

const HistoryPanel = ({ history = [], onHistoryClick }: HistoryPanelProps) => {
  return (
    <Box
      className="panel panel-history"
      style={{
        background: 'linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
        backdropFilter: 'blur(10px)',
        borderRadius: '16px',
        padding: '24px',
        border: '1px solid rgba(255,255,255,0.1)',
        width: '100%',
        maxWidth: '420px',
        height: '100%',
      }}
    >
      <Text size="xl" c="gray.1" mb="xl" style={{ fontFamily: '"Orbitron", sans-serif' }}>
        Calculation History
      </Text>

      <Box style={{ height: '400px', overflow: 'hidden' }}>
        <ScrollArea 
          h={400} 
          type="scroll"
          offsetScrollbars
          styles={{
            scrollbar: {
              backgroundColor: 'rgba(0, 255, 255, 0.2)',
              border: '1px solid rgba(0, 255, 255, 0.3)',
              borderRadius: '4px',
              '&:hover': {
                backgroundColor: 'rgba(0, 255, 255, 0.4)',
              }
            },
            thumb: {
              backgroundColor: 'rgba(0, 255, 255, 0.6)',
              borderRadius: '4px',
              '&:hover': {
                backgroundColor: 'rgba(0, 255, 255, 0.8)',
              }
            },
            viewport: {
              paddingRight: '8px'
            }
          }}
        >
          <Box>
            {history.map((item, idx) => (
              <Box
                key={idx}
                style={{
                  borderBottom: '1px solid rgba(255,255,255,0.07)',
                  padding: '12px 0',
                  margin: 0,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                onClick={() => onHistoryClick?.(item.expression)}
                onMouseEnter={(e) => {
                  e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.backgroundColor = 'transparent';
                }}
              >
                <Group align="flex-start" gap="md">
                  {/* Timestamp on the left */}
                  <Text size="xs" c="dimmed" style={{ minWidth: 70, color: '#fff', marginTop: '4px' }}>
                    {new Date(item.timestamp).toLocaleTimeString()}
                  </Text>
                  
                  {/* Expression and result on the right */}
                  <Box style={{ flex: 1 }}>
                    <Tooltip label={item.expression}>
                      <Text size="xs" style={{ color: '#fff', opacity: 0.8, marginBottom: '4px', textAlign: 'right' }}>
                        {item.expression}
                      </Text>
                    </Tooltip>
                    <Text fw={700} size="md" style={{ color: '#fff', textAlign: 'right' }}>
                      {Number(item.result).toLocaleString()}
                    </Text>
                  </Box>
                </Group>
              </Box>
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