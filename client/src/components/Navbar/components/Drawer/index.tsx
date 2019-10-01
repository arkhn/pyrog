import { Classes, Drawer as BPDrawer } from "@blueprintjs/core";
import * as React from "react";

interface IProps {
  title: string;
  isOpen: boolean;
  onClose: any;
}

const Drawer = ({ title, isOpen, onClose }: IProps) => {
  return (
    <BPDrawer icon="properties" title={title} isOpen={isOpen} onClose={onClose}>
      <div className={Classes.DRAWER_BODY}>
        <div className={Classes.DIALOG_BODY}>
          <p>Hello</p>
        </div>
      </div>
      <div className={Classes.DRAWER_FOOTER}>Footer</div>
    </BPDrawer>
  );
};

export default Drawer;
