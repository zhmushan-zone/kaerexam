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
