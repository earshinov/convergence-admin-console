import {Page} from "../../../../components/Page/";
import React, {ReactNode} from "react";
import {Card, notification, Icon} from "antd";
import {FormComponentProps} from "antd/lib/form";
import styles from "./styles.module.css";
import {RouteComponentProps} from "react-router";
import {injectAs} from "../../../../utils/mobx-utils";
import {SERVICES} from "../../../../services/ServiceConstants";
import {DomainBreadcrumbProducer} from "../../DomainBreadcrumProducer";
import {DomainId} from "../../../../models/DomainId";
import {toDomainUrl} from "../../../../utils/domain-url";
import {DomainUserGroupForm} from "../../../../components/domain/group/DomainUserGroupForm/";
import {DomainGroupService} from "../../../../services/domain/DomainGroupService";
import {DomainUserGroup} from "../../../../models/domain/DomainUserGroup";
import {RestError} from "../../../../services/RestError";

interface CreateDomainUserGroupProps extends RouteComponentProps {
  domainId: DomainId;
}

interface InjectedProps extends CreateDomainUserGroupProps, FormComponentProps {
  domainGroupService: DomainGroupService;
}

class CreateDomainUserGroupComponent extends React.Component<InjectedProps, {}> {
  private readonly _breadcrumbs: DomainBreadcrumbProducer;
  private readonly _newGroup: DomainUserGroup;

  constructor(props: InjectedProps) {
    super(props);

    const groupsUrl = toDomainUrl("", this.props.domainId, "groups/");
    this._breadcrumbs = new DomainBreadcrumbProducer(this.props.domainId, [
      {title: "Groups", link: toDomainUrl("", this.props.domainId, groupsUrl)},
      {title: "New Group"}
    ]);

    this._newGroup = new DomainUserGroup("", "", []);
  }

  public render(): ReactNode {
    return (
      <Page breadcrumbs={this._breadcrumbs}>
        <Card title={<span><Icon type="team"/> New Group</span>} className={styles.formCard}>
          <DomainUserGroupForm
            domainId={this.props.domainId}
            saveButtonLabel="Create"
            initialValue={this._newGroup}
            onCancel={this._handleCancel}
            onSave={this._handleSave}
          />
        </Card>
      </Page>
    );
  }

  private _handleCancel = () => {
    const url = toDomainUrl("", this.props.domainId, "groups/");
    this.props.history.push(url);
  }

  private _handleSave = (group: DomainUserGroup) => {
    this.props.domainGroupService.createUserGroup(this.props.domainId, group)
      .then(() => {
        notification.success({
          message: 'Group Created',
          description: `User '${group.id}' successfully created.`
        });
        const url = toDomainUrl("", this.props.domainId, "groups/");
        this.props.history.push(url);
      }).catch((err) => {
      if (err instanceof RestError) {
        if (err.code === "duplicate") {
          notification.error({
            message: 'Could Not Create Group',
            description: `A user with the specified ${err.details["field"]} already exists.`
          });
        }
      }
    });
  }

}

const injections = [SERVICES.DOMAIN_GROUP_SERVICE];
export const CreateDomainUserGroup = injectAs<CreateDomainUserGroupProps>(injections, CreateDomainUserGroupComponent);
