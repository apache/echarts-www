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
        const absolutePath = path.resolve(artifactDir, relativePath);

        await client.putObjectFromFile(BUCKET_NAME, relativePath, absolutePath)

        console.log(chalk.green(`uploaded: ${absolutePath}`));
    }
}

upload();
