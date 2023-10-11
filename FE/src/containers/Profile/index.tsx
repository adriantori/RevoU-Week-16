import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom";
import { useTokenChecker } from "../../hooks";
import { Card } from "antd";

interface ProfileData {
    id: string;
    name: string;
    email: string;
}

interface ResponseProfileData {
    data: ProfileData;
}

const Profile: React.FC = () => {
    const navigate = useNavigate();
    const [idProfile, setIdProfile] = useState<string>('')
    const [nameProfile, setNameProfile] = useState<string>('')
    const [emailProfile, setEmailProfile] = useState<string>('')

    const token = localStorage.getItem('token')
    useTokenChecker(token)

    const getProfileData = async () => {
        const fetching = await fetch('https://mock-api.arikmpt.com/api/user/profile', {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        })
        const response: ResponseProfileData = await fetching.json();
        setIdProfile(response.data.id);
        setNameProfile(response.data.name)
        setEmailProfile(response.data.email)
    }

    useEffect(
        () => {
            getProfileData()
        },
        []
    )

    return (
        <Card title="Your Profile" headStyle={{ textAlign: 'center' }} style={{ width: '60vw' }}>
            <a onClick={() => { navigate('/') }}>Back to Main Page</a>

            <h2>Profile Page</h2>
            <p>
            ID: {idProfile}<br/>
            Name: {nameProfile}<br/>
            Email: {emailProfile}<br/>
            </p>
        </Card>
    );
}

export default Profile