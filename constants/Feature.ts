import MetadataRepo from "@/backend/repositories/MetadataRepo";
import Log from "@/lib/Log";
import * as Schemas from "@/schemas";

export default class Feature {
  public readonly featureId: string;

  protected constructor(featureId: string) {
    this.featureId = featureId;
  }

  async checkAccess(userAccess: number[] | null): Promise<boolean> {
    const allFeatures = await MetadataRepo.getAllFeatures();
    const feature = allFeatures.find(
      (f: Schemas.Feature) => f.id === this.featureId,
    );

    if (!feature) {
      Log.error(`Invalid or inactive feature: ${this.featureId}`);
      return false;
    }

    if (!userAccess || userAccess.length === 0) {
      Log.error(`Permission array is empty for feature: ${this.featureId}`);
      return false;
    }

    return (
      (userAccess[feature.permBitIndex] & (1 << feature.permBit)) ===
      1 << feature.permBit
    );
  }

  static readonly SkipInterviewPhase = new Feature("SKIP_INTV_PHASE");
  static readonly ManageDashboard = new Feature("MANAGE_DASHBRD");
  static readonly AttendInterview = new Feature("ATTEND_INTV");
}
