import { responsesDb } from '../models/index.js'
import { metrics } from '../utils/metrics.js'
import { getUser } from '../libs/grpc.js'

export default async (payload) => {
  metrics.count('reportStats', payload)
  const strings = {}
  const results = await responsesDb.getMany(null, ['statsIntroThisMonth', 'statsIntroLastMonth', 'statsIntroAllTime', 'statsHas', 'spinsOutro', 'dopesOutro', 'nopesOutro', 'starsOutro', 'statsRoom', 'spinsIcon', 'starsIcon', 'dopesIcon', 'nopesIcon', 'popularTrackIntro', 'popularTrackScore', 'leaderboardIntro', 'leaderboardFooter'], 'system')
  results.forEach(string => {
    strings[string.name] = string.value
  })

  const outroMapping = {
    dopes: 'dopesOutro',
    nopes: 'nopesOutro',
    stars: 'starsOutro',
    spins: 'spinsOutro'
  }

  const iconMapping = {
    dopes: 'dopesIcon',
    nopes: 'nopesIcon',
    stars: 'starsIcon',
    spins: 'spinsIcon'
  }

  let intro = ''
  switch (payload.period) {
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
  if (payload.type === 'leaderboard') {
    const tableMessages = [{
      topic: 'broadcast',
      payload: {
        message: `${intro} ${strings.leaderboardIntro}`
      }
    }]
    const positionIcons = [
      '👑',
      '2️⃣ ',
      '3️⃣ ',
      '4️⃣ ',
      '5️⃣ '
    ]
    payload.leaderboard = payload.leaderboard.slice(0, 5)
    for (const record in payload.leaderboard) {
      if (!payload.leaderboard[record].user) return
      const user = await getUser(payload.leaderboard[record].user)
      tableMessages.push({
        topic: 'broadcast',
        payload: {
          message: `${positionIcons[record]} @${user.name} with a score of ${payload.leaderboard[record].score}`,
          mentions: [{
            userId: payload.leaderboard[record].user,
            nickname: user.name,
            position: positionIcons[record].length + 1
          }]
        }
      })
    }
    tableMessages.push({
      topic: 'broadcast',
      payload: {
        message: strings.leaderboardFooter
      }
    })
    return tableMessages
  } else if (payload.type === 'first') {
    const user = await getUser(payload.firstPlay.user)
    return [{
      topic: 'broadcast',
      payload: {
        message: `${payload.nowPlaying.title} by ${payload.nowPlaying.artist} was first played by ${user} on ${payload.firstPlay.date}`
      }
    }]
  } else {
    let statisticsReport = ` ${strings.statsHas} ${strings[iconMapping[payload.type]]} ${payload.stats[payload.type]} ${strings[outroMapping[payload.type]]}`

    if (payload.type === 'stats') {
      statisticsReport = ` ${strings.statsHas} ${strings.spinsIcon} ${payload.stats.spins} ${strings.spinsOutro} ${strings.starsIcon} ${payload.stats.stars} ${strings.starsOutro} ${strings.dopesIcon} ${payload.stats.dopes} ${strings.dopesOutro} ${strings.nopesIcon} ${payload.stats.nopes} ${strings.nopesOutro}. The ${strings.popularTrackIntro} ${payload.stats.popular.titleArtist} ${strings.popularTrackScore} ${payload.stats.popular.score}`
    } else if (payload.type === 'mostpopular') {
      statisticsReport = `s ${strings.popularTrackIntro} ${payload.stats.popular.titleArtist} ${strings.popularTrackScore} ${payload.stats.popular.score}`
    }
    if (payload.filter === 'user') {
      return [{
        topic: 'broadcast',
        payload: {
          message: `${intro} @${payload.user.nickname}${statisticsReport}`,
          mentions: [{
            userId: payload.user.id,
            nickname: payload.user.nickname,
            position: intro.length + 1
          }]
        }
      }]
    } else {
      return [{
        topic: 'broadcast',
        payload: {
          message: `${intro} ${strings.statsRoom}${statisticsReport}`
        }
      }]
    }
  }
}
