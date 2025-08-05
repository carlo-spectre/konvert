import { useState, useEffect, useRef } from 'react';
import { Box, Button, Group, Stack, Text, ScrollArea, Tooltip } from '@mantine/core';

interface HistoryItem {
  expression: string;
  result: string;
  timestamp: Date;
}

interface CalculatorProps {
  onHistoryUpdate?: (history: HistoryItem[]) => void;
  selectedExpression?: string;
  onExpressionSelected?: () => void;
}

const Calculator = ({ onHistoryUpdate, selectedExpression, onExpressionSelected }: CalculatorProps) => {


  const [display, setDisplay] = useState('0');
  const [currentExpression, setCurrentExpression] = useState('');
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [lastOperation, setLastOperation] = useState<string | null>(null);
  const [isFocused, setIsFocused] = useState(false);
  const calculatorRef = useRef<HTMLDivElement>(null);

  // Handle selected expression from history
  useEffect(() => {
    if (selectedExpression && selectedExpression !== display) {
      setCurrentExpression(selectedExpression);
      // Find the result for this expression from history
      const historyItem = history.find(item => item.expression === selectedExpression);
      if (historyItem) {
        setDisplay(historyItem.result);
      } else {
        setDisplay(selectedExpression);
      }
      onExpressionSelected?.(); // Clear the selection after using it
    }
  }, [selectedExpression, onExpressionSelected, history]);

  const formatExpression = (expression: string) => {
    // Split the expression by operators and format each number
    const parts = expression.split(/(\s[+\-×÷]\s)/);
    return parts.map(part => {
      // If it's an operator, return as is
      if (/^\s[+\-×÷]\s$/.test(part)) {
        return part;
      }
      // If it's a number, format it
      const cleanPart = part.replace(/,/g, '');
      const num = parseFloat(cleanPart);
      if (!isNaN(num)) {
        return num.toLocaleString();
      }
      return part;
    }).join('');
  };

  const handleNumber = (num: string) => {
    setDisplay(prev => {
      if (prev === '0') {
        setCurrentExpression(num);
        return num;
      }
      
      // If we're in the middle of an expression, just add the number
      if (prev.includes(' ')) {
        const newDisplay = prev + num;
        setCurrentExpression(newDisplay);
        return formatExpression(newDisplay);
      }
      
      // If it's just a single number, add to it and format
      const cleanPrev = prev.replace(/,/g, '');
      const newNumber = cleanPrev + num;
      setCurrentExpression(newNumber);
      return Number(newNumber).toLocaleString();
    });
  };

  const handleOperator = (op: string) => {
    // Don't add operator if the last character is already an operator
    if (display.endsWith(' + ') || display.endsWith(' - ') || 
        display.endsWith(' × ') || display.endsWith(' ÷ ')) {
      return;
    }
    const newExpression = display + ' ' + op + ' ';
    setCurrentExpression(newExpression);
    setDisplay(prev => prev + ' ' + op + ' ');
  };

  const handleClear = () => {
    setDisplay('0');
    setCurrentExpression('');
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

      // Replace × with * and ÷ with / for evaluation, and remove commas
      const sanitizedExpression = expressionToEvaluate
        .replace(/×/g, '*')
        .replace(/÷/g, '/')
        .replace(/,/g, '') // Remove commas
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
      const newHistory = [{
        expression: expressionToEvaluate,
        result: result,
        timestamp: new Date()
      }, ...history.slice(0, 9)]; // Keep only last 10 items

      setHistory(newHistory);
      onHistoryUpdate?.(newHistory);
      
      // Update display with result and keep expression visible
      setLastOperation(expressionToEvaluate + ' = ' + Number(result).toLocaleString());
      setDisplay(Number(result).toLocaleString());
      // Don't clear currentExpression so it stays visible on top
    } catch (error) {
      console.error('Calculation error:', error);
      setDisplay('Error');
    }
  };

  // Add keyboard event handler
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Only handle keyboard events if calculator is focused
      if (!isFocused) return;

      // Prevent default behavior for these keys to avoid unwanted scrolling
      if (['+', '-', '*', '/', 'Enter', '=', 'c', 'C'].includes(event.key)) {
        event.preventDefault();
      }

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
  }, [display, isFocused]); // Add isFocused to dependencies

  return (
    <Box
      ref={calculatorRef}
      tabIndex={0}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      style={{
        background: 'linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
        backdropFilter: 'blur(10px)',
        borderRadius: '16px',
        padding: '24px',
        border: '1px solid rgba(255,255,255,0.1)',
        width: '100%',
        height: '100%',
        outline: 'none',
        transition: 'all 0.3s ease',
        '&:focus': {
          boxShadow: '0 0 0 2px rgba(0, 255, 255, 0.5)',
        },
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
        {currentExpression && (
          <Text size="sm" c="gray.4" style={{ marginBottom: '8px', textAlign: 'right' }}>
            {currentExpression}
          </Text>
        )}
        <Text size="xl" c="gray.0" style={{ wordBreak: 'break-all', fontSize: '24px', textAlign: 'right' }}>
          {display}
        </Text>
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
  );
};

export default Calculator; 