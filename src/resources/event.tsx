
export default class Event {
  name: string
  logo: {primary: string; secondary: string}

  constructor(data: any) {
    Object.assign(this, data)
  }

  static make(data: any) {
    return new Event(data)
  }

  get eventName() {
    return this.name
  }

  get logoPrimary(){
    return this.logo?.primary
  }
  get logoSecondary(){
    return this.logo?.secondary
  }
}
