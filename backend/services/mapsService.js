const toRadians = (degree) => (degree * Math.PI) / 180;

export const calculateDistanceKm = (pointA = [], pointB = []) => {
  const [lng1, lat1] = pointA;
  const [lng2, lat2] = pointB;

  const earthRadius = 6371;
  const latDistance = toRadians(lat2 - lat1);
  const lngDistance = toRadians(lng2 - lng1);

  const formula =
    Math.sin(latDistance / 2) ** 2 +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(lngDistance / 2) ** 2;

  return earthRadius * 2 * Math.atan2(Math.sqrt(formula), Math.sqrt(1 - formula));
};
