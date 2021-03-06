import React from 'react';
import hoistNonReactStatic from 'hoist-non-react-statics';
const {
  breakPoints, containerMaxWidth,
} = require('src/styles/theme');
const Measure = require('react-measure');
const _ = require('underscore');

function getBreakPointByWidth(width) {
  if (width > containerMaxWidth.xxl) {
    return 'xxl';
  } else if (width > containerMaxWidth.xl) {
    return 'xl';
  } else if (width > containerMaxWidth.lg) {
    return 'lg';
  } else if (width > containerMaxWidth.md) {
    return 'md';
  } else if (width > containerMaxWidth.sm) {
    return 'sm';
  }
  return 'xs';
}

/**
 * A HOC to detect the device size and match up with breakPoints,
 * then pass it down to props
 * optionally pass down all dimensions (width, height, top, bottom, left, right)
 * If we need to support ssr, use withDimensionsSSR which will delay the rendering
 */

const withDimensions = ({showBreakPoint = false, onlyShowBreakPoint, updateInterval = 5, blacklist = []}) => {
  return (Component) => {
    const componentName = Component.displayName || Component.name || 'Component';
    class HOC extends React.Component {
      static displayName = `withDimensions(${componentName})`;

      static propTypes = {
        onDimensionChange: React.PropTypes.func,
      }

      state = {
        dimensions: [],
        breakPoint: 'lg',
      }

      onMeasure = (dimensions) => {
        const breakPoint = getBreakPointByWidth(dimensions.width);
        if (!_.isEqual(dimensions, this.state.dimensions)) {
          this.setState({ dimensions, breakPoint });
          if (this.props.onDimensionChange) {
            this.props.onDimensionChange(dimensions);
          }
        }
      }

      render() {
        const {dimensions, breakPoint} = this.state;
        let propsToPassDown = {dimensions};
        if (showBreakPoint) {
          propsToPassDown.breakPoint = breakPoint;
        }
        if (onlyShowBreakPoint) {
          propsToPassDown = {breakPoint};
        }

        const throttledOnMeasure = _.throttle(this.onMeasure, updateInterval);

        return (
          <Measure
            blacklist={blacklist}
            onMeasure={throttledOnMeasure}
          >
            <Component
              {...this.props}
              {...propsToPassDown}
            />
          </Measure>
        );
      }
    }

    hoistNonReactStatic(Component, HOC);

    return HOC;
  };
};


module.exports = withDimensions;
