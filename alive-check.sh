
ecHomePath='https://www.echartsjs.com'
localPath=$(cd `dirname $0`; pwd)

normalPages=(
    '404.html'
    'about.html'
    'api.html'
    'builder.html'
    'changelog.html'
    'demo.html'
    'download-extension.html'
    'download-map.html'
    'download-theme.html'
    'download.html'
    'examples.html'
    'faq.html'
    'index.html'
    'option-gl.html'
    'option.html'
    'spreadsheet.html'
    'tutorial.html'
);

codeDownloadURLs=(
    'dist/echarts.common.min.js'
    'dist/echarts.simple.min.js'
    'dist/echarts.min.js'
    'dist/echarts.js'
    'builder/src/echarts/echarts.js'
);

function checkNormalPage() {
    pagePath=$1
    remotePageFullPath=${ecHomePath}/zh/${pagePath}

    echo "Checking: ${remotePageFullPath} ..."

    pageContent=`curl -s ${remotePageFullPath}`
    # originContent=`cat ${localPath}/index.html`

    targetText='ECharts, a powerful, interactive charting and visualization library for browser'
    result=`echo ${pageContent} | grep "${targetText}"`

    if [[ "$result" != "" ]]
    then
        echo "OK.";
    else
        echo "${remotePageFullPath} ABNORMAL!!!";
        exit 1;
    fi
}


function checkCodeDownload() {
    codePath=$1
    remoteCodeFullPath=${ecHomePath}/${codePath}

    echo "Checking: ${remoteCodeFullPath} ..."

    # Find current version.
    # versionFetchRegExp="version:\\s*.\\d\\+[.]\\d\\+[.]\\d\\+"
    # Do not use "\d" or "[ ]" in shell, which does not work in online OS.
    # see https://en.wikibooks.org/wiki/Regular_Expressions/POSIX_Extended_Regular_Expressions
    versionFetchRegExp="version:[[:space:]]*.[[:digit:]]\\+[.][[:digit:]]\\+[.][[:digit:]]\\+"
    versionStr=`cat ${localPath}"/config/common.js" | grep -o -e ${versionFetchRegExp}`

    if [[ "$versionStr" == "" ]]
    then
        echo "Error version string in config";
        exit 1;
    fi

    # Remove "version: "
    versionStr=`echo $versionStr | sed -n -e "s/[a-zA-Z: ']*//gp"`
    echo "echarts version should be: ${versionStr}"
    # Replace "." to "[.]"
    versionRegExp=`echo $versionStr | sed -n -e "s/[.]/[.]/gp"`

    codeContent=`curl -s ${remoteCodeFullPath}`

    # For example:
    # versionRegExp="version:\\s*.3[.]6[.]2"
    # Match:
    #   version: "3.6.2"
    #   version:"3.6.2"
    #   version: '3.6.2'
    #   version:'3.6.2'
    result=`echo ${codeContent} | grep -e ${versionRegExp}`

    if [[ "$result" != "" ]]
    then
        echo "OK.";
    else
        echo "${remoteCodeFullPath} ABNORMAL!!!";
        exit 1;
    fi
}


for pagePath in ${normalPages[@]}; do
    checkNormalPage ${pagePath}
done

for codePath in ${codeDownloadURLs[@]}; do
    checkCodeDownload ${codePath}
done

echo "All Correct."
