// Single source of truth for the design system, shared by AntD and Tailwind.
export const brand = {
  primary: '#016A70',
  primaryHover: '#01585D',
  primarySoft: '#E6F2F2',
  ink: '#0F172A',
  muted: '#64748B',
  border: '#E2E8F0',
  surface: '#FFFFFF',
  canvas: '#F5F7F9',
}

export const antdTheme = {
  token: {
    colorPrimary: brand.primary,
    colorInfo: brand.primary,
    colorLink: brand.primary,
    colorSuccess: '#16A34A',
    colorWarning: '#D97706',
    colorError: '#DC2626',
    colorText: brand.ink,
    colorTextSecondary: brand.muted,
    colorBorder: brand.border,
    colorBorderSecondary: '#EEF2F6',
    colorBgLayout: brand.canvas,
    fontFamily:
      "'Inter', ui-sans-serif, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif",
    fontSize: 14,
    borderRadius: 10,
    borderRadiusLG: 14,
    controlHeight: 40,
    controlHeightLG: 46,
    boxShadowSecondary:
      '0 12px 32px -12px rgba(15, 23, 42, 0.18), 0 2px 6px rgba(15, 23, 42, 0.06)',
  },
  components: {
    Button: { fontWeight: 500, primaryShadow: 'none', defaultShadow: 'none' },
    Table: {
      headerBg: '#F8FAFC',
      headerColor: brand.muted,
      headerSplitColor: 'transparent',
      rowHoverBg: '#F8FAFC',
      cellPaddingBlock: 14,
      borderColor: '#EEF2F6',
    },
    Tabs: { itemSelectedColor: brand.primary, inkBarColor: brand.primary },
    Card: { paddingLG: 24 },
    Modal: { borderRadiusLG: 16 },
    Segmented: { itemSelectedColor: brand.primary },
  },
}
