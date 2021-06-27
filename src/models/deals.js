import dealsDataset from '../data/deals_dataset.json';
import Utils, { COLUMNS_TYPES, LIMIT } from '../utils';

export default class Deals {
  constructor(json = dealsDataset) {
    this.data = json.data || {};
    this.holdings = this.data.Holdings || [];
    this.mainTableData = this.holdings;
    this.industries = this.buildHashMap('Industries', 'Id');
    this.clientIssuers = this.buildHashMap('ClientIssuers', 'IssuerId');
    this.agents = this.buildHashMap('Agents', 'Id');
    this.sources = this.buildHashMap('Sources', 'Id');
    this.dealTypes = this.buildHashMap('DealTypes', 'Id');
    this.analysts = this.buildHashMap('Analysts', 'UserId');
    this.fetchOptions = {};
  }

  buildHashMap(key, idKey) {
    const attributeData = this.data[key] || [];
    return attributeData.reduce((result, row) => {
      const id = row[idKey];
      result[id] = row;
      return result;
    }, {});
  }

  getUniqueValuesForColumn(columnKey) {
    const allData = this.getData();
    return [...new Set(allData.map((row) => row[columnKey]))];
  }

  filterRowsBySearchString(data) {
    const loweredSearchString = decodeURIComponent(this.fetchOptions.search).toLowerCase();
    return data.filter((row) => {
      let containsSearchString = false;
      for (const [columnKey, value] of Object.entries(row)) {
        if (!value) {
          continue;
        }

        if (COLUMNS_TYPES[columnKey] === String) {
          containsSearchString = value.toLowerCase().includes(loweredSearchString);
        }

        if (COLUMNS_TYPES[columnKey] === Array && value.every((x) => typeof x === 'string')) {
          const string = Utils.joinArray(value);
          containsSearchString = string.toLowerCase().includes(loweredSearchString);
        }

        if (containsSearchString) {
          break;
        }
      }
      return containsSearchString;
    });
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

  getmainTableData() {
    return this.mainTableData;
  }

  shouldFilter() {
    const { search } = this.fetchOptions;
    return !!search;
  }

  setFetchOptions(options) {
    this.fetchOptions = options;
  }

  limitData(data) {
    const { offset = 0 } = this.fetchOptions;
    return data.slice(offset, offset + LIMIT);
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

  getTotal(data) {
    return Math.min(data.length, this.getmainTableData().length);
  }

  getPaginationCount(data) {
    const total = this.getTotal(data);
    const division = Math.ceil(total / LIMIT);
    return total && total % LIMIT === 0 ? division - 1 : division;
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
