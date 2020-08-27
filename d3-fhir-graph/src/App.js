import React from "react";
import logo from "./logo.svg";
import "./App.css";
import * as d3 from "d3";

import mapping from "./chimio_mapping.json";
console.log(mapping);

const parse = (mapping) => {
  // each resource makes a node
  const nodes = mapping.resources.map((r) => ({
    id: r.id,
    label: `${r.definitionId}${r.label ? " - " + r.label : ""}`,
    group: r.definition.type,
  }));

  // each reference from a resource to another makes a link
  const links = mapping.resources.reduce((acc, r) => {
    // filter all references
    const references = r.attributes.filter(
      (a) => a.definitionId === "Reference"
    );
    // find references' systems based on the attribute path
    const refSystems = r.attributes.filter((a) => {
      const isSystem =
        references.some((ref) => a.path.startsWith(ref.path)) &&
        a.path.endsWith("identifier.system");
      const hasInput = a.inputs && a.inputs.length && a.inputs[0].staticValue;
      if (isSystem && !hasInput)
        console.warn(`[${r.definitionId}.${a.path}] missing input`);
      return isSystem && hasInput;
    });

    return [
      ...acc,
      ...refSystems
        .map((systemAttribute) => {
          // extract the targeted resource id from the reference system
          const targetResourceId = systemAttribute.inputs[0].staticValue.split(
            /\//
          )[4]; // system must look like http://terminology.arkhn.com/<sourceId>/<resourceId>[/<optionalCustomKey>]
          if (!targetResourceId)
            // FIXME: throw error instead of console.error
            console.error(
              `[${r.definitionId}.${systemAttribute.path}] bad reference system: ${systemAttribute.inputs[0].staticValue}`
            );

          return {
            source: r.id,
            target: targetResourceId,
            value: 1,
            label: systemAttribute.path,
          };
        })
        .filter((l) => !!l.target),
    ];
  }, []);
  console.log(nodes, links);
  return { nodes, links };
};

// parse(mapping);
const data = parse(mapping);

function App() {
  const [n, setNode] = React.useState();
  const height = 600;
  const width = 600;

  // const scale = d3.scaleOrdinal(data.nodes.map((n) => n.group));
  const scale = d3.scaleOrdinal(d3.schemeCategory10);
  const color = (d) => {
    return scale(d.group);
  };

  const drag = (simulation) => {
    function dragstarted(d) {
      if (!d3.event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(d) {
      d.fx = d3.event.x;
      d.fy = d3.event.y;
    }

    function dragended(d) {
      if (!d3.event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    return d3
      .drag()
      .on("start", dragstarted)
      .on("drag", dragged)
      .on("end", dragended);
  };

  const links = data.links.map((d) => Object.create(d));
  const nodes = data.nodes.map((d) => Object.create(d));

  React.useEffect(() => {
    const simulation = d3
      .forceSimulation(nodes)
      .force(
        "link",
        d3
          .forceLink(links)
          .id((d) => d.id)
          .distance(200)
      )
      // .force("charge", null)
      .force("charge", d3.forceManyBody().strength(-40))
      .force("center", d3.forceCenter(width / 2, height / 2));

    const svg = d3.select(n).attr("viewBox", [0, 0, width, height]);

    svg
      .append("defs")
      .append("marker")
      .attr("id", "arrowhead")
      .attr("viewBox", "-0 -5 10 10") //the bound of the SVG viewport for the current SVG fragment. defines a coordinate system 10 wide and 10 high starting on (0,-5)
      .attr("refX", 14) // x coordinate for the reference point of the marker. If circle is bigger, this need to be bigger.
      .attr("refY", 0)
      .attr("orient", "auto")
      .attr("markerWidth", 10)
      .attr("markerHeight", 10)
      .attr("xoverflow", "visible")
      .append("svg:path")
      .attr("d", "M 0,-5 L 10 ,0 L 0,5")
      .attr("fill", "#999")
      .style("stroke", "none");

    //add encompassing group for the zoom
    var container = svg.append("g").attr("class", "everything");

    // LINKS

    const link = container
      .append("g")
      .attr("class", "links")
      .selectAll("line")
      .data(links)
      .enter()
      .append("line");

    link
      .attr("stroke", "#999")
      .attr("stroke-opacity", 0.6)
      .attr("stroke-width", (d) => Math.sqrt(d.value))
      .attr("marker-end", "url(#arrowhead)");

    // EDGE LABELS

    const edgePaths = container
      .selectAll(".edgepath")
      .data(links)
      .enter()
      .append("path")
      .attr("class", "edgepath")
      .attr("fill-opacity", 0)
      .attr("stroke-opacity", 0)
      .attr("id", function (d, i) {
        return "edgepath" + i;
      })
      .style("pointer-events", "none");

    const edgelabels = container
      .selectAll(".edgelabel")
      .data(links)
      .enter()
      .append("text")
      .style("pointer-events", "none")
      .attr("class", "edgelabel")
      .attr("id", function (d, i) {
        return "edgelabel" + i;
      })
      .attr("font-size", 10)
      .attr("fill", "#aaa");

    edgelabels
      .append("textPath")
      .attr("xlink:href", function (d, i) {
        return "#edgepath" + i;
      })
      .style("text-anchor", "middle")
      .style("pointer-events", "none")
      .attr("startOffset", "50%")
      .attr("font-size", "8px")
      .text(function (d) {
        return d.label;
      });

    // NODES
    var node = container
      .selectAll(".node")
      .data(nodes)
      .enter()
      .append("g")
      .attr("class", "node");

    node.append("circle").attr("r", 5).attr("fill", color);
    // node.append("rect").attr("stroke-width", 5).attr("fill", color);

    node
      .append("text")
      .attr("font-size", "10px")
      .attr("dx", 12)
      .attr("dy", ".15em")
      .text((d) => d.label);

    node.call(drag(simulation));
    // _________________________________

    //add zoom capabilities
    //Zoom functions
    function zoom_actions() {
      container.attr("transform", d3.event.transform);
    }
    var zoom_handler = d3.zoom().on("zoom", zoom_actions);

    zoom_handler(svg);

    simulation.on("tick", () => {
      link
        .attr("x1", (d) => d.source.x)
        .attr("y1", (d) => d.source.y)
        .attr("x2", (d) => d.target.x)
        .attr("y2", (d) => d.target.y);

      // node.attr("cx", (d) => d.x).attr("cy", (d) => d.y);
      node.attr("transform", (d) => `translate(${d.x},${d.y})`);

      edgePaths.attr("d", function (d) {
        return (
          "M " +
          d.source.x +
          " " +
          d.source.y +
          " L " +
          d.target.x +
          " " +
          d.target.y
        );
      });

      edgelabels.attr("transform", function (d) {
        if (d.target.x < d.source.x) {
          var bbox = this.getBBox();

          const rx = bbox.x + bbox.width / 2;
          const ry = bbox.y + bbox.height / 2;
          return "rotate(180 " + rx + " " + ry + ")";
        } else {
          return "rotate(0)";
        }
      });
    });

    // invalidation.then(() => simulation.stop());
  });

  return (
    <div className="App">
      <header className="App-header">
        <svg ref={(node) => setNode(node)}></svg>
      </header>
    </div>
  );
}

export default App;
