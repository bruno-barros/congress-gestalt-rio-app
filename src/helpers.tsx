import { ServerResponse } from "http";
import Router, { useRouter } from "next/router";
import trimStart from "lodash/trimStart";
import { QueryClient } from "react-query";
import Event from "./resources/event";
import { DocumentSchema } from "./types/document";
import Edition from "./resources/edition";

/**
 * Used to load files from '/public' folder
 * @param src
 */
export function asset(src: string) {
  let s = trimStart(src, "/");
  return `${
    process.env.RELATIVE_PATH?.length > 1 ? process.env.RELATIVE_PATH : ""
  }/${s}`;
}

export function siteTitle(name: string = "", queryClient?: QueryClient) {
  const event: Event | any = queryClient
    ? queryClient.getQueryData(["settings", null])
    : {};
  // console.log(event)
  return name
    ? name + ` - ${event?.global?.name}`
    : event
    ? event?.global?.name
    : "";
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
    case "year":
      ret.setFullYear(ret.getFullYear() + units);
      checkRollover();
      break;
    case "quarter":
      ret.setMonth(ret.getMonth() + 3 * units);
      checkRollover();
      break;
    case "month":
      ret.setMonth(ret.getMonth() + units);
      checkRollover();
      break;
    case "week":
      ret.setDate(ret.getDate() + 7 * units);
      break;
    case "day":
      ret.setDate(ret.getDate() + units);
      break;
    case "hour":
      ret.setTime(ret.getTime() + units * 3600000);
      break;
    case "minute":
      ret.setTime(ret.getTime() + units * 60000);
      break;
    case "second":
      ret.setTime(ret.getTime() + units * 1000);
      break;
    default:
      ret = undefined;
      break;
  }
  return ret;
};

/**
 * Fake promise for mocking purpose
 * @param timeout
 */
export function fakePromise(timeout: number = 1000): Promise<any> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(`Promise timeout reached (limit: ${timeout} ms)`);
    }, timeout);
  });
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
  return `${user_id}@${rand(1111111111, 9999999999)}`;
}

export function truncateMiddle(
  fullStr: string,
  strLen: number = 24,
  separator: string = "..."
) {
  if (fullStr.length <= strLen) return fullStr;

  separator = separator || "...";

  let sepLen = separator.length,
    charsToShow = strLen - sepLen,
    frontChars = Math.ceil(charsToShow / 2),
    backChars = Math.floor(charsToShow / 2);

  return (
    fullStr.substr(0, frontChars) +
    separator +
    fullStr.substr(fullStr.length - backChars)
  );
}

/**
 *
 * @param count
 * @param singular
 * @param  plural
 * @param zero
 */
export function plural(
  count: number,
  singular: string,
  plural: string,
  zero?: string
) {
  if (count === 0 && zero) {
    return zero;
  }
  if (count > 1) {
    return plural.replace("%c", String(count));
  }
  return singular.replace("%c", String(count));
}

export function inputFloatClass(inputValue: any, appendClasses: string = "") {
  let classes = ["form-control"];
  if (inputValue && inputValue.length > 0) classes.push("filled");
  if (appendClasses) classes.push(appendClasses);
  return classes.join(" ");
}

export function getGenres() {
  return [
    { value: "I", name: "prefiro-nao-responder" },
    { value: "M", name: "homem-cis" },
    { value: "MT", name: "homem-trans" },
    { value: "F", name: "mulher-cis" },
    { value: "FT", name: "mulher-trans" },
    { value: "T", name: "travesti" },
    { value: "NB", name: "nao-binario" },
  ];
}

export function getRaces() {
  return [
    { value: "Parda", name: "parda" },
    { value: "Preta", name: "preta" },
    { value: "Indigena", name: "indigena" },
    { value: "Amarela", name: "amarela" },
    { value: "Branca", name: "branca" },
    { value: "Prefiro não responder", name: "prefiro-nao-responder" },
  ];
}

export const MapLocales = [
  { app: "pt", site: "pt_BR", label: "Português" },
  // { app: "en", site: "en_US", label: "Inglês" },
  { app: "es", site: "es_ES", label: "Espanhol" },
];

export function ev_locale(locale): string {
  if (!locale) return "pt";
  if (locale.indexOf("en") !== -1) return "en";
  if (locale.indexOf("es") !== -1) return "es";
  return "pt";
}

export function statusColorName(
  status: string
): "warning" | "success" | "danger" | "secondary" | "info" {
  if (
    ["pending", "waiting_update", "synopsis_waiting_upd"].indexOf(status) !== -1
  )
    return "secondary";
  if (["synopsis_revision", "final_revision"].indexOf(status) !== -1)
    return "warning";
  if (["synopsis_approved", "pre_approved", "approved"].indexOf(status) !== -1)
    return "success";
  if (["synopsis_rejected", "rejected"].indexOf(status) !== -1) return "danger";
  if (["synopsis_evaluating", "evaluating"].indexOf(status) !== -1)
    return "info";
}

export function states(empty: boolean = true) {
  let states = [
    {
      value: "AC",
      label: "Acre",
    },
    {
      value: "AL",
      label: "Alagoas",
    },
    {
      value: "AM",
      label: "Amazonas",
    },
    {
      value: "AP",
      label: "Amapá",
    },
    {
      value: "BA",
      label: "Bahia",
    },
    {
      value: "CE",
      label: "Ceará",
    },
    {
      value: "DF",
      label: "Distrito Federal",
    },
    {
      value: "ES",
      label: "Espírito Santo",
    },
    {
      value: "GO",
      label: "Goiás",
    },
    {
      value: "MA",
      label: "Maranhão",
    },
    {
      value: "MG",
      label: "Minas Gerais",
    },
    {
      value: "MS",
      label: "Mato Grosso do Sul",
    },
    {
      value: "MT",
      label: "Mato Grosso",
    },
    {
      value: "PA",
      label: "Pará",
    },
    {
      value: "PB",
      label: "Paraíba",
    },
    {
      value: "PE",
      label: "Pernambuco",
    },
    {
      value: "PI",
      label: "Piauí",
    },
    {
      value: "PR",
      label: "Paraná",
    },
    {
      value: "RJ",
      label: "Rio de Janeiro",
    },
    {
      value: "RN",
      label: "Rio Grande do Norte",
    },
    {
      value: "RO",
      label: "Rondônia",
    },
    {
      value: "RR",
      label: "Roraima",
    },
    {
      value: "RS",
      label: "Rio Grande do Sul",
    },
    {
      value: "SC",
      label: "Santa Catarina",
    },
    {
      value: "SE",
      label: "Sergipe",
    },
    {
      value: "SP",
      label: "São Paulo",
    },
    {
      value: "TO",
      label: "Tocantins",
    },
  ];

  if (empty) states.unshift({ label: "", value: "" });

  return states;
}

export function dispatchOnENTER(event, callback) {
  if (
    event?.key === 13 ||
    event?.keyIdentifier === 13 ||
    event?.keyCode === 13
  ) {
    event.preventDefault();
    callback();
  }
}

export function average(numbers: any[], round: number = 1) {
  const divby = numbers.length;
  const sum = numbers.reduce((prev, curr) => {
    const val = curr > 0 ? parseInt(String(curr)) : 0;
    return prev + val;
  }, 0);

  return (Math.round((sum / divby) * 100) / 100).toFixed(round);
}

export function specialValidationRules(
  field: string,
  subfield: "min" | "max",
  edition: Edition,
  values: any
) {
  const v = edition.abstract.required_fields[field].hasOwnProperty(subfield)
    ? edition.abstract.required_fields[field][subfield]
    : undefined;
  const type = values.type || "";

  if (type == "MR" && field == "resume") {
    return subfield == "min" ? 500 : 7000;
  } else if (type == "CO" && field == "resume") {
    return subfield == "min" ? 1500 : 2000;
  } else if (type == "MC" && field == "resume") {
    return subfield == "min" ? 1000 : 3000;
  } else if (type == "RC" && field == "resume") {
    return subfield == "min" ? 1500 : 2200;
  } else if (type == "PO" && field == "resume") {
    return subfield == "min" ? 1500 : 2500;
  } else if (type == "WS" && field == "resume") {
    return subfield == "min" ? 1500 : 2200;
  } else if (type == "PF" && field == "resume") {
    return subfield == "min" ? 1500 : 2200;
  }

  return v;
}

export function formatCPF(cpf) {
  if (!cpf) return cpf;
  // Remove all non-numeric characters
  cpf = String(cpf).replace(/\D/g, "");

  if (cpf.length !== 11) {
    return cpf;
  }

  // Add the dots and the dash to the CPF
  cpf = cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");

  return cpf;
}

export function dump(args: any) {
  if (typeof window === "undefined") return;
  const params = new URLSearchParams(window.location.search);

  if (process.env.NODE_ENV === "development" || !!params.get("debug")) {
    return (
      <pre className="pre-scrollable" style={{ maxWidth: 800 }}>
        {JSON.stringify(args, null, 2)}
      </pre>
    );
  }
}

export function moneyFormat(value: number | string, locale: string = "pt-BR") {
  if (!value) return value;
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency: "BRL",
  }).format(Number(value));
}

export function isEmailValid(str: string) {
  const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,3}$/;
  return re.test(str);
}
