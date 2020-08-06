import React, { Component } from 'react';
import { Container, Divider, Loader } from 'semantic-ui-react';

import PostalCodeForm from './PostalCodeForm';
import LocationSearchResults from './LocationSearchResults';
import localStorageHelper from './localstorage-helper'

const initialState = {
  loading: false,
  locations: null,
  postalCodeSearchValue: '',
};

const MAX_SEARCH_HISTORY = 5

class LocationSearch extends Component {
  constructor(props) {
    super(props);

    this.handleSubmittedData = this.handleSubmittedData.bind(this);
    this.handleChangedPostalCode = this.handleChangedPostalCode.bind(this);

    this.state = { ...initialState };
  }

  handleSubmittedData() {
    this.setState({ loading: true }, async () => {
      try {
        const {postalCodeSearchValue} = this.state;
        localStorageHelper.storeItem('searchHistory', postalCodeSearchValue, MAX_SEARCH_HISTORY);

        const response = await fetch(
          `${process.env.REACT_APP_API_ORIGIN}/locations?postalCode=${postalCodeSearchValue}`
        );

        if (!response.ok) {
          throw new Error(response.error());
        }

        const data = await response.json();

        this.setState({ ...initialState, locations: data });
      } catch (err) {
        this.setState({ loading: false });
      }
    });
  }

  handleChangedPostalCode(changeEvent, { value }) {
    this.setState({ postalCodeSearchValue: value });
  }

  render() {
    const { loading, locations, postalCodeSearchValue } = this.state;

    return (
      <Container>
        <PostalCodeForm
          loading={loading}
          postalCodeSearchValue={postalCodeSearchValue}
          onSubmittedData={this.handleSubmittedData}
          onChangedPostalCode={this.handleChangedPostalCode}
        />
        <Divider hidden />
        {loading && <Loader active />}
        {locations && (
          <LocationSearchResults
            locations={locations}
            postalCodeSearchValue={postalCodeSearchValue}
          />
        )}
      </Container>
    );
  }
}

export default LocationSearch;
