basepath=$(cd `dirname $0`; pwd)

gulp release

zip -r echarts-www.zip release

rm -rf release