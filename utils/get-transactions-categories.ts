import type { EnhancedCategory } from "@/types";

const categoryKeywordsMapping = {
  Market: {
    id: process.env.MARKET_ID ?? "",
    name: [
      "carrefour",
      "gadis",
      "ga.co",
      "lidl",
      "eroski",
      "alcampo",
      "mercadona",
      "frutas",
      "fruteria",
      "comesticos",
      "ikea",
    ],
    common: true,
  },
  Clothing: {
    id: process.env.CLOTHING_ID ?? "",
    name: [
      "primark",
      "lefties",
      "decimas",
      "nike",
      "skechers",
      "puma",
      "polinesia",
      "inside c.c.",
      "pull and bear",
    ],
    common: true,
  },
  Electronics: {
    id: process.env.ELECTRONICS_ID ?? "",
    name: [
      "media markt",
      "coolmod",
      "pccomponentes",
      "marketplace pccom",
      "versus gamers",
      "pc componentes",
    ],
    common: true,
  },
  Sports: {
    id: process.env.SPORTS_ID ?? "",
    name: ["decathlon", "prozis", "deportes"],
    common: true,
  },
  Amazon: {
    id: process.env.AMAZON_ID ?? "",
    name: ["amzn", "amazon", "amz*"],
    common: true,
  },
  Aliexpress: {
    id: "aliexpress",
    name: ["aliexpress"],
    newEntry: true,
  },
  Paypal: { id: process.env.PAYPAL_ID ?? "", name: ["paypal"], common: true },
  "Tobacco Shop": {
    id: "tobacco shop",
    name: ["estanco", "expendeduria 41", "expendeduria 54", "expend.150050"],
    newEntry: true,
  },
  Gas: {
    id: "gas",
    name: ["carbugal"],
    newEntry: true,
  },
  Insurances: { id: "insurances", name: ["seguros"], newEntry: true },
  Paro: {
    id: "paro",
    name: ["servicio publico de empleo estatal"],
    newEntry: true,
  },
  Podiatrist: {
    id: "podiatrist",
    name: [
      "alma cl.san rosendo",
      "clin.podologica",
      "clinica maquieira",
      "clinica honduras",
      "podologia",
    ],
    newEntry: true,
  },
  Pharmacy: {
    id: process.env.PHARMACY_ID ?? "",
    name: ["farma", "farmacia"],
    common: true,
  },
  ATM: { id: process.env.ATM_ID ?? "", name: ["reintegro"], common: true },
  "Home delivery": {
    id: process.env.HOME_DELIVERY_ID ?? "",
    name: ["dominos", "telepizza", "glovoapp", "glovo"],
    common: true,
  },
  Barber: { id: process.env.BARBER_ID ?? "", name: ["kaki"], common: true },
  "Maintenance fees": {
    id: "maintenance fees",
    name: [
      "comision administracion",
      "servicio de mantenimiento",
      "comisiones y gastos",
    ],
    newEntry: true,
  },
  Chatgpt: { id: "chatgpt", name: ["chatgpt"], newEntry: true },
  Paycheck: {
    id: process.env.PAYCHECK_ID ?? "",
    name: [
      "flat 101",
      "ovixia",
      "indra soluciones",
      "team heretics",
      "saski baskonia",
      "arctic gaming",
      "convergys",
      "gamecore",
    ],
    common: true,
  },
  Oxygen: { id: "oxygen", name: ["factura"], newEntry: true },
  Bizum: { id: "bizum", name: ["bizum"], newEntry: true },
  Dentist: {
    id: "dentist",
    name: ["dental", "dentista", "sonrident"],
    newEntry: true,
  },
  Restaurants: {
    id: process.env.RESTAURANTS_ID ?? "",
    name: ["restaurant", "restaurante", "goiko"],
    common: true,
  },
  Physiotherapy: {
    id: "physiotherapy",
    name: ["physiotherapy, fisioterapia"],
    newEntry: true,
  },
};

// Checking into the values of the map, if there is a match, getting that
export const getTransactionsCategories = (concept: string) => {
  const conceptLower = concept.toLowerCase();
  const categories: EnhancedCategory[] = [];

  Object.entries(categoryKeywordsMapping).forEach(
    ([categoryName, categoryInfo]) => {
      const keywordFound = categoryInfo.name.some((catInfo) =>
        conceptLower.includes(catInfo),
      );
      if (keywordFound) {
        categories.push({
          ...categoryInfo,
          name: categoryName,
        });
      }
    },
  );

  return categories.length > 0 ? categories : undefined;
};
