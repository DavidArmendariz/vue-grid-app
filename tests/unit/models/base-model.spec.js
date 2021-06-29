import BaseModel from '../../../src/models/base-model';

const LIMIT = 2;
const COLUMN_TYPES = {
  id: Number,
  firstName: String,
  lastName: String,
};

describe('BaseModel', () => {
  let baseModel;

  beforeEach(() => {
    baseModel = new BaseModel(LIMIT, COLUMN_TYPES);
  });

  describe('buildColumnsMap', () => {
    it('should build a map where the keys are the columns and the values are either true or false', () => {
      expect(baseModel.buildColumnsMap()).toEqual({
        id: true,
        firstName: true,
        lastName: true,
      });
      expect(baseModel.buildColumnsMap(false)).toEqual({
        id: false,
        firstName: false,
        lastName: false,
      });
    });
  });

  describe('setFetchOptions', () => {
    it('should set default values correctly if no options is passed', () => {
      baseModel.setFetchOptions();
      expect(baseModel.fetchOptions).toEqual({
        offset: 0,
        columns: [],
        search: '',
        sort: [],
        uniqueValues: [],
        all: false,
        isExport: false,
      });
    });

    it('should parse offset as an integer', () => {
      baseModel.setFetchOptions({ offset: '2' });
      expect(baseModel.fetchOptions).toMatchObject({
        offset: 2,
      });
    });

    it('should parse columns into an array of strings', () => {
      const columnsArray = ['id', 'firstName'];
      baseModel.setFetchOptions({ columns: encodeURIComponent(JSON.stringify(columnsArray)) });
      expect(baseModel.fetchOptions).toMatchObject({
        columns: columnsArray,
      });
    });

    it('should decode search string', () => {
      const searchString = 'test!!!%%%';
      baseModel.setFetchOptions({ search: encodeURIComponent(searchString) });
      expect(baseModel.fetchOptions).toMatchObject({
        search: searchString,
      });
    });

    it('should parse sort into an array of objects', () => {
      const sortArray = [{ key: 'id', order: 'asc' }];
      baseModel.setFetchOptions({ sort: encodeURIComponent(JSON.stringify(sortArray)) });
      expect(baseModel.fetchOptions).toMatchObject({
        sort: sortArray,
      });
    });

    it('should parse uniqueValues into an object', () => {
      const uniqueValuesObject = { key: 'firstName', values: ['david', 'adrian'] };
      baseModel.setFetchOptions({ uniqueValues: encodeURIComponent(JSON.stringify(uniqueValuesObject)) });
      expect(baseModel.fetchOptions).toMatchObject({
        uniqueValues: uniqueValuesObject,
      });
    });
  });

  describe('buildHashMap', () => {
    it('should return an empty object if key is not present in data', () => {
      baseModel.data = {};
      expect(baseModel.buildHashMap('people', 'id')).toEqual({});
    });

    it('should build a hash map from an array of objects containing an id', () => {
      const data = {
        people: [
          { id: 1, firstName: 'david' },
          { id: 2, firstName: 'adrian' },
        ],
      };
      baseModel.data = data;
      const map = baseModel.buildHashMap('people', 'id');
      expect(map).toEqual({
        1: {
          id: 1,
          firstName: 'david',
        },
        2: {
          id: 2,
          firstName: 'adrian',
        },
      });
    });
  });

  describe('getTotal', () => {
    it('should get the data length if it is less than the main table data', () => {
      const mainTableData = [
        { id: 1, firstName: 'david' },
        { id: 2, firstName: 'adrian' },
        { id: 3, firstName: 'andres' },
      ];
      const data = mainTableData.slice(0, 2);
      baseModel.mainTableData = mainTableData;
      expect(baseModel.getTotal(data)).toEqual(2);
    });

    it('should get the main table data length if data length is the same as main table data length', () => {
      const mainTableData = [
        { id: 1, firstName: 'david' },
        { id: 2, firstName: 'adrian' },
        { id: 3, firstName: 'andres' },
      ];
      const data = [...mainTableData];
      baseModel.mainTableData = mainTableData;
      expect(baseModel.getTotal(data)).toEqual(3);
    });
  });

  describe('getPaginationCount', () => {
    it('should return 0 if data length is zero', () => {
      const mainTableData = [
        { id: 1, firstName: 'david' },
        { id: 2, firstName: 'adrian' },
        { id: 3, firstName: 'andres' },
      ];
      const data = [];
      baseModel.mainTableData = mainTableData;
      expect(baseModel.getPaginationCount(data)).toEqual(0);
    });

    it('should return 1 if data length is less than the limit set', () => {
      const mainTableData = [
        { id: 1, firstName: 'david' },
        { id: 2, firstName: 'adrian' },
        { id: 3, firstName: 'andres' },
      ];
      const data = mainTableData.slice(0, 1);
      baseModel.mainTableData = mainTableData;
      expect(baseModel.getPaginationCount(data)).toEqual(1);
    });

    it('should return 2 if data length is equal to main table data length', () => {
      const mainTableData = [
        { id: 1, firstName: 'david' },
        { id: 2, firstName: 'adrian' },
        { id: 3, firstName: 'andres' },
      ];
      const data = [...mainTableData];
      baseModel.mainTableData = mainTableData;
      expect(baseModel.getPaginationCount(data)).toEqual(2);
    });
  });

  describe('limitData', () => {
    it('should limit data if "all" fetch option is not set', () => {
      const data = [
        { id: 1, firstName: 'david' },
        { id: 2, firstName: 'adrian' },
        { id: 3, firstName: 'andres' },
      ];
      baseModel.setFetchOptions();
      expect(baseModel.limitData(data)).toEqual(data.slice(0, 2));
    });

    it('should not limit data if "all" fetch option is set to true', () => {
      const data = [
        { id: 1, firstName: 'david' },
        { id: 2, firstName: 'adrian' },
        { id: 3, firstName: 'andres' },
      ];
      baseModel.setFetchOptions({ all: 'true' });
      expect(baseModel.limitData(data)).toEqual(data);
    });
  });

  describe('setColumnsToDisplay', () => {
    it('should display all columns if columns is an empty array', () => {
      baseModel.setFetchOptions();
      baseModel.setColumnsToDisplay();
      expect(baseModel.columns).toEqual({
        id: true,
        firstName: true,
        lastName: true,
      });
    });

    it('should set the columns correctly', () => {
      const columns = encodeURIComponent(JSON.stringify(['id']));
      baseModel.setFetchOptions({ columns });
      baseModel.setColumnsToDisplay();
      expect(baseModel.columns).toEqual({
        id: true,
        firstName: false,
        lastName: false,
      });
    });
  });

  describe('filterRowsBySearchString', () => {
    it('should return data if search is not defined', () => {
      const data = [
        { id: 1, firstName: 'david' },
        { id: 2, firstName: 'andres' },
      ];
      baseModel.setFetchOptions();
      expect(baseModel.filterRowsBySearchString(data)).toEqual(data);
    });

    it('should return empty array if search is in data but column that contains it is not displayed', () => {
      const data = [
        { id: 1, firstName: 'david' },
        { id: 2, firstName: 'andres' },
      ];
      const columns = encodeURIComponent(JSON.stringify(['id']));
      baseModel.setFetchOptions({ columns, search: 'david' });
      baseModel.setColumnsToDisplay();
      expect(baseModel.filterRowsBySearchString(data)).toEqual([]);
    });

    it('should return filtered data by search string', () => {
      const data = [
        { id: 1, firstName: 'david' },
        { id: 2, firstName: 'andres' },
      ];
      baseModel.setFetchOptions({ search: 'david' });
      expect(baseModel.filterRowsBySearchString(data)).toEqual([{ id: 1, firstName: 'david' }]);
      baseModel.setFetchOptions({ search: 'DAVID' });
      expect(baseModel.filterRowsBySearchString(data)).toEqual([{ id: 1, firstName: 'david' }]);
      baseModel.setFetchOptions({ search: 'vid' });
      expect(baseModel.filterRowsBySearchString(data)).toEqual([{ id: 1, firstName: 'david' }]);
    });
  });

  describe('filterByUniqueValues', () => {
    it('should return data if unique values is not defined', () => {
      const data = [
        { id: 1, firstName: 'david' },
        { id: 2, firstName: 'andres' },
      ];
      baseModel.setFetchOptions();
      expect(baseModel.filterByUniqueValues(data)).toEqual(data);
    });

    it.only('should return data if unique values is not defined', () => {
      const data = [
        { id: 1, firstName: 'david' },
        { id: 2, firstName: 'andres' },
      ];
      const uniqueValues = encodeURIComponent(JSON.stringify([{ key: 'firstName', values: ['david'] }]));
      baseModel.setFetchOptions({ uniqueValues });
      expect(baseModel.filterByUniqueValues(data)).toEqual([{ id: 1, firstName: 'david' }]);
    });
  });
});
