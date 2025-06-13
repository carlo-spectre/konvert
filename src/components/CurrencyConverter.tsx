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
  padding: '16px',
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
    }
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

  const handleBaseAmountChange = (value: string | number) => {
    const numValue = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(numValue)) return;
    
    const newRows = [...rows];
    newRows[0] = { ...newRows[0], amount: numValue };
    setRows(updateConversions(newRows));
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
      <Group grow>
        <Select
          data={CURRENCIES}
          value={rows[0].currency}
          onChange={(val) => handleCurrencyChange(val, 0)}
          rightSectionWidth={0}
          comboboxProps={{ withinPortal: true }}
          styles={{
            input: {
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: 'white',
              fontSize: '14px',
            },
            section: { display: 'none' }
          }}
        />
        <NumberInput
          value={rows[0].amount}
          onChange={handleBaseAmountChange}
          min={0}
          hideControls
          thousandSeparator=","
          styles={{
            input: {
              background: 'rgba(255,255,255,0.05)',
              border: '1px solid rgba(255,255,255,0.1)',
              color: 'white',
              fontSize: '14px',
            }
          }}
        />
      </Group>

      <Divider
        my="lg"
        variant="dashed"
        style={{ borderColor: 'rgba(255,255,255,0.1)' }}
        label={<Text c="dimmed">Added Currencies</Text>}
        labelPosition="center"
      />

      <Stack gap="md">
        {rows.slice(1).map((row, index) => (
          <Group key={row.id} style={{ alignItems: 'center' }}>
            <Box style={{ flex: 1 }}>
              <Group grow>
                <Select
                  data={CURRENCIES.filter(c => c.value !== rows[0].currency)}
                  value={row.currency}
                  onChange={(value) => handleCurrencyChange(value, index + 1)}
                  rightSectionWidth={0}
                  comboboxProps={{ withinPortal: true }}
                  styles={{
                    input: {
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      color: 'white',
                      fontSize: '14px',
                    },
                    section: { display: 'none' }
                  }}
                />
                <NumberInput
                  value={row.amount}
                  readOnly
                  hideControls
                  thousandSeparator=","
                  styles={{
                    input: {
                      background: 'rgba(255,255,255,0.05)',
                      border: '1px solid rgba(255,255,255,0.1)',
                      color: 'white',
                      fontSize: '14px',
                    }
                  }}
                />
              </Group>
            </Box>
            <ActionIcon
              variant="subtle"
              color="red"
              onClick={() => removeCurrency(index + 1)}
              style={{ 
                background: 'rgba(255,0,0,0.1)',
                borderRadius: '8px',
                marginLeft: '8px',
              }}
            >
              <IconTrash size={16} />
            </ActionIcon>
          </Group>
        ))}
      </Stack>

      {rows.length < 10 && (
        <Button
          fullWidth
          mt="lg"
          onClick={addCurrency}
          leftSection={<IconPlus size={16} style={{ color: 'rgba(255, 82, 82, 1)' }} />}
          variant="subtle"
          style={{
            background: 'rgba(255, 82, 82, 0.05)',
            border: '1px solid rgba(255, 82, 82, 0.2)',
            transition: 'all 0.2s ease',
            color: 'rgba(255, 82, 82, 0.8)',
            fontWeight: 500,
            height: '42px',
            fontSize: '14px',
            borderRadius: '8px',
          }}
          styles={{
            root: {
              '&:hover': {
                background: 'rgba(255, 82, 82, 0.1)',
                border: '1px solid rgba(255, 82, 82, 0.3)',
                transform: 'translateY(-1px)'
              }
            }
          }}
        >
          Add Currency
        </Button>
      )}
    </Box>
  );
};

export default CurrencyConverter; 