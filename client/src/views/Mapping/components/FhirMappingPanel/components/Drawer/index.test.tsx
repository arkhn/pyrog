import { mount, shallow } from "enzyme";
import * as React from "react";
import { ApolloProvider } from "react-apollo";
import { Provider } from "react-redux";
import { MemoryRouter } from "react-router";

import Drawer from "./index";
import mockApolloClient from "test/mockApolloClient";
import mockReduxStore from "test/mockReduxStore";

describe("Drawer component", () => {
  it("Renders without crashing", () => {
    shallow(
      <ApolloProvider client={mockApolloClient}>
        <Drawer title={"test drawer"} isOpen={true} />
      </ApolloProvider>
    );
  });

  it("Calls onCloseCallback when closed", () => {
    const closeFn = jest.fn();
    const component = mount(
      <MemoryRouter initialEntries={["/"]}>
        <Provider store={mockReduxStore}>
          <ApolloProvider client={mockApolloClient}>
            <Drawer title={"test"} isOpen={true} onCloseCallback={closeFn} />
          </ApolloProvider>
        </Provider>
      </MemoryRouter>
    );

    component.find(".bp3-drawer-header button.bp3-button").simulate("click");

    expect(closeFn).toHaveBeenCalled();
  });
});
