import docsDataset from '../data/docs_dataset.json';
import BaseModel from './base-model';
import { LIMIT, DOCS_COLUMNS_TYPES } from '../utils';

export default class Documents extends BaseModel {
  constructor(json = docsDataset) {
    super(LIMIT, DOCS_COLUMNS_TYPES);
    this.data = json.data?.docs || {};
    this.mainTableData = this.data;
  }

  reduceDocumentsData() {
    const fetchedData = this.getMainTableData();
    return fetchedData.reduce((processedData, row) => {
      const processedRow = {
        ...(this.columns.id && { id: row.id }),
        ...(this.columns.dealId && { dealId: row.deal_id }),
        ...(this.columns.documentName && { documentName: row.doc_name }),
        ...(this.columns.tag && { tag: null }), // Not present
        ...(this.columns.posted && { posted: row.posted }),
        ...(this.columns.lastAccessed && { lastAccessed: row.last_accessed }),
        ...(this.columns.note && { note: row.source_file?.note }), // email note or source file note?
        ...(this.columns.filePath && { filePath: this.getFilePath(row) }), // folder path + file name
      };
      processedData.push(processedRow);
      return processedData;
    }, []);
  }

  getData(options = {}) {
    this.setFetchOptions(options);
    this.setColumnsToDisplay();

    let documents = this.reduceDocumentsData();
    documents = this.filterRowsBySearchString(documents);
    documents = this.sortData(documents);
    documents = this.filterByUniqueValues(documents);

    return {
      data: this.limitData(documents),
      total: this.getTotal(documents),
      paginationCount: this.getPaginationCount(documents),
    };
  }

  getFilePath(row) {
    return `${row.folder_path}/${row.name}`;
  }
}
