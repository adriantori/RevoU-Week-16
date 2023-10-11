import { useCallback, useContext, useEffect } from 'react';
import { Button, Card, Space, Table } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { useNavigate } from 'react-router-dom';
import { AppContext } from '../../Provider/AppProvider';
import { Notification } from '../../components'
import { useTokenChecker } from '../../hooks';

interface Category {
    key: string;
    id: string;
    name: string;
    is_active: boolean;
}

interface GetCategoryResponse {
    data: Category[],
    currentPage: number,
    totalItem: number,
    totalPage: number
}

const Datas: React.FC = () => {

    const { categories, setCategories } = useContext(AppContext);
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    useTokenChecker(token)

    const getCategoryList = useCallback(
        async () => {
            const fetching = await fetch('https://mock-api.arikmpt.com/api/category', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            const response: GetCategoryResponse = await fetching.json();

            const categorizedData = response.data ? response.data.map(category => ({
                ...category,
                key: category.id
            })) : [];
            setCategories(categorizedData ?? []);
        },
        [setCategories, token]
    )
    
    useEffect(
        () => {
            getCategoryList()
        },
        [getCategoryList]
    )

    const deleteItem = async (recordId: string) => {
        try {
            const fetching = await fetch(`https://mock-api.arikmpt.com/api/category/${recordId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!fetching.ok) {
                throw new Error('Error deleting category');
            }

            Notification('error', 'Deleted', 'Message is deleted')

            getCategoryList();
        } catch (error) {
            Notification('error', 'Error delete Data', 'Something gone wrong when you tried to annihilate the data');
        }
    }

    const handleLogout = () => {
        Notification('success', 'Logout', 'Goodbye, see you later!');
        localStorage.removeItem('token')
        // setToken(null);
        navigate('/login');
    }

    const columns: ColumnsType<Category> = [
        {
            title: 'ID',
            dataIndex: 'id',
            key: 'id',
            render: (text) => <span>{text}</span>,
            sorter: (a, b) => a.id.localeCompare(b.id),
        },
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
            sorter: (a, b) => a.name.localeCompare(b.name),
        },
        {
            title: 'Status',
            dataIndex: 'is_active',
            key: 'is_active',
            render: (isActive) => (
                <span>{isActive ? 'Active' : 'Deactive'}</span>
            ),
            sorter: (a) => (a.is_active ? 1 : -1),
            filters: [
                { text: 'Active', value: true },
                { text: 'Deactive', value: false },
            ],
            onFilter: (value, record) => record.is_active === value,
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Space size="middle">
                    <a><Button type='primary' onClick={() => navigate(`/edit/${record.id}`)}>Edit</Button></a>
                    <a><Button type='primary' danger onClick={() => deleteItem(record.id)}>Delete</Button></a>
                </Space>
            ),
            onFilter: (value, record) => record.is_active === value,
        },
    ];

    return (
        <Card title="List of Category" style={{ height: '82vh' }} extra={
            <Space direction="horizontal" size="middle">
                <Button onClick={() => { navigate('/profile') }}>My Profile</Button>
                <Button onClick={() => { navigate('/add') }}>Add Item</Button>
                <Button onClick={handleLogout} danger>Log Out</Button>
            </Space>
        }>
            <Table
                columns={columns}
                dataSource={categories}
                pagination={{
                    defaultPageSize: 5,
                    total: categories.length,
                    position: ['topCenter']
                }}
            />
        </Card>
    )
}

export default Datas;
