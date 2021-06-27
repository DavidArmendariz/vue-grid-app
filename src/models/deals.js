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

  reduceDealsData(fetchedData) {
    return fetchedData.reduce((processedData, row) => {
      const processedRow = {};
      processedRow.id = row.Id;
      processedRow.issuer = this.clientIssuers[row.IssuerId]?.IssuerName?.trim();
      processedRow.dealName = row.DealName?.trim();
      processedRow.bloombergId = null; // Not present
      processedRow.isIn = null; // Not present
      processedRow.customDealIdentifiers = row.CustomIdentifiers;
      processedRow.customIssuerIdentifiers = row.CustomClientIssuersIdentifiers;
      processedRow.industry = this.industries[row.IndustryId]?.IndustryName;
      processedRow.agent = this.agents[row.AgentId]?.CompanyName;
      processedRow.source = this.sources[row.SourceId]?.SourceName;
      processedRow.status = null; // Not present
      processedRow.total = row.Total;
      processedRow.lastPosted = row.LastPosted;
      processedRow.lastAccessed = row.LastAccessed;
      processedRow.analysts = this.getAnalystsFromIds(row.AnalystIds);
      processedRow.docCount = row.DocCount;
      processedRow.customField = row.ClientCustomField;
      // dealId to link it to a document
      processedRow.dealId = row.DealId;
      processedData.push(processedRow);
      return processedData;
    }, []);
  }

  getData(options = {}) {
    this.setFetchOptions(options);
    const { search } = this.fetchOptions;
    const fetchedData = this.getmainTableData();
    let deals = this.reduceDealsData(fetchedData);

    if (search) {
      deals = this.filterRowsBySearchString(deals);
    }

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
