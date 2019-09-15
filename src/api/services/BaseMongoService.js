class BaseMongoService {


  static convertRestPagingParams(query) {
    const { _end = 10, _start = 0, _order = -1, _sort = "_id" } = query;
    return {
      sort: { [_sort]: _order },
      offset: parseInt(_start),
      limit: parseInt(_end - _start),
    };
  }
  static convertRestFilterParams(query) {
    let filterQuery = {...query};
    if (query.ids) {
      filterQuery._id = {$in: query.ids};
      delete filterQuery['ids']
    }
    return filterQuery;
  }



}
module.exports = BaseMongoService;