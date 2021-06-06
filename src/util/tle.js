import * as satellite from "satellite.js/lib/index";

export const parseTleFile = (fileContent, dictEstaciones, stationOptions) => {
  const result = [];
  const lines = fileContent.split("\n");
  let current = null;
  let id_norad = "0";

  for (let i = 0; i < lines.length; ++i) {
    const line = lines[i].trim();

    if (line.length === 0) continue;

    if (line[0] === "1") {
      current.tle1 = line;
    } else if (line[0] === "2") {
      current.tle2 = line;
      id_norad = line.split(" ")[1];
      if (id_norad) {
        current.id_norad = id_norad.toString().trim();
        current.datos = dictEstaciones[id_norad];
      } else {
        current.id_norad = "0";
      }
    } else {
      current = {
        name: line,
        ...stationOptions,
      };
      result.push(current);
    }
  }

  let resultado = result.filter((item) => item.datos);
  return resultado;
};

const toThree = (v) => {
  return { x: v.x, y: v.z, z: -v.y };
};


export const getPositionFromTle = (station, date, type = 1) => {
  if (!station || !date) return null;

  if (!station.satrec) {
    const { tle1, tle2 } = station;
    if (!tle1 || !tle2) return null;
    station.satrec = satellite.twoline2satrec(tle1, tle2);
  }
  const positionVelocity = satellite.propagate(station.satrec, date);

  const positionEci = positionVelocity.position;

  if (type === 2) 
    return;

  toThree(positionEci);
  const gmst = satellite.gstime(date);
  if (!positionEci) 
    return null;
  const positionEcf = satellite.eciToEcf(positionEci, gmst);
  return toThree(positionEcf);
};
