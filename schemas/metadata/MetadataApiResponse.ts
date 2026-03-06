import { ApiResponse } from "../common";
import { Feature, Role } from "./MetadataCommon";

export interface GetAllFeaturesResponse extends ApiResponse {
  features: Feature[];
}

export interface GetAllRolesResponse extends ApiResponse {
  roles: Role[];
}
