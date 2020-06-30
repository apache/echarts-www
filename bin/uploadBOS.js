const globby = require('globby');
const chalk = require('chalk');
const path = require('path');
// const fs = require('fs');
// const assert = require('assert');
const bosSDK = require('@baiducloud/sdk');

const projectDir = path.resolve(__dirname, '..');
const artifactDir = path.resolve(projectDir, '../incubator-echarts-website');
const BosClient = bosSDK.BosClient;

const config = {
    endpoint: 'https://bj.bcebos.com',
    credentials: {
        ak: '8b99aee382924513ba255a454d53325a',
        sk: 'a144cf7d259243e5a0f7adf253ee73af'
    }
};

const client = new BosClient(config);
const BUCKET_NAME = 'echarts-www';

async function upload() {
    const filePathList = await globby([
        '**/*'
    ], {
        cwd: artifactDir
    });

    for (relativePath of filePathList) {
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

        await client.putObjectFromFile(BUCKET_NAME, relativePath, absolutePath)

        console.log(chalk.green(`uploaded: ${absolutePath}`));
    }
}

upload();
