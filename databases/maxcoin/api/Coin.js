const axios = require('axios');

class CoinAPI {
  constructor() {
    this.API_URL = 'https://api.coindesk.com/v1/bpi/historical/close.json';
  }

  formatDate(date) {
    const dateObj = new Date(date);
    const month = '' + (dateObj.getMonth() + 1);
    const day = '' + dateObj.getDate();
    const year = dateObj.getFullYear();

    if (month.length < 2) month = '0' + month;
    if (day.length < 2) day = '0' + day;

    return [year, month, day].join('-');
  }

  getRange(years) {
    const today = new Date();
    const end = this.formatDate(today);

    const pastDate = today.setFullYear(today.getFullYear() - years);
    const start = this.formatDate(pastDate);

    return { start, end };
  }

  // Generic function that fetches the closing bitcoin dates of the last month from a public API
  async fetch() {
    const { start, end } = this.getRange(5);

    const url = `${this.API_URL}?start=${start}&end=${end}`;

    const response = await axios.get(url);

    return response.data;
  }
}

module.exports = CoinAPI;