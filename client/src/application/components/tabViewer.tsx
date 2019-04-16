import {
  Button,
  ControlGroup,
  FormGroup,
  Icon,
  Tab,
  Tabs,
  TabId
} from "@blueprintjs/core";
import * as React from "react";

// Import custom components
import ColumnPicker from "./columnPicker";
import ColumnViewer from "./columnViewer";

// Import custom types
import { ISourceColumn, ISourceSchema } from "../types";

export interface IProps {
  sourceSchema: ISourceSchema;
}

export interface IState {
  sourceColumn: ISourceColumn;
  navbarTabId: TabId;
}

export default class TabViewer extends React.Component<IProps, IState> {
  public state: IState = {
    sourceColumn: {
      owner: null,
      table: null,
      column: null
    },
    navbarTabId: "dummy"
  };

  private handleNavbarTabChange = (navbarTabId: TabId) => {
    this.setState({
      navbarTabId
    });
  };

  private changeOwner = (owner: string) => {
    const change = owner != this.state.sourceColumn.owner;

    this.setState((state: IState) => {
      return {
        sourceColumn: {
          owner: owner,
          table: change ? null : state.sourceColumn.table,
          column: change ? null : state.sourceColumn.column
        }
      };
    });
  };

  private changeTable = (table: string) => {
    const change = table != this.state.sourceColumn.table;

    this.setState((state: IState) => {
      return {
        sourceColumn: {
          owner: state.sourceColumn.owner,
          table: table,
          column: change ? null : state.sourceColumn.column
        }
      };
    });
  };

  private changeColumn = (column: string) => {
    this.setState((state: IState) => {
      return {
        sourceColumn: {
          owner: state.sourceColumn.owner,
          table: state.sourceColumn.table,
          column: column
        }
      };
    });
  };

  private handleClick = (column: any) => {
    // this.props.dispatch(clickAddInputColumn(this.state.sourceColumn))
    this.setState({
      sourceColumn: {
        owner: null,
        table: null,
        column: null
      }
    });
  };

  public render() {
    let { sourceSchema } = this.props;

    let { sourceColumn, navbarTabId } = this.state;

    // Dummy column selector tab
    const dummyTabTitle = (
      <div className={"tab-title"}>
        <Icon icon={"panel-table"} />
        <span>Column Selector</span>
      </div>
    );

    const dummyTab = (
      <div id={"dummy-column-picker"}>
        <FormGroup label="Choose column" labelFor="text-input" inline={true}>
          <ControlGroup>
            <ColumnPicker
              onChangeOwner={this.changeOwner}
              onChangeTable={this.changeTable}
              onChangeColumn={this.changeColumn}
              sourceSchema={sourceSchema}
            />
            <Button
              disabled={!sourceColumn.column}
              icon={"add"}
              onClick={this.handleClick}
            />
          </ControlGroup>
        </FormGroup>
      </div>
    );

    // Cluster tab
    const clusterTabTitle = (
      <div className={"tab-title"}>
        <Icon icon={"layout"} />
        <span>Explore Clusters (soon...)</span>
      </div>
    );

    const clusterTab = (
      <div className={"vertical-flex"}>
        <ColumnViewer data={null} />
      </div>
    );

    // Text search tab
    const textTabTitle = (
      <div className={"tab-title"}>
        <Icon icon={"paragraph"} />
        <span>Search by Text (soon...)</span>
      </div>
    );

    const textTab = (
      <div className={"vertical-flex"}>
        <ColumnViewer data={null} />
      </div>
    );

    return (
      <Tabs selectedTabId={navbarTabId} onChange={this.handleNavbarTabChange}>
        <Tab id="dummy" title={dummyTabTitle} panel={dummyTab} />
        <Tab id="text" title={textTabTitle} panel={textTab} disabled={true} />
        <Tab
          id="clustering"
          title={clusterTabTitle}
          panel={clusterTab}
          disabled={true}
        />
      </Tabs>
    );
  }
}
