import moment from "moment";
// import {weekdayTrans} from "./date-time-week";

export interface UserInterface {
  id?: string | number;
  databaseId: number;
  name?: string;
  firstName?: string;
  email?: string;
  timeframes?: any[]
  roles?: any;
  avatar: any;
  specialities?: string[];
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
  complement?: string;
  neighborhood?: string;
  number?: number;
  state?: string;
  credits?: number;
  registeredDate?: string;
  academia_sso?: string|null;
  partner_zb?: {
    id: number;
    logo: string;
    name: string;
  } | null;
  user_status?: number;
  ms_graph?: {
    id?: string
    upn?: string
  }
  subscriptions?: {
    id: number
    title: string
    expire_at: string
    status: string
  }[]
}

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

  isAdmin() {
    //   roles: {nodes: [{name: "administrator"}]},
    return !!this.user?.roles?.nodes.find(role => role.name === 'administrator');
  }

  canManageScreenings() {
    return this.isAdmin() || !!this.user?.roles?.nodes.find(role => role.name === 'contributor');
  }
  isProfessional() {
    //   roles: {nodes: [{name: "administrator"}]},
    return !!this.user?.roles?.nodes.find(role => role.name === 'professional');
  }

  isPatient() {
    return !!this.user?.roles?.nodes.find(role => role.name === 'subscriber');
  }



  getMsGraph(){
    return this.user?.ms_graph?.id ? this.user.ms_graph : null
  }
}

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


export interface UserHistory {
  appointments_fulfilled: number;
  appointments_total: number;
  last_appointment_at: string;
  registered_at: string;
  last_professional?: {
    avatar: {
      url: string
    }
    name: string;
    databaseId: number;
  }
}
