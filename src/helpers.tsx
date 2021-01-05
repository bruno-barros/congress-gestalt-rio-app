import {ServerResponse} from "http";
import Router from "next/router";
import trimStart from "lodash/trimStart";
import {QueryClient} from 'react-query'
import Event from "./resources/event";

/**
 * Used to load files from '/public' folder
 * @param src
 */
export function asset(src: string) {
  // return `${process.env.assetPrefix}${src}`;
  let s = trimStart(src, '/');
  return `${process.env.RELATIVE_PATH?.length > 1
    ? process.env.RELATIVE_PATH : ''}/${s}`;
}

export function siteTitle(name: string = '', queryClient?: QueryClient) {
  const event: Event|any = queryClient ? queryClient.getQueryData('event'): {}
  return name ? name + ` - ${event?.eventName}` : (event ? event.eventName : '')
}


export const redirectToLogin = (server?: ServerResponse) => {
  // add the redirected query param for debugging
  const login = "/?session=expired";
  if (server) {
    // @see https://github.com/zeit/next.js/wiki/Redirecting-in-%60getInitialProps%60
    // server rendered pages need to do a server redirect
    server.writeHead(302, {
      Location: login,
    });
    server.end();
  } else {
    // only client side pages have access to next/router
    Router.push(login);
  }
};


/**
 * Adds time to a date. Modelled after MySQL DATE_ADD function.
 * Example: dateAdd(new Date(), 'minutes', 30)  //returns 30 minutes from now.
 *
 * @param date  Date to start with
 * @param interval  One of: year, quarter, month, week, day, hour, minute, second
 * @param units  Number of units of the given interval to add.
 */
export const dateAdd = (date: Date, interval: string, units: number) => {
  if (!(date instanceof Date)) return undefined;
  var ret = new Date(date); //don't change original date
  var checkRollover = function () {
    if (ret.getDate() != date.getDate()) ret.setDate(0);
  };
  switch (String(interval).toLowerCase()) {
    case 'year'   :
      ret.setFullYear(ret.getFullYear() + units);
      checkRollover();
      break;
    case 'quarter':
      ret.setMonth(ret.getMonth() + 3 * units);
      checkRollover();
      break;
    case 'month'  :
      ret.setMonth(ret.getMonth() + units);
      checkRollover();
      break;
    case 'week'   :
      ret.setDate(ret.getDate() + 7 * units);
      break;
    case 'day'    :
      ret.setDate(ret.getDate() + units);
      break;
    case 'hour'   :
      ret.setTime(ret.getTime() + units * 3600000);
      break;
    case 'minute' :
      ret.setTime(ret.getTime() + units * 60000);
      break;
    case 'second' :
      ret.setTime(ret.getTime() + units * 1000);
      break;
    default       :
      ret = undefined;
      break;
  }
  return ret;
}

/**
 * Fake promise for mocking purpose
 * @param timeout
 */
export function fakePromise(timeout: number = 1000): Promise<any> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(`Promise timeout reached (limit: ${timeout} ms)`)
    }, timeout);
  })
}

/**
 * Generate numbers between A and B
 * @param min
 * @param max
 */
export function rand(min, max) {
  let randomNum = Math.random() * (max - min) + min;
  return Math.floor(randomNum);
}

export function generate_tmp_id(user_id: number) {
return `${user_id}@${rand(1111111111, 9999999999)}`
}


export function truncateMiddle(fullStr: string, strLen: number = 24, separator: string = '...') {
  if (fullStr.length <= strLen) return fullStr;

  separator = separator || '...';

  let sepLen = separator.length,
    charsToShow = strLen - sepLen,
    frontChars = Math.ceil(charsToShow / 2),
    backChars = Math.floor(charsToShow / 2);

  return fullStr.substr(0, frontChars) +
    separator +
    fullStr.substr(fullStr.length - backChars);
}

/**
 *
 * @param count
 * @param singular
 * @param  plural
 * @param zero
 */
export function plural(count: number, singular: string, plural: string, zero?: string) {

  if (count === 0 && zero) {
    return zero
  }
  if (count > 1) {
    return plural.replace('%c', String(count))
  }
  return singular.replace('%c', String(count))
}


export function inputFloatClass(inputValue:any, appendClasses:string = '') {
  let classes = ['form-control']
  if(inputValue && inputValue.length > 0) classes.push('filled')
  if(appendClasses) classes.push(appendClasses)
  return classes.join(' ')
}

export function getGenres() {
return [
  {value: 'M', name: 'masculino'},
  {value: 'F', name: 'feminino'},
  {value: 'I', name: 'outro'},
]
}

export const MapLocales = [
  {app: 'pt', site: 'pt_BR', label: 'Português'},
  {app: 'en', site: 'en_US', label: 'Inglês'},
]

export function ev_locale(locale) : string{
  if(!locale) return 'pt'
  if(locale.indexOf('en') !== -1) return 'en';
  if(locale.indexOf('es') !== -1) return 'es';
  return  'pt'
}

export function statusColorName(status: string): 'warning' | 'success' | 'danger' {
  if (['pending', 'revision', 'waiting_update', 'synopsis_waiting_update', 'final_revision'].indexOf(status) !== -1) return 'warning'
  if (['synopsis_approved', 'pre_approved', 'approved'].indexOf(status) !== -1) return 'success'
  if (['synopsis_rejected', 'rejected'].indexOf(status) !== -1) return 'danger'
}



export function states(empty: boolean = true) {
  let states = [{
    value: "AC",
    label: "Acre"
  },
    {
      value: "AL",
      label: "Alagoas"
    },
    {
      value: "AM",
      label: "Amazonas"
    },
    {
      value: "AP",
      label: "Amapá"
    },
    {
      value: "BA",
      label: "Bahia"
    },
    {
      value: "CE",
      label: "Ceará"
    },
    {
      value: "DF",
      label: "Distrito Federal"
    },
    {
      value: "ES",
      label: "Espírito Santo"
    },
    {
      value: "GO",
      label: "Goiás"
    },
    {
      value: "MA",
      label: "Maranhão"
    },
    {
      value: "MG",
      label: "Minas Gerais"
    },
    {
      value: "MS",
      label: "Mato Grosso do Sul"
    },
    {
      value: "MT",
      label: "Mato Grosso"
    },
    {
      value: "PA",
      label: "Pará"
    },
    {
      value: "PB",
      label: "Paraíba"
    },
    {
      value: "PE",
      label: "Pernambuco"
    },
    {
      value: "PI",
      label: "Piauí"
    },
    {
      value: "PR",
      label: "Paraná"
    },
    {
      value: "RJ",
      label: "Rio de Janeiro"
    },
    {
      value: "RN",
      label: "Rio Grande do Norte"
    },
    {
      value: "RO",
      label: "Rondônia"
    },
    {
      value: "RR",
      label: "Roraima"
    },
    {
      value: "RS",
      label: "Rio Grande do Sul"
    },
    {
      value: "SC",
      label: "Santa Catarina"
    },
    {
      value: "SE",
      label: "Sergipe"
    },
    {
      value: "SP",
      label: "São Paulo"
    },
    {
      value: "TO",
      label: "Tocantins"
    }]

  if(empty) states.unshift({label: '', value: ''})

  return states
}
