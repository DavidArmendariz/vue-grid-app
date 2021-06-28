import { LIMIT } from './constants';

export function handleRouteChange(newRoute, oldRoute) {
  if (newRoute.query.offset !== oldRoute.query.offset) {
    const offset = parseInt(newRoute.query.offset) || 1;
    const newData = this.model.getData({
      offset: LIMIT * (offset - 1),
      search: newRoute.query.search,
      columns: newRoute.query.columns,
      sort: newRoute.query.sort,
    });
    this.updateData(newData);
  }

  if (newRoute.query.search !== oldRoute.query.search) {
    const newData = this.model.getData({
      offset: 0,
      search: newRoute.query.search,
      columns: newRoute.query.columns,
      sort: newRoute.query.sort,
    });
    this.updateData(newData);
  }

  if (newRoute.query.columns !== oldRoute.query.columns) {
    const offset = parseInt(newRoute.query.offset) || 1;
    const newData = this.model.getData({
      offset: LIMIT * (offset - 1),
      search: newRoute.query.search,
      columns: newRoute.query.columns,
      sort: newRoute.query.sort,
    });
    this.updateData(newData);
  }

  if (newRoute.query.sort !== oldRoute.query.sort) {
    const offset = parseInt(newRoute.query.offset) || 1;
    const newData = this.model.getData({
      offset: LIMIT * (offset - 1),
      search: newRoute.query.search,
      columns: newRoute.query.columns,
      sort: newRoute.query.sort,
    });
    this.updateData(newData);
  }
}
