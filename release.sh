basepath=$(cd `dirname $0`; pwd)

gulp release

zip -r echarts-home.zip release

rm -rf release