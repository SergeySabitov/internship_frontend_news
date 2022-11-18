import React, { Suspense, useEffect, useState } from "react";
import styles from "./App.module.scss";
import RingStyles from "./components/common/LoaderRing.module.scss";

import { Navigate, Route, Routes } from "react-router-dom";
import News from "./components/News/News";
import NewsDetails from "./components/NewsDetails/NewsDetails";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "./components/redux-store/ReduxStore";
import { newsActions } from "./components/redux-store/NewsSlice";
import { newsType } from "./components/types";
import {
  idsOfNewItems as getIdsOfNewItems,
  fetchItemsByIds,
} from "./components/exportedFunctions";
import { NEWS_CNT } from "./components/exportedFunctions";
import LoaderRing from "./components/common/LoaderRing";
const URL = " https://hacker-news.firebaseio.com";

let timerId: NodeJS.Timeout;
let init = true;

const removingAsks = (stories: number[], asks: number[]) => {
  let storiesWithoutAsks: number[] | undefined = [];
  for (let i = 0, j = 0; i < stories.length; i++) {
    if (stories[i] === asks[j]) {
      j++;
    } else {
      storiesWithoutAsks.push(stories[i]);
    }
    if (storiesWithoutAsks.length > NEWS_CNT - 1) {
      break;
    }
  }
  return storiesWithoutAsks;
};

function App() {
  const newsState = useSelector((state: RootState) => state.news);
  const dispatch = useDispatch();
  const [fetchDataError, setFetchDataError] = useState<boolean>(false);

  const newsDataHandler = (items: newsType[]) => {
    setFetchDataError(false);
    if (items.length > 0) {
      if (newsState.news.length > 0)
        dispatch(newsActions.updateNews({ newNews: items }));
      else dispatch(newsActions.firstLoad({ news: items }));
    } else {
      dispatch(newsActions.setEndOfLoading());
    }
    // все запросы прошли успешно, устанавливаем таймер на след fetch
    startTimer();
  };
  const newsSelect = () => {
    // api HN устроено так, что в newstories есть askstories,
    // потому убираем из newstories все asks
    const requests = [
      fetch(`${URL}/v0/newstories.json?print=pretty`),
      fetch(`${URL}/v0/askstories.json?print=pretty`),
    ];
    Promise.all(requests)
      .then((responses) => Promise.all(responses.map((r) => r.json())))
      .then((items) => {
        const [stories, asks] = items;
        let storiesWithoutAsks: number[] | undefined = removingAsks(
          stories,
          asks
        );

        if (newsState.news.length > 0) {
          storiesWithoutAsks = getIdsOfNewItems(
            // берем только новые новости
            newsState.news,
            storiesWithoutAsks,
            "news"
          );
        }

        fetchItemsByIds(URL, storiesWithoutAsks, newsDataHandler, () => {
          dispatch(newsActions.setEndOfLoading());
          setFetchDataError(true);
        });
      })
      .catch((error) => {
        setFetchDataError(true);
        dispatch(newsActions.setEndOfLoading());
      });
  };

  const updateNews = () => {
    if (fetchDataError) setFetchDataError(false);
    dispatch(newsActions.setStartOfLoading());
    newsSelect();
  };

  const startTimer = () => {
    timerId = setTimeout(() => {
      updateNews();
    }, 60000);
  };
  useEffect(() => {
    if (init) {
      updateNews();
      init = false;
    }
  }, []);

  return (
    <div className={styles.global_container}>
      <section>
        <Suspense fallback={<LoaderRing className={RingStyles.fallback} />}>
          <Routes>
            <Route
              path="/"
              element={
                <News
                  updateNews={() => {
                    clearTimeout(timerId);
                    updateNews();
                  }}
                  fetchDataError={fetchDataError}
                />
              }
            />
            {newsState.news.length > 0 && (
              <Route path="/news-item/:newsId" element={<NewsDetails />} />
            )}
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </Suspense>
      </section>
    </div>
  );
}

export default App;
