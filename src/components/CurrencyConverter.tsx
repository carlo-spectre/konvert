import React, { useState, useEffect } from 'react';
import { Box, Select, NumberInput, Button, Group, Stack, ActionIcon, Divider, Text } from '@mantine/core';
import { IconTrash, IconPlus } from '@tabler/icons-react';

const CURRENCIES = [
  { label: 'US Dollar (USD)', value: 'USD' },
  { label: 'Euro (EUR)', value: 'EUR' },
  { label: 'British Pound (GBP)', value: 'GBP' },
  { label: 'Japanese Yen (JPY)', value: 'JPY' },
  { label: 'Hong Kong Dollar (HKD)', value: 'HKD' },
  { label: 'Philippine Peso (PHP)', value: 'PHP' },
  { label: 'Bitcoin (BTC)', value: 'BTC' },
  { label: 'Ethereum (ETH)', value: 'ETH' },
  { label: 'Solana (SOL)', value: 'SOL' },
  { label: 'Australian Dollar (AUD)', value: 'AUD' },
  { label: 'New Zealand Dollar (NZD)', value: 'NZD' },
  { label: 'Canadian Dollar (CAD)', value: 'CAD' },
  { label: 'Swiss Franc (CHF)', value: 'CHF' },
];

const CRYPTO_CURRENCIES = ['BTC', 'ETH', 'SOL'];

const containerStyles = {
  background: 'linear-gradient(145deg, #1a1a1a, #0a0a0a)',
  borderRadius: '16px',
  padding: '24px',
  boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.05)'
};

const rowStyles = {
  background: 'rgba(255, 255, 255, 0.02)',
  borderRadius: '12px',
  padding: '12px',
  transition: 'all 0.2s ease',
  '&:hover': {
    background: 'rgba(255, 255, 255, 0.03)',
    transform: 'translateY(-1px)'
  }
};

const inputStyles = {
  root: { width: '100%' },
  label: { 
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: '0.85rem',
    fontWeight: 500,
    marginBottom: '8px'
  },
  input: { 
    color: '#ffffff',
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    borderRadius: '8px',
    height: '42px',
    fontSize: '1rem',
    transition: 'all 0.2s ease',
    '&:focus': {
      backgroundColor: 'rgba(0, 0, 0, 0.3)',
      borderColor: 'rgba(255, 255, 255, 0.1)'
    },
    '&[readonly]': {
      backgroundColor: 'rgba(0, 0, 0, 0.15)',
      color: 'rgba(255, 255, 255, 0.9)',
      border: '1px solid rgba(255, 255, 255, 0.03)'
    },
    '&::-webkit-inner-spin-button, &::-webkit-outer-spin-button': {
      '-webkit-appearance': 'none',
      margin: 0
    },
    '&[type=number]': {
      '-moz-appearance': 'textfield'
    }
  }
};

const baseInputStyles = {
  ...inputStyles,
  label: {
    ...inputStyles.label,
    fontSize: '1rem',
    marginBottom: '12px'
  },
  input: {
    ...inputStyles.input,
    height: '48px',
    fontSize: '1.1rem'
  }
};

interface CurrencyRow {
  id: string;
  currency: string;
  amount: number;
}

const CurrencyConverter = () => {
  const [rows, setRows] = useState<CurrencyRow[]>([
    { id: '1', currency: 'USD', amount: 1 },
    { id: '2', currency: 'EUR', amount: 0 },
  ]);
  const [rates, setRates] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  const fetchRates = async () => {
    try {
      // Fetch crypto rates
      const cryptoResponse = await fetch(
        'https://api.coingecko.com/api/v3/simple/price?ids=bitcoin,ethereum,solana&vs_currencies=usd'
      );
      const cryptoData = await cryptoResponse.json();
      
      // Fetch forex rates
      const forexResponse = await fetch(
        'https://api.exchangerate-api.com/v4/latest/USD'
      );
      const forexData = await forexResponse.json();

      // Combine rates
      const newRates = {
        USD: 1,
        ...forexData.rates,
        BTC: 1 / cryptoData.bitcoin.usd,
        ETH: 1 / cryptoData.ethereum.usd,
        SOL: 1 / cryptoData.solana.usd,
      };

      setRates(newRates);
      setLoading(false);
      
      // Update conversions with new rates
      setRows(prev => updateConversions(prev, newRates));
    } catch (error) {
      console.error('Error fetching rates:', error);
      // Fallback to some default rates if API fails
      setRates({
        USD: 1,
        EUR: 0.92,
        GBP: 0.79,
        JPY: 148.41,
        HKD: 7.82,
        PHP: 55.67,
        BTC: 0.000023,
        ETH: 0.00037,
        SOL: 0.0137,
        AUD: 1.52,
        NZD: 1.65,
        CAD: 1.35,
        CHF: 0.88,
      });
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRates();
    // Refresh rates every 5 minutes
    const interval = setInterval(fetchRates, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const calculateAmount = (baseAmount: number, fromCurrency: string, toCurrency: string, currentRates: Record<string, number>) => {
    const usdAmount = baseAmount / currentRates[fromCurrency];
    return Number((usdAmount * currentRates[toCurrency]).toFixed(CRYPTO_CURRENCIES.includes(toCurrency) ? 8 : 2));
  };

  const updateConversions = (newRows: CurrencyRow[], currentRates: Record<string, number> = rates) => {
    const baseRow = newRows[0];
    return newRows.map((row, index) => {
      if (index === 0) return row;
      return {
        ...row,
        amount: calculateAmount(baseRow.amount, baseRow.currency, row.currency, currentRates)
      };
    });
  };

  const handleAmountChange = (value: string | number, index: number) => {
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(numValue)) return;
    
    const newRows = [...rows];
    newRows[index] = { ...newRows[index], amount: numValue };

    // If changing base amount
    if (index === 0) {
      setRows(updateConversions(newRows));
    } else {
      // If changing other amounts, reverse calculate the base amount
      const targetCurrency = newRows[index].currency;
      const baseCurrency = newRows[0].currency;
      const newBaseAmount = calculateAmount(numValue, targetCurrency, baseCurrency, rates);
      newRows[0] = { ...newRows[0], amount: newBaseAmount };
      setRows(updateConversions(newRows));
    }
  };

  const handleCurrencyChange = (value: string | null, index: number) => {
    if (!value) return;
    const newRows = [...rows];
    newRows[index] = { ...newRows[index], currency: value };
    setRows(updateConversions(newRows));
  };

  const addCurrency = () => {
    const availableCurrencies = CURRENCIES.filter(
      c => !rows.some(row => row.currency === c.value)
    );
    if (availableCurrencies.length === 0) return;

    const newRow: CurrencyRow = {
      id: Date.now().toString(),
      currency: availableCurrencies[0].value,
      amount: 0
    };
    const newRows = [...rows, newRow];
    setRows(updateConversions(newRows));
  };

  const removeCurrency = (index: number) => {
    if (index === 0 || rows.length <= 2) return;
    const newRows = rows.filter((_, i) => i !== index);
    setRows(updateConversions(newRows));
  };

  if (loading) {
    return (
      <Box
        style={{
          background: 'linear-gradient(145deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.02) 100%)',
          backdropFilter: 'blur(10px)',
          borderRadius: '16px',
          padding: '24px',
          border: '1px solid rgba(255,255,255,0.1)',
          overflow: 'hidden',
        }}
      >
        <Text c="dimmed" ta="center">Loading exchange rates...</Text>
      </Box>
    );
  }

  return (
    <Box style={containerStyles}>
      <Stack gap="md">
        {rows.map((row, index) => (
          <Group key={row.id} style={rowStyles} align="center">
            <Box style={{ flex: 1 }}>
              <Select
                label={index === 0 ? "Base Currency" : undefined}
                placeholder={index === 0 ? undefined : "Select currency"}
                value={row.currency}
                onChange={(value) => handleCurrencyChange(value, index)}
                data={CURRENCIES.filter(c => 
                  c.value === row.currency || 
                  !rows.some(r => r.currency === c.value)
                )}
                styles={index === 0 ? baseInputStyles : inputStyles}
              />
            </Box>
            <Box style={{ flex: 1 }}>
              <NumberInput
                label={index === 0 ? "Amount" : undefined}
                placeholder={index === 0 ? undefined : "Amount"}
                value={row.amount}
                onChange={(value) => handleAmountChange(value, index)}
                decimalScale={CRYPTO_CURRENCIES.includes(row.currency) ? 8 : 2}
                min={0}
                hideControls
                styles={index === 0 ? baseInputStyles : inputStyles}
              />
            </Box>
            {index > 1 && (
              <ActionIcon
                color="red"
                variant="subtle"
                onClick={() => removeCurrency(index)}
                style={{ marginTop: index === 0 ? '32px' : 0 }}
              >
                <IconTrash size={20} />
              </ActionIcon>
            )}
          </Group>
        ))}
        
        {rows.length < CURRENCIES.length && (
          <Button
            leftSection={<IconPlus size={20} />}
            variant="subtle"
            onClick={addCurrency}
            style={{
              backgroundColor: 'rgba(0, 255, 255, 0.1)',
              color: '#00ffff',
              '&:hover': {
                backgroundColor: 'rgba(0, 255, 255, 0.2)',
              }
            }}
          >
            Add Currency
          </Button>
        )}
      </Stack>
    </Box>
  );
};

export default CurrencyConverter; 