import { User } from '../../src/resources/user'
import Abstract from './resolvers/Abstract'
import Activity from './resolvers/Activity'
import Configuration from './resolvers/Configuration'
import Evaluation from './resolvers/Evaluation'
import Subscription from './resolvers/Subscription'
import UserProfile from './resolvers/User'

export default class Resolver {
 
  Configuration = new Configuration()
  UserProfile = new UserProfile()
  Abstract = new Abstract()
  Subscription = new Subscription()
  Activity = new Activity()
  Evaluation = new Evaluation()
  
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
