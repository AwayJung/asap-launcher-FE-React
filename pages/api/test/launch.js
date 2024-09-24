/**
 * @TODO implement here
 * @param {*} req
 * @param {*} res
 */
export default async function handler(req, res) {
  // console.log("req.params : " +req.params );
  // res.json({message: 'Operation has been performed.'});
  // const step = req.query.step;
  // const parent = req.query.parent;
  //
  // const result = searchParams(params, step, parent);
  res.status(200).json(req.body);
  // res.json({message: req.params});
}
