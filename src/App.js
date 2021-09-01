import React from 'react';
import './App.css';
import { mockProducts } from './data/product';

class SearchBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filterText: '',
      inStockOnly: false
    }    
    this.handleChange = this.handleChange.bind(this);
    this.handleIsOnStockChange = this.handleIsOnStockChange.bind(this);
  }

  handleChange(event) {
    this.setState({
      filterText: event.target.value
    }, () => {
      this.props.onFilterTextChange(this.state.filterText);
    });
  }

  handleIsOnStockChange(event) {
    this.setState({
      inStockOnly: event.target.checked
    }, () => {
      this.props.onStockChange(this.state.inStockOnly);
    });
  }

  render() {
    return (
      <div className="search-bar">
        <form>
          <fieldset>
            <div className="search-bar--input">
              <input
                className="search-bar--input-text" 
                type="text"
                value={this.state.filterText}
                onChange={this.handleChange} ></input>
            </div>
            <div className="search-bar--input">
              <input 
                type="checkbox"
                value={this.state.inStockOnly}
                onChange={this.handleIsOnStockChange}></input>
              <div className="search-bar--input-checkbox">
                Only show products in Stock
              </div>
            </div>
          </fieldset>
        </form>
      </div>
    );
  }
}

class ProductRow extends React.Component {
  constructor(props) {
    super(props);
  }

  renderProducts(products) {
    const productsList = products.map((product) => (
      <div className="product-row--product" key={product.name}>
        <div className="product-row--product-name">
          { product.name }
        </div>
        <div className="product-row--product-price">
          { product.price }
        </div>
      </div>
    ));
    return productsList;
  }

  render() {
    return (
      <div className="product-row">
        { this.renderProducts(this.props.products) }
      </div>
    );
  }
}

class ProductCategoryRow extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="product-category-row">
        {this.props.categoryName}
      </div>
    );
  }
}

class ProductTable extends React.Component {
  constructor(props) {
    super(props);
  }

  renderProducsAndCategories(productsByCategory) {
    const categories = [];
    for (const [categoy, value] of Object.entries(productsByCategory)) {
      categories.push((
        <div key={categoy}>
          <ProductCategoryRow categoryName={categoy} />
          <ProductRow products={value} />
        </div>
      ));
    }
    return categories;
  }

  render() {
    return (
      <div className="product-table">
        <div className="product-table--header">
          <div className="product-table--header-title">Name</div>
          <div className="product-table--header-title">Price</div>
        </div>
        {
          this.renderProducsAndCategories(
            this.props.productsByCategory
          )
        }
      </div>
    );
  }
}

class FilterableProductTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      filterText: '',
      isOnStock: false,
      products: mockProducts
    };
    this.handleFilterTextChange = this.handleFilterTextChange.bind(this);
    this.handleStockChange = this.handleStockChange.bind(this);
  }

  handleFilterTextChange(filterText) {
    this.setState({ filterText });
  }

  handleStockChange(isOnStock) {
    this.setState({ isOnStock }, () => {
      this.filterProductsByCategory();
    });
  }

  filterProductsByCategory() {
    const isOnStock = this.state.isOnStock;
    const productsInStock = isOnStock ? 
      this.state.products.filter((product) =>  product.stocked) :
      this.state.products;
    const filterText = this.state.filterText;
    const productsFilterByCategory = filterText ?
      productsInStock.filter((product) => product.name.indexOf(filterText) !== -1) :
      productsInStock
    return this.getProductsByCategory(productsFilterByCategory);
  }

  getProductsByCategory(products) {
    const categories = {};
    products.forEach( product => {
      if (categories[product.category]) {
        categories[product.category].push(product);
      } else {
        categories[product.category] = [product];
      }
    });
    return categories;
  }

  render() {
    return (
      <div className="filterable-product-table">
        <SearchBar
          onStockChange={this.handleStockChange}
          onFilterTextChange={this.handleFilterTextChange} />
        <ProductTable
          productsByCategory={this.filterProductsByCategory()}>
        </ProductTable>
      </div>
    );
  }
}

function App() {
  return (
    <FilterableProductTable />
  );
}

export default App;
