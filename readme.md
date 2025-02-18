# Lighthouse Backend Challenge

Checkout feature of a shopping cart node server

## Machine requsites

- Node 21
- VS Code (optional) - To use _REST Client_ extension

## Run Locally

Clone the project

```bash
  git clone https://github.com/PedroMarianoAlmeida/lighthouseBackendChallenge
```

Go to the project directory

```bash
  cd lighthouseBackendChallenge
```

Install dependencies

```bash
  npm install
```

Start the server

```bash
  npm run dev
```

## API Reference

### Get the items and price for product

```http
  POST /checkout
```

#### Request Headers

| Header         | Type     | Description                              |
| :------------- | :------- | :--------------------------------------- |
| `Content-Type` | `string` | **Required**. Must be `application/json` |

#### Request Body

| Field         | Type      | Description                             |
| :------------ | :-------- | :-------------------------------------- |
| `items`       | `array`   | **Required**. List of items to checkout |
| `items[].sku` | `string`  | **Required**. The SKU of the product    |
| `items[].qtd` | `integer` | **Required**. Quantity of the product   |

##### Node

Check `src/requests.rest` for a complete API samples (to run on VS Code, install the _REST Client_ extension)

## Authors

- [Pedro Almeida](https://www.linkedin.com/in/pedroprogrammer/)

## Running Tests

To run tests, run the following command

```bash
  npm run test
```

## Improvements

- Products and Promotions should be in a database and not as a variable hard coded
- Add integration tests (I mannualy check all calls on `src/requests.rest`)
- Create a production URL to be used
- Add a products endpoint (to fetch all products and original prices)
