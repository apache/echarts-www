basepath=$(cd `dirname $0`; pwd)

rm -r ${basepath}/release
rm ${basepath}/echarts-www.zip

node ${basepath}/node_modules/gulp/bin/gulp.js release-cn

zip -r echarts-www.zip release

rm -r ${basepath}/release

node node_modules/gulp/bin/gulp.js release-en

rm -r ${basepath}/release
