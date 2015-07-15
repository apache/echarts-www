rm -r ../tmp-echarts-www-build
mkdir ../tmp-echarts-www-build
cp -r ./* ../tmp-echarts-www-build
find ../tmp-echarts-www-build/ -name ".git" | xargs rm -rf
rm -r ../tmp-echarts-www-build/docv
cd ./docv
edp build
mv output ../../tmp-echarts-www-build/docv
cd ../../tmp-echarts-www-build/