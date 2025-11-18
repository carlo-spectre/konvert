import React, { useState, useEffect, useRef } from 'react';
import { Box, Select, NumberInput, Button, Group, Stack, ActionIcon, Divider, Text, ScrollArea, Tabs, Modal, Portal, Drawer } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { IconTrash, IconPlus, IconChevronDown, IconCurrencyDollar, IconCurrencyEuro, IconCurrencyPound, IconCurrencyYen, IconCurrencyDollarOff, IconCurrencyBitcoin, IconCurrencyEthereum, IconFlag, IconSearch, IconX } from '@tabler/icons-react';

const FIAT_CURRENCIES = [
  { label: 'AED', value: 'AED', flag: '🇦🇪', country: 'United Arab Emirates', aliases: ['UAE', 'Emirates'] },
  { label: 'AUD', value: 'AUD', flag: '🇦🇺', country: 'Australia', aliases: [] },
  { label: 'BRL', value: 'BRL', flag: '🇧🇷', country: 'Brazil', aliases: [] },
  { label: 'CAD', value: 'CAD', flag: '🇨🇦', country: 'Canada', aliases: [] },
  { label: 'CHF', value: 'CHF', flag: '🇨🇭', country: 'Switzerland', aliases: ['Swiss'] },
  { label: 'CNY', value: 'CNY', flag: '🇨🇳', country: 'China', aliases: ['RMB', "Renminbi", 'PRC', 'CN'] },
  { label: 'CZK', value: 'CZK', flag: '🇨🇿', country: 'Czech Republic', aliases: ['Czechia'] },
  { label: 'DKK', value: 'DKK', flag: '🇩🇰', country: 'Denmark', aliases: [] },
  { label: 'EUR', value: 'EUR', flag: '🇪🇺', country: 'Eurozone', aliases: ['European Union', 'EU', 'Europe'] },
  { label: 'GBP', value: 'GBP', flag: '🇬🇧', country: 'United Kingdom', aliases: ['UK', 'Britain', 'Great Britain', 'England'] },
  { label: 'HKD', value: 'HKD', flag: '🇭🇰', country: 'Hong Kong', aliases: [] },
  { label: 'HUF', value: 'HUF', flag: '🇭🇺', country: 'Hungary', aliases: [] },
  { label: 'IDR', value: 'IDR', flag: '🇮🇩', country: 'Indonesia', aliases: [] },
  { label: 'INR', value: 'INR', flag: '🇮🇳', country: 'India', aliases: [] },
  { label: 'JPY', value: 'JPY', flag: '🇯🇵', country: 'Japan', aliases: [] },
  { label: 'KRW', value: 'KRW', flag: '🇰🇷', country: 'South Korea', aliases: ['Korea', 'Republic of Korea'] },
  { label: 'MXN', value: 'MXN', flag: '🇲🇽', country: 'Mexico', aliases: [] },
  { label: 'MYR', value: 'MYR', flag: '🇲🇾', country: 'Malaysia', aliases: [] },
  { label: 'NOK', value: 'NOK', flag: '🇳🇴', country: 'Norway', aliases: [] },
  { label: 'NZD', value: 'NZD', flag: '🇳🇿', country: 'New Zealand', aliases: ['NZ'] },
  { label: 'PHP', value: 'PHP', flag: '🇵🇭', country: 'Philippines', aliases: [] },
  { label: 'PLN', value: 'PLN', flag: '🇵🇱', country: 'Poland', aliases: [] },
  { label: 'QAR', value: 'QAR', flag: '🇶🇦', country: 'Qatar', aliases: [] },
  { label: 'RUB', value: 'RUB', flag: '🇷🇺', country: 'Russia', aliases: ['Russian Federation'] },
  { label: 'SAR', value: 'SAR', flag: '🇸🇦', country: 'Saudi Arabia', aliases: [] },
  { label: 'SEK', value: 'SEK', flag: '🇸🇪', country: 'Sweden', aliases: [] },
  { label: 'SGD', value: 'SGD', flag: '🇸🇬', country: 'Singapore', aliases: [] },
  { label: 'THB', value: 'THB', flag: '🇹🇭', country: 'Thailand', aliases: [] },
  { label: 'TRY', value: 'TRY', flag: '🇹🇷', country: 'Turkey', aliases: ['Türkiye'] },
  { label: 'TWD', value: 'TWD', flag: '🇹🇼', country: 'Taiwan', aliases: ['Republic of China', 'ROC'] },
  { label: 'USD', value: 'USD', flag: '🇺🇸', country: 'United States', aliases: ['USA', 'US', 'America'] },
  { label: 'VND', value: 'VND', flag: '🇻🇳', country: 'Vietnam', aliases: [] },
  { label: 'ZAR', value: 'ZAR', flag: '🇿🇦', country: 'South Africa', aliases: [] },
];

const CRYPTO_CURRENCIES = [
  { label: 'ADA', value: 'ADA', icon: IconCurrencyDollarOff },
  { label: 'AVAX', value: 'AVAX', icon: IconCurrencyDollarOff },
  { label: 'BNB', value: 'BNB', icon: IconCurrencyDollarOff },
  { label: 'BTC', value: 'BTC', icon: IconCurrencyBitcoin },
  { label: 'DOGE', value: 'DOGE', icon: IconCurrencyDollarOff },
  { label: 'DOT', value: 'DOT', icon: IconCurrencyDollarOff },
  { label: 'ETH', value: 'ETH', icon: IconCurrencyEthereum },
  { label: 'LINK', value: 'LINK', icon: IconCurrencyDollarOff },
  { label: 'MATIC', value: 'MATIC', icon: IconCurrencyDollarOff },
  { label: 'SOL', value: 'SOL', icon: IconCurrencyDollarOff },
  { label: 'TRX', value: 'TRX', icon: IconCurrencyDollarOff },
  { label: 'UNI', value: 'UNI', icon: IconCurrencyDollarOff },
  { label: 'XRP', value: 'XRP', icon: IconCurrencyDollarOff },
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
  const [isOpen, setIsOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('fiat');
  const [searchTerm, setSearchTerm] = useState('');
  const [searchTermCrypto, setSearchTermCrypto] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const isMobile = useMediaQuery('(max-width: 768px)');
  // Simple formatter for display
  const formatDisplay = (value: number) => {
    if (value === 0) return '';
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
    { id: '5', currency: 'JPY', amount: 0 },
  ]);
  const [deleteMode, setDeleteMode] = useState(false);
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
    const dropdownRef = useRef<HTMLDivElement>(null);
    const triggerRef = useRef<HTMLDivElement>(null);
    const [dropdownPosition, setDropdownPosition] = useState<{ left: number; top: number; width: number }>({ left: 0, top: 0, width: 0 });

    // Handle clicks outside dropdown
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        const targetNode = event.target as Node;
        const clickedInsideDropdown = dropdownRef.current?.contains(targetNode);
        const clickedTrigger = triggerRef.current?.contains(targetNode);
        if (!clickedInsideDropdown && !clickedTrigger) {
          setIsOpen(false);
        }
      };

      const updatePosition = () => {
        if (!triggerRef.current) return;
        const rect = triggerRef.current.getBoundingClientRect();
        setDropdownPosition({
          left: Math.round(rect.left),
          top: Math.round(rect.bottom),
          width: Math.round(rect.width),
        });
      };

      if (isOpen) {
        document.addEventListener('mousedown', handleClickOutside);
        window.addEventListener('scroll', updatePosition, true);
        window.addEventListener('resize', updatePosition);
        updatePosition();
      }

      return () => {
        document.removeEventListener('mousedown', handleClickOutside);
        window.removeEventListener('scroll', updatePosition, true);
        window.removeEventListener('resize', updatePosition);
      };
    }, [isOpen]);

    const normalize = (s: string) => s.toLowerCase();
    const term = normalize(searchTerm);
    const includesSearch = (code: string, country?: string, aliases?: string[]) => {
      if (!term) return true;
      if (normalize(code).includes(term)) return true;
      if (country && normalize(country).includes(term)) return true;
      if (aliases && aliases.some(a => normalize(a).includes(term))) return true;
      return false;
    };

    const availableFiat = FIAT_CURRENCIES.filter(c => 
      c.value === value || !rows.some(r => r.currency === c.value)
    ).filter(c => includesSearch(c.label, c.country, c.aliases));
    const availableCrypto = CRYPTO_CURRENCIES.filter(c => 
      c.value === value || !rows.some(r => r.currency === c.value)
    ).filter(c => normalize(c.label).includes(term));

    return (
      <Box style={{ position: 'relative' }}>
        {label && (
          <Text size="sm" c="gray.4" mb={8} style={{ fontSize: '0.85rem', fontWeight: 500 }}>
            {label}
          </Text>
        )}
        
        {/* Trigger Button */}
        <Box
          ref={triggerRef}
          onClick={() => {
            if (isMobile) {
              setIsModalOpen(true);
            } else {
              setIsOpen(!isOpen);
            }
          }}
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

        {/* Dropdown with Tabs (rendered in portal to avoid clipping) */}
        {isOpen && (
          <Portal>
            <Box
              ref={dropdownRef}
              style={{
                position: 'fixed',
                top: `${dropdownPosition.top}px`,
                left: `${dropdownPosition.left}px`,
                width: `${dropdownPosition.width}px`,
                zIndex: 1000,
                background: '#000000',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                borderRadius: '8px',
                marginTop: '4px',
                maxHeight: '300px',
                overflow: 'hidden',
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
                    color: activeTab === 'fiat' ? '#00ffff' : 'rgba(255, 255, 255, 0.6)', 
                    fontSize: '0.8rem',
                    padding: '8px 12px',
                    background: 'transparent',
                    border: 'none',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(0, 255, 255, 0.1)';
                    e.currentTarget.style.color = '#00ffff';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = activeTab === 'fiat' ? '#00ffff' : 'rgba(255, 255, 255, 0.6)';
                  }}
                >
                  Fiat
                </Tabs.Tab>
                <Tabs.Tab 
                  value="crypto" 
                  style={{ 
                    color: activeTab === 'crypto' ? '#00ffff' : 'rgba(255, 255, 255, 0.6)', 
                    fontSize: '0.8rem',
                    padding: '8px 12px',
                    background: 'transparent',
                    border: 'none',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'rgba(0, 255, 255, 0.1)';
                    e.currentTarget.style.color = '#00ffff';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = activeTab === 'crypto' ? '#00ffff' : 'rgba(255, 255, 255, 0.6)';
                  }}
                >
                  Crypto
                </Tabs.Tab>
              </Tabs.List>

                                        <Tabs.Panel value="fiat" style={{ 
                                          padding: '12px', 
                                          maxHeight: '200px', 
                                          overflowY: 'scroll',
                                          scrollbarWidth: 'thin',
                                          scrollbarColor: 'rgba(0, 255, 255, 0.3) transparent',
                                          borderRight: '1px solid rgba(0, 255, 255, 0.2)'
                                        }} className="always-visible-scrollbar">
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
                        background: '#000000',
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

              <Tabs.Panel value="crypto" style={{ 
                padding: '12px', 
                maxHeight: '200px', 
                overflowY: 'scroll',
                scrollbarWidth: 'thin',
                scrollbarColor: 'rgba(0, 255, 255, 0.3) transparent',
                borderRight: '1px solid rgba(0, 255, 255, 0.2)'
              }} className="always-visible-scrollbar">
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
                      value={searchTermCrypto}
                      onChange={(e) => setSearchTermCrypto(e.target.value)}
                      style={{
                        width: '100%',
                        background: '#000000',
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
          </Portal>
        )}

        {/* Mobile Bottom Sheet Drawer */}
        {isMobile && (
          <Drawer
            opened={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            position="bottom"
            size="100%"
            overlayProps={{ opacity: 0.5, color: '#000000', blur: 0 }}
            withCloseButton={false}
            styles={{
              content: {
                background: '#000000',
                borderTopLeftRadius: '16px',
                borderTopRightRadius: '16px',
                height: '55vh',
                maxHeight: '65vh',
                padding: 0,
              }
            }}
          >
            <Box style={{ 
              background: '#000000', 
              height: '100%',
              borderRadius: '16px 16px 0 0',
              padding: '20px 0 0 0',
              position: 'relative',
              fontFamily: '"Orbitron", sans-serif'
            }}>
              <ActionIcon
                aria-label="Close currency picker"
                variant="light"
                onClick={() => setIsModalOpen(false)}
                style={{
                  position: 'absolute',
                  top: 12,
                  right: 12,
                  backgroundColor: 'rgba(255, 255, 255, 0.08)',
                  borderRadius: '50%',
                  border: '1px solid rgba(255, 255, 255, 0.2)',
                  color: '#00ffff',
                  zIndex: 20
                }}
              >
                <IconX size={16} />
              </ActionIcon>
              <Box style={{
                width: '40px',
                height: '4px',
                background: 'rgba(255, 255, 255, 0.3)',
                borderRadius: '2px',
                margin: '0 auto 20px auto'
              }} />
              <Tabs value={activeTab} onChange={(val) => setActiveTab(val as 'fiat' | 'crypto')}>
                <Tabs.List style={{ 
                  background: 'rgba(255, 255, 255, 0.05)', 
                  border: 'none',
                  justifyContent: 'center',
                  display: 'flex',
                  fontFamily: '"Orbitron", sans-serif'
                }}>
                  <Tabs.Tab 
                    value="fiat" 
                    style={{ 
                      color: activeTab === 'fiat' ? '#00ffff' : 'rgba(255, 255, 255, 0.6)', 
                      fontSize: '1rem',
                      padding: '12px 16px',
                      background: 'transparent',
                      border: 'none',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    Fiat
                  </Tabs.Tab>
                  <Tabs.Tab 
                    value="crypto" 
                    style={{ 
                      color: activeTab === 'crypto' ? '#00ffff' : 'rgba(255, 255, 255, 0.6)', 
                      fontSize: '1rem',
                      padding: '12px 16px',
                      background: 'transparent',
                      border: 'none',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    Crypto
                  </Tabs.Tab>
                </Tabs.List>

                <Tabs.Panel value="fiat" style={{ 
                  padding: '0', 
                  maxHeight: 'calc(70vh - 70px)', 
                  overflowY: 'scroll',
                }} className="always-visible-scrollbar">
                  <Stack gap={0}>
                    <Box
                      style={{
                        position: 'sticky',
                        top: 0,
                        background: '#000000',
                        zIndex: 10,
                        padding: '12px 12px 8px 12px',
                        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
                      }}
                    >
                      <IconSearch 
                        size={16} 
                        style={{ 
                          position: 'absolute', 
                          left: '12px', 
                          top: '50%', 
                          transform: 'translateY(-50%)',
                          color: 'rgba(255, 255, 255, 0.6)',
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
                          background: '#0a0a0a',
                          border: '1px solid rgba(255, 255, 255, 0.3)',
                          borderRadius: '6px',
                          padding: '10px 12px 10px 36px',
                          fontSize: '1rem',
                          color: '#ffffff',
                          outline: 'none',
                          fontFamily: '"Orbitron", sans-serif'
                        }}
                      />
                    </Box>
                    {availableFiat.map((currency) => (
                      <Box
                        key={currency.value}
                        onClick={() => {
                          onChange(currency.value);
                          setIsModalOpen(false);
                        }}
                        style={{
                          padding: '14px 16px',
                          cursor: 'pointer',
                          color: '#ffffff',
                          fontSize: '1rem',
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

                <Tabs.Panel value="crypto" style={{ 
                  padding: '0', 
                  maxHeight: 'calc(70vh - 70px)', 
                  overflowY: 'scroll',
                }} className="always-visible-scrollbar">
                  <Stack gap={0}>
                    <Box
                      style={{
                        position: 'sticky',
                        top: 0,
                        background: '#000000',
                        zIndex: 10,
                        padding: '12px 12px 8px 12px',
                        borderBottom: '1px solid rgba(255, 255, 255, 0.1)'
                      }}
                    >
                      <IconSearch 
                        size={16} 
                        style={{ 
                          position: 'absolute', 
                          left: '12px', 
                          top: '50%', 
                          transform: 'translateY(-50%)',
                          color: 'rgba(255, 255, 255, 0.6)',
                          zIndex: 1
                        }} 
                      />
                      <input
                        type="text"
                        placeholder="Search"
                        value={searchTermCrypto}
                        onChange={(e) => setSearchTermCrypto(e.target.value)}
                        style={{
                          width: '100%',
                          background: '#0a0a0a',
                          border: '1px solid rgba(255, 255, 255, 0.3)',
                          borderRadius: '6px',
                          padding: '10px 12px 10px 36px',
                          fontSize: '1rem',
                          color: '#ffffff',
                          outline: 'none',
                          fontFamily: '"Orbitron", sans-serif'
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
                            setIsModalOpen(false);
                          }}
                          style={{
                            padding: '14px 16px',
                            cursor: 'pointer',
                            color: '#ffffff',
                            fontSize: '1rem',
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
                          <IconComponent size={18} style={{ color: '#ff00ff' }} />
                          {currency.label}
                        </Box>
                      );
                    })}
                  </Stack>
                </Tabs.Panel>
              </Tabs>
            </Box>
          </Drawer>
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
    let numValue: number;
    
    if (typeof value === 'string') {
      if (value === '' || value === '0') {
        numValue = 0;
      } else {
        numValue = parseFloat(value);
        if (isNaN(numValue)) return;
      }
    } else {
      numValue = value;
    }
    
    const newRows = [...rows];
    newRows[index] = { ...newRows[index], amount: numValue };

    // If changing base amount
    if (index === 0) {
      setRows(updateConversions(newRows));
    } else {
      // If changing other amounts, reverse calculate the base amount
      const targetCurrency = newRows[index].currency;
      const baseCurrency = newRows[0].currency;
      
      // Check if we have valid rates for both currencies
      if (rates[targetCurrency] && rates[baseCurrency]) {
        const newBaseAmount = calculateAmount(numValue, targetCurrency, baseCurrency, rates);
        newRows[0] = { ...newRows[0], amount: newBaseAmount };
        
        // Update all other rows EXCEPT the one being edited
        const updatedRows = newRows.map((row, i) => {
          if (i === 0 || i === index) return row; // Keep base and edited row unchanged
          return {
            ...row,
            amount: calculateAmount(newBaseAmount, baseCurrency, row.currency, rates)
          };
        });
        
        setRows(updatedRows);
      } else {
        // If rates are not available, just update the current row
        setRows(newRows);
      }
    }
  };

  const handleCurrencyChange = (value: string | null, index: number) => {
    if (!value) return;
    console.log('handleCurrencyChange called with:', { value, index, currentRows: rows });
    
    // Create a copy of the current rows
    const newRows = [...rows];
    
    // Store the current amount for this row
    const currentAmount = newRows[index].amount;
    
    // Update the currency
    newRows[index] = { ...newRows[index], currency: value };
    
    console.log('Before update - row at index', index, ':', newRows[index]);
    console.log('After update - row at index', index, ':', newRows[index]);
    console.log('All new rows:', newRows);
    
    // If this is not the base currency (index > 0), preserve the amount
    if (index > 0) {
      // Keep the amount the same, just update the currency
      setRows(newRows);
    } else {
      // For base currency, recalculate all conversions
      setRows(updateConversions(newRows));
    }
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
    <Box className="panel panel-currency-converter" style={{ height: '100%', display: 'flex', flexDirection: 'column', maxWidth: '420px', width: '100%' }}>
      <Box style={{ ...containerStyles, height: '100%', display: 'flex', flexDirection: 'column' }}>
        {/* Base Currency - Always fixed at top */}
        <Group key={baseCurrency.id} style={{...rowStyles, marginBottom: '16px'}} align="flex-end">
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
                inputMode="numeric"
                value={formatDisplay(baseCurrency.amount)}
                onChange={(e) => {
                  const cleanValue = e.target.value.replace(/,/g, '');
                  handleAmountChange(cleanValue, 0);
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
        <Box style={{ flex: 1, overflow: 'hidden', marginBottom: '16px' }}>
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
            <Stack gap="8px">
              {/* All Additional Currencies */}
              {additionalCurrencies.map((row, index) => (
                <Group 
                  key={`currency-row-${index + 1}`} 
                  style={rowStyles} 
                  align="flex-end"
                >
                  <Box style={{ flex: 1 }}>
                    <CurrencySelector
                      placeholder="Select currency"
                      value={row.currency}
                      onChange={(value) => {
                        console.log('CurrencySelector onChange:', { 
                          rowCurrency: row.currency, 
                          newValue: value, 
                          index: index, 
                          actualRowIndex: index + 1,
                          rowId: row.id
                        });
                        // Since additionalCurrencies is rows.slice(1), the actual index is index + 1
                        const actualIndex = index + 1;
                        console.log('Using actual index:', actualIndex);
                        handleCurrencyChange(value, actualIndex);
                      }}
                      styles={inputStyles}
                    />
                  </Box>
                  <Box style={{ flex: 1 }}>
                    <input
                      type="text"
                      inputMode="numeric"
                      value={formatDisplay(row.amount)}
                      onChange={(e) => {
                        const cleanValue = e.target.value.replace(/,/g, '');
                        handleAmountChange(cleanValue, index + 1);
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
                  {deleteMode && (
                    <ActionIcon
                      color="red"
                      variant="subtle"
                      onClick={() => removeCurrency(index + 1)}
                      style={{ 
                        marginTop: 0,
                        opacity: 1,
                        transition: 'opacity 0.2s ease'
                      }}
                    >
                      <IconTrash size={20} />
                    </ActionIcon>
                  )}
                </Group>
              ))}
            </Stack>
          </ScrollArea>
        </Box>

        {/* Action Buttons - FIXED at bottom */}
        <Group gap="xs" style={{ marginTop: '16px' }}>
          {rows.length < CURRENCIES.length && (
            <Button
              leftSection={<IconPlus size={20} />}
              variant="subtle"
              onClick={addCurrency}
              style={{
                backgroundColor: 'rgba(0, 255, 255, 0.1)',
                color: '#00ffff',
                borderRadius: '8px',
                border: '1px solid rgba(0, 255, 255, 0.2)',
                flex: 1,
                '&:hover': {
                  backgroundColor: 'rgba(0, 255, 255, 0.2)',
                  borderColor: 'rgba(0, 255, 255, 0.4)',
                }
              }}
            >
              {isMobile ? 'Add' : 'Add Currency'}
            </Button>
          )}
          
          <Button
            leftSection={<IconTrash size={20} />}
            variant="subtle"
            onClick={() => setDeleteMode(!deleteMode)}
            style={{
              backgroundColor: deleteMode ? 'rgba(255, 0, 0, 0.2)' : 'rgba(255, 255, 255, 0.1)',
              color: deleteMode ? '#ff4444' : 'rgba(255, 255, 255, 0.7)',
              borderRadius: '8px',
              border: `1px solid ${deleteMode ? 'rgba(255, 0, 0, 0.3)' : 'rgba(255, 255, 255, 0.2)'}`,
              flex: 1,
              '&:hover': {
                backgroundColor: deleteMode ? 'rgba(255, 0, 0, 0.3)' : 'rgba(255, 255, 255, 0.2)',
                borderColor: deleteMode ? 'rgba(255, 0, 0, 0.5)' : 'rgba(255, 255, 255, 0.3)',
              }
            }}
          >
            {deleteMode ? 'Cancel Delete' : 'Delete'}
          </Button>
        </Group>
      </Box>
    </Box>
  );
};

export default CurrencyConverter; 