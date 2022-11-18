const NEWS_CNT = 100;

const idsOfNewItems = (
  originItems: { id: number }[],
  newIds: number[],
  mode: string
) => {
  let index = newIds.findIndex((el) => el === originItems[0].id);
  switch (mode) {
    case "news":
      if (index) {
        if (index === 0) {
          return [];
        }
        if (index === -1 || index > NEWS_CNT - 2) {
          return newIds.slice(0, NEWS_CNT);
        }
        return newIds.slice(0, index);
      }
      break;
    case "comments":
      if (index) {
        if (index === 0) {
          return [];
        }
        return newIds.slice(0, index);
      }
  }
};
const fetchItemsByIds = (
  url: string,
  itemsIds: number[] | undefined,
  dataHandler: any,
  errorHandler: any
) => {
  if (itemsIds) {
    const requests = itemsIds.map((id) =>
      fetch(`${url}/v0/item/${id}.json?print=pretty`)
    );
    Promise.all(requests)
      .then((responses) => Promise.all(responses.map((r) => r.json())))
      .then((items) => {
        dataHandler(items);
      })
      .catch((error) => {
        console.log("error: failed to fetch items by id");
        errorHandler();
      });
  } else {
    dataHandler([]);
  }
};

const fromUnixTimeToDate = (unixTime: number) => {
  var date = new Date(unixTime * 1000);
  let month = date.toLocaleString("en-US", { month: "short" }); // December
  let day = date.toLocaleString("en-US", { day: "numeric" }); // 9
  let hours = date.getHours(); // 10
  let minutes = "0" + date.getMinutes();

  let formattedTime =
    month + " " + day + ", " + hours + ":" + minutes.substr(-2);

  return formattedTime;
};
export { idsOfNewItems, fetchItemsByIds, NEWS_CNT, fromUnixTimeToDate };
