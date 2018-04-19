exports.__esModule = true;
var request = require("request");
var answerId = '1804192109085497776781497';
request.post('https://www.qingsuyun.com/h5/actions/exam/execute/find-exam.json', {
    form: {
        'answerId': answerId,
        'queryItems': true
    }
}, function (error, response, body) {
    var data = JSON.parse(body).body.examItems;
    var flag = 0;
    for (var _i = 0, data_1 = data; _i < data_1.length; _i++) {
        var item = data_1[_i];
        var answerContent = void 0;
        if (item.questionType === 'SINGLE') {
            for (var _a = 0, _b = item.jsonData.single.options; _a < _b.length; _a++) {
                var i = _b[_a];
                if (i.rightAnswers) {
                    answerContent = i.sortIndex;
                    break;
                }
            }
        }
        else {
            answerContent = [];
            for (var _c = 0, _d = item.jsonData.multiple.options; _c < _d.length; _c++) {
                var i = _d[_c];
                if (i.rightAnswers) {
                    answerContent.push(i.sortIndex);
                }
            }
            answerContent = answerContent.toString();
        }
        request.post('https://www.qingsuyun.com/h5/actions/exam/execute/submit-answer.json', {
            form: {
                'answerId': answerId,
                'questionId': item.questionId,
                'answerContent': answerContent
            }
        }, function (error, response, body) {
            if (error) {
                console.error('网络不佳, 请重试');
                return;
            }
            else {
                flag++;
            }
        });
    }
    setInterval(function () {
        if (flag === 80) {
            console.log('成功');
            flag++;
            request.post('https://www.qingsuyun.com/h5/actions/exam/execute/finish-exam.json', {
                form: {
                    'answerId': answerId,
                    interrupt: false
                }
            }, function (error, response, body) {
                console.log("https://www.qingsuyun.com/h5/107515/pc/exam/exam-detail/#id=" + answerId);
            });
        }
    }, 1000);
});
