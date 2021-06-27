export const DEALS_COLUMNS_MAP = {
  id: 'ID',
  issuer: 'Issuer',
  dealName: 'Deal name',
  bloombergId: 'Bloomberg ID',
  isIn: 'Is in',
  customDealIdentifiers: 'Custom Deal Identifiers',
  customIssuerIdentifiers: 'Custom Issuer Identifiers',
  industry: 'Industry',
  agent: 'Agent',
  source: 'Source',
  status: 'Status',
  total: 'Total',
  lastPosted: 'Last posted',
  lastAccessed: 'Last Accessed',
  analysts: 'Analysts',
  docCount: 'Doc Count',
  customField: 'Custom Field',
  dealId: 'Deal ID',
};

export const DEALS_COLUMNS_TYPES = {
  id: Number,
  issuer: String,
  dealName: String,
  bloombergId: String,
  isIn: String,
  customDealIdentifiers: Array,
  customIssuerIdentifiers: Array,
  industry: String,
  agent: String,
  source: String,
  status: String,
  total: Number,
  lastPosted: Date,
  lastAccessed: Date,
  analysts: Array,
  docCount: Number,
  customField: String,
  dealId: Number,
};
