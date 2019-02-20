import {Collection} from "../../models/domain/Collection";
import {
  CollectionData,
  CollectionPermissionsData,
  CollectionSummaryData, DomainJwtKeyData,
  DomainUserData,
  DomainUserGroupData, DomainUserGroupInfoData, DomainUserGroupSummaryData,
  DomainUserIdData,
  ModelData,
  ModelPermissionsData,
  ModelPermissionSummaryData,
  ModelSnapshotPolicyData,
  ModelUserPermissionsData
} from "./common-rest-data";
import {CollectionPermissions} from "../../models/domain/CollectionPermissions";
import {ModelSnapshotPolicy} from "../../models/domain/ModelSnapshotPolicy";
import {CollectionSummary} from "../../models/domain/CollectionSummary";
import {Model} from "../../models/domain/Model";
import {ModelPermissionSummary} from "../../models/domain/ModelPermissionsSummary";
import {ModelPermissions} from "../../models/domain/ModelPermissions";
import {ModelUserPermissions} from "../../models/domain/ModelUserPermissions";
import {DomainUserId} from "../../models/domain/DomainUserId";
import {DomainUser} from "../../models/domain/DomainUser";
import {DomainUserGroup} from "../../models/domain/DomainUserGroup";
import {DomainUserGroupInfo} from "../../models/domain/DomainUserGroupInfo";
import {DomainUserGroupSummary} from "../../models/domain/DomainUserGroupSummary";
import {DomainJwtKey} from "../../models/domain/DomainJwtKey";

export function toCollection(data: CollectionData): Collection {
  return new Collection(
    data.id,
    data.description,
    toCollectionPermissions(data.worldPermissions),
    data.overrideSnapshotPolicy,
    toModelSnapshotPolicy(data.snapshotPolicy));
}

export function toCollectionPermissions(data: CollectionPermissionsData): CollectionPermissions {
  return new CollectionPermissions(
    data.read,
    data.write,
    data.create,
    data.remove,
    data.manage);
}

export function toModelSnapshotPolicy(data: ModelSnapshotPolicyData): ModelSnapshotPolicy {
  return new ModelSnapshotPolicy(
    data.snapshotsEnabled,
    data.triggerByVersion,
    data.maximumVersionInterval,
    data.limitByVersion,
    data.minimumVersionInterval,
    data.triggerByTime,
    data.maximumTimeInterval,
    data.limitByTime,
    data.minimumTimeInterval);
}

export function toCollectionSummary(data: CollectionSummaryData): CollectionSummary {
  return new CollectionSummary(
    data.id,
    data.description,
    data.modelCount);
}

export function toModel(data: ModelData): Model {
  return new Model(
    data.metaData.id,
    data.metaData.collection,
    data.metaData.version,
    new Date(data.metaData.createdTime),
    new Date(data.metaData.modifiedTime),
    data.data
  );
}

export function toModelPermissionSummary(data: ModelPermissionSummaryData): ModelPermissionSummary {
  return new ModelPermissionSummary(
    data.overrideWorld,
    toModelPermissions(data.worldPermissions),
    data.userPermissions.map(toModelUserPermissions)
  );
}

export function toModelPermissions(data: ModelPermissionsData): ModelPermissions {
  return new ModelPermissions(
    data.read,
    data.write,
    data.remove,
    data.manage
  )
}

export function toModelUserPermissions(data: ModelUserPermissionsData): ModelUserPermissions {
  return new ModelUserPermissions(
    toDomainUserId(data.userId),
    toModelPermissions(data.permissions)
  );
}

export function toDomainUser(data: DomainUserData): DomainUser {
  return new DomainUser(
    data.username,
    data.displayName,
    data.firstName,
    data.lastName,
    data.email);
}

export function toDomainUserId(data: DomainUserIdData): DomainUserId {
  return new DomainUserId(data.type, data.username);
}

export function toDomainUserGroup(data: DomainUserGroupData): DomainUserGroup {
  return new DomainUserGroup(
    data.id,
    data.description,
    data.members);
}

export function toDomainUserGroupInfo(data: DomainUserGroupInfoData): DomainUserGroupInfo {
  return new DomainUserGroupInfo(
    data.id,
    data.description);
}

export function toDomainUserGroupSummary(data: DomainUserGroupSummaryData): DomainUserGroupSummary {
  return new DomainUserGroupSummary(
    data.id,
    data.description,
    data.members);
}

export function toDomainJwtKey(data: DomainJwtKeyData): DomainJwtKey {
  return new DomainJwtKey(
    data.id,
    data.description,
    new Date(data.updated),
    data.key,
    data.enabled
  );
}
