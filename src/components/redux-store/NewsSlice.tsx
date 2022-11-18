import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { newsType } from "../types";
import { NEWS_CNT } from "../exportedFunctions";

// type initAuthState = {
//     isAuth: boolean;
//     token: string | null;
//     userNickname: string | null;
//     userEmail: string | null,
//     isFirstTime: boolean | null
// }
type initType = {
  news: newsType[];
  isLoading: boolean;
};
const initialState: initType = { news: [], isLoading: false };

const newsSlice = createSlice({
  name: "news",
  initialState,
  reducers: {
    firstLoad: (state, { payload }: PayloadAction<{ news: newsType[] }>) => {
      state.isLoading = false;
      state.news = [...payload.news];
    },
    updateNews: (
      state,
      { payload }: PayloadAction<{ newNews: newsType[] }>
    ) => {
      if (payload.newNews.length < NEWS_CNT)
        state.news = [
          ...payload.newNews,
          ...state.news.slice(0, NEWS_CNT - payload.newNews.length),
        ];
      else state.news = [...payload.newNews.slice(0, NEWS_CNT)];
      state.isLoading = false;
    },
    updateItem: (state, { payload }: PayloadAction<{ newNews: newsType }>) => {
      const index = state.news.findIndex((el) => el.id === payload.newNews.id);
      if (index !== -1) state.news[index] = payload.newNews;
    },
    setStartOfLoading: (state) => {
      state.isLoading = true;
    },
    setEndOfLoading: (state) => {
      state.isLoading = false;
    },
  },
});

export default newsSlice;
export const newsActions = newsSlice.actions;
