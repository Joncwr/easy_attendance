const express = require('express')
const router = express.Router()

const Attendance = require('../../models/attendance')
const Groups = require('../../models/groups')
const accountSid = 'AC5af195c67fd6e784c03f34e51eb7dd3b';
const authToken = '33c1b87b673af4cb521989e6b27e42e2';
const client = require('twilio')(accountSid, authToken);
const Telegram = require('telegraf/telegram')
const TelegramBot = new Telegram(process.env.TELEGRAM_BOT_TOKEN)

router.post('/broadcast', (req, res) => {
  let { attendeesData, event_id, message } = req.body
  let attendees = req.body
  let result = []
  let test
  let counter = 0
  attendeesData.forEach(data => {
    let { name, id, number } = data
    let link = `http://ec2-18-191-78-79.us-east-2.compute.amazonaws.com/confirmation?attendee_id=${id}&event_id=${event_id}, please click on the link to confirm your attendance!`
    client.messages
    .create({
       body: `Your ${message} code is ${link}`,
       from: 'whatsapp:+14155238886',
       to: `whatsapp:${number}`
     })
    .then(message => {
      result.push({
        name: data.name,
        message: message
      })
      return Attendance
      .query()
      .where({attendee_id: id, event_id})
      .then(([row]) => {
        if (!row) {
          return Attendance
          .query()
          .insert({attendee_id: id, event_id, status: null, message_sid: message.sid})
          .then(attendance => {
            counter++
            if (counter === attendeesData.length) {
              res.send(result)
            }
          })
        }
        else {
          return Attendance
          .query()
          .where({ id: row.id })
          .patch({ message_sid: message.sid })
          .then(attendance => {
            counter++
            if (counter === attendeesData.length) {
              res.send(result)
            }
          })
        }
      })
    })
    .catch(err => {
      console.log('error => ', err);
      result.push({
        name: data.name,
        message: err
      })
    })
  })
});

router.post('/single', (req, res) => {
  let { name, id, number, event_id, message } = req.body
  let link = `http://ec2-18-191-78-79.us-east-2.compute.amazonaws.com/confirmation?attendee_id=${id}&event_id=${event_id}, please click on the link to confirm your attendance!`
  client.messages
    .create({
       body: `Your ${message} code is ${link}`,
       from: 'whatsapp:+14155238886',
       to: `whatsapp:${number}`
     })
    .then(message => {
      return Attendance
      .query()
      .where({attendee_id: id, event_id})
      .then(([row]) => {
        if (!row) {
          return Attendance
          .query()
          .insert({attendee_id: id, event_id, status: null, message_sid: message.sid})
          .then(attendance => {
            res.send(attendance)
          })
        }
        else {
          return Attendance
          .query()
          .where({ id: row.id })
          .patch({ message_sid: message.sid })
          .then(attendance => {
            res.sendStatus(200)
          })
        }
      })
    })
    .catch(err => {
      console.log('error => ', err);
      res.send(err)
    })
});

router.post('/testTelegram', (req, res) => {
  bot.sendMessage(721544223, 'https://t.me/Bible_Study_Test_Bot?start=regfor30')
  .then(res => {
    console.log(res);
  })
  .catch(err => {
    console.log(err);
  })
});

router.post('/telegramBroadcast', (req, res) => {
  let { group_id, event_id, event_name } = req.body
  return Groups
  .query()
  .where({id: group_id})
  .eager('attendees(telegramExists)')
  .then(([group]) => {
    group.attendees.forEach(attendee => {
      let inlineButton = [{text: '📝 Respond for ' + event_name + '! 💖', callback_data: 'inatt.' + event_id}]
      TelegramBot.sendMessage(attendee.telegram_id, null, {
        text: 'Please take a minute to mark your attendance by clicking the link below! 🙏😊',
        reply_markup: { inline_keyboard: [inlineButton] }
      })
      .then(res => {
        return Attendance
        .query()
        .where({attendee_id: attendee.id, event_id})
        .then(attendance => {
          if (attendance.length > 0) {
            return Attendance
            .query()
            .patchAndFetchById(attendance[0].id, {attendee_id: attendee.id, event_id, message_status: 'delivered'})
            .then(result => {
            })
          }
          else {
            return Attendance
            .query()
            .insert({attendee_id: attendee.id, event_id, message_status: 'delivered'})
            .then(result => {
            })
          }
        })
      })
      .catch(err => {
        return Attendance
        .query()
        .where({attendee_id: attendee.id, event_id})
        .then(attendance => {
          if (attendance.length > 0) {
            return Attendance
            .query()
            .patchAndFetchById(attendance[0].id, {attendee_id: attendee.id, event_id, message_status: 'failed'})
            .then(result => {
            })
          }
          else {
            return Attendance
            .query()
            .insert({attendee_id: attendee.id, event_id, message_status: 'failed'})
            .then(result => {
            })
          }
        })
        console.log('COULNT SEND MESSAGE', err.description);
      })
    })

    res.sendStatus(200)
  })
  .catch(err => {
    console.log(err)
    res.sendStatus(400)
  })
});

router.post('/telegramBroadcastUnanswered', (req, res) => {
  let { group_id, event_id, event_name } = req.body
  return Groups
  .query()
  .where({id: group_id})
  .eager('attendees(telegramExists)')
  .then(([group]) => {
    group.attendees.forEach(attendee => {
      return Attendance
      .query()
      .where({attendee_id: attendee.id, event_id, status: null})
      .then(attendance => {
        if (attendance.length > 0) {
          let inlineButton = [{text: '📝 Respond for ' + event_name + '! 💖', callback_data: 'inatt.' + event_id}]
          TelegramBot.sendMessage(attendee.telegram_id, null, {
            text: 'Please take a minute to mark your attendance by clicking the link below! 🙏😊',
            reply_markup: { inline_keyboard: [inlineButton] }
          })
          .then(res => {})
          .catch(err => console.log(err))
        }
      })
    })
    res.sendStatus(200)
  })
  .catch(err => {
    console.log(err)
    res.sendStatus(400)
  })
});

router.post('/sendSummaryNotesToDeclined', (req, res) => {
  let { event_id } = req.body
  return Attendance
  .query()
  .where({ event_id })
  .whereNot({ status: true })
  .eager('attendees(telegramExists)')
  .then(attendance => {
    attendance.forEach(data => {
      if (data.attendees) {
        let inlineButton = [{
          text: `👉 Click to be directed to the summary notes! 📖`,
          callback_data: `snotes:${event_id}`
        }]
        TelegramBot.sendMessage(data.attendees.telegram_id, null, {
          text: '❤️ Please catch up on with the Bible Study Material with the summary notes available below! 🙏',
          reply_markup: { inline_keyboard: [inlineButton] }
        })
        .then(res => {})
        .catch(err => console.log(err))
      }
    })
    res.sendStatus(200)
  })
  .catch(err => {
    console.log(err)
    res.sendStatus(400)
  })
});


module.exports = router
