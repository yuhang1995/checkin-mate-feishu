import * as lark from '@larksuiteoapi/node-sdk';
import express from 'express';
import dayjs from 'dayjs';

const PORT = process.env.PORT;
const APP_ID = process.env.APP_ID;
const APP_SECRET = process.env.APP_SECRET;

const client = new lark.Client({
    appId: APP_ID,
    appSecret: APP_SECRET
});

const app = express();

const PUNCH_STATUS = {
    Early: '早退',
    Late: '迟到',
    Lack: '缺卡'
}

const WORK_TYPES = {
    1: '上班',
    2: '下班'
}

// 通过通讯录权限接口，获取所有user_id
async function getContacatUsers() {
    return await client.contact.scope.list({
        params: {
            user_id_type: 'user_id',
            department_id_type: 'open_department_id',
            page_size: 50,
        },
    },
    ).then((res) => {
        const { data = {} } = res
        return data.user_ids || []
    }).catch(err => {
        console.log('获取通讯录联系人失败:', {
            status: err.response.status,
            data: err.response.data
        })
        return []
    });
}

// 获取用户某天可以补的第几次上 / 下班卡的时间
async function getUserAllowedRemedys(user_id, remedy_date) {
    return client.attendance.userTaskRemedy.queryUserAllowedRemedys({
        params: {
            employee_type: 'employee_id',
        },
        data: {
            user_id,
            remedy_date,
        },
    }
    ).then(res => {
        const { data = {} } = res
        const { user_allowed_remedys = [] } = data
        return user_allowed_remedys.map(remedy => remedyFormatter(remedy)).filter(item => !!item)
    }).catch(err => {
        console.log(`获取用户${user_id}补卡信息失败`, {
            status: err.response.status,
            data: err.response.data
        })
        return []
    });
}

// 以YYYY-MM-DD格式格式化remedy_date
function remedyDateFormatter(date) {
    if (date) {
        const year = date.slice(0, 4);
        const month = date.slice(4, 6);
        const day = date.slice(6, 8);
        return `${year}-${month}-${day}`
    }
    return ''
}

// 将缺卡格式化为指定的文本格式
function remedyFormatter(remedy) {
    if (remedy.is_free_punch) {
        return ''
    }

    return `😢缺卡：${remedyDateFormatter(remedy.remedy_date + '')} ${WORK_TYPES[remedy.work_type]}`
    // return `😢缺卡：${remedyDateFormatter(remedy.remedy_date + '')} ${WORK_TYPES[remedy.work_type]}\n\n补卡时间：${dayjs(remedy.remedy_start_time).format('YYYY-MM-DD')} - ${dayjs(remedy.remedy_end_time).format('YYYY-MM-DD')}`
}

// 组装消息卡片
function cardMessage(remedyStrs) {
    let contentStrs = []
    remedyStrs.forEach(remedyStr => {
        contentStrs = [...contentStrs,
        {
            "tag": "div",
            "text": {
                "content": remedyStr,
                "tag": "plain_text"
            }
        }
            ,
        {
            "tag": "hr"
        }
        ]
    })

    const template = {
        "config": {
            "wide_screen_mode": true
        },
        "elements": [
            ...contentStrs,
            {
                "actions": [
                    {
                        "tag": "button",
                        "text": {
                            "content": "去补卡",
                            "tag": "plain_text"
                        },
                        "type": "primary",
                        "multi_url": {
                            "url": "https://applink.feishu.cn/client/mini_program/open?appId=cli_9c21a4767c305107&mode=sidebar-semi",
                            "pc_url": "https://applink.feishu.cn/client/mini_program/open?appId=cli_9c21a4767c305107&mode=sidebar-semi",
                            "android_url": "",
                            "ios_url": ""
                        }
                    }
                ],
                "tag": "action"
            }
        ],
        "header": {
            "template": "violet",
            "title": {
                "content": "缺卡提醒",
                "tag": "plain_text"
            }
        }
    }

    return JSON.stringify(template)
}

async function sendMessageHandler() {
    const currentDate = dayjs().format('YYYYMMDD')
    try {
        await getContacatUsers().then(users => {
            users.map(async user => {
                const remedys = await getUserAllowedRemedys(user, currentDate)
                if (remedys.length > 0) {
                    await client.im.message.create({
                        params: {
                            receive_id_type: 'user_id'
                        },
                        data: {
                            receive_id: user,
                            content: cardMessage(remedys),
                            msg_type: 'interactive'
                        }
                    });
                }
            })
        })
        return ({
            code: '0',
            message: 'success'
        })
    } catch (error) {
        return ({
            code: '1',
            message: 'error',
            error
        })
    }
}

app.post('*', async (req, res) => {
    res.send(await sendMessageHandler())
})

app.listen(PORT, () => {
    console.log(`服务启动成功，端口http://localhost:${PORT}`)
});