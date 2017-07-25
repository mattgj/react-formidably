import React from 'react';
import PropTypes from 'prop-types';
import equal from 'deep-equal';

export default class Form extends React.PureComponent {
  static propTypes = {
    components: PropTypes.shape({}),
    template: PropTypes.shape({}).isRequired,
    data: PropTypes.shape({}),
    onSubmit: PropTypes.func,
    className: PropTypes.string,
    children: PropTypes.node,
  };

  static defaultProps = {
    data: {},
    components: null,
    onSubmit: null,
    className: null,
    children: null,
  };

  static contextTypes = {
    formComponents: PropTypes.object,
    formDefaultClass: PropTypes.string,
  };

  constructor() {
    super();
    this.data = {};
    this.state = { errorProps: {} };
  }

  componentWillMount() {
    this.components = this.props.components || this.context.formComponents;
    this.className = this.props.className || this.context.formDefaultClass;

    const { template, data } = this.props;
    const templateKeys = Object.keys(template);

    // Initialize the data container with the current value
    templateKeys.forEach((tk) => {
      const value = this.getValueForKey(data, tk);
      this.setValueForKey(tk, value);
    });
  }

  getValueForKey = (data, templateKey) => {
    const keySplit = templateKey.split('.');
    let current = data;
    try {
      keySplit.forEach(key => (current = current[key]));
    } catch (ex) {
      return undefined;
    }

    return current;
  };

  setValueForKey = (templateKey, value, arrayIndex = null) => {
    const keySplit = templateKey.split('.');
    // Get the last key which will hold the value
    const lastKey = keySplit.splice(keySplit.length - 1);
    let current = this.data;

    // Get the last object which holds the lastKey property
    keySplit.forEach((key) => {
      if (!Object.prototype.hasOwnProperty.call(current, key)) {
        current[key] = {};
      }

      current = current[key];
    });

    if (arrayIndex !== null) {
      current[lastKey][arrayIndex] = value;
    } else {
      current[lastKey] = value;
    }
  };

  generateForm = () => {
    const { template, data } = this.props;
    const components = this.components;
    const templateKeys = Object.keys(template);

    const form = templateKeys.map((tk) => {
      const value = this.getValueForKey(data, tk);
      const { type, children } = template[tk];
      const Component = components[type].component;
      const { valueProp, event = {} } = components[type];
      const eventName = typeof event === 'string' ? event : event.name;
      const isArray = Array.isArray(value);
      const errorProps = this.state.errorProps[tk] || (isArray ? [] : {});

      if (Component) {
        return (isArray ? value : [value]).map((v, i) => {
          const props = {
            ...template[tk].props,
          };

          const errProps = isArray ? errorProps[i] : errorProps;

          if (typeof v !== 'undefined') {
            props[valueProp] = v;
          }

          // Setup the change event
          if (eventName) {
            if (!event.function) {
              props[eventName] = (...args) =>
                this.valueChange(tk, event.arg, event.key, isArray ? i : null, ...args);
            } else {
              props[eventName] = (...args) =>
                this.valueChange(tk, 0, null, isArray ? i : null, event.function(...args));
            }
          }

          // Create children
          if (children) {
            const ChildComponent = components[children.type].component;
            const childValues = children.values;

            props.children = childValues.map(childProps => <ChildComponent {...childProps} />);
          }

          // console.log(tk, i, errorProps);

          return <Component key={`${tk}-${i + 1}`} {...props} {...errProps} />;
        });
      }

      return null;
    });

    return form;
  };

  validate = (tk, value, arrayIndex = null) => {
    const { template } = this.props;
    const { validation = null } = template[tk];
    let errorProps = null;

    if (validation) {
      (Array.isArray(validation) ? validation : [validation]).forEach((v) => {
        const match = (typeof v.match === 'function' && v.match(value)) || value.match(v.match);
        if (!match) {
          errorProps = v.errorProps;
        }
      });
    }

    if (!equal(this.state.errorProps[tk], errorProps)) {
      if (arrayIndex === null) {
        this.setState({ errorProps: { ...this.state.errorProps, [tk]: errorProps } });
      } else {
        const arrayErrorProps = { ...this.state.errorProps[tk] };

        arrayErrorProps[arrayIndex] = errorProps;
        this.setState({ errorProps: { ...this.state.errorProps, [tk]: arrayErrorProps } });
      }
    }
  };

  valueChange = async (key, argIndex = 0, argKey = null, arrayIndex = null, ...args) => {
    if (args && args.length) {
      let value = args[argIndex];
      if (argKey) {
        value = this.getValueForKey(value, argKey);
      }

      this.setValueForKey(key, value, arrayIndex);
      // Hack for when setState is fired too quickly and old state is used.
      setTimeout(() => this.validate(key, value, arrayIndex), 0);
    }
  };

  submit = (e) => {
    e.preventDefault();

    if (this.props.onSubmit) {
      this.props.onSubmit(this.data);
    }
  };

  render() {
    const { components, template, data, children, ...props } = this.props;
    return (
      <form {...props} className={this.className} onSubmit={this.submit}>
        {this.generateForm()}
        {children}
      </form>
    );
  }
}
