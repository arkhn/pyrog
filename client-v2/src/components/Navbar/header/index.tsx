import { Button, Navbar as BPNavbar } from "@blueprintjs/core";
import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import useReactRouter from "use-react-router";

import { IReduxStore } from "src/types";
import { deselectSource } from "src/services/selectedNode/actions";

interface IProps {
  openDrawer: any;
}

const Header = ({ openDrawer }: IProps) => {
  const dispatch = useDispatch();
  const selectedNode = useSelector((state: IReduxStore) => state.selectedNode);
  const { history, location } = useReactRouter();

  let header;
  switch (location.pathname) {
    case "/newSource": {
      header = (
        <Button
          icon={"chevron-left"}
          intent={"primary"}
          minimal={true}
          onClick={() => {
            history.push("/");
          }}
        >
          Sources
        </Button>
      );
      break;
    }

    case "/mapping": {
      header =
        selectedNode.source !== null ? (
          <>
            <Button
              icon={"chevron-left"}
              intent={"primary"}
              minimal={true}
              onClick={() => {
                dispatch(deselectSource());
                history.push("/");
              }}
            >
              Sources
            </Button>
            <BPNavbar.Divider />
            {selectedNode.source.name}
            <BPNavbar.Divider />
            <Button icon="more" minimal={true} onClick={openDrawer} />
          </>
        ) : null;
      break;
    }

    default:
      header = null;
      break;
  }

  return <>{header}</>;
};

export default Header;
