export interface UserLocation {
  balloonContent: string
  name: string
  description: string
  metaDataProperty: MetaDataProperty
  boundedBy: number[][]
  uriMetaData: UriMetaData
  text: string
  balloonContentBody: string
}

export interface MetaDataProperty {
  GeocoderMetaData: GeocoderMetaData
}

export interface GeocoderMetaData {
  precision: string
  text: string
  kind: string
  Address: Address
  AddressDetails: AddressDetails
}

export interface Address {
  country_code: string
  formatted: string
  Components: Component[]
}

export interface Component {
  kind: string
  name: string
}

export interface AddressDetails {
  Country: Country
}

export interface Country {
  AddressLine: string
  CountryNameCode: string
  CountryName: string
  Locality: Locality
  AdministrativeArea: AdministrativeArea
}

export interface Locality {
  LocalityName: string
  DependentLocality: DependentLocality
}

export interface DependentLocality {
  DependentLocalityName: string
}

export interface UriMetaData {
  URIs: Uri[]
  URI: Uri2
}

export interface Uri {
  uri: string
}

export interface Uri2 {
  uri: string
}

export interface AdministrativeArea {
  AdministrativeAreaName: string
  Locality: Locality
}

export interface Locality {
  LocalityName: string
}

export interface Region {
  code: string;
  name: string;
}

export interface GeoObjectConstructor {
  feature: ymaps.IGeoObjectFeature;
  options: ymaps.IGeoObjectOptions;
}

export interface PlacemarkConstructor {
  geometry: number[];
  properties: ymaps.IPlacemarkProperties;
  options: ymaps.IPlacemarkOptions;
}
