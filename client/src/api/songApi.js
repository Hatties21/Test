import apiClient from './apiClient';

const songApi = {
  getSongs: (page = 1, limit = 25) =>
    apiClient.get('/songs', { params: { page, limit } }),
  addSong: (songData) =>
    apiClient.post('/songs', songData),
  likeSong: (songId) => apiClient.post(`/songs/${songId}/like`),
  unlikeSong: (songId) => apiClient.post(`/songs/${songId}/unlike`),
  getLikedSongs: () => apiClient.get("/songs/liked"),
  isLiked: (songId) => apiClient.get(`/songs/${songId}/isLiked`),
  searchSongs: async (query) => {
    return await apiClient.get(`/songs/search?q=${encodeURIComponent(query)}`);
  },
  getSongById: (songId) => apiClient.get(`/songs/${songId}`),
  getRandomSong: () => apiClient.get('/songs/random'),
};

export default songApi;

