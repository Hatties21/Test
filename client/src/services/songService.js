import songApi from '../api/songApi';

const songService = {
  fetchSongs: async (page = 1) => {
    const res = await songApi.getSongs(page);
    return res.data;
  },
  addSong: async (songData) => {
    const res = await songApi.addSong(songData);
    return res.data;
  },
  fetchTopSongs: async (limit = 10) => {
    const res = await songApi.getTopSongs(limit);
    return res.data;
  }
};

export const fetchTopSongs = songService.fetchTopSongs;
export default songService;
