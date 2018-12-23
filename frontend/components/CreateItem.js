import React, { Component } from "react";
import { Mutation } from "react-apollo";
import Router from "next/router";
import Form from "./styles/Form";
import formatMoney from "../lib/formatMoney";
import gql from "graphql-tag";
import Error from "./ErrorMessage";
import styled from "styled-components";

const UploadedImage = styled.div`
  width: 250px;
  height: 250px;

  img {
    max-width: 100%;
    max-height: 100%;
  }
`;

const CREATE_ITEM_MUTATION = gql`
  mutation CREATE_ITEM_MUTATION(
    $title: String!
    $description: String!
    $price: Int!
    $image: String
    $largeImage: String
  ) {
    createItem(
      title: $title
      description: $description
      price: $price
      image: $image
      largeImage: $largeImage
    ) {
      id
    }
  }
`;

class CreateItem extends Component {
  state = {
    title: "",
    description: "",
    image: "",
    largeImage: "",
    price: 0
  };
  handleChange = e => {
    const { name, type, value } = e.target;
    const val = type === "number" ? parseFloat(value) : value;

    this.setState({
      [name]: val
    });
  };
  uploadFile = async e => {
    const file = e.target.files[0];

    const data = new FormData();

    data.append("file", file);
    data.append("upload_preset", "sickfits");

    const response = await fetch(
      "https://api.cloudinary.com/v1_1/dwuxxsif6/image/upload",
      {
        method: "POST",
        body: data
      }
    );

    const uploadedFile = await response.json();

    this.setState({
      image: uploadedFile.secure_url,
      largeImage: uploadedFile.eager[0].secure_url
    });
  };
  render() {
    return (
      <Mutation mutation={CREATE_ITEM_MUTATION} variables={this.state}>
        {(createItem, { loading, error }) => (
          <Form
            onSubmit={async e => {
              e.preventDefault();
              const response = await createItem();
              Router.push({
                pathname: "/item",
                query: { id: response.data.createItem.id }
              });
            }}
          >
            <h2>Sell an Item</h2>
            <Error error={error} />
            <fieldset disabled={loading} aria-busy={loading}>
              <label htmlFor="image">
                Image
                <input
                  type="file"
                  id="image"
                  name="image"
                  placeholder="image"
                  onChange={this.uploadFile}
                  required
                />
                {this.state.image && (
                  <UploadedImage>
                    <img src={this.state.image} alt={this.state.title} />
                  </UploadedImage>
                )}
              </label>
              <label htmlFor="title">
                Title
                <input
                  type="text"
                  id="title"
                  name="title"
                  placeholder="Title"
                  value={this.state.title}
                  onChange={this.handleChange}
                  required
                />
              </label>
              <label htmlFor="price">
                Price
                <input
                  type="number"
                  id="price"
                  name="price"
                  placeholder="Price"
                  value={this.state.price}
                  onChange={this.handleChange}
                  required
                />
              </label>
              <label htmlFor="description">
                Description
                <textarea
                  type="text"
                  id="description"
                  name="description"
                  placeholder="Description"
                  value={this.state.description}
                  onChange={this.handleChange}
                  required
                />
              </label>
              <button type="submit">Submit</button>
            </fieldset>
          </Form>
        )}
      </Mutation>
    );
  }
}

export default CreateItem;
export { CREATE_ITEM_MUTATION };
