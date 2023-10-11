import { Button, Form, Input, Space, Card, Select } from 'antd';
import { useFormik } from 'formik';
import { useContext } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { AppContext } from '../../Provider/AppProvider';
import * as yup from 'yup';
import { Notification } from '../../components'
import { useTokenChecker } from '../../hooks';

interface AccountLogin {
    name?: string;
    is_active?: string;
}

const EditItem: React.FC = () => {

    const navigate = useNavigate();
    const { id } = useParams();
    const { categories } = useContext(AppContext)
    const token = localStorage.getItem('token')
    useTokenChecker(token)

    const category = categories.find(category => category.id === id);

    const initialValues = {
        name: category?.name,
        is_active: category?.is_active ? "Active" : "Deactive"
    }
    
    const validationSchema = yup.object({
        name: yup.string().required(),
        is_active: yup.string().required(),
    })

    const handleSubmit = async (values: AccountLogin) => {
        const newValues = {
            id, ...values
        }
        try {
            const fetching = await fetch(`https://mock-api.arikmpt.com/api/category/update`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(newValues)
            });
            if (!fetching.ok) {
                throw new Error('Error adding category');
            }
                Notification('success', 'Edit data', 'Edit successful!');
                navigate('/');
        } catch (error) {
            console.error('Error adding data', error);
        }
    }

    const formik = useFormik({
        initialValues: initialValues,
        onSubmit: handleSubmit,
        validationSchema: validationSchema
    })


    return (
        <Card title="Edit Category" headStyle={{ textAlign: 'center' }}>
            <a onClick={() => { navigate('/') }}>Back to Main Page</a>
            <Form onFinish={formik.handleSubmit}>
                <Form.Item
                    name="name"
                    rules={[{ required: true, message: 'Name must be different / exist' }]}
                >
                    <Input
                        placeholder="Name"
                        value={formik.values.name}
                        onChange={formik.handleChange('name')}
                        status={formik.errors.name && 'error'}
                        defaultValue={formik.initialValues.name}
                    />
                </Form.Item>
                <Form.Item
                    name="is_active"
                    rules={[{ required: true, message: 'Status must be different / reselected' }]}
                >
                    <Select
                        placeholder="Status"
                        value={formik.values.is_active}
                        onChange={formik.handleChange('is_active')}
                        status={formik.errors.is_active && 'error'}
                        defaultValue={formik.initialValues.is_active}
                    >
                        <Select.Option value="true">Active</Select.Option>
                        <Select.Option value="false">Deactive</Select.Option>
                    </Select>
                </Form.Item>
                <Space direction="horizontal" size="middle" style={{ display: 'flex', justifyContent: 'space-around', width: "100%" }}>
                    <Button type="primary" htmlType="submit" style={{ width: "200px" }}>
                        Submit
                    </Button>
                </Space>
            </Form>
        </Card>
    );
};

export default EditItem;