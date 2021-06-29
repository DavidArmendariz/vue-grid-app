import {
  getColumnKeys,
  getColumnsShown,
  getCSVContent,
  getCurrentSort,
  getPaginationNumber,
  handleRouteChange,
  joinArray,
} from '../../../src/utils/functions';

describe('getColumnKeys', () => {
  it('should return column keys', () => {
    const data = [{ id: 1, firstName: 'david' }];
    expect(getColumnKeys(data)).toEqual(['id', 'firstName']);
  });

  it('should return an empty array if data is empty', () => {
    const data = [];
    expect(getColumnKeys(data)).toEqual([]);
  });
});

describe('getCSVContent', () => {
  it('should parse a JSON into a CSV', () => {
    const data = [{ id: 1, firstName: 'david' }];
    expect(getCSVContent(data)).toEqual('id;firstName\r\n1;david');
  });
});

describe('joinArray', () => {
  it('should join an array of strings by commas', () => {
    const array = ['david', 'adrian'];
    expect(joinArray(array)).toEqual('david, adrian');
  });
});

describe('getColumnsShown', () => {
  it('should build an object where the keys are the columns shown', () => {
    const context = {
      filteredData: [{ id: 1, firstName: 'david' }],
    };
    expect(getColumnsShown.bind(context)()).toEqual({
      id: true,
      firstName: true,
    });
  });
});

describe('getPaginationNumber', () => {
  const TEST_MAX_PAGINATION_NUMBER = 7;

  it('should return an array of size pagination count if pagination count is less than or equal to max pagination', () => {
    const context = {
      paginationCount: 6,
    };
    const result = getPaginationNumber.bind(context)(TEST_MAX_PAGINATION_NUMBER);
    expect(result).toEqual([1, 2, 3, 4, 5, 6]);
  });

  it('should not show left dots if active pagination is 1 and pagination count is 100', () => {
    const context = {
      paginationCount: 100,
      activePagination: 1,
    };
    const result = getPaginationNumber.bind(context)(TEST_MAX_PAGINATION_NUMBER);
    expect(result).toEqual([1, 2, 3, 4, 5, 6, '...', 100]);
  });

  it('should show left dots if active pagination is 99 and pagination count is 100', () => {
    const context = {
      paginationCount: 100,
      activePagination: 99,
    };
    const result = getPaginationNumber.bind(context)(TEST_MAX_PAGINATION_NUMBER);
    expect(result).toEqual([1, '...', 95, 96, 97, 98, 99, 100]);
  });

  it('should show left and right dots if active pagination is 50 and pagination count is 100', () => {
    const context = {
      paginationCount: 100,
      activePagination: 50,
    };
    const result = getPaginationNumber.bind(context)(TEST_MAX_PAGINATION_NUMBER);
    expect(result).toEqual([1, '...', 48, 49, 50, 51, 52, '...', 100]);
  });
});

describe('getCurrentSort', () => {
  it('should return current of query params', () => {
    const sort = [
      { key: 'firstName', order: 'asc' },
      { key: 'lastName', order: 'desc' },
    ];
    const context = {
      $route: {
        query: { sort: encodeURIComponent(JSON.stringify(sort)) },
      },
      columnKey: 'lastName',
    };
    const result = getCurrentSort.bind(context)();
    expect(result).toEqual([{ key: 'firstName', order: 'asc' }]);
  });
});

describe('handleRouteChange', () => {
  let context;
  let testLimit = 10;
  let spyOnGetData;
  let spyOnUpdateData;

  beforeEach(() => {
    context = {
      model: {
        getData: jest.fn(),
      },
      updateData: jest.fn(),
    };
    spyOnGetData = jest.spyOn(context.model, 'getData');
    spyOnUpdateData = jest.spyOn(context, 'updateData');
  });

  it('should call getData with the correct arguments if offset changed', () => {
    const newRoute = {
      query: {
        offset: '2',
      },
    };
    const oldRoute = {
      query: {
        offset: '1',
      },
    };
    handleRouteChange.bind(context)(newRoute, oldRoute, testLimit);
    expect(spyOnGetData).toHaveBeenCalledTimes(1);
    expect(spyOnUpdateData).toHaveBeenCalledTimes(1);
    expect(spyOnGetData).toHaveBeenCalledWith({
      ...newRoute.query,
      offset: 10,
    });
  });

  it('should call getData with the correct arguments if search changed', () => {
    const newRoute = {
      query: {
        search: 'test1',
      },
    };
    const oldRoute = {
      query: {
        offset: 'test2',
      },
    };
    handleRouteChange.bind(context)(newRoute, oldRoute, testLimit);
    expect(spyOnGetData).toHaveBeenCalledTimes(1);
    expect(spyOnUpdateData).toHaveBeenCalledTimes(1);
    expect(spyOnGetData).toHaveBeenCalledWith({
      ...newRoute.query,
      offset: 0,
    });
  });

  it('should call getData with the correct arguments if columns changed', () => {
    const newRoute = {
      query: {
        columns: encodeURIComponent(JSON.stringify(['id'])),
      },
    };
    const oldRoute = {
      query: {
        offset: encodeURIComponent(JSON.stringify(['id', 'firstName'])),
      },
    };
    handleRouteChange.bind(context)(newRoute, oldRoute, testLimit);
    expect(spyOnGetData).toHaveBeenCalledTimes(1);
    expect(spyOnUpdateData).toHaveBeenCalledTimes(1);
    expect(spyOnGetData).toHaveBeenCalledWith({
      ...newRoute.query,
      offset: 0,
    });
  });

  it('should call getData with the correct arguments if unique values changed', () => {
    const newRoute = {
      query: {
        uniqueValues: encodeURIComponent(JSON.stringify({ key: 'id', values: ['test1'] })),
      },
    };
    const oldRoute = {
      query: {
        uniqueValues: encodeURIComponent(JSON.stringify({ key: 'id', values: ['test2'] })),
      },
    };
    handleRouteChange.bind(context)(newRoute, oldRoute, testLimit);
    expect(spyOnGetData).toHaveBeenCalledTimes(1);
    expect(spyOnUpdateData).toHaveBeenCalledTimes(1);
    expect(spyOnGetData).toHaveBeenCalledWith({
      ...newRoute.query,
      offset: 0,
    });
  });

  it('should call getData with the correct arguments if sort changed', () => {
    const newRoute = {
      query: {
        sort: encodeURIComponent(JSON.stringify([{ key: 'id', order: 'asc' }])),
      },
    };
    const oldRoute = {
      query: {
        sort: encodeURIComponent(
          JSON.stringify([
            { key: 'id', order: 'asc' },
            { key: 'firstName', order: 'desc' },
          ])
        ),
      },
    };
    handleRouteChange.bind(context)(newRoute, oldRoute, testLimit);
    expect(spyOnGetData).toHaveBeenCalledTimes(1);
    expect(spyOnUpdateData).toHaveBeenCalledTimes(1);
    expect(spyOnGetData).toHaveBeenCalledWith({
      ...newRoute.query,
      offset: 0,
    });
  });
});