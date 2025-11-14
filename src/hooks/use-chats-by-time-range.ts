import type { Thread } from "@/lib/threads-store/threads/utils";

const MS_PER_DAY = 24 * 60 * 60 * 1000;
const DAYS_30 = 30;

type ThreadsByTimeRange = {
  today: Thread[];
  yesterday: Thread[];
  lastThirtyDays: Thread[];
  history: Thread[];
};

export function useThreadsByTimeRange<T extends Thread>(
  threadsArray: T[]
): ThreadsByTimeRange {
  const now = Date.now();

  const timeBoundaries = {
    oneDayAgo: now - MS_PER_DAY,
    twoDaysAgo: now - 2 * MS_PER_DAY,
    thirtyDaysAgo: now - DAYS_30 * MS_PER_DAY,
  };

  const filterThreadsByTimeRange = (startTime: number, endTime?: number) =>
    threadsArray.filter((thread) => {
      const threadTime = thread.updatedAt ?? 0;
      return endTime
        ? threadTime >= startTime && threadTime < endTime
        : threadTime >= startTime;
    });

  const groups = {
    today: filterThreadsByTimeRange(timeBoundaries.oneDayAgo),
    yesterday: filterThreadsByTimeRange(
      timeBoundaries.twoDaysAgo,
      timeBoundaries.oneDayAgo
    ),
    lastThirtyDays: filterThreadsByTimeRange(
      timeBoundaries.thirtyDaysAgo,
      timeBoundaries.twoDaysAgo
    ),
    history: filterThreadsByTimeRange(0, timeBoundaries.thirtyDaysAgo),
  };

  return groups;
}
