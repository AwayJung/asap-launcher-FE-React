import { promises as fs } from 'fs';

/**
 * 
 * @param {*} req 
 * @param {*} res 
 */
export default async function handler(req, res) {
  const step = req.query.step;
  const parent = req.query.parent;
  const params = JSON.parse(await readParams())?.data;

  const result = searchParams(params, step, parent);
  res.status(200).json(result);
}

/**
 * 
 * @param {*} params 
 * @param {*} step 
 * @param {*} parent 
 * @returns 
 */
function searchParams(params, step, parent) {
  const result = [];
  params.forEach(_items => {
    _items.forEach(_item => {
      step = parseInt(step);
      if (_item.step === step) {
        if (step > 1) {
          _item.parents.forEach(_parent => {
            if (_parent === parent) {
              result.push(_item);
            }
          })
        } else {
          result.push(_item);
        }
      }
    })
  });
  return result;
}

/**
 * 
 * @returns 
 */
async function readParams() {
  return await fs.readFile(process.cwd() + '/public/data/params.example.v0.1.json', 'utf8');
}