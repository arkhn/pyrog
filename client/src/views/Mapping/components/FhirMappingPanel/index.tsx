import { Spinner } from "@blueprintjs/core";
import * as QueryString from "query-string";
import * as React from "react";
import { Query } from "react-apollo";
import { useSelector, useDispatch } from "react-redux";
import useReactRouter from "use-react-router";

// ACTIONS
import { updateFhirAttribute } from "../../../../services/selectedNode/actions";

// COMPONENTS
import AddResource from "./components/AddResource";
import FhirResourceTree from "./components/FhirResourceTree";
import ResourceSelector from "./components/ResourceSelector";

import { IReduxStore } from "../../../../types";

// GRAPHQL
const availableResources = require("../../../../graphql/queries/availableResources.graphql");
const resourceAttributeTree = require("../../../../graphql/queries/resourceAttributeTree.graphql");

const FhirMappingPanel = () => {
  const dispatch = useDispatch();
  const selectedNode = useSelector((state: IReduxStore) => state.selectedNode);
  const { history, location } = useReactRouter();

  const [
    expandedAttributesIdList,
    setExpandedAttributesIdList
  ] = React.useState([]);
  const [createdResources, setCreatedResources] = React.useState(0);
  const [createdProfiles, setCreatedProfiles] = React.useState(0);

  // This function updates the current url with new information.
  // Before: url/pathname?attr1=value1
  // After: url/pathname?attr1=value1&key=value
  const updateLocationSearch = (key: string, value: string) => {
    const qs = QueryString.stringify({
      ...QueryString.parse(location.search),
      [key]: value
    });

    history.push({ search: qs });
  };

  return (
    <Query
      fetchPolicy={"network-only"}
      query={availableResources}
      skip={!selectedNode.source.id}
      variables={{
        sourceId: selectedNode.source.id,
        // This allows to force refetch
        // when a new resource is added.
        createdResources: createdResources
      }}
    >
      {({ data, loading }: any) => {
        return (
          <>
            <div id="fhir-attributes">
              <div id="resource-selector">
                <ResourceSelector
                  data={data}
                  loading={loading}
                  deleteResourceCallback={() => {
                    setCreatedResources(createdResources - 1);
                  }}
                />
              </div>
              <div id="fhir-resource-tree">
                {selectedNode.resource.fhirType ? (
                  <Query
                    fetchPolicy={"network-only"}
                    query={resourceAttributeTree}
                    variables={{
                      createdProfiles: createdProfiles,
                      resourceId: selectedNode.resource.id
                    }}
                    skip={!selectedNode.source || !selectedNode.resource.id}
                  >
                    {({ data, loading }: any) => {
                      return loading ? (
                        <Spinner />
                      ) : (
                        <FhirResourceTree
                          addProfileCallback={(response: any) => {
                            setCreatedProfiles(createdProfiles + 1);
                          }}
                          deleteProfileCallback={(response: any) => {
                            setCreatedProfiles(createdProfiles - 1);
                          }}
                          expandedAttributesIdList={expandedAttributesIdList}
                          nodeCollapseCallback={(node: any) => {
                            setExpandedAttributesIdList(
                              expandedAttributesIdList.filter(
                                (item: any) => item !== node.nodeData.id
                              )
                            );
                          }}
                          nodeExpandCallback={(node: any) => {
                            setExpandedAttributesIdList([
                              ...expandedAttributesIdList,
                              node.nodeData.id
                            ]);
                          }}
                          json={data.resource.attributes}
                          onClickCallback={(nodeData: any) => {
                            dispatch(
                              updateFhirAttribute(nodeData.id, nodeData.name)
                            );
                            updateLocationSearch("attributeId", nodeData.id);
                          }}
                          selectedNodeId={selectedNode.attribute.id}
                        />
                      );
                    }}
                  </Query>
                ) : null}
              </div>
            </div>
            <div id="resource-add">
              <AddResource
                callback={() => {
                  setCreatedResources(createdResources + 1);
                }}
              />
            </div>
          </>
        );
      }}
    </Query>
  );
};

export default FhirMappingPanel;
