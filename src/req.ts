/**
MIT License

Copyright (c) 2018 木杉

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

 */

import * as got from 'got'

export const getAnswerId = async (userInfo: UserInfo) => {
    const resp = await got.post('https://www.qingsuyun.com/h5/actions/exam/execute/create-exam.json', {
        form: true,
        body: userInfo
    })
    return JSON.parse(resp.body).body.answerId
}

export const getExam = async (answerId: string) => {
    const resp = await got.post('https://www.qingsuyun.com/h5/actions/exam/execute/find-exam.json', {
        form: true,
        body: {
            answerId,
            queryItems: true
        }
    })
    return JSON.parse(resp.body).body.examItems
}

export const complete = async (answerId: string, questionId: string, answerContent: string) => {
    const resp = await got.post('https://www.qingsuyun.com/h5/actions/exam/execute/submit-answer.json', {
        form: true,
        body: {
            answerId,
            questionId,
            answerContent
        }
    })
    if (JSON.parse(resp.body).code === 'SUCCESS') {
        return true
    }
    return false
}

export const getAnswerContent = (item: any, isRight: number) => {
    let answerContent = [];
    if (item.questionType === 'SINGLE') {
        for (const i of item.jsonData.single.options) {
            if (!(isRight ^ i.rightAnswers)) {
                answerContent.push(i.sortIndex)
                break
            }
        }
    } else {
        for (const i of item.jsonData.multiple.options) {
            if (!(isRight ^ i.rightAnswers)) {
                answerContent.push(i.sortIndex)
            }
        }
    }
    return answerContent.toString() || '0'
}

export const getScore = async (answerId: string) => {
    const resp = await got('https://www.qingsuyun.com/h5/actions/exam/execute/finish-exam.json', {
        form: true,
        body: {
            answerId,
            interrupt: true
        }
    })
    if (JSON.parse(resp.body).code === 'SUCCESS') {
        return true
    }
    return false
}
