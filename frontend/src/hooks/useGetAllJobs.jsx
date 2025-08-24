import { setAllJobs } from '@/redux/jobSlice'
import { JOB_API_END_POINT } from '@/utils/constant'
import axios from 'axios'
import { useEffect, useCallback, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'sonner'

const useGetAllJobs = () => {
    const dispatch = useDispatch();
    const { searchedQuery } = useSelector(store => store.job);
    const abortControllerRef = useRef(null);
    const lastFetchTimeRef = useRef(0);
    const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes cache

    const fetchAllJobs = useCallback(async (forceRefresh = false) => {
        try {
            // Cancel previous request if it exists
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }

            // Check cache duration
            const now = Date.now();
            if (!forceRefresh && (now - lastFetchTimeRef.current) < CACHE_DURATION) {
                return; // Use cached data
            }

            // Create new abort controller
            abortControllerRef.current = new AbortController();

            // Explicitly set withCredentials to false for public job fetching
            const res = await axios.get(`${JOB_API_END_POINT}/get?keyword=${searchedQuery}`, {
                withCredentials: false,
                signal: abortControllerRef.current.signal,
                timeout: 8000, // 8 second timeout for jobs
            });

            if (res.data.success) {
                dispatch(setAllJobs(res.data.jobs));
                lastFetchTimeRef.current = now;
            }
        } catch (error) {
            // Don't show error for aborted requests
            if (axios.isCancel(error)) {
                return;
            }

            console.error("Failed to fetch jobs:", error);
            
            // Only show toast for actual errors, not timeouts
            if (error.code !== 'ECONNABORTED') {
                toast.error("Failed to load jobs. Please try again later.");
            }
            
            // Set empty array on error to avoid showing stale data
            dispatch(setAllJobs([]));
        }
    }, [dispatch, searchedQuery]);

    useEffect(() => {
        fetchAllJobs();
        
        // Cleanup function to abort request on unmount
        return () => {
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, [fetchAllJobs]);

    // Return refresh function for manual refresh
    const refreshJobs = useCallback(() => {
        fetchAllJobs(true);
    }, [fetchAllJobs]);

    return { refreshJobs };
}

export default useGetAllJobs