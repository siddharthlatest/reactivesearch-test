import React from "react";
import ReactDOM from "react-dom";

import {
  ReactiveBase,
  DataSearch,
  MultiList,
  SelectedFilters,
  ReactiveList
} from "@appbaseio/reactivesearch";
import { Row, Button, Col, Card, Switch, Tree, Popover, Affix } from "antd";
import "antd/dist/antd.css";

import ExpandCollapse from "react-expand-collapse";

import "./styles.css";

const { TreeNode } = Tree;

const renderAsTree = (res, key = "0") => {
  if (!res) return null;
  const iterable = Array.isArray(res) ? res : Object.keys(res);
  return iterable.map((item, index) => {
    const type = typeof res[item];
    if (type === "string" || type === "number") {
      return (
        <TreeNode
          title={
            <div>
              <span>{item}:</span>&nbsp;
              <span dangerouslySetInnerHTML={{ __html: res[item] }} />
            </div>
          }
          key={key + "-" + (index + 1)}
        />
      );
    }
    const hasObject = res[item] === undefined && typeof item !== "string";
    const node = hasObject ? item : res[item];
    return (
      <TreeNode
        title={
          typeof item !== "string"
            ? "Object"
            : "" + (node || Array.isArray(res) ? item : item + ": null")
        }
        key={key + "-" + (index + 1)}
      >
        {renderAsTree(node, key + "-" + (index + 1))}
      </TreeNode>
    );
  });
};

function renderItem(res, triggerClickAnalytics) {
  return (
    <div onClick={triggerClickAnalytics} className="list-item" key={res._id}>
      <ExpandCollapse previewHeight="390px" expandText="Show more">
        {<Tree showLine>{renderAsTree(res)}</Tree>}
      </ExpandCollapse>
    </div>
  );
}

const App = () => (
  <ReactiveBase
    app="test-csv-import-v7"
    credentials="5FXNzwGxH:2d92743a-d752-46a1-b088-1239b074c14c"
    url="https://scalr.api.appbase.io"
    analytics={true}
    searchStateHeader
  >
    <Row gutter={16} style={{ padding: 20 }}>
      <Col span={24}>
        <DataSearch
          componentId="search"
          dataField={[
            "Customer_Domain",
            "Customer_Domain.autosuggest",
            "Customer_Domain.english",
            "Customer_Domain.search"
          ]}
          fieldWeights={[1, 1, 1]}
          fuzziness={0}
          highlightField={["Customer_Domain"]}
          style={{
            marginBottom: 20
          }}
        />

        <SelectedFilters />
        <div id="result">
          <ReactiveList
            componentId="result"
            dataField="_score"
            pagination={true}
            react={{
              and: ["search"]
            }}
            renderItem={renderItem}
            size={5}
            style={{
              marginTop: 20
            }}
          />
        </div>
      </Col>
    </Row>
  </ReactiveBase>
);

ReactDOM.render(<App />, document.getElementById("root"));
