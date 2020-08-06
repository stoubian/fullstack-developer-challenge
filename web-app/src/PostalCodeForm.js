import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Form, Dropdown } from 'semantic-ui-react';

import localStorageHelper from './localstorage-helper';

class PostalCodeForm extends Component {
  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(submitEvent) {
    submitEvent.preventDefault();
    this.props.onSubmittedData();
  }

  render() {
    const { loading, postalCodeSearchValue, onChangedPostalCode } = this.props;

    const searchHistory = localStorageHelper.readItem('searchHistory');
    const dropdownOptions = searchHistory.map((element, i) => ({key: i, text: element, value: element}))

    return (
      <Form onSubmit={this.handleSubmit}>
        <Form.Input
          fluid
          focus
          action={
            <Dropdown
              button
              basic
              floating
              onChange={onChangedPostalCode}
              options={dropdownOptions}
              defaultValue=""
            />
          }
          onChange={onChangedPostalCode}
          placeholder="Search Location by Postal Code…"
          value={postalCodeSearchValue}
        />
        <Form.Button content="Search" loading={loading} />
      </Form>
    );
  }
}

PostalCodeForm.propTypes = {
  loading: PropTypes.bool,
  postalCodeSearchValue: PropTypes.string,
  onSubmittedData: PropTypes.func.isRequired,
  onChangedPostalCode: PropTypes.func.isRequired,
};

PostalCodeForm.defaultProps = {
  loading: false,
  postalCodeSearchValue: '',
};

export default PostalCodeForm;
