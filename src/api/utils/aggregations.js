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
exports.pagination = ({skip = 0, limit = 10, sort}) => {
  let stages = [];
  if (sort) {
    stages.push({$sort: {[sort.field]: parseInt(sort.order, 10)}});
  }
  stages = [
      ...stages,
      {$group: {_id: null, total: {$sum: 1}, docs: {$push: "$$ROOT"}}},
      {$project: {total: 1, docs: {$slice: ["$docs", parseInt(skip, 10), parseInt(limit, 10)]}}},
      {$addFields: {offset: parseInt(skip, 10)}}
      ];
  return stages;
};
