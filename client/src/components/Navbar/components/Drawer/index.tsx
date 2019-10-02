import {
  Button,
  Classes,
  Drawer as BPDrawer,
  H3,
  Icon,
  InputGroup,
  FormGroup,
  Spinner
} from "@blueprintjs/core";
import * as React from "react";
import { Mutation } from "react-apollo";
import { useSelector } from "react-redux";
import { useApolloClient } from "react-apollo-hooks";

import "./style.less";
import StringSelect from "../../../selects/stringSelect";
import { IReduxStore } from "../../../../types";
import sourceSchemas from "../../../../services/selectedNode/sourceSchemas/reducer";

const credential = require("../../../../graphql/queries/credential.graphql");
const upsertCredential = require("../../../../graphql/mutations/upsertCredential.graphql");

interface IProps {
  title: string;
  isOpen: boolean;
  onClose: any;
}

const Drawer = ({ title, isOpen, onClose }: IProps) => {
  const types = ["POSTGRES"];

  const [host, setHost] = React.useState("");
  const [port, setPort] = React.useState("");
  const [login, setLogin] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [database, setDatabase] = React.useState("");
  const [type, setType] = React.useState(types[0]);
  const [hasChanged, setHasChanged] = React.useState(false);
  const [hasSuccessfullyChanged, setHasSuccessfullyChanged] = React.useState(
    false
  );
  const [loading, setLoading] = React.useState(true);
  const selectedNode = useSelector((state: IReduxStore) => state.selectedNode);
  const client = useApolloClient();

  React.useEffect(() => {
    console.log("USE EFFECT", selectedNode);
    if (selectedNode.source.id) {
      client
        .query({
          query: credential,
          variables: {
            sourceId: selectedNode.source.id
          },
          fetchPolicy: "network-only"
        })
        .then((response: any) => {
          setLoading(false);

          const cred = response.data.credential;
          setHost(cred.host);
          setPort(cred.port);
          setLogin(cred.login);
          setPassword(cred.password);
          setDatabase(cred.database);
          setType(cred.type);
        })
        .catch((error: any) => {
          console.log(error);
          throw new Error(error);
        });
    }
  }, [selectedNode]);

  return (
    <BPDrawer
      className="drawer"
      icon="properties"
      title={title}
      isOpen={isOpen}
      onClose={onClose}
      size={"30%"}
    >
      <div className={Classes.DRAWER_BODY}>
        <div className={Classes.DIALOG_BODY}>
          <H3 className="inline-title">
            <span>Database credentials</span>
            <span>{loading && <Spinner size={15} />}</span>
          </H3>
          <Mutation
            mutation={upsertCredential}
            onCompleted={(data: any) => {
              setHasChanged(false);
              setHasSuccessfullyChanged(true);
            }}
            onError={(error: any) => {
              console.log("ERROR", error);
            }}
          >
            {(upsert: any, { loading }: any) => {
              return (
                <form
                  onSubmit={(e: any) => {
                    console.log("onsubmit");
                    e.preventDefault();
                    upsert({
                      variables: {
                        host,
                        port,
                        login,
                        database,
                        password,
                        type,
                        sourceId: selectedNode.source.id
                      }
                    });
                  }}
                >
                  <FormGroup label="Host">
                    <InputGroup
                      value={host}
                      disabled={loading}
                      leftIcon={"desktop"}
                      onChange={(event: any) => {
                        setHost(event.target.value);
                        setHasChanged(true);
                      }}
                      placeholder={"Host"}
                    />
                  </FormGroup>
                  <FormGroup label="Port">
                    <InputGroup
                      value={port}
                      disabled={loading}
                      leftIcon={"numerical"}
                      onChange={(event: any) => {
                        setPort(event.target.value);
                        setHasChanged(true);
                      }}
                      placeholder={"Port"}
                    />
                  </FormGroup>
                  <FormGroup label="Database name">
                    <InputGroup
                      value={database}
                      disabled={loading}
                      leftIcon={"database"}
                      onChange={(event: any) => {
                        setDatabase(event.target.value);
                        setHasChanged(true);
                      }}
                      placeholder={"Database name"}
                    />
                  </FormGroup>
                  <FormGroup label="Login">
                    <InputGroup
                      value={login}
                      disabled={loading}
                      leftIcon={"user"}
                      onChange={(event: any) => {
                        setLogin(event.target.value);
                        setHasChanged(true);
                      }}
                      placeholder={"Login"}
                    />
                  </FormGroup>
                  <FormGroup label="Password">
                    <InputGroup
                      value={password}
                      disabled={loading}
                      leftIcon={"key"}
                      onChange={(event: any) => {
                        setPassword(event.target.value);
                        setHasChanged(true);
                      }}
                      placeholder={"Password"}
                      type={"password"}
                    />
                  </FormGroup>
                  <FormGroup label="Type">
                    <StringSelect
                      filterable={false}
                      items={types}
                      disabled={loading}
                      inputItem={type}
                      onChange={(item: string) => {
                        setHasChanged(true);
                        setType(item);
                      }}
                    />
                  </FormGroup>
                  <Button
                    intent={
                      hasSuccessfullyChanged && !hasChanged
                        ? "success"
                        : "primary"
                    }
                    disabled={
                      (hasSuccessfullyChanged && !hasChanged) || !hasChanged
                    }
                    loading={loading}
                    icon={
                      hasSuccessfullyChanged &&
                      !hasChanged && <Icon intent={"success"} icon={"tick"} />
                    }
                    type={"submit"}
                    onClick={() => {
                      upsert({
                        variables: {
                          host,
                          port,
                          login,
                          password,
                          database,
                          type,
                          sourceId: selectedNode.source.id
                        }
                      });
                    }}
                  >
                    Save
                  </Button>
                </form>
              );
            }}
          </Mutation>
        </div>
      </div>
    </BPDrawer>
  );
};

export default Drawer;
