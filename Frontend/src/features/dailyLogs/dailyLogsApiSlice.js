import { createSelector, createEntityAdapter } from "@reduxjs/toolkit";
import { apiSlice } from "../../app/api/apiSlice";

const dailyLogsAdapter = createEntityAdapter({});

const initialState = dailyLogsAdapter.getInitialState();

export const dailyLogsApiSlice = apiSlice.injectEndpoints({
  endpoints: builder => ({
    getDailyLogs: builder.query({
      query: (userId) => ({
        url: `/dailylogs/${userId}`,
        validateStatus: (response, result) => {
          return response.status === 200 && !result.isError;
        }
      }),
      transformResponse: responseData => {
        const loadedDailyLogs = responseData.map(dailyLog => {
          dailyLog.id = dailyLog._id;
          return dailyLog;
        });
        return dailyLogsAdapter.setAll(initialState, loadedDailyLogs);
      },
      providesTags: (result, error, arg) => {
        if (result?.ids) {
          return [
            { type: "DailyLog", id: "LIST" },
            ...result.ids.map(id => ({ type: "DailyLog", id }))
          ];
        } 
        else {
          return [{ type: "DailyLog", id: "LIST" }];
        }
      }
    }),
    addNewDailyLog: builder.mutation({
      query: ({ userId, date, calories, protein }) => ({
        url: `/dailylogs/${userId}`,
        method: "POST",
        body: { date, calories, protein }
      }),
      invalidatesTags: [
        { type: "DailyLog", id: "LIST" }
      ]
    }),
    updateDailyLog: builder.mutation({
      query: ({ userId, id, date, calories, protein }) => ({
        url: `/dailylogs/${userId}`,
        method: "PATCH",
        body: { id, date, calories, protein }
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "DailyLog", id: arg.id }
      ]
    }),
    deleteDailyLog: builder.mutation({
      query: ({ userId, id }) => ({
        url: `/dailylogs/${userId}`,
        method: "DELETE",
        body: { id }
      }),
      invalidatesTags: (result, error, arg) => [
        { type: "DailyLog", id: arg.id }
      ]
    }),
  }),
});

export const {
  useGetDailyLogsQuery,
  useAddNewDailyLogMutation,
  useUpdateDailyLogMutation,
  useDeleteDailyLogMutation
 } = dailyLogsApiSlice;

export const selectDailyLogsResult = dailyLogsApiSlice.endpoints.getDailyLogs.select();

const selectDailyLogsData = createSelector(
  selectDailyLogsResult,
  dailyLogsResult => dailyLogsResult.data
);

export const {
  selectAll: selectAllDailyLogs,
  selectById: selectDailyLogById,
  selectIds: selectDailyLogIds
} = dailyLogsAdapter.getSelectors(state => selectDailyLogsData(state) ?? initialState);
