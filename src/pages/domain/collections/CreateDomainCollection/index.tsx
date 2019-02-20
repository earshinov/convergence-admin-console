import React, {ReactNode} from "react";
import {
  Card,
  notification,
  Form,
  Icon
} from "antd";
import {FormComponentProps} from "antd/lib/form";
import {RouteComponentProps} from "react-router";
import {Page} from "../../../../components/Page/";
import {injectAs} from "../../../../utils/mobx-utils";
import {SERVICES} from "../../../../services/ServiceConstants";
import {RestError} from "../../../../services/RestError";
import {DomainBreadcrumbProducer} from "../../DomainBreadcrumProducer";
import {DomainCollectionService} from "../../../../services/domain/DomainCollectionService";
import {Collection} from "../../../../models/domain/Collection";
import {toDomainUrl} from "../../../../utils/domain-url";
import {DomainId} from "../../../../models/DomainId";
import {DomainCollectionForm} from "../../../../components/domain/collection/DomainCollectionForm";
import styles from "./styles.module.css";
import {CollectionPermissions} from "../../../../models/domain/CollectionPermissions";
import {ModelSnapshotPolicy} from "../../../../models/domain/ModelSnapshotPolicy";


interface CreateDomainCollectionsProps extends RouteComponentProps {
  domainId: DomainId;
}

interface InjectedProps extends CreateDomainCollectionsProps, FormComponentProps {
  domainCollectionService: DomainCollectionService;
}

class CreateDomainCollectionComponent extends React.Component<InjectedProps, {}> {
  private readonly _breadcrumbs: DomainBreadcrumbProducer;
  private readonly _newCollection: Collection;

  constructor(props: InjectedProps) {
    super(props);

    this._newCollection = new Collection(
      "",
      "",
      new CollectionPermissions(true, true, true, true, false),
      false,
      new ModelSnapshotPolicy(
        false,
        false,
        0,
        false,
        0,
        false,
        0 ,
        false,
        0)
    );

    this._breadcrumbs = new DomainBreadcrumbProducer(this.props.domainId, [
      {title: "Collection", link: "/collections"},
      {title: "New Collection"}
    ]);
  }

  public render(): ReactNode {
    return (
      <Page breadcrumbs={this._breadcrumbs}>
        <Card title={<span><Icon type="folder"/> New Collection</span>} className={styles.formCard}>
          <DomainCollectionForm
            saveButtonLabel="Create"
            initialValue={this._newCollection}
            onCancel={this._handleCancel}
            onSave={this._handleSave}
          />
        </Card>
      </Page>
    );
  }

  private _handleCancel = () => {
    const url = toDomainUrl("", this.props.domainId, "collections/");
    this.props.history.push(url);
  }

  private _handleSave = (collection: Collection) => {
    const domainId = this.props.domainId;
    this.props.domainCollectionService.createCollection(domainId, collection)
      .then(() => {
        notification.success({
          message: 'Collection Created',
          description: `Collection '${collection.id}' successfully created`
        });
        const url = toDomainUrl("", domainId, "collections/");
        this.props.history.push(url);
      }).catch((err) => {
      if (err instanceof RestError) {
        if (err.code === "duplicate") {
          notification.error({
            message: 'Could Not Create Collection',
            description: `A collection with the specified ${err.details["field"]} already exists.`
          });
        }
      }
    });
  }
}

const injections = [SERVICES.DOMAIN_COLLECTION_SERVICE];
export const CreateDomainCollection = injectAs<CreateDomainCollectionsProps>(injections, Form.create<{}>()(CreateDomainCollectionComponent));
