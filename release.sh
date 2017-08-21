basepath=$(cd `dirname $0`; pwd)

# gulp release
node node_modules/gulp/bin/gulp.js release

zip -r echarts-www.zip release

rm -rf release