import { clientCreds, users, strings } from '@whatagoodbot/rpc'

const userService = new users.Users(`${process.env.USERS_SERVICE}:50051`, clientCreds)
const stringService = new strings.Strings(`${process.env.RPC_MISS_GROUPIE}:${process.env.RPC_MISS_GROUPIE_PORT || '50051'}`, clientCreds)

export const getUser = id => {
  return new Promise(resolve => {
    userService.getUser({ id }, (error, response) => {
      if (error) console.log(error)
      resolve(response)
    })
  })
}

export const getString = string => {
  return new Promise(resolve => {
    stringService.getString({ string }, (error, response) => {
      if (error) console.log(error)
      resolve(response)
    })
  })
}

export const getManyStrings = strings => {
  return new Promise(resolve => {
    stringService.getManyStrings({ strings }, (error, response) => {
      if (error) console.log(error)
      const strings = {}
      response.strings.forEach(string => {
        strings[string.name] = string.value
      })
      resolve(strings)
    })
  })
}
