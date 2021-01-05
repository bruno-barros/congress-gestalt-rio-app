import moment from "moment";

// import {weekdayTrans} from "./date-time-week";

export interface UserInterface {
  id?: string | number;
  databaseId: number;
  name?: string;
  firstName?: string;
  email?: string;
  roles?: any;
  avatar: any;
  phone?: string;
  gender?: string;
  description?: string;
  cpf?: string;
  postcode?: string;
  lastName?: string;
  address?: string;
  birthdate?: string;
  cellphone?: string;
  city?: string;
  country?: string;
  number?: number;
  complement?: string|number;
  neighborhood?: string;
  state?: string;
  registeredDate?: string;
  user_status?: number;
  passport?: string
  badge_name?: string
  locale?: string
}

/**
 * --------------------------------------------------
 * User class
 */
export class User {
  user: UserInterface;

  constructor(userData: UserInterface) {
    this.user = userData;
  }

  static make(user: any) {
    // console.log({makeAuth: user});
    return new User(user)
  }

  getUserData() {
    return this.user
  }

  getId() {
    return this.user?.databaseId || -1
  }

  getFirstName() {
    return this.user?.firstName || this.user?.name?.split(' ')[0] || null
  }

  getAvatarUrl() {
    return this.user.avatar?.url || null
  }

  get registeredDate() {
    return this.user.registeredDate
      && moment(this.user.registeredDate).format('DD/MM/YYYY') || ''
  }


  canManageAbstracts() {
    return this.isAdmin() || this.isSupervisor() || this.isSuperAdmin()
  }

  isSuperAdmin() {
    const superIds = [3]
    return this.isAdmin() && superIds.indexOf(this.user.databaseId) !== -1
  }

  isAdmin() {
    return !!this.user?.roles?.nodes.find(role => role.name === 'administrator');
  }

  isSupervisor() {
    return !!this.user?.roles?.nodes.find(role => role.name === 'editor');
  }

  isEvaluator() {
    return !!this.user?.roles?.nodes.find(role => role.name === 'contributor');
  }

  isSubscriber() {
    return !!this.user?.roles?.nodes.find(role => role.name === 'subscriber');
  }


}

// export function getGenres() {
//   return [
//     {value: 'M', name: 'masculino'},
//     {value: 'F', name: 'feminino'},
//     {value: 'I', name: 'outro'},
//   ]
// }
export const Genders = () => {
  const genres = {
    M: 'Homem',
    F: 'Mulher',
    I: 'Indefinido',
  }

  function getAll() {
    return genres
  }

  function getAllAsArray() {
    let genresArr = []
    Object.keys(genres).map(k => {
      genresArr.push({id: k, value: genres[k]})
    })
    return genresArr
  }

  function findByKey(k) {
    return genres[k.toUpperCase()] || null
  }

  function findByName(n) {
    return getAllAsArray()
      .find(genre => genre.value.toLowerCase() === n.toLowerCase())
  }

  return {
    all: getAll,
    allAsArray: getAllAsArray,
    findByKey,
    findByName
  }
};


export const MapRoles = [
  {name: 'subscriber', label: 'Participante', color: '#ada900'},
  {name: 'contributor', label: 'Avaliador', color: '#bc6402'},
  {name: 'editor', label: 'Supervisor', color: '#868686'},
  {name: 'administrator', label: 'Admin', color: '#000000'},
]
