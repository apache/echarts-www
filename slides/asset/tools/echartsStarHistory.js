import fs from 'fs';
import getStarHistory from './getStarHistory';

var repo = 'ecomfe/echarts';

const starHistory = await getStarHistory(repo)

fs.writeFileSync('../data/star-history.json', JSON.stringify(starHistory), 'utf-8');