type newsTypeForList = {
  id: number;
  title: string;
  time: number;
  by: string;
  score: number;
};
type newsType = {
  id: number;
  url: string;
  title: string;
  time: number;
  by: string;
  descendants: number;
  kids?: number[];
  score: number;
  text?: string;
};

type commentType = {
  id: number;
  time: number;
  by: string;
  parent: number;
  kids?: number[];
  text: string;
};

export type { newsType, newsTypeForList, commentType };
