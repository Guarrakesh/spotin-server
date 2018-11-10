/**
 *
 * Aggregazioni che prendono in input un array di documenti e restituiscono un risultato paginato
 *
 * Esempio di risultato restituito
 * {
 *    _id: null,
 *    docs: [{...}, {...}],
 *    total: 2,
 *    offset: 0
 *  }
 * @param skip
 * @param limit
 * @param sort {{Object}} e.g: { field: _id, order: 1 }
 */
exports.pagination = ({skip = 0, limit = 10, sort = { field: "_id", order: 1}}) => ([
  sort && { $sort: { [sort.field]: sort.order } },
  { $group: { _id: null, total: { $sum: 1 }, docs: { $push: "$$ROOT"} } },
  { $project: { total: 1, docs: { $slice: [ "$docs", skip, limit ] } } },
  { $addFields: { offset: skip }}
]);
