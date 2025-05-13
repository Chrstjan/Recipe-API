/**
 * Gets attributes from request or standard
 * @param {Object} query req.query objekt
 * @param {string} default_attr default attributes
 * @returns {Array} A list of attributes
 */
export const getQueryAttributes = (query, default_att) => {
  const { attributes } = query;
  const valid_att = attributes ? attributes : default_att;
  return valid_att.split(",").map((item) => item.trim());
};

/**
 * Gets sorting params from request or standard
 * @param {Object} query req.query object
 * @returns {Array} An array in Sequelize's order format (column - direction)
 */
export const getQueryOrder = (query) => {
  const { order_key = "id", order_dir = "ASC" } = query;
  return [[order_key, order_dir]];
};

/**
 * Gets query limit from request or standard(10)
 * @param {Object} req.query object
 * @returns {number} query limit amount
 */
export const getQueryLimit = (query) => {
  const { limit } = query;
  return Number(limit) || 10;
};
