const globby = require('globby');
const chalk = require('chalk');
const path = require('path');
// const fs = require('fs');
const assert = require('assert');
const bosSDK = require('@baiducloud/sdk');
const argv = require('yargs').argv;

const projectDir = path.resolve(__dirname, '..');
const artifactDir = path.resolve(projectDir, '../incubator-echarts-website');
const BosClient = bosSDK.BosClient;

// -------------------------------------------------------------------------
// Usage:
// node uploadBOS.js --doc --ak xxx --sk yyy  # upload all. Would be slow.
// node uploadBOS.js --doc                    # upload only doc.
// -------------------------------------------------------------------------


assert(argv.ak && argv.sk, 'as sk MUST be provided.')

const config = {
    endpoint: 'https://bj.bcebos.com',
    credentials: {
        ak: argv.ak,
        sk: argv.sk
    }
};

const client = new BosClient(config);
const BUCKET_NAME = 'echarts-www';

async function upload(onlyDoc) {
    const filePathList = await globby([
        '**/*'
    ], {
        cwd: artifactDir
    });

    for (relativePath of filePathList) {

        if (onlyDoc
            && relativePath
        ) {
            if (relativePath.indexOf('zh/documents') !== 0) {
                continue;
            }
            console.log('Only upload doc ...');
        }

        if (
            /\.html$/.test(relativePath)
            || relativePath.indexOf('en/') === 0
            || relativePath.includes('vendors/echarts')
            || relativePath.includes('vendors/ace')
            || relativePath.includes('vendors/bootstrap')
            || relativePath.includes('vendors/d3')
            || relativePath.includes('vendors/jquery')
            || relativePath.includes('vendors/dat.gui')
            || relativePath.includes('vendors/jquery.lazyload')
            || relativePath.includes('vendors/loadash')
            || relativePath.includes('vendors/waypoint')
            || relativePath.indexOf('zh/builder') === 0
            || relativePath.indexOf('zh/dist') === 0
        ) {
            continue;
        }

        const absolutePath = path.resolve(artifactDir, relativePath);
        const opt = {
            // Try to force use browser cache to save money.
            // If source changed, change the version param in URL to invalid the cache.
            'Cache-Control': 'max-age=31536000'
            // FIXME Should "public"?
            // 'Cache-Control': 'public, max-age=31536000'
        };

        await client.putObjectFromFile(BUCKET_NAME, relativePath, absolutePath, opt)

        console.log(chalk.green(`uploaded: ${absolutePath}`));
    }
}

upload(!!argv.doc);
