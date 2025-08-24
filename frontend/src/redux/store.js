import { combineReducers, configureStore } from "@reduxjs/toolkit";
import authSlice from "./authSlice";
import jobSlice from "./jobSlice";
import {
    persistStore,
    persistReducer,
    FLUSH,
    REHYDRATE,
    PAUSE,
    PERSIST,
    PURGE,
    REGISTER,
} from 'redux-persist'
import storage from 'redux-persist/lib/storage'
import companySlice from "./companySlice";
import applicationSlice from "./applicationSlice";

// Selective persistence config for better performance
const persistConfig = {
    key: 'root',
    version: 1,
    storage,
    // Only persist essential data
    whitelist: ['auth', 'company'],
    // Don't persist job data as it changes frequently
    blacklist: ['job', 'application']
}

const rootReducer = combineReducers({
    auth: authSlice,
    job: jobSlice,
    company: companySlice,
    application: applicationSlice
})

const persistedReducer = persistReducer(persistConfig, rootReducer)

const store = configureStore({
    reducer: persistedReducer,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
            },
            // Performance optimizations
            immutableCheck: false, // Disable immutable checks in production
            serializableCheck: {
                ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
                ignoredPaths: ['job.allJobs', 'application.applications'], // Ignore frequently changing data
            },
        }),
    // Performance optimizations
    devTools: process.env.NODE_ENV !== 'production',
    preloadedState: undefined,
});

export default store;