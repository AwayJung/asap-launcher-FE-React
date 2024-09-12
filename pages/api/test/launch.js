/**
 * @TODO implement here
 * @param {*} req
 * @param {*} res
 */
export default async function handler(req, res) {
  const step = req.query.step;
  const parent = req.query.parent;

  const result = searchParams(params, step, parent);
  res.status(200).json(result);
}
