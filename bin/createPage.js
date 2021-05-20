const fs = require('fs');
const path = require('path');
const readline = require("readline");
const fse = require('fs-extra');
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const SPA_PAGE_CONFIG_PATH = path.join(__dirname, '../config/spa-pages.json');
const JADE_PATH = path.join(__dirname, '../_jade');
const JADE_ZH_PATH = path.join(JADE_PATH, 'zh');
const JADE_EN_PATH = path.join(JADE_PATH, 'en');
const spaPages = JSON.parse(fs.readFileSync(SPA_PAGE_CONFIG_PATH, 'utf-8'));

function createPage({
    projectName,
    pageName,
    pageTitle,
    pageChineseTitle,
}) {
    const entry = path.join(pageName, 'index.jade');

    const idx = spaPages.findIndex(page => page.pageName === pageName);

    function doCreatePage() {
        fse.copySync(
            path.join(__dirname, "asset/template/page-redirect.jade"),
            path.join(JADE_PATH, `${pageName}.jade`),
            { overwrite: true }
        );

        fse.copySync(
            path.join(__dirname, "asset/template/page-zh.jade"),
            path.join(JADE_ZH_PATH, entry),
            { overwrite: true }
        );

        fse.copySync(
            path.join(__dirname, "asset/template/page-en.jade"),
            path.join(JADE_EN_PATH, entry),
            { overwrite: true }
        );

        fs.writeFileSync(SPA_PAGE_CONFIG_PATH, JSON.stringify(spaPages, null, 2), 'utf-8');

        console.log('Page created successfully!');
        console.log('You can change the page title in the config/spa-pages.json');
    }

    const pageCfg = {
        projectName,
        pageName,
        pageTitle,
        pageChineseTitle,
        entry
    };
    if (idx >= 0) {
        rl.question(`Page exists. Do you wan\'t to replace it? (Yes or No): `, function (response) {
            if (response.toLowerCase() === 'yes' || response.toLowerCase() === 'y') {
                spaPages[idx] = pageCfg;
                doCreatePage();
            }
            else {
                return;
            }

            rl.close();
        });
    }
    else {
        spaPages.push(pageCfg);
        doCreatePage();

        rl.close();
    }
}

rl.question('Project Name? (It will use it locate the project): ', function (projectName) {
    rl.question('Page Name? (It will be used to create page file): ', function (pageName) {
        rl.question('Page Title? (It will be displayed on title): ', function (pageTitle) {
            rl.question('Page Chinese Title? (It will be displayed on title): ', function (pageChineseTitle) {
                createPage({
                    projectName,
                    pageName,
                    pageTitle,
                    pageChineseTitle
                });
            });
        });
    });
});

