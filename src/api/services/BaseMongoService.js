const { ObjectId } = require('bson');
const omit = require('lodash/omit');
class BaseMongoService {


  constructor(model) {
    this.model = model;
  }
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


  async paginate(filter, pagingParams) {
    let params = BaseMongoService.convertRestFilterParams(filter);
    const paging = BaseMongoService.convertRestPagingParams(pagingParams);

    if (params._id && params._id.$in && !ObjectId.isValid(params._id.$in[0])) {
      params.slug = params._id;
      params = omit(params, '_id')
    }
    return {
      docs: await this.model.find(params).skip(paging.offset).limit(paging.limit).sort(paging.sort),
      total: await this.model.find(params).count(),
      limit: paging.limit,
      offset: paging.offset,
    }
  }
  async findById(id) {
    return this.model.findById(id);
  }
  async findOne(...opts) {
    return this.model.findOne(...opts);
  }
  async find(...opts) {
    return this.model.find(...opts);
  }
  async remove(id) {

    return this.model.remove({_id: id});
  }

  async create(atts, opts) {
    return this.model.create(atts, opts);
  }
  async update(id, atts, opts) {
    return this.model.findOneAndUpdate({ _id: id }, atts, opts);
  }
}
module.exports = BaseMongoService;
