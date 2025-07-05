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
};

export default songApi;

