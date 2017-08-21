
ecHomePath='http://echarts.baidu.com'
localPath='.'

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
    remotePageFullPath=${ecHomePath}/${pagePath}

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

    codeContent=`curl -s ${remoteCodeFullPath}`

    # Find current version.
    versionFetchRegExp="version:\\s*.\\d\\+[.]\\d\\+[.]\\d\\+"
    versionStr=`cat ${localPath}"/config/env.js" | grep -ow -e ${versionFetchRegExp}`
    # Remove "version: "
    versionStr=`echo $versionStr | sed -n -e "s/[a-zA-Z: ']*//gp"`
    echo "echarts version should be: ${versionStr}"
    # Replace "." to "[.]"
    versionRegExp="version:\\s*."`echo $versionStr | sed -n -e "s/[.]/[.]/gp"`

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
