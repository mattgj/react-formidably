/* eslint-disable import/no-extraneous-dependencies, no-unused-vars */
import React from 'react';
import { storiesOf, action, linkTo } from '@kadira/storybook';
import { Input, Button, Dropdown, DropdownItem } from '@pgprojectx/react-catalyst';
// import Button from './Button';
// import Welcome from './Welcome';
import Form, { FormProvider } from '../lib';

import './styles.css';

const formComponents = {
  button: { component: Button, valueProp: 'children' },
  input: {
    component: Input,
    valueProp: 'defaultValue',
    event: { name: 'onChange', arg: 0, key: null },
  },
  input2: {
    component: Input,
    valueProp: 'defaultValue',
    event: { name: 'onChange', function: v => v },
  },
  select: { component: Dropdown, valueProp: 'defaultValue', event: 'onChange' },
  option: { component: DropdownItem },
};

const formTemplate = {
  field1: { type: 'button' },
  field2: {
    type: 'input',
    props: { placeholder: 'Field2', required: true },
    validation: [{ match: /^test$/, errorProps: { error: 'Invalid value' } }],
  },
  field3: {
    type: 'input',
    props: { placeholder: 'Field3' },
    validation: [{ match: /^test$/, errorProps: { error: 'Invalid value' } }],
  },
  'field4.field5': { type: 'input', props: { placeholder: 'Field5' } },
  'field4.field6': { type: 'input2', props: { placeholder: 'Field6' } },
  field7: {
    type: 'select',
    children: {
      type: 'option',
      values: [
        { value: 'test', children: 'Test Item' },
        { value: 'test2', children: <strong>Test Item #2</strong> },
      ],
    },
    props: {
      placeholder: 'Field7',
    },
  },
};

const data = {
  field1: 'Button1',
  field2: ['a', 'b'],
  field3: 'field3',
  field4: {
    field5: 'field5 text',
  },
  field7: 'test2',
};

// storiesOf('Welcome', module).add('to Storybook', () => <Welcome showApp={linkTo('Button')} />);

storiesOf('Form', module).add('Test', () =>
  <FormProvider components={formComponents} defaultClass="form">
    <div>
      <Form template={formTemplate} data={data} onSubmit={formData => console.log(formData)}>
        <Button type="submit">Submit</Button>
      </Form>
    </div>
  </FormProvider>,
);
