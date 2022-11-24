// TODO make sure this is all covered in theme manager
// import { responsesDb } from '../models/index.js'
// import { logger, metrics } from '@whatagoodbot/utilities'
// import { clients } from '@whatagoodbot/rpc'

// export default async (payload) => {
//   metrics.count('themeUpdate', payload)
//   const strings = {}
//   const results = await responsesDb.getMany(null, ['themeCurrent', 'themeOnDeck', 'themeLeader', 'themeCaboose', 'themeEnd'], 'system')
//   results.forEach(string => {
//     strings[string.name] = string.value
//   })
//   const leader = await getUser(payload.leader)
//   const caboose = await getUser(payload.caboose)
//   const firstMentionPosition = strings.themeLeader.length + 1
//   const secondMentionPosition = firstMentionPosition + leader.name.length + strings.themeCaboose.length + 4
//   if (payload.trigger === 'stop') {
//     return [{
//       topic: 'broadcast',
//       payload: {
//         message: strings.themeEnd,
//         clearPin: true
//       }
//     }]
//   } else {
//     return [{
//       topic: 'broadcast',
//       payload: {
//         message: `${strings.themeCurrent} ${payload.currentTheme}. ${strings.themeOnDeck} ${payload.nextTheme}`,
//         pin: true
//       }
//     }, {
//       topic: 'broadcast',
//       payload: {
//         message: `${strings.themeLeader} @${leader.name}, ${strings.themeCaboose} @${caboose.name}`,
//         mentions: [{
//           userId: payload.leader,
//           nickname: leader.name,
//           position: firstMentionPosition
//         }, {
//           userId: payload.caboose,
//           nickname: caboose.name,
//           position: secondMentionPosition
//         }]
//       }
//     }]
//   }
// }
