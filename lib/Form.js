import React from 'react';
import PropTypes from 'prop-types';
import FormComponent from './FormComponent';
import { getValueForKey, setValueForKey } from './util';

export default class Form extends React.PureComponent {
  static propTypes = {
    components: PropTypes.shape({}),
    template: PropTypes.shape({}).isRequired,
    data: PropTypes.shape({}),
    onSubmit: PropTypes.func,
    onChange: PropTypes.func,
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
      const value = getValueForKey(data, tk);
      setValueForKey(this.data, tk, value);
    });
  }

  generateForm = () => {
    const { template, data } = this.props;
    const components = this.components;
    const templateKeys = Object.keys(template);

    const form = templateKeys.map((tk) => {
      const value = getValueForKey(data, tk);
      const { type, children } = template[tk];
      const Component = components[type].component;
      const childComponent = children && children.type ? components[children.type] : null;
      const isArray = Array.isArray(value);

      if (Component) {
        return (isArray ? value : [value]).map((v, i) =>
          <FormComponent
            form={this}
            component={components[type]}
            childComponent={childComponent}
            template={template[tk]}
            templateKey={tk}
            valueIndex={isArray ? i : null}
            value={v}
            onChange={this.change}
            key={`${tk}-${i + 1}`}
          />,
        );
      }

      return null;
    });

    return form;
  };

  submit = (e) => {
    e.preventDefault();

    if (this.props.onSubmit) {
      this.props.onSubmit(this.data);
    }
  };

  change = () => {
    if (this.props.onChange) {
      this.props.onChange(this.data);
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
