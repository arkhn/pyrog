import * as React from "react";
import { shallow } from "enzyme";
import SQLRequestParserTab from "./sqlRequestParserTab";

describe("SQLRequestParserTab component", () => {
  it("Renders without crashing", () => {
    shallow(
      <SQLRequestParserTab selectedSource={{ id: "myid", name: "Mimic" }} />
    );
  });
});
