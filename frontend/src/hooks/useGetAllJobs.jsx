import { setAllJobs } from '@/redux/jobSlice'
import { JOB_API_END_POINT } from '@/utils/constant'
import axios from 'axios'
import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { toast } from 'sonner'

const useGetAllJobs = () => {
    const dispatch = useDispatch();
    const {searchedQuery} = useSelector(store=>store.job);
    
    useEffect(() => {
        const fetchAllJobs = async () => {
            try {
                // Remove withCredentials to allow non-authenticated requests
                const res = await axios.get(`${JOB_API_END_POINT}/get?keyword=${searchedQuery}`);
                if(res.data.success) {
                    dispatch(setAllJobs(res.data.jobs));
                }
            } catch (error) {
                console.error("Failed to fetch jobs:", error);
                toast.error("Failed to load jobs. Please try again later.");
                // Set empty array on error to avoid showing stale data
                dispatch(setAllJobs([]));
            }
        }
        fetchAllJobs();
    }, [dispatch, searchedQuery]) // Added searchedQuery as dependency
}

export default useGetAllJobs