import { app, BrowserWindow, ipcMain } from 'electron'
import * as path from 'path'
import * as url from 'url'
import { sleep } from './util'
import * as request from 'request'
import { getAnswerId, getExam, complete, getAnswerContent, getScore } from './req';

// 保持一个对于 window 对象的全局引用，如果你不这样做，
// 当 JavaScript 对象被垃圾回收， window 会被自动地关闭
let win: BrowserWindow | null

function createWindow() {
    // 创建浏览器窗口。
    win = new BrowserWindow({ width: 800, height: 640 })

    // 然后加载应用的 index.html。
    win.loadURL(url.format({
        pathname: path.join(__dirname, '../static/index.html'),
        protocol: 'file:',
        slashes: true
    }))

    // 打开开发者工具。
    // win.webContents.openDevTools()

    // 当 window 被关闭，这个事件会被触发。
    win.on('closed', () => {
        // 取消引用 window 对象，如果你的应用支持多窗口的话，
        // 通常会把多个 window 对象存放在一个数组里面，
        // 与此同时，你应该删除相应的元素。
        win = null
    })

    ipcMain.on('user-info', async (evt: any, userInfo: UserInfo, time: any, score: number) => {
        const ms = (parseInt(time.minutes) * 60 + parseInt(time.seconds)) * 1000
        const answerId = await getAnswerId(userInfo)
        const exam = await getExam(answerId)
        await sleep(ms)
        for (const i of exam) {
            const answerContent = getAnswerContent(i, score-- > 0 ? 1 : 0)
            const flag = await complete(answerId, i.questionId, answerContent)
            if (!flag) {
                evt.sender.send('network-err')
                return
            }
        }
        const flag = await getScore(answerId)
        if (!flag) {
            evt.sender.send('network-err')
            return
        } else {
            evt.sender.send('result-url', `https://www.qingsuyun.com/h5/107515/pc/exam/exam-detail/#id=${answerId}`)
        }
    })
}

// Electron 会在初始化后并准备
// 创建浏览器窗口时，调用这个函数。
// 部分 API 在 ready 事件触发后才能使用。
app.on('ready', createWindow)

// 当全部窗口关闭时退出。
app.on('window-all-closed', () => {
    // 在 macOS 上，除非用户用 Cmd + Q 确定地退出，
    // 否则绝大部分应用及其菜单栏会保持激活。
    if (process.platform !== 'darwin') {
        app.quit()
    }
})

app.on('activate', () => {
    // 在macOS上，当单击dock图标并且没有其他窗口打开时，
    // 通常在应用程序中重新创建一个窗口。
    if (win === null) {
        createWindow()
    }
})

  // 在这文件，你可以续写应用剩下主进程代码。
  // 也可以拆分成几个文件，然后用 require 导入。
