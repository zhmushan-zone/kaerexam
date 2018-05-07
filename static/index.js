alert('我没有做任何异常处理, 如果程序出现问题, 清联系我')
const ipc = require('electron').ipcRenderer
const shell = require('electron').shell
submit.onclick = evt => {
    alert('按钮已点击, 不用重复点了')
    const userInfo = {
        'collections[0].answerContent': username.value,
        'collections[1].answerContent': college.value,
        'collections[2].answerContent': collegeId.value,
        'collections[3].answerContent': faculty.value,
        'collections[4].answerContent': className.value,
        'paperId': '1803217582',
        'startNow': true
    }
    const time = {
        'minutes': timeM.value,
        'seconds': timeS.value
    }
    ipc.send('user-info', userInfo, time, score.value)
    ipc.once('result-url', (evt, url) => {
        shell.openExternal(url)
    })
    ipc.once('network-err', evt => {
        alert('网络错误, 换一个好一点的网络')
    })
}