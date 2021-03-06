import React, { Component } from "react";
import styled from "styled-components";

import { color as c } from "metabase/lib/colors";

type Props = {
  percentage: number,
  animated: boolean,
  color: string,
  height: number,
};

const ProgressWrapper = styled.div`
  position: relative;
  border: 1px solid ${props => props.color};
  height: 10px;
  border-radius: 99px;
`;

const Progress = styled.div`
      overflow: hidden;
      background-color: ${props => props.color};
      position: relative;
      height: 100%;
      top: 0;
      left: 0;
      border-radius: inherit;
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
      width: ${props => props.width}%;
      ":before": {
        display: ${props => (props.animated ? "block" : "none")};
        position: absolute;
        content: "";
        left: 0;
        width: ${props => props.width / 4}%;
        height: 100%;
        background-color: ${c("bg-black")};
        animation: ${props =>
          props.animated ? "progress-bar 1.5s linear infinite" : "none"};
      },
`;

// @Question - why is this separate from our progress Viz type?
export default class ProgressBar extends Component {
  props: Props;

  static defaultProps = {
    animated: false,
    height: 10,
  };

  render() {
    const { percentage, animated, color = c("brand") } = this.props;

    const width = percentage * 100;

    return (
      <ProgressWrapper color={color}>
        <Progress width={width} animated={animated} color={color} />
      </ProgressWrapper>
    );
  }
}
