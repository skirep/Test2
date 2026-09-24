export const isRenderableCountryFeature = (feature) => {
  const geometryType = feature?.geometry?.type;
  const name = feature?.properties?.name;

  return (
    (geometryType === "Polygon" || geometryType === "MultiPolygon") &&
    typeof name === "string" &&
    name.trim() !== ""
  );
};

export const prepareCountryData = (data, locale = "ca") => {
  if (!Array.isArray(data?.features)) {
    throw new Error("GeoJSON invàlid");
  }

  const countryFeatures = data.features.filter(isRenderableCountryFeature);
  const countryFeaturesByName = countryFeatures.reduce((groups, feature) => {
    const name = feature.properties.name;
    const currentGroup = groups.get(name) ?? [];
    currentGroup.push(feature);
    groups.set(name, currentGroup);
    return groups;
  }, new Map());
  const countryNames = [...countryFeaturesByName.keys()].sort((left, right) => left.localeCompare(right, locale));

  return { countryFeatures, countryFeaturesByName, countryNames };
};
