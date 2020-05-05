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

currWorkingDir=$(pwd)
thisScriptDir=$(cd `dirname $0`; pwd)
wwwProjectDir="${thisScriptDir}/..";
docProjectDir="${wwwProjectDir}/../incubator-echarts-doc";
examplesProjectDir="${wwwProjectDir}/../echarts-examples";

cd ${wwwProjectDir}

if [[ "${envType}" = "echartsjs" ]]; then
    mkdir ${wwwProjectDir}/release
fi

# Cleanup
cd ${thisScriptDir}
node build.js --env ${envType} --clean

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
echo "Build examples ..."
if [ ! -d "${examplesProjectDir}" ]; then
    echo "Directory ${examplesProjectDir} DOES NOT exists."
    exit 1
fi
cd ${examplesProjectDir}
node build.js --env ${envType}
cd ${currWorkingDir}
echo "Build examples done."

# Build www
echo "Build www ..."
cd ${wwwProjectDir}
node bin/build.js --env ${envType}
cd ${currWorkingDir}
echo "Build www done."


if [[ "${envType}" = "echartsjs" ]]; then
    cd ${wwwProjectDir}
    echo "zip echarts-www.zip ..."
    if [ -f echarts-www.zip ]; then
        rm echarts-www.zip
    fi
    zip -r -q echarts-www.zip release
    echo "zip echarts-www.zip done."
    cd ${currWorkingDir}
fi

echo "echarts-www release done for ${envType}"
