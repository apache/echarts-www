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

cd ${basePath}
# Cleanup
rm -r release
rm echarts-www.zip

if [[ "${envType}" = "echartsjs" ]]; then
    mkdir ${basePath}/release
fi

# Build doc
echo "Build doc ..."
sh ../echarts-doc/release.sh --env ${envType}
echo "Build doc done."

# Build examples
echo "Build examples ..."
sh ../echarts-examples/release.sh --env ${envType}
echo "Build examples done."

# Release
echo "Build www ..."
node ${basePath}/build.js --env ${envType}
echo "Build www done."

cd ${currPath}

if [[ "${envType}" = "echartsjs" ]]; then
    cd ${basePath}
    zip -r echarts-www.zip release
    cd ${currPath}
fi
