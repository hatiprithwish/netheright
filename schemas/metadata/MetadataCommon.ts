export interface Feature {
  id: string;
  description: string;
  permBit: number;
  permBitIndex: number;
}

export interface Role {
  id: string;
  name: string;
}

export interface FeatureCheck {
  /** Single feature required */
  feature?: {
    featureId: string;
    checkAccess: (access: number[]) => Promise<boolean>;
  };
  /** At least one of these features required (OR logic) */
  featuresOr?: {
    featureId: string;
    checkAccess: (access: number[]) => Promise<boolean>;
  }[];
  /** All of these features required (AND logic) */
  featuresAnd?: {
    featureId: string;
    checkAccess: (access: number[]) => Promise<boolean>;
  }[];
}
