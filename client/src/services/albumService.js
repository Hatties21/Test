import albumApi from '../api/albumApi';

export const fetchAlbums = async (page, limit) => {
  const res = await albumApi.getAlbums(page, limit);
  return res.data;
};

export const fetchAlbum = async (id) => {
  const res = await albumApi.getAlbumById(id);
  return res.data;
};

export const createAlbum = async (data) => {
  const res = await albumApi.createAlbum(data);
  return res.data;
};

export const updateAlbum = async (id, data) => {
  const res = await albumApi.updateAlbum(id, data);
  return res.data;
};

export const deleteAlbum = async (id) => {
  const res = await albumApi.deleteAlbum(id);
  return res.data;
};
