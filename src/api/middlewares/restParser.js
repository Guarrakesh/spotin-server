const { omit, pick } = require('lodash');

exports.filterRestQuery = (req, res, next) => {
  const pagingParams = pick(req.query, ['_end', '_start', '_order', '_sort' ]);
  let filterParams = omit(req.query, ['_end', '_start', '_order', '_sort' ]);
  if (req.query.id_like) {
    filterParams.ids = decodeURIComponent(req.query.id_like).split('|');
    delete filterParams['id_like'];
  };
  req.pagingParams = pagingParams;
  req.filterParams = filterParams;

  next();

};
