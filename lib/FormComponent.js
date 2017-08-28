import React from 'react';
import PropTypes from 'prop-types';
import equal from 'deep-equal';
import { getValueForKey, setValueForKey } from './util';

export default class FormComponent extends React.PureComponent {
  static propTypes = {
    component: PropTypes.shape({}).isRequired,
    childComponent: PropTypes.shape({}),
    template: PropTypes.shape({}).isRequired,
    templateKey: PropTypes.string.isRequired,
    form: PropTypes.shape({ data: PropTypes.shape({}) }).isRequired,
    value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    valueIndex: PropTypes.number,
  };

  static defaultProps = {
    childComponent: null,
    value: null,
    valueIndex: null,
  };

  constructor() {
    super();
    this.state = { errorProps: {} };
  }

  // validate = (tk, value, arrayIndex = null) => {
  //   const { template } = this.props;
  //   const { validation = null } = template[tk];
  //   let errorProps = null;
  //
  //   if (validation) {
  //     (Array.isArray(validation) ? validation : [validation]).forEach((v) => {
  //       const match = (typeof v.match === 'function' && v.match(value)) || value.match(v.match);
  //       if (!match) {
  //         errorProps = v.errorProps;
  //       }
  //     });
  //   }
  //
  //   if (!equal(this.state.errorProps[tk], errorProps)) {
  //     if (arrayIndex === null) {
  //       this.setState({ errorProps: { ...this.state.errorProps, [tk]: errorProps } });
  //     } else {
  //       const arrayErrorProps = { ...this.state.errorProps[tk] };
  //
  //       arrayErrorProps[arrayIndex] = errorProps;
  //       this.setState({ errorProps: { ...this.state.errorProps, [tk]: arrayErrorProps } });
  //     }
  //   }
  // };

  validate = (value, arrayIndex = null) => {
    const { template } = this.props;
    const { validation = null } = template;
    let errorProps = null;

    if (validation) {
      (Array.isArray(validation) ? validation : [validation]).forEach((v) => {
        const match = (typeof v.match === 'function' && v.match(value)) || value.match(v.match);
        if (!match) {
          errorProps = v.errorProps;
        }
      });
    }

    if (!equal(this.state.errorProps, errorProps)) {
      if (arrayIndex === null) {
        this.setState({ errorProps });
      } else {
        const arrayErrorProps = { ...this.state.errorProps };

        arrayErrorProps[arrayIndex] = errorProps;
        this.setState({ errorProps: arrayErrorProps });
      }
    }
  };

  valueChange = (argIndex = 0, argKey = null, arrayIndex = null, ...args) => {
    const { templateKey, onChange } = this.props;

    if (args && args.length) {
      let value = args[argIndex];
      if (argKey) {
        value = getValueForKey(value, argKey);
      }

      setValueForKey(this.props.form.data, templateKey, value, arrayIndex);
      this.validate(value, arrayIndex);
      // Hack for when setState is fired too quickly and old state is used.
      // setTimeout(() => this.validate(key, value, arrayIndex), 0);

      onChange();
    }
  };

  render() {
    const { component, childComponent, template, valueIndex, value } = this.props;
    const { errorProps } = this.state;
    const { children } = template;
    const { valueProp, event = {} } = component;
    const Component = component.component;
    const eventName = typeof event === 'string' ? event : event.name;
    const props = {
      ...template.props,
    };

    if (typeof value !== 'undefined' && value !== null) {
      props[valueProp] = value;
    }

    // Setup the change event
    if (eventName) {
      if (!event.function) {
        props[eventName] = (...args) => this.valueChange(event.arg, event.key, valueIndex, ...args);
      } else {
        props[eventName] = (...args) =>
          this.valueChange(0, null, valueIndex, event.function(...args));
      }
    }

    // Create children
    if (children && childComponent) {
      const ChildComponent = childComponent.component;
      const childValues = children.values;

      props.children = childValues.map(childProps => <ChildComponent {...childProps} />);
    }

    const errProps = valueIndex === null ? errorProps : errorProps[valueIndex];

    return <Component {...props} {...errProps} />;
  }
}
