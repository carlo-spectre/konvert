import React, { useState, useEffect } from 'react';
import { Box, Select, NumberInput, Button, Group, Stack, ActionIcon, Divider, Text, ScrollArea, Tabs } from '@mantine/core';
import { IconTrash, IconPlus, IconChevronDown, IconCurrencyDollar, IconCurrencyEuro, IconCurrencyPound, IconCurrencyYen, IconCurrencyDollarOff, IconCurrencyBitcoin, IconCurrencyEthereum, IconFlag, IconSearch } from '@tabler/icons-react';

const FIAT_CURRENCIES = [
  { label: 'AUD', value: 'AUD', flag: '🇦🇺' },
  { label: 'CAD', value: 'CAD', flag: '🇨🇦' },
  { label: 'CHF', value: 'CHF', flag: '🇨🇭' },
  { label: 'EUR', value: 'EUR', flag: '🇪🇺' },
  { label: 'GBP', value: 'GBP', flag: '🇬🇧' },
  { label: 'HKD', value: 'HKD', flag: '🇭🇰' },
  { label: 'JPY', value: 'JPY', flag: '🇯🇵' },
  { label: 'MYR', value: 'MYR', flag: '🇲🇾' },
  { label: 'NZD', value: 'NZD', flag: '🇳🇿' },
  { label: 'PHP', value: 'PHP', flag: '🇵🇭' },
  { label: 'SGD', value: 'SGD', flag: '🇸🇬' },
  { label: 'USD', value: 'USD', flag: '🇺🇸' },
];

const CRYPTO_CURRENCIES = [
  { label: 'BTC', value: 'BTC', icon: IconCurrencyBitcoin },
  { label: 'ETH', value: 'ETH', icon: IconCurrencyEthereum },
  { label: 'SOL', value: 'SOL', icon: IconCurrencyDollarOff },
];

const CURRENCIES = [...FIAT_CURRENCIES, ...CRYPTO_CURRENCIES];

const containerStyles = {
  background: 'linear-gradient(145deg, #1a1a1a, #0a0a0a)',
  borderRadius: '16px',
  padding: '24px',
  boxShadow: '0 4px 30px rgba(0, 0, 0, 0.1)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255, 255, 255, 0.05)'
};

const rowStyles = {
  background: 'transparent',
  borderRadius: '12px',
  padding: '0',
  marginBottom: '12px',
  transition: 'all 0.2s ease',
  '&:hover': {
    background: 'rgba(255, 255, 255, 0.02)',
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
  // Simple formatter for display
  const formatDisplay = (value: number) => {
    return value.toLocaleString('en-US', { 
      minimumFractionDigits: 0,
      maximumFractionDigits: 8 
    });
  };

  const [rows, setRows] = useState<CurrencyRow[]>([
    { id: '1', currency: 'HKD', amount: 1 },
    { id: '2', currency: 'USD', amount: 0 },
    { id: '3', currency: 'PHP', amount: 0 },
    { id: '4', currency: 'MYR', amount: 0 },
  ]);
  const [rates, setRates] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  // Custom Currency Selector Component with Tabs
  const CurrencySelector = ({ value, onChange, label, placeholder, styles }: {
    value: string;
    onChange: (value: string | null) => void;
    label?: string;
    placeholder?: string;
    styles?: any;
  }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [activeTab, setActiveTab] = useState<'fiat' | 'crypto'>('fiat');
    const [searchTerm, setSearchTerm] = useState('');

    const availableFiat = FIAT_CURRENCIES.filter(c => 
      c.value === value || !rows.some(r => r.currency === c.value)
    ).filter(c => 
      c.label.toLowerCase().includes(searchTerm.toLowerCase())
    );
    const availableCrypto = CRYPTO_CURRENCIES.filter(c => 
      c.value === value || !rows.some(r => r.currency === c.value)
    ).filter(c => 
      c.label.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
      <Box style={{ position: 'relative' }}>
        {label && (
          <Text size="sm" c="gray.4" mb={8} style={{ fontSize: '0.85rem', fontWeight: 500 }}>
            {label}
          </Text>
        )}
        
        {/* Trigger Button */}
        <Box
          onClick={() => setIsOpen(!isOpen)}
          style={{
            ...styles?.input,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 16px',
          }}
        >
          <Box style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {value && (
              <Text style={{ fontSize: '1rem' }}>
                {FIAT_CURRENCIES.find(c => c.value === value)?.flag || ''}
              </Text>
            )}
            <Text style={{ color: '#ffffff' }}>
              {value || placeholder || 'Select currency'}
            </Text>
          </Box>
          <IconChevronDown 
            size={16} 
            style={{ color: '#00ffff', marginLeft: '8px' }} 
          />
        </Box>

        {/* Dropdown with Tabs */}
        {isOpen && (
          <Box
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              zIndex: 1000,
              background: 'rgba(0, 0, 0, 0.95)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              marginTop: '4px',
              backdropFilter: 'blur(10px)',
            }}
          >
            <Tabs value={activeTab} onChange={(val) => setActiveTab(val as 'fiat' | 'crypto')}>
              <Tabs.List style={{ 
                background: 'rgba(255, 255, 255, 0.05)', 
                border: 'none',
                justifyContent: 'center',
                display: 'flex'
              }}>
                <Tabs.Tab 
                  value="fiat" 
                  style={{ 
                    color: '#00ffff', 
                    fontSize: '0.8rem',
                    padding: '8px 12px'
                  }}
                >
                  Fiat
                </Tabs.Tab>
                <Tabs.Tab 
                  value="crypto" 
                  style={{ 
                    color: '#ff00ff', 
                    fontSize: '0.8rem',
                    padding: '8px 12px'
                  }}
                >
                  Crypto
                </Tabs.Tab>
              </Tabs.List>

                                        <Tabs.Panel value="fiat" style={{ padding: '12px' }}>
                <Stack gap={6}>
                  {/* Search Input */}
                  <Box
                    style={{
                      position: 'relative',
                      marginBottom: '8px'
                    }}
                  >
                    <IconSearch 
                      size={16} 
                      style={{ 
                        position: 'absolute', 
                        left: '12px', 
                        top: '50%', 
                        transform: 'translateY(-50%)',
                        color: 'rgba(255, 255, 255, 0.5)',
                        zIndex: 1
                      }} 
                    />
                    <input
                      type="text"
                      placeholder="Search"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      style={{
                        width: '100%',
                        background: 'rgba(0, 0, 0, 0.3)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '6px',
                        padding: '8px 12px 8px 36px',
                        fontSize: '0.9rem',
                        color: '#ffffff',
                        outline: 'none'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = 'rgba(0, 255, 255, 0.3)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                      }}
                    />
                  </Box>
                  {availableFiat.map((currency) => (
                    <Box
                      key={currency.value}
                      onClick={() => {
                        onChange(currency.value);
                        setIsOpen(false);
                      }}
                      style={{
                        padding: '12px 16px',
                        cursor: 'pointer',
                        borderRadius: '6px',
                        color: '#ffffff',
                        fontSize: '0.9rem',
                        transition: 'all 0.2s ease',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = 'rgba(0, 255, 255, 0.1)';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent';
                      }}
                    >
                      <Text style={{ fontSize: '1.2rem' }}>{currency.flag}</Text>
                      {currency.label}
                    </Box>
                  ))}
                </Stack>
              </Tabs.Panel>

              <Tabs.Panel value="crypto" style={{ padding: '12px' }}>
                <Stack gap={6}>
                  {/* Search Input */}
                  <Box
                    style={{
                      position: 'relative',
                      marginBottom: '8px'
                    }}
                  >
                    <IconSearch 
                      size={16} 
                      style={{ 
                        position: 'absolute', 
                        left: '12px', 
                        top: '50%', 
                        transform: 'translateY(-50%)',
                        color: 'rgba(255, 255, 255, 0.5)',
                        zIndex: 1
                      }} 
                    />
                    <input
                      type="text"
                      placeholder="Search"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      style={{
                        width: '100%',
                        background: 'rgba(0, 0, 0, 0.3)',
                        border: '1px solid rgba(255, 255, 255, 0.2)',
                        borderRadius: '6px',
                        padding: '8px 12px 8px 36px',
                        fontSize: '0.9rem',
                        color: '#ffffff',
                        outline: 'none'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = 'rgba(255, 0, 255, 0.3)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = 'rgba(255, 255, 255, 0.2)';
                      }}
                    />
                  </Box>
                  {availableCrypto.map((currency) => {
                    const IconComponent = currency.icon;
                    return (
                      <Box
                        key={currency.value}
                        onClick={() => {
                          onChange(currency.value);
                          setIsOpen(false);
                        }}
                        style={{
                          padding: '12px 16px',
                          cursor: 'pointer',
                          borderRadius: '6px',
                          color: '#ffffff',
                          fontSize: '0.9rem',
                          transition: 'all 0.2s ease',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '12px',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'rgba(255, 0, 255, 0.1)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'transparent';
                        }}
                      >
                        <IconComponent size={18} style={{ color: '#ff00ff' }} />
                        {currency.label}
                      </Box>
                    );
                  })}
                </Stack>
              </Tabs.Panel>
            </Tabs>
          </Box>
        )}
      </Box>
    );
  };

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
        MYR: 4.75,
        SGD: 1.35,
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
    const isCrypto = CRYPTO_CURRENCIES.some(c => c.value === toCurrency);
    return Number((usdAmount * currentRates[toCurrency]).toFixed(isCrypto ? 8 : 2));
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
    if (index === 0) return; // Only prevent deleting the base currency
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
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        <Text c="gray.4">Loading rates...</Text>
      </Box>
    );
  }

  // Separate base currency and additional currencies
  const baseCurrency = rows[0];
  const additionalCurrencies = rows.slice(1);
  const visibleCurrencies = additionalCurrencies.slice(0, 4);
  const scrollableCurrencies = additionalCurrencies.slice(4);

    return (
    <Box style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <Box style={{ ...containerStyles, height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Base Currency - Always fixed at top */}
        <Group key={baseCurrency.id} style={rowStyles} align="flex-end">
          <Box style={{ flex: 1 }}>
            <CurrencySelector
              label="Base Currency"
              value={baseCurrency.currency}
              onChange={(value) => handleCurrencyChange(value, 0)}
              styles={baseInputStyles}
            />
          </Box>
          <Box style={{ flex: 1 }}>
            <Box>
              <Text size="sm" c="gray.4" mb={8} style={{ fontSize: '0.85rem', fontWeight: 500 }}>
                Amount
              </Text>
              <input
                type="text"
                value={formatDisplay(baseCurrency.amount)}
                onChange={(e) => {
                  const cleanValue = e.target.value.replace(/,/g, '');
                  const numValue = parseFloat(cleanValue);
                  if (!isNaN(numValue)) {
                    handleAmountChange(numValue, 0);
                  }
                }}
                onClick={(e) => {
                  // Clear the input when clicked/tapped
                  (e.target as HTMLInputElement).select();
                }}
                style={{
                  width: '100%',
                  background: 'rgba(0, 0, 0, 0.2)',
                  border: '1px solid rgba(255, 255, 255, 0.05)',
                  borderRadius: '8px',
                  padding: '12px 16px',
                  height: '48px',
                  fontSize: '1.1rem',
                  color: '#ffffff',
                  fontFamily: 'monospace',
                  textAlign: 'right',
                  outline: 'none',
                  transition: 'all 0.2s ease'
                }}
                onFocus={(e) => {
                  e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.3)';
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                  // Select all text on focus
                  (e.target as HTMLInputElement).select();
                }}
                onBlur={(e) => {
                  e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.2)';
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.05)';
                }}
                placeholder="0"
              />
            </Box>
          </Box>
        </Group>

        {/* Scrollable area for additional currencies - fills remaining space */}
        <Box style={{ flex: 1, overflow: 'hidden' }}>
          <ScrollArea 
            h="100%" 
            type="scroll"
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
              }
            }}
          >
            <Stack gap="md">
              {/* All Additional Currencies */}
              {additionalCurrencies.map((row, index) => (
                <Group key={row.id} style={rowStyles} align="flex-end">
                  <Box style={{ flex: 1 }}>
                    <CurrencySelector
                      placeholder="Select currency"
                      value={row.currency}
                      onChange={(value) => handleCurrencyChange(value, index + 1)}
                      styles={inputStyles}
                    />
                  </Box>
                  <Box style={{ flex: 1 }}>
                    <input
                      type="text"
                      value={formatDisplay(row.amount)}
                      onChange={(e) => {
                        const cleanValue = e.target.value.replace(/,/g, '');
                        const numValue = parseFloat(cleanValue);
                        if (!isNaN(numValue)) {
                          handleAmountChange(numValue, index + 1);
                        }
                      }}
                      onClick={(e) => {
                        // Clear the input when clicked/tapped
                        (e.target as HTMLInputElement).select();
                      }}
                      style={{
                        width: '100%',
                        background: 'rgba(0, 0, 0, 0.2)',
                        border: '1px solid rgba(255, 255, 255, 0.05)',
                        borderRadius: '8px',
                        padding: '12px 16px',
                        height: '42px',
                        fontSize: '1rem',
                        color: '#ffffff',
                        fontFamily: 'monospace',
                        textAlign: 'right',
                        outline: 'none',
                        transition: 'all 0.2s ease'
                      }}
                      onFocus={(e) => {
                        e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.3)';
                        e.target.style.borderColor = 'rgba(255, 255, 255, 0.1)';
                        // Select all text on focus
                        (e.target as HTMLInputElement).select();
                      }}
                      onBlur={(e) => {
                        e.target.style.backgroundColor = 'rgba(0, 0, 0, 0.2)';
                        e.target.style.borderColor = 'rgba(255, 255, 255, 0.05)';
                      }}
                      placeholder="0"
                    />
                  </Box>
                  <ActionIcon
                    color="red"
                    variant="subtle"
                    onClick={() => removeCurrency(index + 1)}
                    style={{ marginTop: 0 }}
                  >
                    <IconTrash size={20} />
                  </ActionIcon>
                </Group>
              ))}
            </Stack>
          </ScrollArea>
        </Box>
        
        {/* Add Currency Button - INSIDE the container */}
        {rows.length < CURRENCIES.length && (
          <Button
            leftSection={<IconPlus size={20} />}
            variant="subtle"
            onClick={addCurrency}
            fullWidth
            style={{
              backgroundColor: 'rgba(0, 255, 255, 0.1)',
              color: '#00ffff',
              marginTop: '16px',
              borderRadius: '8px',
              border: '1px solid rgba(0, 255, 255, 0.2)',
              '&:hover': {
                backgroundColor: 'rgba(0, 255, 255, 0.2)',
                borderColor: 'rgba(0, 255, 255, 0.4)',
              }
            }}
          >
            Add Currency
          </Button>
        )}
      </Box>
    </Box>
  );
};

export default CurrencyConverter; 