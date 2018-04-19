import * as request from 'request'

const answerId = '1804192012245149292474881'

request.post('https://www.qingsuyun.com/h5/actions/exam/execute/find-exam.json', {
    form: {
        'answerId': answerId,
        'queryItems': true
    }
}, (error, response, body) => {
    const data = JSON.parse(body).body.examItems
    let flag = 0;
    for (const item of data) {
        let answerContent;
        if (item.questionType === 'SINGLE') {
            for (const i of item.jsonData.single.options) {
                if (i.rightAnswers) {
                    answerContent = i.sortIndex
                    break
                }
            }
        } else {
            answerContent = []
            for (const i of item.jsonData.multiple.options) {
                if (i.rightAnswers) {
                    answerContent.push(i.sortIndex)
                }
            } 
            answerContent = answerContent.toString()
        }
        request.post('https://www.qingsuyun.com/h5/actions/exam/execute/submit-answer.json', {
            form: {
                'answerId': answerId,
                'questionId': item.questionId,
                'answerContent': answerContent
            }
        }, (error, response, body) => {
            if (error) {
                console.error('网络不佳, 请重试')
                return
            } else {
                flag++;
            }
        })
    }
    setInterval(() => {
        if (flag === 80) {
            console.log('成功')
            flag++
            request.post('https://www.qingsuyun.com/h5/actions/exam/execute/finish-exam.json', {
                form: {
                    'answerId': answerId,
                    interrupt: false
                }
            }, (error, response, body) => {
                console.log(`https://www.qingsuyun.com/h5/107515/pc/exam/exam-detail/#id=${answerId}`)
            })
        }
    }, 1000)
})
