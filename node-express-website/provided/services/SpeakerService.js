const fs = require("fs");
const util = require("util");

/**
 * We want to use async/await with fs.readFile - util.promisfy gives us that
 */
const readFile = util.promisify(fs.readFile);

/**
 * Logic for fetching speakers information
 */
class SpeakerService {
  /**
   * Constructor
   * @param {*} datafile Path to a JSOn file that contains the speakers data
   */
  constructor(datafile) {
    this.datafile = datafile;
  }

  /**
   * Returns a list of speakers name and short name
   */
  async getNames() {
    const data = await this.getData();

    // We are using map() to transform the array we get into another one
    const namesArray = data.map(speaker => ({
      name: speaker.name,
      shortname: speaker.shortname
    }));

    return namesArray;
  }

  /**
   * Get all artwork
   */
  async getAllArtwork() {
    const data = await this.getData();

    // Array.reduce() is used to traverse all speakers and
    // create an array that contains all artwork
    const artworkArray = data.reduce((acc, elm) => {
      if (elm.artwork) {
        // eslint-disable-next-line no-param-reassign
        acc = [...acc, ...elm.artwork];
      }
      return acc;
    }, []);

    return artworkArray;
  }

  /**
   * Get all artwork of a given speaker
   * @param {*} shortname The speakers short name
   */
  async getArtworkForSpeaker(shortname) {
    const data = await this.getData();

    const speaker = data.find(elm => elm.shortname === shortname);
    if (!speaker || !speaker.artwork) return null;

    return speaker.artwork;
  }

  /**
   * Get speaker information provided a shortname
   * @param {*} shortname
   */
  async getSpeaker(shortname) {
    const data = await this.getData();

    const speaker = data.find(elm => elm.shortname === shortname);
    if (!speaker) return null;

    const speakerData = {
      title: speaker.title,
      name: speaker.name,
      shortname: speaker.shortname,
      description: speaker.description
    };

    return speakerData;
  }

  /**
   * Returns a list of speakers with only the basic information
   */
  async getListShort() {
    const data = await this.getData();

    const shortDataArray = data.map(speaker => {
      return {
        name: speaker.name,
        shortname: speaker.shortname,
        title: speaker.title
      };
    });

    return shortDataArray;
  }

  /**
   * Get a list of speakers
   */
  async getList() {
    const data = await this.getData();

    const longDataArray = data.map(speaker => ({
      name: speaker.name,
      shortname: speaker.shortname,
      title: speaker.title,
      summary: speaker.summary
    }));

    return longDataArray;
  }

  /**
   * Fetches speakers data from the JSON file provided to the constructor
   */
  async getData() {
    const data = await readFile(this.datafile, "utf8");

    const parsedData = data ? JSON.parse(data) : [];

    return parsedData;
  }
}

module.exports = SpeakerService;
