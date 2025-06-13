import { useState, useEffect } from 'react';
import { Box, Button, Group, Stack, Text, ScrollArea } from '@mantine/core';

interface HistoryItem {
  expression: string;
  result: string;
  timestamp: Date;
}

const Calculator = () => {
  const [display, setDisplay] = useState('0');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [lastOperation, setLastOperation] = useState<string | null>(null);

  const handleNumber = (num: string) => {
    setDisplay(prev => prev === '0' ? num : prev + num);
  };

  const handleOperator = (op: string) => {
    // Don't add operator if the last character is already an operator
    if (display.endsWith(' + ') || display.endsWith(' - ') || 
        display.endsWith(' × ') || display.endsWith(' ÷ ')) {
      return;
    }
    setDisplay(prev => prev + ' ' + op + ' ');
  };

  const handleClear = () => {
    setDisplay('0');
    setLastOperation(null);
  };

  const handleDelete = () => {
    setDisplay(prev => {
      if (prev.length <= 1) return '0';
      if (prev.endsWith(' ')) return prev.slice(0, -3);
      return prev.slice(0, -1);
    });
  };

  const handleEquals = () => {
    try {
      // Don't calculate if display is just a single number
      if (!/[+\-×÷]/.test(display)) {
        return;
      }

      // Remove any trailing operators
      let expressionToEvaluate = display;
      if (expressionToEvaluate.endsWith(' + ') || 
          expressionToEvaluate.endsWith(' - ') || 
          expressionToEvaluate.endsWith(' × ') || 
          expressionToEvaluate.endsWith(' ÷ ')) {
        expressionToEvaluate = expressionToEvaluate.slice(0, -3);
      }

      // Replace × with * and ÷ with / for evaluation
      const sanitizedExpression = expressionToEvaluate
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        .replace(/\s/g, ''); // Remove all spaces
      
      console.log('Expression to evaluate:', sanitizedExpression);
      
      // Evaluate the expression
      const result = eval(sanitizedExpression).toString();
      console.log('Result:', result);
      
      // Don't update if the result is undefined or NaN
      if (result === 'undefined' || result === 'NaN') {
        console.log('Invalid result');
        return;
      }

      // Add to history
      setHistory(prev => [{
        expression: expressionToEvaluate,
        result,
        timestamp: new Date()
      }, ...prev].slice(0, 10));
      
      // Store last operation
      setLastOperation(expressionToEvaluate + ' = ' + result);
      
      // Set result as new display
      setDisplay(result);
    } catch (error) {
      console.error('Calculation error:', error);
      setDisplay('Error');
    }
  };

  // Add keyboard event handler
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Prevent default behavior for these keys to avoid unwanted scrolling
      if (['+', '-', '*', '/', 'Enter', '=', 'c', 'C'].includes(event.key)) {
        event.preventDefault();
      }

      console.log('Key pressed:', event.key);

      // Numbers (both number row and numpad)
      if (/^[0-9]$/.test(event.key)) {
        handleNumber(event.key);
      }
      // Decimal point (both period and numpad decimal)
      else if (event.key === '.' || event.key === ',') {
        handleNumber('.');
      }
      // Operators
      else if (event.key === '+') {
        handleOperator('+');
      }
      else if (event.key === '-') {
        handleOperator('-');
      }
      else if (event.key === '*' || event.key === 'x' || event.key === '×') {
        handleOperator('×');
      }
      else if (event.key === '/' || event.key === '÷') {
        handleOperator('÷');
      }
      // Enter/Return for equals
      else if (event.key === 'Enter' || event.key === 'Return') {
        console.log('Enter pressed, current display:', display);
        handleEquals();
      }
      // Backspace for delete
      else if (event.key === 'Backspace') {
        handleDelete();
      }
      // C for clear
      else if (event.key.toLowerCase() === 'c') {
        handleClear();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [display]); // Add display to dependencies since we use it in the handler

  return (
    <Group align="flex-start" gap="xl" wrap="nowrap">
      <Box
        style={{
          background: 'linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          padding: '24px',
          border: '1px solid rgba(255,255,255,0.1)',
          width: '320px'
        }}
      >
        {/* Display */}
        <Box
          style={{
            background: 'rgba(0,0,0,0.4)',
            padding: '16px',
            borderRadius: '8px',
            marginBottom: '24px',
            minHeight: '80px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
          }}
        >
          {lastOperation && (
            <Text size="xs" c="gray.4" style={{ marginBottom: '8px' }}>
              {lastOperation}
            </Text>
          )}
          <Text size="xl" c="gray.0" style={{ wordBreak: 'break-all', fontSize: '24px' }}>{display}</Text>
        </Box>

        {/* Calculator Buttons */}
        <Group mb="lg" grow>
          <Button 
            variant="subtle" 
            color="red" 
            onClick={handleClear}
            style={{ background: 'rgba(255,82,82,0.15)', height: '45px', fontSize: '16px' }}
          >
            C
          </Button>
          <Button 
            variant="subtle" 
            onClick={handleDelete}
            style={{ background: 'rgba(255,255,255,0.1)', height: '45px', fontSize: '16px' }}
          >
            ←
          </Button>
          <Button 
            variant="subtle"
            onClick={() => handleOperator('÷')}
            style={{ background: 'rgba(255,255,255,0.1)', height: '45px', fontSize: '16px' }}
          >
            ÷
          </Button>
        </Group>

        <Group mb="lg" grow>
          {['7', '8', '9'].map(num => (
            <Button
              key={num}
              variant="subtle"
              onClick={() => handleNumber(num)}
              style={{ background: 'rgba(255,255,255,0.1)', height: '45px', fontSize: '16px' }}
            >
              {num}
            </Button>
          ))}
          <Button
            variant="subtle"
            onClick={() => handleOperator('×')}
            style={{ background: 'rgba(255,255,255,0.1)', height: '45px', fontSize: '16px' }}
          >
            ×
          </Button>
        </Group>

        <Group mb="lg" grow>
          {['4', '5', '6'].map(num => (
            <Button
              key={num}
              variant="subtle"
              onClick={() => handleNumber(num)}
              style={{ background: 'rgba(255,255,255,0.1)', height: '45px', fontSize: '16px' }}
            >
              {num}
            </Button>
          ))}
          <Button
            variant="subtle"
            onClick={() => handleOperator('-')}
            style={{ background: 'rgba(255,255,255,0.1)', height: '45px', fontSize: '16px' }}
          >
            -
          </Button>
        </Group>

        <Group mb="lg" grow>
          {['1', '2', '3'].map(num => (
            <Button
              key={num}
              variant="subtle"
              onClick={() => handleNumber(num)}
              style={{ background: 'rgba(255,255,255,0.1)', height: '45px', fontSize: '16px' }}
            >
              {num}
            </Button>
          ))}
          <Button
            variant="subtle"
            onClick={() => handleOperator('+')}
            style={{ background: 'rgba(255,255,255,0.1)', height: '45px', fontSize: '16px' }}
          >
            +
          </Button>
        </Group>

        <Group grow>
          <Button
            variant="subtle"
            onClick={() => handleNumber('0')}
            style={{ background: 'rgba(255,255,255,0.1)', height: '45px', fontSize: '16px' }}
          >
            0
          </Button>
          <Button
            variant="subtle"
            onClick={() => handleNumber('.')}
            style={{ background: 'rgba(255,255,255,0.1)', height: '45px', fontSize: '16px' }}
          >
            .
          </Button>
          <Button
            variant="subtle"
            color="blue"
            onClick={handleEquals}
            style={{ 
              background: 'rgba(51,154,240,0.2)',
              height: '45px',
              fontSize: '16px'
            }}
          >
            =
          </Button>
        </Group>
      </Box>

      {/* History */}
      <Box
        style={{
          background: 'linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          padding: '24px',
          border: '1px solid rgba(255,255,255,0.1)',
          flex: 1
        }}
      >
        <Text size="lg" c="gray.3" mb="md" style={{ fontSize: '18px', fontWeight: 500 }}>Calculation History</Text>
        <ScrollArea h={400} type="scroll">
          <Stack gap="md">
            {history.map((item, index) => (
              <Box
                key={index}
                style={{
                  background: 'rgba(255,255,255,0.08)',
                  padding: '16px 20px',
                  borderRadius: '8px',
                }}
              >
                <Text size="md" c="gray.4" style={{ fontSize: '16px' }}>{item.expression} =</Text>
                <Text c="gray.0" style={{ fontSize: '24px', marginTop: '8px', fontWeight: 500 }}>{item.result}</Text>
                <Text size="xs" c="gray.5" style={{ marginTop: '8px' }}>
                  {item.timestamp.toLocaleTimeString()}
                </Text>
              </Box>
            ))}
          </Stack>
        </ScrollArea>
      </Box>
    </Group>
  );
};

export default Calculator; 