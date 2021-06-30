import dealsDataset from '../data/deals_dataset.json';
import { DEALS_COLUMNS_TYPES, LIMIT } from '../utils';
import BaseModel from './base-model';

export default class Deals extends BaseModel {
  constructor(json = dealsDataset) {
    super(LIMIT, DEALS_COLUMNS_TYPES);
    this.data = json.data || {};
    this.holdings = this.data.Holdings || [];
    this.industries = this.buildHashMap('Industries', 'Id');
    this.clientIssuers = this.buildHashMap('ClientIssuers', 'IssuerId');
    this.agents = this.buildHashMap('Agents', 'Id');
    this.sources = this.buildHashMap('Sources', 'Id');
    this.dealTypes = this.buildHashMap('DealTypes', 'Id');
    this.analysts = this.buildHashMap('Analysts', 'UserId');
    this.mainTableData = this.holdings;
  }

  reduceDealsData() {
    const fetchedData = this.getMainTableData();
    return fetchedData.reduce((processedData, row) => {
      let shouldIncludeDealId = true;

      if (this.fetchOptions.isExport) {
        shouldIncludeDealId = this.columns.dealId;
      }

      const newRow = {
        ...(this.columns.id && { id: row.Id }),
        ...(this.columns.issuer && { issuer: this.clientIssuers[row.IssuerId]?.IssuerName?.trim() }),
        ...(this.columns.dealName && { dealName: row.DealName?.trim() }),
        ...(this.columns.bloombergId && { bloombergId: null }), // Not present
        ...(this.columns.isIn && { isIn: null }), // Not present
        ...(this.columns.customDealIdentifiers && { customDealIdentifiers: row.CustomIdentifiers }),
        ...(this.columns.customIssuerIdentifiers && { customIssuerIdentifiers: row.CustomClientIssuersIdentifiers }),
        ...(this.columns.industry && { industry: this.industries[row.IndustryId]?.IndustryName?.trim() }),
        ...(this.columns.agent && { agent: this.agents[row.AgentId]?.CompanyName?.trim() }),
        ...(this.columns.source && { source: this.sources[row.SourceId]?.SourceName?.trim() }),
        ...(this.columns.status && { status: null }), // Not present
        ...(this.columns.total && { total: row.Total }),
        ...(this.columns.lastPosted && { lastPosted: row.LastPosted }),
        ...(this.columns.lastAccessed && { lastAccessed: row.LastAccessed }),
        ...(this.columns.analysts && { analysts: this.getAnalystsFromIds(row.AnalystIds) }),
        ...(this.columns.docCount && { docCount: row.DocCount }),
        ...(this.columns.customField && { customField: row.ClientCustomField }),
        ...(shouldIncludeDealId && { dealId: row.DealId }),
      };
      const processedRow = this.processRow(newRow);
      processedData.push(processedRow);
      return processedData;
    }, []);
  }

  getData(options) {
    this.setFetchOptions(options);
    this.setColumnsToDisplay();

    let deals = this.reduceDealsData();
    deals = this.filterRowsBySearchString(deals);
    deals = this.sortData(deals);
    deals = this.filterByUniqueValues(deals);

    return {
      data: this.limitData(deals),
      total: this.getTotal(deals),
      paginationCount: this.getPaginationCount(deals),
    };
  }

  getAnalystsFromIds(ids) {
    return (ids || []).reduce((result, currentId) => {
      if (this.analysts[currentId]?.FullName) {
        result.push(this.analysts[currentId].FullName);
      }
      return result;
    }, []);
  }
}
