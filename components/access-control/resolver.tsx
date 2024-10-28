import { User } from '../../src/resources/user'
import Configuration from './resolvers/Configuration'

export default class Resolver {
 
  Configuration = new Configuration()
  
  resolve(requires: string[], user: User, args?: any, relation?: 'OR' | 'AND') {
    let rel = relation || 'AND'
    let isAllowed = rel === 'AND' ? true : false

    requires.map((r) => {
      const controller = r.split(':')[0]
      const action = r.split(':')[1]
      const Controller = this[controller]
      const allow = Controller[action](user, args)

      if (rel === 'AND' && allow === false) {
        isAllowed = false
      } else if (rel === 'OR' && allow === true) {
        isAllowed = true
      }
    })

    return isAllowed
  }
}
