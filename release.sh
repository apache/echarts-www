basepath=$(cd `dirname $0`; pwd)

node node_modules/gulp/bin/gulp.js release-cn

zip -r echarts-www.zip release

node node_modules/gulp/bin/gulp.js release-en

rm -rf release