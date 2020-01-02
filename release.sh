#!/bin/bash

# ------------------------------------------------------------------------
# Usage:
# sh release.sh --env asf
# sh release.sh --env echartsjs
# sh release.sh --env dev # the same as "debug"
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

basePath=$(cd `dirname $0`; pwd)
currPath=$(pwd)
docProjectPath="${basePath}/../incubator-echarts-doc";
examplesProjectPath="${basePath}/../echarts-examples";

cd ${basePath}

if [[ "${envType}" = "echartsjs" ]]; then
    mkdir ${basePath}/release
fi

# Cleanup
cd ${basePath}
node build.js --env ${envType} --clean

# Build doc
echo "Build doc ..."
if [ ! -d "${docProjectPath}" ]; then
    echo "Directory ${docProjectPath} DOES NOT exists."
    exit 1
fi
cd ${docProjectPath}
npm run build:site
node build.js --env ${envType}
cd ${currPath}
echo "Build doc done."

# Build examples
echo "Build examples ..."
if [ ! -d "${examplesProjectPath}" ]; then
    echo "Directory ${examplesProjectPath} DOES NOT exists."
    exit 1
fi
cd ${examplesProjectPath}
node build.js --env ${envType}
cd ${currPath}
echo "Build examples done."

# Build www
echo "Build www ..."
cd ${basePath}
node build.js --env ${envType}
cd ${currPath}
echo "Build www done."


if [[ "${envType}" = "echartsjs" ]]; then
    cd ${basePath}
    echo "zip echarts-www.zip ..."
    if [ -f echarts-www.zip ]; then
        rm echarts-www.zip
    fi
    zip -r -q echarts-www.zip release
    echo "zip echarts-www.zip done."
    cd ${currPath}
fi

echo "echarts-www release done for ${envType}"
