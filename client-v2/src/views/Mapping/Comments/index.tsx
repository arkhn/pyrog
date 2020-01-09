import * as React from "react";
import { useQuery, useMutation } from "@apollo/react-hooks";
import { useSelector } from "react-redux";
import { FormGroup, TextArea, Button } from "@blueprintjs/core";

import { IReduxStore } from "../../../types";
import { loader } from "graphql.macro";

// GRAPHQL
const qCommentsForAttribute = loader(
  "src/graphql/queries/commentsForAttribute.graphql"
);
const mUpdateAttribute = loader(
  "src/graphql/mutations/updateAttribute.graphql"
);

const Comments = () => {
  const selectedNode = useSelector((state: IReduxStore) => state.selectedNode);

  const { data, loading } = useQuery(qCommentsForAttribute, {
    variables: {
      attributeId: selectedNode.attribute.id
    },
    skip: !selectedNode.attribute.id
  });
  const [updateAttribute] = useMutation(mUpdateAttribute);

  const [comments, setComments] = React.useState("");

  React.useEffect(() => {
    setComments(data && data.attribute.comments ? data.attribute.comments : "");
  }, [selectedNode, loading]);

  return (
    <div id="comment">
      <FormGroup label={<h3>Comments</h3>}>
        <div id="comment-input">
          <TextArea
            className={"bp3-fill"}
            value={comments}
            disabled={loading || !selectedNode.attribute.id}
            onChange={e => {
              setComments(e.target.value);
            }}
          />
          <Button
            id="save-comment-button"
            onClick={() => {
              updateAttribute({
                variables: {
                  attributeId: selectedNode.attribute.id,
                  data: {
                    comments
                  }
                }
              });
            }}
          >
            Save
          </Button>
        </div>
      </FormGroup>
    </div>
  );
};

export default Comments;
