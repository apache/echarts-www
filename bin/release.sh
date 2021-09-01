#!/bin/bash

# ------------------------------------------------------------------------
# Usage:
# sh release.sh --env asf
# sh release.sh --env echartsjs
# sh release.sh --env dev # the same as "debug"
# sh release.sh --onlynext # only build next
# # Check `./config` to see the available env
# ------------------------------------------------------------------------

while [[ $# -gt 0 ]]; do
    case "$1" in
        --env) envType="$2"; shift; shift ;;
        --env=*) envType="${1#*=}"; shift ;;
        *) shift ;;
    esac
done
if [[ ! -n "${envType}" ]]; then
    echo "--env must be specified."
    exit 1;
fi

echo "Building with env type: ${envType}"

currWorkingDir=$(pwd)
thisScriptDir=$(cd `dirname $0`; pwd)
wwwProjectDir="${thisScriptDir}/..";
docProjectDir="${wwwProjectDir}/../echarts-doc";
examplesProjectDir="${wwwProjectDir}/../echarts-examples";
handbookProjectDir="${wwwProjectDir}/../echarts-handbook";
websiteTargetDir="${wwwProjectDir}/../echarts-website";
themeProjectDir="${wwwProjectDir}/../echarts-theme-builder";

cd ${wwwProjectDir}

if [[ "${envType}" = "echartsjs" ]]; then
    mkdir ${wwwProjectDir}/release
fi

# Cleanup
cd ${thisScriptDir}
node build.js --env ${envType} --clean

# Build Theme Builder
echo "Build theme builder ..."
if [ ! -d "${themeProjectDir}" ]; then
    echo "Directory ${themeProjectDir} DOES NOT exists."
    exit 1
fi
cd ${themeProjectDir}
node build.js --release

# Build doc
echo "Build doc ..."
if [ ! -d "${docProjectDir}" ]; then
    echo "Directory ${docProjectDir} DOES NOT exists."
    exit 1
fi
cd ${docProjectDir}
npm run build:site
node build.js --env ${envType}
cd ${currWorkingDir}
echo "Build doc done."

# Build examples
echo "Build examples..."
if [ ! -d "${examplesProjectDir}" ]; then
    echo "Directory ${examplesProjectDir} DOES NOT exists."
    exit 1
fi
cd ${examplesProjectDir}
npm run release
cd ${currWorkingDir}
echo "Build examples done."

# Build SPA pages.
cd ${thisScriptDir}
node releasePages.js

# Build www
echo "Build www ..."
cd ${wwwProjectDir}
node bin/build.js --env ${envType}
cd ${currWorkingDir}
echo "Build www done."

# Build handbook after www page build.
# handbook needs fetch nav page.
echo "Build handbook ..."
if [ ! -d "${handbookProjectDir}" ]; then
    echo "Directory ${handbookProjectDir} DOES NOT exists."
    exit 1
fi
cd ${handbookProjectDir}
npm run build:${envType}
rm -rf ${websiteTargetDir}/handbook
cp -R ${handbookProjectDir}/dist ${websiteTargetDir}/handbook
echo "Build handbook done."


echo "echarts-www release done for ${envType}"
