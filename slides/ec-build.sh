
ecDevDir=~/Develop/echarts-dev3.0
zrDevDir=~/Develop/zrender-dev3.0/
thisDir=`pwd`

rm -r ${thisDir}/asset/echarts-next/src
# mkdir ${thisDir}/asset/echarts-next
mkdir ${thisDir}/asset/echarts-next/src
# cp -r ${ecDevDir}/theme ${thisDir}/asset/echarts-next
# cp -r ${ecDevDir}/geoData ${thisDir}/asset/echarts-next

cd ${ecDevDir}/build
sh build.sh raw
cp ${ecDevDir}/dist/echarts.js ${thisDir}/asset/echarts-next/src
cd ${thisDir}

#alias md2reveal="node ~/Develop/echarts-home/slides/md2reveal/bin/cli.js"