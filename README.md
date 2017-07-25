# React-Formidably

React-Formidably allows you to create dynamic forms from JSON.

## Install
```sh
npm install @pgprojectx/react-formidably
```
or
```sh
yarn add @pgprojectx/react-formidably
```

## Example

Somewhere in your app...
```JavaScript
import { FormProvider } from '@pgprojectx/react-formidably';
import { Input } from '@pgprojectx/react-catalyst';

const formConfig = {
  input: { component: Input, valueProp: 'defaultValue', event: { name: 'onChange' } }
};

class MyApp extends React.Component {

  // ...

  render() {
    return (
      <FormProvider components={formConfig}>
        { /* ... */ }
      </FormProvider>
    )
  }

}
```

Somewhere else in your app...
```JavaScript
import Form from '@pgprojectx/react-formidably';

const formTemplate = {
  field1: { type: 'input', props: { placeholder: 'Field1' } },
  field2: { type: 'input', props: { placeholder: 'Field1' } }
};

const formData = {
  field1: 'Hello',
  field2: 'World!'
};

class MyForm extends React.Component {

  // ...

  submitForm = (data) => {
    console.log(data);
  };

  render() {
    return (
      <Form template={formTemplate} data={formData} onSubmit={this.submitForm}>
        <Button type="submit">Submit</Button>
      </Form>
    )
  }

}
```
