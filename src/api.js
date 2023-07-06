import Axios from "axios";

const api = Axios.create({
  baseURL: "https://opendata.resas-portal.go.jp/api/v1",
  headers: {
    "X-API-KEY": "MRnrjJIJVltbYzx07kpsbbaXHQKlqZUXhYb4MgIj",
  },
});

export const apiData = {
  locations: () => api.get("/prefectures"),
  population: (code) =>
    api.get(`/population/composition/perYear?cityCode=-&prefCode=${code + 1}`),
};
