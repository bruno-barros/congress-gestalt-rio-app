import isArray from 'lodash/isArray'
import isString from 'lodash/isString'
import slugfy from 'lodash/kebabCase'

export default class Error {
  errorData: any
  code: number | string | null = null
  message: string = ''
  slug: string = ''
  data: any = {}

  constructor(errorData: any, defaults?: any) {
    if (isArray(errorData)) this.errorData = errorData[0]
    else this.errorData = errorData

    if (this.errorData.hasOwnProperty('message')) this.message = this.errorData.message
    else if (this.errorData.hasOwnProperty('msg')) this.message = this.errorData.msg
    else if (this.errorData.hasOwnProperty('err')) this.message = this.errorData.err
    else if(isString(this.errorData)) this.message = this.errorData
    else this.message = JSON.stringify(this.errorData)

    this.slug = slugfy(this.message)

    if (this.errorData.hasOwnProperty('code')) this.code = this.errorData.code
    else if(defaults.hasOwnProperty('code')) this.code = defaults.code

    if (this.errorData.hasOwnProperty('data')) this.data = this.errorData.data
    else if (defaults.hasOwnProperty('data')) this.data = defaults.data
  }

  static make(errorData: any, defaults?: any) {
    return new Error(errorData, defaults)
  }
}
