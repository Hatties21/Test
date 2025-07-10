import apiClient from "../api/apiClient";

// File: client/src/services/albumService.js
export const getAlbums = async () => {
  return await apiClient.get("/albums");
};

export const getSongsByAlbum = async (albumId) => {
  return await apiClient.get(`/albums/${albumId}/songs`);
};