import packageJson from "../../package.json";

const currentYear = new Date().getFullYear();

export const APP_CONFIG = {
  name: "Índice Congreso",
  version: packageJson.version,
  copyright: `© ${currentYear}, Medusa.`,
  meta: {
    title: "Índice Congreso - La Sastreria",
    description:
      "Índice Congreso - La Sastreria es una plataforma de análisis de comportamiento parlamentario para la Asamblea Legislativa de la República Dominicana.",
  },
};
