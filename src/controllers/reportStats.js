import { responsesDb } from '../models/index.js'
import { metrics } from '../utils/metrics.js'
import { getUser } from '../libs/grpc.js'

export default async (payload, meta) => {
  metrics.count('reportStats', payload)
  const strings = {}
  const results = await responsesDb.getMany(null, ['statsIntroThisMonth', 'statsIntroLastMonth', 'statsIntroAllTime', 'statsHas', 'spinsOutro', 'dopeOutro', 'nopeOutro', 'starOutro', 'statsRoom', 'spinsIcon', 'starIcon', 'dopeIcon', 'nopeIcon', 'popularTrackIntro', 'popularTrackScore', 'leaderboardIntro', 'leaderboardFooter'], 'system')
  results.forEach(string => {
    strings[string.name] = string.value
  })

  const outroMapping = {
    dope: 'dopeOutro',
    nope: 'nopeOutro',
    star: 'starOutro',
    spins: 'spinsOutro'
  }

  const iconMapping = {
    dope: 'dopeIcon',
    nope: 'nopeIcon',
    star: 'starIcon',
    spins: 'spinsIcon'
  }

  let intro = ''
  switch (meta.stat.period) {
    case 'lastmonth':
      intro = strings.statsIntroLastMonth
      break
    case 'alltime':
      intro = strings.statsIntroAllTime
      break
    default:
      intro = strings.statsIntroThisMonth
      break
  }
  if (meta.stat.type === 'leaderboard') {
    const tableMessages = [{ message: `${intro} ${strings.leaderboardIntro}` }]
    const positionIcons = [
      '👑',
      '2️⃣',
      '3️⃣',
      '4️⃣',
      '5️⃣'
    ]
    payload.leaderboard = payload.leaderboard.slice(0, 5)

    for (const record in payload.leaderboard) {
      const user = await getUser(payload.leaderboard[record].user)
      tableMessages.push({
        message: `${positionIcons[record]} @${user.name} with a score of ${payload.leaderboard[record].score}`,
        mentions: [{
          userId: payload.leaderboard[record].user,
          nickname: user.name,
          position: positionIcons[record].length + 1
        }]
      })
    }
    tableMessages.push({ message: strings.leaderboardFooter })
    return tableMessages
  } else {
    let statisticsReport = ` ${strings.statsHas} ${strings[iconMapping[payload.type]]} ${payload.stats[payload.type]} ${strings[outroMapping[payload.type]]}`

    if (meta.stat.type === 'all') {
      statisticsReport = ` ${strings.statsHas} ${strings.spinsIcon} ${payload.stats.spins} ${strings.spinsOutro} ${strings.starIcon} ${payload.stats.star} ${strings.starOutro} ${strings.dopeIcon} ${payload.stats.dope} ${strings.dopeOutro} ${strings.nopeIcon} ${payload.stats.nope} ${strings.nopeOutro}. The ${strings.popularTrackIntro} ${payload.stats.popular.titleArtist} ${strings.popularTrackScore} ${payload.stats.popular.score}`
    } else if (meta.stat.type === 'popular') {
      statisticsReport = `s ${strings.popularTrackIntro} ${payload.stats.popular.titleArtist} ${strings.popularTrackScore} ${payload.stats.popular.score}`
    }
    if (meta.stat.filter === 'user') {
      return [{
        message: `${intro} @${meta.user.nickname}${statisticsReport}`,
        mentions: [{
          userId: meta.user.id,
          nickname: meta.user.nickname,
          position: intro.length + 1
        }]
      }]
    } else {
      return [{
        message: `${intro} ${strings.statsRoom}${statisticsReport}`
      }]
    }
  }
}
