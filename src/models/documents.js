import docsDataset from '../data/docs_dataset.json';

export default class Documents {
  constructor(json = docsDataset) {
    this.data = json.data?.docs || {};
  }

  getDocuments(limit = 20, offset = 0) {
    const dataToFetch = this.data.slice(offset, offset + limit);
    return dataToFetch.reduce((processedData, row) => {
      const processedRow = {};
      processedRow.id = row.id;
      processedRow.dealId = row.deal_id;
      processedRow.documentName = row.doc_name;
      processedRow.tag = null; // Not present
      processedRow.posted = row.posted;
      processedRow.lastAccessed = row.last_accessed;
      processedRow.note = row.source_file?.note; // email note or source file note?
      processedRow.file_path = this.getFilePath(row); // folder path + file name
      processedData.push(processedRow);
      return processedData;
    }, []);
  }

  getFilePath(row) {
    return `${row.folder_path}/${row.name}`;
  }
}
