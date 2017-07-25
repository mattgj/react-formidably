import React from 'react';
import PropTypes from 'prop-types';

export default class FormProvider extends React.PureComponent {
  static propTypes = {
    children: PropTypes.node.isRequired,
    components: PropTypes.shape({}).isRequired,
    defaultClass: PropTypes.string,
  };

  static defaultProps = {
    defaultClass: null,
  };

  static childContextTypes = {
    formComponents: PropTypes.object,
    formDefaultClass: PropTypes.string,
  };

  getChildContext() {
    return {
      formComponents: this.props.components,
      formDefaultClass: this.props.defaultClass,
    };
  }

  render() {
    return this.props.children;
  }
}
