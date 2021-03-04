import React from "react";
import { Col, Statistic } from "antd";

export const StatsContainer = (props) => {

  return (
    <>
      <Col flex="auto">
        <Statistic title={`Event count - pixels over ${props.eventThreshold}`} value={props.eventCount ? props.eventCount : "Loading..."} />
      </Col>
      <Col flex="auto">
        <Statistic title={"Aggregate stat #2"} value={100} />
      </Col>
      <Col flex="auto">
        <Statistic title={"Aggregate stat #3"} value={100} />
      </Col>
    </>
  );
};
