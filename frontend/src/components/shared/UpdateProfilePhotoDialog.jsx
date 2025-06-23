import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { useDispatch, useSelector } from 'react-redux';
import { USER_API_END_POINT } from '@/utils/constant';
import axios from 'axios';
import { toast } from 'sonner';
import { setUser } from '@/redux/authSlice';

const UpdateProfilePhotoDialog = ({ open, onOpenChange }) => {
    const [file, setFile] = useState(null);
    const { user } = useSelector(store => store.auth);
    const dispatch = useDispatch();

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    
    const handleSubmit = async () => {
        if (!file) {
            toast.error("Please select a file.");
            return;
        }

        const formData = new FormData();
        formData.append("profilePhoto", file);

        try {
            const res = await axios.post(`${USER_API_END_POINT}/profile/update`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
                withCredentials: true
            });

            if (res.data.success) {
                dispatch(setUser(res.data.user));
                toast.success(res.data.message);
                onOpenChange(false);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message);
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent aria-describedby="dialog-description">
                <DialogHeader>
                    <DialogTitle>Update Profile Photo</DialogTitle>
                    <DialogDescription id="dialog-description">
                        Select a new photo to update your profile picture.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <Input type="file" onChange={handleFileChange} />
                </div>
                <DialogFooter>
                    <Button onClick={handleSubmit}>Update</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default UpdateProfilePhotoDialog;
