import apiClient from './apiClient';

const albumApi = {
  // Lấy danh sách album, hỗ trợ phân trang
  getAlbums: (page = 1, limit = 25) =>
    apiClient.get('/albums', { params: { page, limit } }),

  // Lấy chi tiết 1 album
  getAlbumById: (albumId) =>
    apiClient.get(`/albums/${albumId}`),

  // Tạo mới album
  createAlbum: (albumData) =>
    apiClient.post('/albums', albumData),

  // Cập nhật album
  updateAlbum: (albumId, albumData) =>
    apiClient.put(`/albums/${albumId}`, albumData),

  // Xóa album
  deleteAlbum: (albumId) =>
    apiClient.delete(`/albums/${albumId}`),
};

export default albumApi;
