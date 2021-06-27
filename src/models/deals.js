import dealsDataset from '../data/deals_dataset.json';

export default class Deals {
  constructor(json = dealsDataset) {
    this.data = json.data || {};
    this.holdings = this.data.Holdings || [];
    this.industries = this.buildHashMap('Industries', 'Id');
    this.clientIssuers = this.buildHashMap('ClientIssuers', 'IssuerId');
    this.agents = this.buildHashMap('Agents', 'Id');
    this.sources = this.buildHashMap('Sources', 'Id');
    this.dealTypes = this.buildHashMap('DealTypes', 'Id');
    this.analysts = this.buildHashMap('Analysts', 'UserId');
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
    const allData = this.getDeals({ all: true });
    return [...new Set(allData.map((row) => row[columnKey]))];
  }

  getDeals(options = {}) {
    const { all = false, offset = 0, limit = 10 } = options;
    const dataToFetch = all ? this.holdings : this.holdings.slice(offset, offset + limit);
    const deals = dataToFetch.reduce((processedData, row) => {
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

    return {
      data: deals,
      total: this.getTotal(deals, { all }),
      paginationCount: this.getPaginationCount(limit),
    };
  }

  getTotal(data, all) {
    if (all) {
      return this.holdings.length;
    }
    return data.length;
  }

  getPaginationCount(limit) {
    const total = this.holdings.length;
    const division = Math.ceil(total / limit);
    return total % limit === 0 ? division - 1 : division;
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
