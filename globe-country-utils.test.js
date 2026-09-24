import test from "node:test";
import assert from "node:assert/strict";

import { isRenderableCountryFeature, prepareCountryData } from "./globe-country-utils.js";

test("isRenderableCountryFeature accepts only named polygon features", () => {
  assert.equal(
    isRenderableCountryFeature({
      geometry: { type: "Polygon" },
      properties: { name: "Catalunya" },
    }),
    true,
  );

  assert.equal(
    isRenderableCountryFeature({
      geometry: { type: "LineString" },
      properties: { name: "Frontera" },
    }),
    false,
  );

  assert.equal(
    isRenderableCountryFeature({
      geometry: { type: "Polygon" },
      properties: { name: "   " },
    }),
    false,
  );

  assert.equal(
    isRenderableCountryFeature({
      geometry: { type: "Polygon" },
      properties: { name: { text: "No vàlid" } },
    }),
    false,
  );
});

test("prepareCountryData groups duplicate country names and sorts them", () => {
  const { countryFeatures, countryFeaturesByName, countryNames } = prepareCountryData({
    features: [
      {
        geometry: { type: "Polygon", coordinates: [] },
        properties: { name: "França" },
      },
      {
        geometry: { type: "MultiPolygon", coordinates: [] },
        properties: { name: "Espanya" },
      },
      {
        geometry: { type: "Polygon", coordinates: [] },
        properties: { name: "França" },
      },
      {
        geometry: { type: "Point", coordinates: [] },
        properties: { name: "Ignorat" },
      },
    ],
  });

  assert.equal(countryFeatures.length, 3);
  assert.deepEqual(countryNames, ["Espanya", "França"]);
  assert.equal(countryFeaturesByName.get("França")?.length, 2);
  assert.equal(countryFeaturesByName.get("Espanya")?.length, 1);
});

test("prepareCountryData rejects invalid GeoJSON payloads", () => {
  assert.throws(() => prepareCountryData({ type: "FeatureCollection" }), /GeoJSON invàlid/);
});


test("prepareCountryData respects an overridden locale for sorting", () => {
  const { countryNames } = prepareCountryData(
    {
      features: [
        { geometry: { type: "Polygon", coordinates: [] }, properties: { name: "Österreich" } },
        { geometry: { type: "Polygon", coordinates: [] }, properties: { name: "Zulu" } },
      ],
    },
    "sv",
  );

  assert.deepEqual(countryNames, ["Zulu", "Österreich"]);
});
