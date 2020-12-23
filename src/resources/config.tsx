export default class Config {
  name: string

  constructor(data: any) {
    Object.assign(this, data)
  }

  static make(data: any) {
    return new Config(data)
  }

  get eventName() {
    return this.name
  }
}
