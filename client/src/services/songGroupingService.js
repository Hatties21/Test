/**
 * Nhóm mảng songs theo trường artist
 * Trả về mảng [{ artist: string, songs: Song[] }]
 */
export const groupSongsByArtist = (songs) => {
  const map = {};
  songs.forEach(song => {
    const artist = song.artist || 'Unknown Artist';
    if (!map[artist]) map[artist] = [];
    map[artist].push(song);
  });
  return Object.entries(map).map(([artist, songs]) => ({ artist, songs }));
};

/**
 * Nhóm mảng songs theo người đăng tải (username)
 * Trả về mảng [{ uploader: string, songs: Song[] }]
 */
export const groupSongsByUploader = (songs) => {
  const map = {};
  songs.forEach(song => {
    const uploader = song.username || 'Unknown User';
    if (!map[uploader]) map[uploader] = [];
    map[uploader].push(song);
  });
  return Object.entries(map).map(([uploader, songs]) => ({ uploader, songs }));
};
