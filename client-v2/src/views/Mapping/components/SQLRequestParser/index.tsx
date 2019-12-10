import * as React from "react";
import { TextArea } from "@blueprintjs/core";

export interface IProps {
  onChangeCallback?: any;
}
export interface IState {}

export default class SQLRequestParser extends React.Component<IProps, IState> {
  constructor(props: IProps) {
    super(props);
  }

  public render() {
    return (
      <div>
        <TextArea
          className={"bp3-fill"}
          onChange={event => {
            this.props.onChangeCallback(event.target.value);
          }}
        />
      </div>
    );
  }
}
