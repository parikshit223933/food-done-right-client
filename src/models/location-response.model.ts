export interface LocationResponseModel {
  success: boolean;
  coveredByPolygon: boolean;
  coveringPolygon: null | Feature;
  deliverablePointInPolygon: Feature | null;
  error: null | string;
}

export interface Feature {
  type: string;
  properties: FeatureProperties;
  geometry: FeatureGeometry;
}

export interface FeatureProperties {
  Name: string;
  description: string | null;
}


export interface FeatureGeometry {
  type: string;
  coordinates: number[][][];
}
