const axios = require('axios');

class CoinAPI {
  constructor() {
    this.API_URL = 'https://api.coindesk.com/v1/bpi/historical/close.json';
  }

  static formatDate(date) {
    const dateObj = new Date(date);
    const year = dateObj.getFullYear();
    let month = `${dateObj.getMonth() + 1}`;
    let day = `${dateObj.getDate()}`;

    if (month.length < 2) month = `0${month}`;
    if (day.length < 2) day = `0${day}`;

    return [year, month, day].join('-');
  }

  static getRange(years) {
    const today = new Date();
    const end = CoinAPI.formatDate(today);

    const pastDate = today.setFullYear(today.getFullYear() - years);
    const start = CoinAPI.formatDate(pastDate);

    return { start, end };
  }

  // Generic function that fetches the closing bitcoin dates of the last month from a public API
  async fetch() {
    const { start, end } = CoinAPI.getRange(5);

    const url = `${this.API_URL}?start=${start}&end=${end}`;

    const response = await axios.get(url);

    return response.data;
  }
}

module.exports = CoinAPI;
