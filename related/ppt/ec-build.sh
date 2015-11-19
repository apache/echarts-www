
ecDevDir=/sushuangwork/met/act/gitall/echarts/echarts-next
zrDevDir=/sushuangwork/met/act/gitall/echarts/zrender-dev3.0/
thisDir=`pwd`

rm -r ${thisDir}/asset/echarts-next
mkdir ${thisDir}/asset/echarts-next
mkdir ${thisDir}/asset/echarts-next/src
cp -r ${ecDevDir}/theme ${thisDir}/asset/echarts-next
cp -r ${ecDevDir}/geoData ${thisDir}/asset/echarts-next

cd ${ecDevDir}/build
sh build.sh raw
cp ${ecDevDir}/dist/echarts.js ${thisDir}/asset/echarts-next/src
cd ${thisDir}
