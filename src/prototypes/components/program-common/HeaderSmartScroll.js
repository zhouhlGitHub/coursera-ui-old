/* eslint-disable no-param-reassign, no-use-before-define, max-len */
import React from 'react';
const {
  cssWithClass, StyleSheet, css, color, spacing, gradient, transition, zIndex
} = require('src/styles/theme');

const _ = require('underscore');
import { Avatar, Button, SmartScrollWrapper } from 'src';
import withApiMockData from 'src/components/hocs/withApiMockData';
import { courseraLogo } from 'src/assets/pngAssets';
import {HEADER_HEIGHT} from 'src/constants/ProgramCreationAppConstants';
import Measure from 'react-measure';

class HeaderSmartScroll extends React.Component {
  static propTypes = {
    onHeaderHeightChange: React.PropTypes.func.isRequired,
    isLoggedIn: React.PropTypes.bool,
    isInfiniteMode: React.PropTypes.bool,
    children: React.PropTypes.node,
  }

  state = {
    containerHeight: 0,
  }

  shouldComponentUpdate({
    isInfiniteMode: nextIsInfiniteMode, children: nextChildren, ...restNextProps
  }, nextState) {
    const {isInfiniteMode, children, ...restProps} = this.props;
    // If we are entering or leaving infiniteMode, or the children changes we don't want to update
    if (nextIsInfiniteMode !== isInfiniteMode) return false;
    return !_.isEqual(nextState, this.state) || !_.isEqual(restProps, restNextProps);
  }

  componentWillUpdate(nextProps, {containerHeight}) {
    if (this.state.containerHeight !== containerHeight) {
      this.props.onHeaderHeightChange(containerHeight);
    }
  }

  render() {
    const {isLoggedIn, isInfiniteMode, children} = this.props;
    if (isInfiniteMode) return null;
    const {containerHeight} = this.state;

    return (
      <SmartScrollWrapper delta={50} containerHeight={containerHeight} zIndex={1}>
        <Measure
          onMeasure={dimensions => this.setState({containerHeight: dimensions.height})}
        >
          <div {...css(styles.mainContainer)}>
            <header {...cssWithClass('container-fluid', styles.HeaderSmartScroll)}>
              <div {...cssWithClass('container horizontal-box align-items-spacebetween wrap', styles.headerInner)}>
                <a href="/"> <img src={courseraLogo} alt="Coursera Logo"/></a>
                {isInfiniteMode && <p>Infinite Mode</p>}
                <div className="horizontal-box align-items-vertical-center">
                  {isLoggedIn &&
                    <Avatar size={44} imgSrc="https://s3.amazonaws.com/uifaces/faces/twitter/aiiaiiaii/128.jpg" />
                  }
                </div>
                <div className="horizontal-box align-items-vertical-center">
                  <Button type="noStyle" size="sm" label="Log In" style={{marginRight: '1rem'}} />
                  <Button type="primary" size="sm" label="Sign Up" />
                </div>
              </div>
            </header>
            {children}
          </div>
        </Measure>
      </SmartScrollWrapper>
    );
  }
}


module.exports = HeaderSmartScroll;

const styles = StyleSheet.create({
  HeaderSmartScroll: {
    height: 48,
    minWidth: spacing.minWidth,
    backgroundColor: color.white,
    boxShadow: `0 2px 4px 0 ${color.shadow}`,
  },
  mainContainer: {

  },
  headerInner: {
    padding: '8px 0',
  },
});