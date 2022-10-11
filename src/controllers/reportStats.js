import { responsesDb } from '../models/index.js'
import { metrics } from '../utils/metrics.js'

export default async (payload, meta) => {
  metrics.count('reportStats', payload)
  const strings = {}
  const results = await responsesDb.getMany(null, ['statsIntroThisMonth', 'statsHas', 'spinsOutro', 'dopeOutro', 'nopeOutro', 'starOutro', 'statsRoom'], 'system')
  results.forEach(string => {
    strings[string.name] = string.value
  })
  const outroMapping = {
    dope: 'dopeOutro',
    nope: 'nopeOutro',
    star: 'starOutro',
    spins: 'spinsOutro'
  }
  if (meta.stat.filter === 'user') {
    return [{
      message: `${strings.statsIntroThisMonth} @${meta.user.nickname} ${strings.statsHas} ${payload.stats[payload.type]} ${strings[outroMapping[payload.type]]}`,
      mention: {
        userId: meta.user.id,
        nickname: meta.user.nickname,
        position: strings.statsIntroThisMonth.length + 1
      }
    }]
  } else {
    return [{
      message: `${strings.statsIntroThisMonth} ${strings.statsRoom} ${strings.statsHas} ${payload.stats[payload.type]} ${strings[outroMapping[payload.type]]}`
    }]
  }
}
