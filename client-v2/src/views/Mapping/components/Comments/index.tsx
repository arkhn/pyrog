import * as React from "react"
import { useQuery, useMutation } from '@apollo/react-hooks';
import {
  FormGroup,
  TextArea,
} from "@blueprintjs/core";


interface IProps {
  attribute: {
    id: string
  }
}

// GRAPHQL
const qCommentsForAttribute = require("src/graphql/queries/commentsForAttribute.graphql");
const mUpdateAttribute = require("src/graphql/mutations/updateAttribute.graphql");

const Comments = ({ attribute }: IProps) => {

  const { data, loading } =
    useQuery(qCommentsForAttribute, {
      variables: {
        attributeId: attribute.id
      }
    })
  const [updateAttribute] = useMutation(mUpdateAttribute)

  const [comments, setComments] = React.useState("")

  React.useEffect(() => {
    setComments(
      data && data.attribute.comments
        ? data.attribute.comments
        : ""
      )
  }, [loading])

  return (
    <div>
      <FormGroup label={<h3>Comments</h3>}>
        <div>
          <TextArea
            className={"bp3-fill"}
            value={comments}
            disabled={loading || !attribute.id}
            onChange={e => {
              setComments(e.target.value)
              updateAttribute({
                variables: {
                  attributeId: attribute.id,
                  data: {
                    comments: e.target.value
                  }
                },
              })
            }}
          />
        </div>
      </FormGroup>
    </div>
  )
}

export default Comments
