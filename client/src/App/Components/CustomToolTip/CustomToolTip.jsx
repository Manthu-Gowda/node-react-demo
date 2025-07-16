import React from "react";
import { Tooltip } from "antd";
import PropTypes from "prop-types";

const CustomToolTip = ({
  children,
  title,
  placement = "top",
  overlayClassName = "",
  ...rest
}) => (
  <Tooltip
    placement={placement}
    title={title}
    overlayClassName={overlayClassName}
    {...rest}
  >
    {children}
  </Tooltip>
);

CustomToolTip.propTypes = {
  children: PropTypes.node.isRequired,
  title: PropTypes.oneOfType([PropTypes.string, PropTypes.node]).isRequired,
  placement: PropTypes.oneOf([
    "top", "left", "right", "bottom", 
    "topLeft", "topRight", "bottomLeft", "bottomRight",
    "leftTop", "leftBottom", "rightTop", "rightBottom"
  ]),
  overlayClassName: PropTypes.string
};

export default CustomToolTip;
